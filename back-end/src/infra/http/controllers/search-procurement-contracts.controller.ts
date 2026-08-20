import { SearchProcurementContractsInput } from '@/domain/procurement/application/contracts/analysis-contracts';
import { SearchProcurementContractsUseCase } from '@/domain/procurement/application/use-cases/search-procurement-contracts';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultaContratosLicitacaoDto } from '../dtos/analysis-request.dto';
import { RespostaContratosLicitacaoDto } from '../dtos/analysis-response.dto';
import { AnalysisHttpErrorMapper } from '../errors/analysis-http-error-mapper';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnalysisPresenter } from '../presenters/analysis-presenter';
import { searchProcurementContractsSchema } from '../schemas/analysis-request-schemas';
import { ApiAnalysisResponses } from '../swagger/api-analysis-responses';

@ApiTags('Contratos públicos')
@Controller('/api/v1/analises/contratos-da-licitacao')
export class SearchProcurementContractsController {
  constructor(
    private readonly searchProcurementContracts: SearchProcurementContractsUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Consultar contratos vinculados a uma licitação',
    description:
      'Consulta os contratos de uma licitação e permite restringir o resultado a um item específico.',
  })
  @ApiBody({ type: ConsultaContratosLicitacaoDto })
  @ApiAnalysisResponses(
    RespostaContratosLicitacaoDto,
    'Contratos da licitação consultados com sucesso.',
  )
  @UsePipes(new ZodValidationPipe(searchProcurementContractsSchema))
  async handle(
    @Body() body: SearchProcurementContractsInput,
    @Req() request: RequestWithTraceId,
  ) {
    const result = await this.searchProcurementContracts.execute(body);

    if (result.isLeft()) {
      AnalysisHttpErrorMapper.throw(result.value);
    }

    return AnalysisPresenter.toHTTP(result.value, request.traceId);
  }
}
