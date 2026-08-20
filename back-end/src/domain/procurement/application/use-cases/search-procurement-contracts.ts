import { Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  AnalysisOperation,
  ProcurementContractsData,
  SearchProcurementContractsInput,
} from '../contracts/analysis-contracts';
import { AnalysisError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import {
  AnalysisUseCaseResult,
  ExecuteCachedAnalysis,
} from './execute-cached-analysis';

export type SearchProcurementContractsResponse = Either<
  AnalysisError,
  AnalysisUseCaseResult<ProcurementContractsData>
>;

@Injectable()
export class SearchProcurementContractsUseCase extends ExecuteCachedAnalysis {
  constructor(
    private readonly analysisGateway: AnalysisGateway,
    analysisCache: AnalysisCache,
    cacheKeyGenerator: CacheKeyGenerator,
    cachePolicy: AnalysisCachePolicy,
  ) {
    super(analysisCache, cacheKeyGenerator, cachePolicy);
  }

  execute(
    input: SearchProcurementContractsInput,
  ): Promise<SearchProcurementContractsResponse> {
    return this.executeCached(
      AnalysisOperation.PROCUREMENT_CONTRACTS,
      input,
      () => this.analysisGateway.searchProcurementContracts(input),
    );
  }
}
