import { GetLocalMeParticipationInput } from '@/domain/procurement/application/contracts/analysis-contracts';
import { GetLocalMeParticipationUseCase } from '@/domain/procurement/application/use-cases/get-local-me-participation';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultaParticipacaoMeLocalDto } from '../dtos/analysis-request.dto';
import { RespostaParticipacaoMeLocalDto } from '../dtos/analysis-response.dto';
import { AnalysisHttpErrorMapper } from '../errors/analysis-http-error-mapper';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnalysisPresenter } from '../presenters/analysis-presenter';
import { getLocalMeParticipationSchema } from '../schemas/analysis-request-schemas';
import { ApiAnalysisResponses } from '../swagger/api-analysis-responses';

@ApiTags('Participação de microempresas')
@Controller('/api/v1/analises/participacao-me-local')
export class GetLocalMeParticipationController {
  constructor(
    private readonly getLocalMeParticipation: GetLocalMeParticipationUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Calcular a participação de microempresas locais',
    description:
      'Calcula a participação financeira de microempresas locais nas compras públicas do município e apresenta a metodologia utilizada.',
  })
  @ApiBody({ type: ConsultaParticipacaoMeLocalDto })
  @ApiAnalysisResponses(
    RespostaParticipacaoMeLocalDto,
    'Participação de microempresas calculada com sucesso.',
  )
  @UsePipes(new ZodValidationPipe(getLocalMeParticipationSchema))
  async handle(
    @Body() body: GetLocalMeParticipationInput,
    @Req() request: RequestWithTraceId,
  ) {
    const result = await this.getLocalMeParticipation.execute(body);

    if (result.isLeft()) {
      AnalysisHttpErrorMapper.throw(result.value);
    }

    return AnalysisPresenter.toHTTP(result.value, request.traceId);
  }
}
