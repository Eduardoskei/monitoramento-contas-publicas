import { AnalysisUseCaseResult } from '@/domain/procurement/application/use-cases/execute-cached-analysis';
import { OrigemResposta } from '../dtos/analysis-response.dto';

export class AnalysisPresenter {
  static toHTTP<T>(result: AnalysisUseCaseResult<T>, traceId: string) {
    return {
      dados: result.dados,
      metadados: {
        origemResposta: result.cache.hit
          ? OrigemResposta.CACHE
          : OrigemResposta.SERVICO_ANALISE,
        geradoEm: new Date().toISOString(),
        expiraEm: result.cache.expiresAt?.toISOString() ?? null,
        identificadorRastreio: traceId,
        fonteDados: 'Serviço de análise de dados',
      },
    };
  }
}
