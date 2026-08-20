import { Either, left, right } from '@/core/either';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import { AnalysisOperation } from '../contracts/analysis-contracts';
import {
  AnalysisError,
  UnexpectedAnalysisError,
} from '../errors/analysis-errors';

export interface AnalysisUseCaseResult<T> {
  dados: T;
  cache: {
    hit: boolean;
    expiresAt: Date | null;
  };
}

export abstract class ExecuteCachedAnalysis {
  protected constructor(
    private readonly analysisCache: AnalysisCache,
    private readonly cacheKeyGenerator: CacheKeyGenerator,
    private readonly cachePolicy: AnalysisCachePolicy,
  ) {}

  protected async executeCached<TInput, TOutput>(
    operation: AnalysisOperation,
    input: TInput,
    loader: () => Promise<TOutput>,
  ): Promise<Either<AnalysisError, AnalysisUseCaseResult<TOutput>>> {
    try {
      const key = this.cacheKeyGenerator.generate(operation, input);
      const cached = await this.analysisCache.remember(
        key,
        this.cachePolicy.ttlFor(operation),
        loader,
      );

      return right({
        dados: cached.value,
        cache: {
          hit: cached.hit,
          expiresAt: cached.expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof AnalysisError) {
        return left(error);
      }

      return left(new UnexpectedAnalysisError());
    }
  }
}
