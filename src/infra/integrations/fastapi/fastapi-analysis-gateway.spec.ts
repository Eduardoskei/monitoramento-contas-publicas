/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { EnvService } from '../../env/env.service';
import { FastApiAnalysisGateway } from './fastapi-analysis-gateway';
import {
  AnalysisResourceNotFoundError,
  AnalysisServiceTimeoutError,
  AnalysisUpstreamError,
  InvalidAnalysisRequestError,
  InvalidAnalysisResponseError,
} from '@/domain/procurement/application/errors/analysis-errors';

const municipality = {
  codigoIbge: '2300754',
  nome: 'Amontada',
  uf: 'CE',
};

const pagination = {
  pagina: 1,
  limite: 20,
  totalRegistros: 0,
  totalPaginas: 0,
};

const municipalResponse = {
  municipio: municipality,
  licitacoes: [],
  paginacao: pagination,
};

function axiosError(status?: number, code?: string) {
  return {
    isAxiosError: true,
    code,
    response: status
      ? {
          status,
          headers: {},
          data: {},
        }
      : undefined,
  };
}

describe('FastApiAnalysisGateway', () => {
  let httpPost: ReturnType<typeof vi.fn>;
  let gateway: FastApiAnalysisGateway;

  beforeEach(() => {
    httpPost = vi.fn();
    const http = { post: httpPost } as unknown as HttpService;
    const values = {
      FASTAPI_RETRY_ATTEMPTS: 1,
      FASTAPI_TIMEOUT_MS: 10_000,
      FASTAPI_SERVICE_TOKEN: 'service-token',
    };
    const env = {
      get: vi.fn((key: keyof typeof values) => values[key]),
    } as unknown as EnvService;

    gateway = new FastApiAnalysisGateway(http, env);
  });

  it('should send municipal procurement data to the configured FastAPI route', async () => {
    httpPost.mockReturnValue(of({ data: municipalResponse }));
    const input = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    };

    const result = await gateway.searchMunicipalProcurements(input);

    expect(result).toEqual(municipalResponse);
    expect(httpPost).toHaveBeenCalledWith(
      '/api/v1/analises/licitacoes-municipais',
      input,
      expect.objectContaining({
        timeout: 10_000,
        headers: expect.objectContaining({
          Authorization: 'Bearer service-token',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('should support all planned FastAPI operations', async () => {
    httpPost
      .mockReturnValueOnce(
        of({
          data: {
            municipio: municipality,
            periodo: { ano: 2025 },
            valorTotalCompras: '100.00',
            valorComprasMeLocal: '40.00',
            percentualMeLocal: '40.00',
            quantidadeTotalLicitacoes: 2,
            quantidadeLicitacoesMeLocal: 1,
            quantidadeFornecedoresNaoClassificados: 0,
            metodologia: {
              versao: '1.0',
              formula: 'Fórmula oficial.',
              criterioEmpresaLocal: 'Mesmo município.',
            },
          },
        }),
      )
      .mockReturnValueOnce(of({ data: municipalResponse }))
      .mockReturnValueOnce(
        of({
          data: {
            empresa: {
              cnpj: '12345678000190',
              razaoSocial: 'Empresa Exemplo Ltda.',
              porte: 'MICROEMPRESA',
              municipio: 'Amontada',
              uf: 'CE',
              dataConsultaPorte: '2025-08-20',
            },
            licitacoes: [],
            paginacao: pagination,
          },
        }),
      )
      .mockReturnValueOnce(
        of({
          data: {
            identificadorLicitacao: 'LIC-001',
            contratos: [],
            paginacao: pagination,
          },
        }),
      );

    await gateway.getLocalMeParticipation({
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
    });
    await gateway.searchMeProcurements({
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      apenasEmpresasLocais: true,
      pagina: 1,
      limite: 20,
    });
    await gateway.searchCompanyProcurements({
      cnpj: '12345678000190',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    });
    await gateway.searchProcurementContracts({
      identificadorLicitacao: 'LIC-001',
      pagina: 1,
      limite: 20,
    });

    expect(httpPost.mock.calls.map((call) => call[0])).toEqual([
      '/api/v1/analises/participacao-me-local',
      '/api/v1/analises/licitacoes-me',
      '/api/v1/analises/licitacoes-por-empresa',
      '/api/v1/analises/contratos-da-licitacao',
    ]);
  });

  it('should reject a response that does not match the public contract', async () => {
    httpPost.mockReturnValue(of({ data: { licitacoes: [] } }));

    await expect(
      gateway.searchMunicipalProcurements({
        codigoMunicipioIbge: '2300754',
        periodo: { ano: 2025 },
        pagina: 1,
        limite: 20,
      }),
    ).rejects.toBeInstanceOf(InvalidAnalysisResponseError);
    expect(httpPost).toHaveBeenCalledTimes(1);
  });

  it('should map FastAPI validation errors without retrying', async () => {
    httpPost.mockReturnValue(throwError(() => axiosError(422)));

    await expect(
      gateway.searchMunicipalProcurements({
        codigoMunicipioIbge: '2300754',
        periodo: { ano: 2025 },
        pagina: 1,
        limite: 20,
      }),
    ).rejects.toBeInstanceOf(InvalidAnalysisRequestError);
    expect(httpPost).toHaveBeenCalledTimes(1);
  });

  it('should map a missing resource without retrying', async () => {
    httpPost.mockReturnValue(throwError(() => axiosError(404)));

    await expect(
      gateway.searchProcurementContracts({
        identificadorLicitacao: 'missing',
        pagina: 1,
        limite: 20,
      }),
    ).rejects.toBeInstanceOf(AnalysisResourceNotFoundError);
    expect(httpPost).toHaveBeenCalledTimes(1);
  });

  it('should retry a timeout once and return a typed error', async () => {
    httpPost.mockReturnValue(
      throwError(() => axiosError(undefined, 'ECONNABORTED')),
    );

    await expect(
      gateway.searchMunicipalProcurements({
        codigoMunicipioIbge: '2300754',
        periodo: { ano: 2025 },
        pagina: 1,
        limite: 20,
      }),
    ).rejects.toBeInstanceOf(AnalysisServiceTimeoutError);
    expect(httpPost).toHaveBeenCalledTimes(2);
  });

  it('should retry a FastAPI server error and accept a later success', async () => {
    httpPost
      .mockReturnValueOnce(throwError(() => axiosError(500)))
      .mockReturnValueOnce(of({ data: municipalResponse }));

    await expect(
      gateway.searchMunicipalProcurements({
        codigoMunicipioIbge: '2300754',
        periodo: { ano: 2025 },
        pagina: 1,
        limite: 20,
      }),
    ).resolves.toEqual(municipalResponse);
    expect(httpPost).toHaveBeenCalledTimes(2);
  });

  it('should return an upstream error after all server-error attempts fail', async () => {
    httpPost.mockReturnValue(throwError(() => axiosError(500)));

    await expect(
      gateway.searchMunicipalProcurements({
        codigoMunicipioIbge: '2300754',
        periodo: { ano: 2025 },
        pagina: 1,
        limite: 20,
      }),
    ).rejects.toBeInstanceOf(AnalysisUpstreamError);
    expect(httpPost).toHaveBeenCalledTimes(2);
  });
});
