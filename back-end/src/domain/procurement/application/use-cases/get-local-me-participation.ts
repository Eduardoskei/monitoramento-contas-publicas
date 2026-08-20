import { Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnalysisCache } from '../cache/analysis-cache';
import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  AnalysisOperation,
  GetLocalMeParticipationInput,
  LocalMeParticipationData,
} from '../contracts/analysis-contracts';
import { AnalysisError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import {
  AnalysisUseCaseResult,
  ExecuteCachedAnalysis,
} from './execute-cached-analysis';

export type GetLocalMeParticipationResponse = Either<
  AnalysisError,
  AnalysisUseCaseResult<LocalMeParticipationData>
>;

@Injectable()
export class GetLocalMeParticipationUseCase extends ExecuteCachedAnalysis {
  constructor(
    private readonly analysisGateway: AnalysisGateway,
    analysisCache: AnalysisCache,
    cacheKeyGenerator: CacheKeyGenerator,
    cachePolicy: AnalysisCachePolicy,
  ) {
    super(analysisCache, cacheKeyGenerator, cachePolicy);
  }

  execute(
    input: GetLocalMeParticipationInput,
  ): Promise<GetLocalMeParticipationResponse> {
    return this.executeCached(
      AnalysisOperation.LOCAL_ME_PARTICIPATION,
      input,
      () => this.analysisGateway.getLocalMeParticipation(input),
    );
  }
}
