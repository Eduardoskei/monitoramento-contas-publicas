import { Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  AnalysisOperation,
  CompanyProcurementsData,
  SearchCompanyProcurementsInput,
} from '../contracts/analysis-contracts';
import { AnalysisError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import {
  AnalysisUseCaseResult,
  ExecuteCachedAnalysis,
} from './execute-cached-analysis';

export type SearchCompanyProcurementsResponse = Either<
  AnalysisError,
  AnalysisUseCaseResult<CompanyProcurementsData>
>;

@Injectable()
export class SearchCompanyProcurementsUseCase extends ExecuteCachedAnalysis {
  constructor(
    private readonly analysisGateway: AnalysisGateway,
    analysisCache: AnalysisCache,
    cacheKeyGenerator: CacheKeyGenerator,
    cachePolicy: AnalysisCachePolicy,
  ) {
    super(analysisCache, cacheKeyGenerator, cachePolicy);
  }

  execute(
    input: SearchCompanyProcurementsInput,
  ): Promise<SearchCompanyProcurementsResponse> {
    return this.executeCached(
      AnalysisOperation.COMPANY_PROCUREMENTS,
      input,
      () => this.analysisGateway.searchCompanyProcurements(input),
    );
  }
}
