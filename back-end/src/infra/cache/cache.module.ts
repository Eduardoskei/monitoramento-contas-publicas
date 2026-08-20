import { AnalysisCache } from '@/domain/procurement/application/cache/analysis-cache';
import { AnalysisCachePolicy } from '@/domain/procurement/application/cache/analysis-cache-policy';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { EnvAnalysisCachePolicy } from './env-analysis-cache-policy';
import {
  InMemoryAnalysisCache,
  MEMORY_CACHE_OPTIONS,
} from './memory/in-memory-analysis-cache';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: MEMORY_CACHE_OPTIONS,
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        maxEntries: env.get('CACHE_MAX_ENTRIES'),
        maxValueBytes: env.get('CACHE_MAX_VALUE_BYTES'),
        maxTotalBytes: env.get('CACHE_MAX_TOTAL_BYTES'),
        cleanupIntervalSeconds: env.get('CACHE_CLEANUP_INTERVAL_SECONDS'),
      }),
    },
    InMemoryAnalysisCache,
    EnvAnalysisCachePolicy,
    {
      provide: AnalysisCache,
      useExisting: InMemoryAnalysisCache,
    },
    {
      provide: AnalysisCachePolicy,
      useExisting: EnvAnalysisCachePolicy,
    },
  ],
  exports: [AnalysisCache, AnalysisCachePolicy],
})
export class CacheModule {}
