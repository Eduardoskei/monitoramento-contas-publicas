import { Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  AnalysisOperation,
  MunicipalProcurementsData,
  SearchMunicipalProcurementsInput,
} from '../contracts/analysis-contracts';
import { AnalysisError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import {
  AnalysisUseCaseResult,
  ExecuteCachedAnalysis,
} from './execute-cached-analysis';

export type SearchMunicipalProcurementsResponse = Either<
  AnalysisError,
  AnalysisUseCaseResult<MunicipalProcurementsData>
>;

@Injectable()
export class SearchMunicipalProcurementsUseCase extends ExecuteCachedAnalysis {
  constructor(
    private readonly analysisGateway: AnalysisGateway,
    analysisCache: AnalysisCache,
    cacheKeyGenerator: CacheKeyGenerator,
    cachePolicy: AnalysisCachePolicy,
  ) {
    super(analysisCache, cacheKeyGenerator, cachePolicy);
  }

  execute(
    input: SearchMunicipalProcurementsInput,
  ): Promise<SearchMunicipalProcurementsResponse> {
    return this.executeCached(
      AnalysisOperation.MUNICIPAL_PROCUREMENTS,
      input,
      () => this.analysisGateway.searchMunicipalProcurements(input),
    );
  }
}
