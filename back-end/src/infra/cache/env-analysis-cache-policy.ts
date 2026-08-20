import { AnalysisCachePolicy } from '@/domain/procurement/application/cache/analysis-cache-policy';
import { AnalysisOperation } from '@/domain/procurement/application/contracts/analysis-contracts';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class EnvAnalysisCachePolicy implements AnalysisCachePolicy {
  constructor(private readonly env: EnvService) {}

  ttlFor(operation: AnalysisOperation): number {
    const ttlByOperation: Record<AnalysisOperation, number> = {
      [AnalysisOperation.MUNICIPAL_PROCUREMENTS]: this.env.get(
        'CACHE_TTL_MUNICIPAL_PROCUREMENTS_SECONDS',
      ),
      [AnalysisOperation.LOCAL_ME_PARTICIPATION]: this.env.get(
        'CACHE_TTL_LOCAL_ME_PARTICIPATION_SECONDS',
      ),
      [AnalysisOperation.ME_PROCUREMENTS]: this.env.get(
        'CACHE_TTL_ME_PROCUREMENTS_SECONDS',
      ),
      [AnalysisOperation.COMPANY_PROCUREMENTS]: this.env.get(
        'CACHE_TTL_COMPANY_PROCUREMENTS_SECONDS',
      ),
      [AnalysisOperation.PROCUREMENT_CONTRACTS]: this.env.get(
        'CACHE_TTL_PROCUREMENT_CONTRACTS_SECONDS',
      ),
    };

    return ttlByOperation[operation];
  }
}
