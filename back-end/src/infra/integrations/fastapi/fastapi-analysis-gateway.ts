import {
  CompanyProcurementsData,
  GetLocalMeParticipationInput,
  LocalMeParticipationData,
  MeProcurementsData,
  MunicipalProcurementsData,
  ProcurementContractsData,
  SearchCompanyProcurementsInput,
  SearchMeProcurementsInput,
  SearchMunicipalProcurementsInput,
  SearchProcurementContractsInput,
} from '@/domain/procurement/application/contracts/analysis-contracts';
import { AnalysisGateway } from '@/domain/procurement/application/gateways/analysis-gateway';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { ZodType } from 'zod';
import { EnvService } from '../../env/env.service';
import { FastApiErrorMapper } from './fastapi-error-mapper';
import {
  companyProcurementsResponseSchema,
  localMeParticipationResponseSchema,
  meProcurementsResponseSchema,
  municipalProcurementsResponseSchema,
  procurementContractsResponseSchema,
} from './fastapi-response-schemas';

const routes = {
  municipalProcurements: '/api/v1/analises/licitacoes-municipais',
  localMeParticipation: '/api/v1/analises/participacao-me-local',
  meProcurements: '/api/v1/analises/licitacoes-me',
  companyProcurements: '/api/v1/analises/licitacoes-por-empresa',
  procurementContracts: '/api/v1/analises/contratos-da-licitacao',
} as const;

@Injectable()
export class FastApiAnalysisGateway implements AnalysisGateway {
  constructor(
    private readonly http: HttpService,
    private readonly env: EnvService,
  ) {}

  searchMunicipalProcurements(
    input: SearchMunicipalProcurementsInput,
  ): Promise<MunicipalProcurementsData> {
    return this.post(
      routes.municipalProcurements,
      input,
      municipalProcurementsResponseSchema,
    );
  }

  getLocalMeParticipation(
    input: GetLocalMeParticipationInput,
  ): Promise<LocalMeParticipationData> {
    return this.post(
      routes.localMeParticipation,
      input,
      localMeParticipationResponseSchema,
    );
  }

  searchMeProcurements(
    input: SearchMeProcurementsInput,
  ): Promise<MeProcurementsData> {
    return this.post(
      routes.meProcurements,
      input,
      meProcurementsResponseSchema,
    );
  }

  searchCompanyProcurements(
    input: SearchCompanyProcurementsInput,
  ): Promise<CompanyProcurementsData> {
    return this.post(
      routes.companyProcurements,
      input,
      companyProcurementsResponseSchema,
    );
  }

  searchProcurementContracts(
    input: SearchProcurementContractsInput,
  ): Promise<ProcurementContractsData> {
    return this.post(
      routes.procurementContracts,
      input,
      procurementContractsResponseSchema,
    );
  }

  private async post<T>(
    route: string,
    payload: unknown,
    schema: ZodType<T>,
  ): Promise<T> {
    const attempts = this.env.get('FASTAPI_RETRY_ATTEMPTS') + 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const token = this.env.get('FASTAPI_SERVICE_TOKEN');
        const response = await firstValueFrom(
          this.http.post(route, payload, {
            timeout: this.env.get('FASTAPI_TIMEOUT_MS'),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Identificador-Rastreio': randomUUID(),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
        );

        return schema.parse(response.data);
      } catch (error) {
        const mappedError = FastApiErrorMapper.toDomain(error);
        lastError = mappedError;

        if (
          attempt === attempts ||
          !FastApiErrorMapper.isRetryable(mappedError)
        ) {
          throw mappedError;
        }
      }
    }

    throw FastApiErrorMapper.toDomain(lastError);
  }
}
