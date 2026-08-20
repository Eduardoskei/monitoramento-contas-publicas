import { left, right } from '@/core/either';
import { MunicipalProcurementsData } from '@/domain/procurement/application/contracts/analysis-contracts';
import { AnalysisServiceTimeoutError } from '@/domain/procurement/application/errors/analysis-errors';
import { SearchMunicipalProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-municipal-procurements';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { SearchMunicipalProcurementsController } from './search-municipal-procurements.controller';

const data: MunicipalProcurementsData = {
  municipio: {
    codigoIbge: '2300754',
    nome: 'Amontada',
    uf: 'CE',
  },
  licitacoes: [],
  paginacao: {
    pagina: 1,
    limite: 20,
    totalRegistros: 0,
    totalPaginas: 0,
  },
};

describe('SearchMunicipalProcurementsController', () => {
  it('should return a Portuguese response envelope', async () => {
    const execute = vi.fn().mockResolvedValue(
      right({
        dados: data,
        cache: {
          hit: true,
          expiresAt: new Date('2026-08-20T13:00:00.000Z'),
        },
      }),
    );
    const useCase = {
      execute,
    } as unknown as SearchMunicipalProcurementsUseCase;
    const controller = new SearchMunicipalProcurementsController(useCase);
    const input = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    };

    const response = await controller.handle(input, {
      traceId: 'f583b452-75c4-4f17-a2ca-50404d57c863',
    } as RequestWithTraceId);

    expect(response).toMatchObject({
      dados: data,
      metadados: {
        origemResposta: 'CACHE',
        expiraEm: '2026-08-20T13:00:00.000Z',
        identificadorRastreio: 'f583b452-75c4-4f17-a2ca-50404d57c863',
        fonteDados: 'Serviço de análise de dados',
      },
    });
    expect(execute).toHaveBeenCalledWith(input);
  });

  it('should map a FastAPI timeout to HTTP 504', async () => {
    const useCase = {
      execute: vi
        .fn()
        .mockResolvedValue(left(new AnalysisServiceTimeoutError())),
    } as unknown as SearchMunicipalProcurementsUseCase;
    const controller = new SearchMunicipalProcurementsController(useCase);

    try {
      await controller.handle(
        {
          codigoMunicipioIbge: '2300754',
          periodo: { ano: 2025 },
          pagina: 1,
          limite: 20,
        },
        { traceId: 'trace-id' } as RequestWithTraceId,
      );
      expect.fail('The controller should throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.GATEWAY_TIMEOUT,
      );
      expect((error as HttpException).getResponse()).toMatchObject({
        codigoErro: 'TEMPO_LIMITE_SERVICO_ANALISE',
      });
    }
  });
});
