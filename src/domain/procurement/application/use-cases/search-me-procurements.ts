import { Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  AnalysisOperation,
  MeProcurementsData,
  SearchMeProcurementsInput,
} from '../contracts/analysis-contracts';
import { AnalysisError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import {
  AnalysisUseCaseResult,
  ExecuteCachedAnalysis,
} from './execute-cached-analysis';

export type SearchMeProcurementsResponse = Either<
  AnalysisError,
  AnalysisUseCaseResult<MeProcurementsData>
>;

@Injectable()
export class SearchMeProcurementsUseCase extends ExecuteCachedAnalysis {
  constructor(
    private readonly analysisGateway: AnalysisGateway,
    analysisCache: AnalysisCache,
    cacheKeyGenerator: CacheKeyGenerator,
    cachePolicy: AnalysisCachePolicy,
  ) {
    super(analysisCache, cacheKeyGenerator, cachePolicy);
  }

  execute(
    input: SearchMeProcurementsInput,
  ): Promise<SearchMeProcurementsResponse> {
    return this.executeCached(AnalysisOperation.ME_PROCUREMENTS, input, () =>
      this.analysisGateway.searchMeProcurements(input),
    );
  }
}
