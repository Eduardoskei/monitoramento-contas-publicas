import { AnalysisGateway } from '@/domain/procurement/application/gateways/analysis-gateway';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { FastApiAnalysisGateway } from './fastapi/fastapi-analysis-gateway';

@Module({
  imports: [
    EnvModule,
    HttpModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        baseURL: env.get('FASTAPI_BASE_URL'),
        timeout: env.get('FASTAPI_TIMEOUT_MS'),
        maxRedirects: 0,
      }),
    }),
  ],
  providers: [
    {
      provide: AnalysisGateway,
      useClass: FastApiAnalysisGateway,
    },
  ],
  exports: [AnalysisGateway],
})
export class IntegrationsModule {}
