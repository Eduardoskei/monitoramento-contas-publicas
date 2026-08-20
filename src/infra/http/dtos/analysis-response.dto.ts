import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PeriodoAnaliseDto } from './analysis-request.dto';

export enum OrigemResposta {
  CACHE = 'CACHE',
  SERVICO_ANALISE = 'SERVICO_ANALISE',
}

export class MetadadosRespostaDto {
  @ApiProperty({
    description: 'Indica se os dados vieram do cache ou do serviço de análise.',
    enum: OrigemResposta,
    example: OrigemResposta.CACHE,
  })
  origemResposta!: OrigemResposta;

  @ApiProperty({
    description: 'Data e hora em que a API gerou a resposta.',
    example: '2026-08-20T12:00:00.000Z',
    format: 'date-time',
  })
  geradoEm!: string;

  @ApiPropertyOptional({
    description: 'Data e hora de expiração da resposta armazenada em cache.',
    example: '2026-08-20T18:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  expiraEm!: string | null;

  @ApiProperty({
    description: 'Identificador utilizado para rastrear a requisição.',
    example: 'f583b452-75c4-4f17-a2ca-50404d57c863',
    format: 'uuid',
  })
  identificadorRastreio!: string;

  @ApiProperty({
    description: 'Origem responsável pela produção dos dados analisados.',
    example: 'Serviço de análise de dados',
  })
  fonteDados!: string;
}

export class MunicipioDto {
  @ApiProperty({
    description: 'Código do município no IBGE.',
    example: '2300754',
  })
  codigoIbge!: string;

  @ApiProperty({
    description: 'Nome oficial do município.',
    example: 'Amontada',
  })
  nome!: string;

  @ApiProperty({ description: 'Sigla da unidade federativa.', example: 'CE' })
  uf!: string;
}

export class PaginacaoRespostaDto {
  @ApiProperty({ description: 'Página retornada.', example: 1 })
  pagina!: number;

  @ApiProperty({ description: 'Limite de registros da página.', example: 20 })
  limite!: number;

  @ApiProperty({ description: 'Quantidade total de registros.', example: 150 })
  totalRegistros!: number;

  @ApiProperty({ description: 'Quantidade total de páginas.', example: 8 })
  totalPaginas!: number;
}

export class ItemLicitacaoDto {
  @ApiProperty({ description: 'Identificador do item.', example: 'ITEM-01' })
  identificador!: string;

  @ApiProperty({ description: 'Descrição do item.', example: 'Papel A4' })
  descricao!: string;

  @ApiPropertyOptional({
    description: 'Quantidade fornecida em formato decimal.',
    example: '500',
    nullable: true,
  })
  quantidade!: string | null;

  @ApiPropertyOptional({
    description: 'Valor unitário sem perda de precisão.',
    example: '25.00',
    nullable: true,
  })
  valorUnitario!: string | null;

  @ApiPropertyOptional({
    description: 'Valor total do item sem perda de precisão.',
    example: '12500.00',
    nullable: true,
  })
  valorTotal!: string | null;
}

export class LicitacaoDto {
  @ApiProperty({
    description: 'Identificador da licitação na fonte de dados.',
    example: 'LIC-2025-001',
  })
  identificador!: string;

  @ApiProperty({
    description: 'Número oficial da licitação.',
    example: '001/2025',
  })
  numero!: string;

  @ApiProperty({
    description: 'Modalidade da licitação.',
    example: 'Pregão eletrônico',
  })
  modalidade!: string;

  @ApiProperty({
    description: 'Descrição do objeto da licitação.',
    example: 'Aquisição de materiais de expediente',
  })
  objeto!: string;

  @ApiProperty({
    description: 'Órgão responsável pela compra.',
    example: 'Prefeitura Municipal',
  })
  orgaoComprador!: string;

  @ApiPropertyOptional({
    description: 'Data de publicação da licitação.',
    example: '2025-02-10',
    nullable: true,
    format: 'date',
  })
  dataPublicacao!: string | null;

  @ApiProperty({
    description: 'Situação atual da licitação.',
    example: 'Homologada',
  })
  situacao!: string;

  @ApiPropertyOptional({
    description: 'Valor estimado sem perda de precisão.',
    example: '125000.00',
    nullable: true,
  })
  valorEstimado!: string | null;

  @ApiPropertyOptional({
    description: 'Valor homologado sem perda de precisão.',
    example: '118500.00',
    nullable: true,
  })
  valorHomologado!: string | null;

  @ApiProperty({ description: 'Fonte pública dos dados.', example: 'TCE-CE' })
  fonteDados!: string;

  @ApiPropertyOptional({
    description: 'Itens fornecidos pela empresa consultada.',
    type: [ItemLicitacaoDto],
  })
  itensFornecidos?: ItemLicitacaoDto[];
}

export class DadosLicitacoesMunicipaisDto {
  @ApiProperty({ type: MunicipioDto })
  municipio!: MunicipioDto;

  @ApiProperty({ type: [LicitacaoDto] })
  licitacoes!: LicitacaoDto[];

  @ApiProperty({ type: PaginacaoRespostaDto })
  paginacao!: PaginacaoRespostaDto;
}

export class RespostaLicitacoesMunicipaisDto {
  @ApiProperty({ type: DadosLicitacoesMunicipaisDto })
  dados!: DadosLicitacoesMunicipaisDto;

  @ApiProperty({ type: MetadadosRespostaDto })
  metadados!: MetadadosRespostaDto;
}

export class MetodologiaParticipacaoMeDto {
  @ApiProperty({
    description: 'Versão da metodologia aplicada.',
    example: '1.0',
  })
  versao!: string;

  @ApiProperty({
    description: 'Fórmula utilizada no cálculo do percentual.',
    example:
      'Valor das compras de ME local dividido pelo valor total das compras, multiplicado por 100.',
  })
  formula!: string;

  @ApiProperty({
    description: 'Critério utilizado para classificar a empresa como local.',
    example:
      'Município do estabelecimento fornecedor igual ao município comprador.',
  })
  criterioEmpresaLocal!: string;
}

export class DadosParticipacaoMeLocalDto {
  @ApiProperty({ type: MunicipioDto })
  municipio!: MunicipioDto;

  @ApiProperty({ type: PeriodoAnaliseDto })
  periodo!: PeriodoAnaliseDto;

  @ApiProperty({
    description: 'Valor total das compras analisadas.',
    example: '14207434.39',
  })
  valorTotalCompras!: string;

  @ApiProperty({
    description: 'Valor das compras realizadas com ME local.',
    example: '6698407.25',
  })
  valorComprasMeLocal!: string;

  @ApiPropertyOptional({
    description: 'Percentual financeiro destinado a ME local.',
    example: '47.15',
    nullable: true,
  })
  percentualMeLocal!: string | null;

  @ApiProperty({
    description: 'Quantidade total de licitações analisadas.',
    example: 320,
  })
  quantidadeTotalLicitacoes!: number;

  @ApiProperty({
    description: 'Quantidade de licitações com participação de ME local.',
    example: 151,
  })
  quantidadeLicitacoesMeLocal!: number;

  @ApiProperty({
    description: 'Fornecedores cujo porte não pôde ser classificado.',
    example: 4,
  })
  quantidadeFornecedoresNaoClassificados!: number;

  @ApiProperty({ type: MetodologiaParticipacaoMeDto })
  metodologia!: MetodologiaParticipacaoMeDto;
}

export class RespostaParticipacaoMeLocalDto {
  @ApiProperty({ type: DadosParticipacaoMeLocalDto })
  dados!: DadosParticipacaoMeLocalDto;

  @ApiProperty({ type: MetadadosRespostaDto })
  metadados!: MetadadosRespostaDto;
}

export class RespostaLicitacoesMeDto extends RespostaLicitacoesMunicipaisDto {}

export class EmpresaDto {
  @ApiProperty({ description: 'CNPJ da empresa.', example: '12345678000190' })
  cnpj!: string;

  @ApiProperty({
    description: 'Razão social da empresa.',
    example: 'Empresa Exemplo Ltda.',
  })
  razaoSocial!: string;

  @ApiProperty({
    description: 'Porte empresarial identificado.',
    example: 'MICROEMPRESA',
  })
  porte!: string;

  @ApiPropertyOptional({
    description: 'Município da empresa.',
    example: 'Amontada',
    nullable: true,
  })
  municipio!: string | null;

  @ApiPropertyOptional({
    description: 'Unidade federativa da empresa.',
    example: 'CE',
    nullable: true,
  })
  uf!: string | null;

  @ApiPropertyOptional({
    description: 'Data em que o porte empresarial foi consultado.',
    example: '2025-08-20',
    nullable: true,
  })
  dataConsultaPorte!: string | null;
}

export class DadosLicitacoesPorEmpresaDto {
  @ApiProperty({ type: EmpresaDto })
  empresa!: EmpresaDto;

  @ApiProperty({ type: [LicitacaoDto] })
  licitacoes!: LicitacaoDto[];

  @ApiProperty({ type: PaginacaoRespostaDto })
  paginacao!: PaginacaoRespostaDto;
}

export class RespostaLicitacoesPorEmpresaDto {
  @ApiProperty({ type: DadosLicitacoesPorEmpresaDto })
  dados!: DadosLicitacoesPorEmpresaDto;

  @ApiProperty({ type: MetadadosRespostaDto })
  metadados!: MetadadosRespostaDto;
}

export class ContratoDto {
  @ApiProperty({
    description: 'Identificador do contrato.',
    example: 'CONTRATO-001',
  })
  identificador!: string;

  @ApiProperty({
    description: 'Número oficial do contrato.',
    example: '015/2025',
  })
  numero!: string;

  @ApiPropertyOptional({
    description: 'Item associado ao contrato.',
    example: 'ITEM-01',
    nullable: true,
  })
  identificadorItem!: string | null;

  @ApiProperty({
    description: 'CNPJ do fornecedor.',
    example: '12345678000190',
  })
  cnpjFornecedor!: string;

  @ApiProperty({
    description: 'Razão social do fornecedor.',
    example: 'Empresa Exemplo Ltda.',
  })
  razaoSocialFornecedor!: string;

  @ApiProperty({
    description: 'Valor inicial do contrato.',
    example: '12500.00',
  })
  valorInicial!: string;

  @ApiPropertyOptional({
    description: 'Valor atualizado do contrato.',
    example: '12500.00',
    nullable: true,
  })
  valorAtualizado!: string | null;

  @ApiPropertyOptional({
    description: 'Início da vigência.',
    example: '2025-03-01',
    nullable: true,
  })
  dataInicioVigencia!: string | null;

  @ApiPropertyOptional({
    description: 'Fim da vigência.',
    example: '2025-12-31',
    nullable: true,
  })
  dataFimVigencia!: string | null;

  @ApiProperty({
    description: 'Situação atual do contrato.',
    example: 'Vigente',
  })
  situacao!: string;
}

export class DadosContratosLicitacaoDto {
  @ApiProperty({
    description: 'Identificador da licitação.',
    example: 'LIC-2025-001',
  })
  identificadorLicitacao!: string;

  @ApiProperty({ type: [ContratoDto] })
  contratos!: ContratoDto[];

  @ApiProperty({ type: PaginacaoRespostaDto })
  paginacao!: PaginacaoRespostaDto;
}

export class RespostaContratosLicitacaoDto {
  @ApiProperty({ type: DadosContratosLicitacaoDto })
  dados!: DadosContratosLicitacaoDto;

  @ApiProperty({ type: MetadadosRespostaDto })
  metadados!: MetadadosRespostaDto;
}

export class DetalheErroDto {
  @ApiProperty({
    description: 'Campo relacionado ao erro.',
    example: 'periodo.ano',
  })
  campo!: string;

  @ApiProperty({
    description: 'Descrição do problema encontrado.',
    example: 'O ano deve ser maior ou igual a 2000.',
  })
  mensagem!: string;
}

export class RespostaErroDto {
  @ApiProperty({ description: 'Código HTTP da resposta.', example: 400 })
  codigoHttp!: number;

  @ApiProperty({
    description: 'Código estável do erro em português.',
    example: 'DADOS_DE_ENTRADA_INVALIDOS',
  })
  codigoErro!: string;

  @ApiProperty({
    description: 'Mensagem segura e compreensível para o consumidor da API.',
    example: 'Os dados enviados são inválidos.',
  })
  mensagem!: string;

  @ApiProperty({ type: [DetalheErroDto] })
  detalhes!: DetalheErroDto[];

  @ApiProperty({
    description: 'Identificador utilizado para rastrear o erro.',
    example: 'f583b452-75c4-4f17-a2ca-50404d57c863',
  })
  identificadorRastreio!: string;

  @ApiProperty({
    description: 'Data e hora em que o erro ocorreu.',
    example: '2026-08-20T12:00:00.000Z',
  })
  ocorridoEm!: string;
}
