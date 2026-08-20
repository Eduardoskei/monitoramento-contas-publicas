import {
  AnalysisError,
  AnalysisRateLimitError,
  AnalysisResourceNotFoundError,
  AnalysisServiceTimeoutError,
  AnalysisServiceUnavailableError,
  AnalysisUpstreamError,
  InvalidAnalysisRequestError,
  InvalidAnalysisResponseError,
} from '@/domain/procurement/application/errors/analysis-errors';
import axios from 'axios';
import { ZodError } from 'zod';

export class FastApiErrorMapper {
  static toDomain(error: unknown): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }

    if (error instanceof ZodError) {
      return new InvalidAnalysisResponseError();
    }

    if (!axios.isAxiosError(error)) {
      return new AnalysisServiceUnavailableError();
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AnalysisServiceTimeoutError();
    }

    const status = error.response?.status;

    if (!status) {
      return new AnalysisServiceUnavailableError();
    }

    if (status === 400 || status === 422) {
      return new InvalidAnalysisRequestError();
    }

    if (status === 404) {
      return new AnalysisResourceNotFoundError();
    }

    if (status === 429) {
      const retryAfter = Number(error.response?.headers['retry-after']);
      return new AnalysisRateLimitError(
        Number.isFinite(retryAfter) ? retryAfter : undefined,
      );
    }

    if (status === 503) {
      return new AnalysisServiceUnavailableError();
    }

    if (status === 504) {
      return new AnalysisServiceTimeoutError();
    }

    return new AnalysisUpstreamError();
  }

  static isRetryable(error: AnalysisError): boolean {
    return (
      error instanceof AnalysisServiceUnavailableError ||
      error instanceof AnalysisServiceTimeoutError ||
      error instanceof AnalysisUpstreamError
    );
  }
}
