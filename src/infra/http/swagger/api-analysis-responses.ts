import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiGatewayTimeoutResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RespostaErroDto } from '../dtos/analysis-response.dto';

export function ApiAnalysisResponses(
  successType: Type<unknown>,
  successDescription: string,
) {
  return applyDecorators(
    ApiOkResponse({ description: successDescription, type: successType }),
    ApiBadRequestResponse({
      description: 'Os dados enviados pelo frontend são inválidos.',
      type: RespostaErroDto,
    }),
    ApiNotFoundResponse({
      description: 'O recurso solicitado não foi encontrado.',
      type: RespostaErroDto,
    }),
    ApiUnprocessableEntityResponse({
      description: 'O serviço de análise rejeitou os parâmetros informados.',
      type: RespostaErroDto,
    }),
    ApiTooManyRequestsResponse({
      description: 'O limite de requisições foi excedido.',
      type: RespostaErroDto,
    }),
    ApiBadGatewayResponse({
      description: 'O serviço de análise retornou uma resposta inválida.',
      type: RespostaErroDto,
    }),
    ApiServiceUnavailableResponse({
      description: 'O serviço de análise está indisponível.',
      type: RespostaErroDto,
    }),
    ApiGatewayTimeoutResponse({
      description: 'O serviço de análise excedeu o tempo máximo de resposta.',
      type: RespostaErroDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Ocorreu um erro interno na aplicação.',
      type: RespostaErroDto,
    }),
  );
}
