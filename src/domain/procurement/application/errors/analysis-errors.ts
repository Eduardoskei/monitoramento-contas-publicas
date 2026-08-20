import { UseCaseError } from '@/core/errors/use-case-error';

export abstract class AnalysisError extends Error implements UseCaseError {
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
  }
}

export class InvalidAnalysisRequestError extends AnalysisError {
  readonly code = 'DADOS_DE_ENTRADA_INVALIDOS';

  constructor(message = 'Os dados enviados para análise são inválidos.') {
    super(message);
  }
}

export class AnalysisResourceNotFoundError extends AnalysisError {
  readonly code = 'RECURSO_DE_ANALISE_NAO_ENCONTRADO';

  constructor(message = 'O recurso solicitado não foi encontrado.') {
    super(message);
  }
}

export class AnalysisRateLimitError extends AnalysisError {
  readonly code = 'LIMITE_DE_REQUISICOES_EXCEDIDO';

  constructor(public readonly retryAfterSeconds?: number) {
    super('O serviço de análise atingiu o limite de requisições.');
  }
}

export class AnalysisServiceUnavailableError extends AnalysisError {
  readonly code = 'SERVICO_ANALISE_INDISPONIVEL';

  constructor() {
    super('O serviço de análise está temporariamente indisponível.');
  }
}

export class AnalysisServiceTimeoutError extends AnalysisError {
  readonly code = 'TEMPO_LIMITE_SERVICO_ANALISE';

  constructor() {
    super('O serviço de análise demorou mais que o esperado.');
  }
}

export class InvalidAnalysisResponseError extends AnalysisError {
  readonly code = 'RESPOSTA_SERVICO_ANALISE_INVALIDA';

  constructor() {
    super('O serviço de análise retornou uma resposta inválida.');
  }
}

export class AnalysisUpstreamError extends AnalysisError {
  readonly code = 'ERRO_SERVICO_ANALISE';

  constructor() {
    super('O serviço de análise não conseguiu concluir a solicitação.');
  }
}

export class UnexpectedAnalysisError extends AnalysisError {
  readonly code = 'ERRO_INTERNO_ANALISE';

  constructor() {
    super('Não foi possível concluir a análise.');
  }
}
