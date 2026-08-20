import { CacheKeyGenerator } from '@/domain/procurement/application/cache/cache-key-generator';
import { GetLocalMeParticipationUseCase } from '@/domain/procurement/application/use-cases/get-local-me-participation';
import { SearchCompanyProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-company-procurements';
import { SearchMeProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-me-procurements';
import { SearchMunicipalProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-municipal-procurements';
import { SearchProcurementContractsUseCase } from '@/domain/procurement/application/use-cases/search-procurement-contracts';
import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { IntegrationsModule } from '../integrations/integrations.module';
import { GetLocalMeParticipationController } from './controllers/get-local-me-participation.controller';
import { SearchCompanyProcurementsController } from './controllers/search-company-procurements.controller';
import { SearchMeProcurementsController } from './controllers/search-me-procurements.controller';
import { SearchMunicipalProcurementsController } from './controllers/search-municipal-procurements.controller';
import { SearchProcurementContractsController } from './controllers/search-procurement-contracts.controller';

@Module({
  imports: [CacheModule, IntegrationsModule],
  controllers: [
    SearchMunicipalProcurementsController,
    GetLocalMeParticipationController,
    SearchMeProcurementsController,
    SearchCompanyProcurementsController,
    SearchProcurementContractsController,
  ],
  providers: [
    CacheKeyGenerator,
    SearchMunicipalProcurementsUseCase,
    GetLocalMeParticipationUseCase,
    SearchMeProcurementsUseCase,
    SearchCompanyProcurementsUseCase,
    SearchProcurementContractsUseCase,
  ],
})
export class HttpModule {}
