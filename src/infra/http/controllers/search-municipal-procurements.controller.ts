import { SearchMunicipalProcurementsInput } from '@/domain/procurement/application/contracts/analysis-contracts';
import { SearchMunicipalProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-municipal-procurements';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultaLicitacoesMunicipaisDto } from '../dtos/analysis-request.dto';
import { RespostaLicitacoesMunicipaisDto } from '../dtos/analysis-response.dto';
import { AnalysisHttpErrorMapper } from '../errors/analysis-http-error-mapper';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnalysisPresenter } from '../presenters/analysis-presenter';
import { searchMunicipalProcurementsSchema } from '../schemas/analysis-request-schemas';
import { ApiAnalysisResponses } from '../swagger/api-analysis-responses';

@ApiTags('Análises de licitações')
@Controller('/api/v1/analises/licitacoes-municipais')
export class SearchMunicipalProcurementsController {
  constructor(
    private readonly searchMunicipalProcurements: SearchMunicipalProcurementsUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Consultar licitações de um município',
    description:
      'Recebe município, período e filtros do frontend, encaminha a solicitação ao serviço de análise e retorna as licitações encontradas.',
  })
  @ApiBody({ type: ConsultaLicitacoesMunicipaisDto })
  @ApiAnalysisResponses(
    RespostaLicitacoesMunicipaisDto,
    'Licitações municipais consultadas com sucesso.',
  )
  @UsePipes(new ZodValidationPipe(searchMunicipalProcurementsSchema))
  async handle(
    @Body() body: SearchMunicipalProcurementsInput,
    @Req() request: RequestWithTraceId,
  ) {
    const result = await this.searchMunicipalProcurements.execute(body);

    if (result.isLeft()) {
      AnalysisHttpErrorMapper.throw(result.value);
    }

    return AnalysisPresenter.toHTTP(result.value, request.traceId);
  }
}
