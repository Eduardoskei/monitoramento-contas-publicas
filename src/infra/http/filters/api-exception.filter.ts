import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';

interface ExceptionBody {
  codigoErro?: string;
  mensagem?: string;
  detalhes?: unknown[];
  message?: string | string[];
}

const errorCodeByStatus = new Map<number, string>([
  [HttpStatus.BAD_REQUEST, 'DADOS_DE_ENTRADA_INVALIDOS'],
  [HttpStatus.NOT_FOUND, 'RECURSO_NAO_ENCONTRADO'],
  [HttpStatus.UNPROCESSABLE_ENTITY, 'SOLICITACAO_NAO_PROCESSAVEL'],
  [HttpStatus.TOO_MANY_REQUESTS, 'LIMITE_DE_REQUISICOES_EXCEDIDO'],
  [HttpStatus.BAD_GATEWAY, 'ERRO_SERVICO_ANALISE'],
  [HttpStatus.SERVICE_UNAVAILABLE, 'SERVICO_ANALISE_INDISPONIVEL'],
  [HttpStatus.GATEWAY_TIMEOUT, 'TEMPO_LIMITE_SERVICO_ANALISE'],
]);

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request & Partial<RequestWithTraceId>>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawBody =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const body =
      typeof rawBody === 'object' && rawBody !== null
        ? (rawBody as ExceptionBody)
        : undefined;

    const defaultMessage =
      status === 500
        ? 'Ocorreu um erro interno ao processar a solicitação.'
        : 'Não foi possível processar a solicitação.';

    const message =
      body?.mensagem ??
      (typeof body?.message === 'string' ? body.message : defaultMessage);

    if (status === 500) {
      this.logger.error(
        `Erro não tratado em ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const codigoErro: string =
      body?.codigoErro ??
      errorCodeByStatus.get(status) ??
      'ERRO_INTERNO_APLICACAO';

    response.status(status).json({
      codigoHttp: status,
      codigoErro,
      mensagem: message,
      detalhes:
        body?.detalhes ??
        (Array.isArray(body?.message)
          ? body.message.map((item) => ({ mensagem: item }))
          : []),
      identificadorRastreio: request.traceId ?? randomUUID(),
      ocorridoEm: new Date().toISOString(),
    });
  }
}
