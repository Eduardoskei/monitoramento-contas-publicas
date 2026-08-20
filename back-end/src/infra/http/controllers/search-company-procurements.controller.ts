import { SearchCompanyProcurementsInput } from '@/domain/procurement/application/contracts/analysis-contracts';
import { SearchCompanyProcurementsUseCase } from '@/domain/procurement/application/use-cases/search-company-procurements';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultaLicitacoesPorEmpresaDto } from '../dtos/analysis-request.dto';
import { RespostaLicitacoesPorEmpresaDto } from '../dtos/analysis-response.dto';
import { AnalysisHttpErrorMapper } from '../errors/analysis-http-error-mapper';
import { RequestWithTraceId } from '../middleware/trace-id.middleware';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnalysisPresenter } from '../presenters/analysis-presenter';
import { searchCompanyProcurementsSchema } from '../schemas/analysis-request-schemas';
import { ApiAnalysisResponses } from '../swagger/api-analysis-responses';

@ApiTags('Empresas fornecedoras')
@Controller('/api/v1/analises/licitacoes-por-empresa')
export class SearchCompanyProcurementsController {
  constructor(
    private readonly searchCompanyProcurements: SearchCompanyProcurementsUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Consultar licitações e itens fornecidos por uma empresa',
    description:
      'Recebe o CNPJ e os filtros da consulta e retorna as licitações e os itens fornecidos pela empresa.',
  })
  @ApiBody({ type: ConsultaLicitacoesPorEmpresaDto })
  @ApiAnalysisResponses(
    RespostaLicitacoesPorEmpresaDto,
    'Licitações da empresa consultadas com sucesso.',
  )
  @UsePipes(new ZodValidationPipe(searchCompanyProcurementsSchema))
  async handle(
    @Body() body: SearchCompanyProcurementsInput,
    @Req() request: RequestWithTraceId,
  ) {
    const result = await this.searchCompanyProcurements.execute(body);

    if (result.isLeft()) {
      AnalysisHttpErrorMapper.throw(result.value);
    }

    return AnalysisPresenter.toHTTP(result.value, request.traceId);
  }
}
