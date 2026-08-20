import { EXPENSE_NATURES } from '@/domain/procurement/application/contracts/analysis-contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PeriodoAnaliseDto {
  @ApiPropertyOptional({
    description: 'Ano de referência da análise. Não deve ser usado com datas.',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  ano?: number;

  @ApiPropertyOptional({
    description: 'Data inicial da análise no formato AAAA-MM-DD.',
    example: '2025-01-01',
    format: 'date',
  })
  dataInicial?: string;

  @ApiPropertyOptional({
    description: 'Data final da análise no formato AAAA-MM-DD.',
    example: '2025-12-31',
    format: 'date',
  })
  dataFinal?: string;
}

export class PaginacaoEntradaDto {
  @ApiPropertyOptional({
    description: 'Número da página solicitada.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  pagina?: number;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de registros por página.',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  limite?: number;
}

export class ConsultaLicitacoesMunicipaisDto extends PaginacaoEntradaDto {
  @ApiProperty({
    description: 'Código de sete dígitos do município segundo o IBGE.',
    example: '2300754',
    pattern: '^\\d{7}$',
  })
  codigoMunicipioIbge!: string;

  @ApiProperty({ type: PeriodoAnaliseDto })
  periodo!: PeriodoAnaliseDto;

  @ApiPropertyOptional({
    description: 'Naturezas de despesa consideradas na consulta.',
    enum: EXPENSE_NATURES,
    isArray: true,
  })
  naturezasDespesa?: string[];

  @ApiPropertyOptional({
    description: 'Situações das licitações que devem ser retornadas.',
    example: ['Homologada', 'Em andamento'],
    type: [String],
  })
  situacoes?: string[];
}

export class ConsultaParticipacaoMeLocalDto {
  @ApiProperty({
    description: 'Código de sete dígitos do município segundo o IBGE.',
    example: '2300754',
  })
  codigoMunicipioIbge!: string;

  @ApiProperty({ type: PeriodoAnaliseDto })
  periodo!: PeriodoAnaliseDto;

  @ApiPropertyOptional({
    description: 'Naturezas de despesa consideradas no cálculo.',
    enum: EXPENSE_NATURES,
    isArray: true,
  })
  naturezasDespesa?: string[];
}

export class ConsultaLicitacoesMeDto extends PaginacaoEntradaDto {
  @ApiProperty({
    description: 'Código de sete dígitos do município segundo o IBGE.',
    example: '2300754',
  })
  codigoMunicipioIbge!: string;

  @ApiProperty({ type: PeriodoAnaliseDto })
  periodo!: PeriodoAnaliseDto;

  @ApiPropertyOptional({
    description: 'Quando verdadeiro, retorna somente empresas do município.',
    example: true,
    default: false,
  })
  apenasEmpresasLocais?: boolean;

  @ApiPropertyOptional({
    description: 'Naturezas de despesa consideradas na consulta.',
    enum: EXPENSE_NATURES,
    isArray: true,
  })
  naturezasDespesa?: string[];
}

export class ConsultaLicitacoesPorEmpresaDto extends PaginacaoEntradaDto {
  @ApiProperty({
    description: 'CNPJ da empresa contendo apenas números.',
    example: '12345678000190',
    pattern: '^\\d{14}$',
  })
  cnpj!: string;

  @ApiPropertyOptional({
    description: 'Código do município para restringir a consulta.',
    example: '2300754',
  })
  codigoMunicipioIbge?: string;

  @ApiProperty({ type: PeriodoAnaliseDto })
  periodo!: PeriodoAnaliseDto;
}

export class ConsultaContratosLicitacaoDto extends PaginacaoEntradaDto {
  @ApiProperty({
    description: 'Identificador da licitação na fonte de dados.',
    example: 'LIC-2025-001',
  })
  identificadorLicitacao!: string;

  @ApiPropertyOptional({
    description: 'Identificador do item para restringir os contratos.',
    example: 'ITEM-01',
  })
  identificadorItem?: string;
}
