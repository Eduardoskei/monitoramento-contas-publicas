import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export interface RequestWithTraceId extends Request {
  traceId: string;
}

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(request: RequestWithTraceId, response: Response, next: NextFunction) {
    const receivedTraceId = request.header('x-identificador-rastreio');
    const traceId =
      receivedTraceId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        receivedTraceId,
      )
        ? receivedTraceId
        : randomUUID();

    request.traceId = traceId;
    response.setHeader('X-Identificador-Rastreio', traceId);
    next();
  }
}
