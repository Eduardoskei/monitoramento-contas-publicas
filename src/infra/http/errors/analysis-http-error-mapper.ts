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
import { HttpException, HttpStatus } from '@nestjs/common';

export class AnalysisHttpErrorMapper {
  static throw(error: AnalysisError): never {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof InvalidAnalysisRequestError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (error instanceof AnalysisResourceNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (error instanceof AnalysisRateLimitError) {
      status = HttpStatus.TOO_MANY_REQUESTS;
    } else if (error instanceof AnalysisServiceUnavailableError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
    } else if (error instanceof AnalysisServiceTimeoutError) {
      status = HttpStatus.GATEWAY_TIMEOUT;
    } else if (
      error instanceof InvalidAnalysisResponseError ||
      error instanceof AnalysisUpstreamError
    ) {
      status = HttpStatus.BAD_GATEWAY;
    }

    throw new HttpException(
      {
        codigoErro: error.code,
        mensagem: error.message,
        detalhes: [],
      },
      status,
      { cause: error },
    );
  }
}
