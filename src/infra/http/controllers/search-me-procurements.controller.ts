import { SearchMeProcurementsInput } from '@/domain/procurement/application/contracts/analysis-contracts';
import { SearchMeProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-me-procurements';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultaLicitacoesMeDto } from '../dtos/analysis-request.dto';
import { RespostaLicitacoesMeDto } from '../dtos/analysis-response.dto';
import { AnalysisHttpErrorMapper } from '../errors/analysis-http-error-mapper';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnalysisPresenter } from '../presenters/analysis-presenter';
import { searchMeProcurementsSchema } from '../schemas/analysis-request-schemas';
import { ApiAnalysisResponses } from '../swagger/api-analysis-responses';

@ApiTags('Participação de microempresas')
@Controller('/api/v1/analises/licitacoes-me')
export class SearchMeProcurementsController {
  constructor(
    private readonly searchMeProcurements: SearchMeProcurementsUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Consultar licitações destinadas a microempresas',
    description:
      'Consulta as licitações com participação de microempresas, permitindo restringir o resultado às empresas locais.',
  })
  @ApiBody({ type: ConsultaLicitacoesMeDto })
  @ApiAnalysisResponses(
    RespostaLicitacoesMeDto,
    'Licitações de microempresas consultadas com sucesso.',
  )
  @UsePipes(new ZodValidationPipe(searchMeProcurementsSchema))
  async handle(
    @Body() body: SearchMeProcurementsInput,
    @Req() request: RequestWithTraceId,
  ) {
    const result = await this.searchMeProcurements.execute(body);

    if (result.isLeft()) {
      AnalysisHttpErrorMapper.throw(result.value);
    }

    return AnalysisPresenter.toHTTP(result.value, request.traceId);
  }
}
