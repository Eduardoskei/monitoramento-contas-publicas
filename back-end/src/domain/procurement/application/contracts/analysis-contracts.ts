export const EXPENSE_NATURES = [
  'OBRAS_E_INSTALACOES',
  'SERVICOS_TERCEIROS_PESSOA_JURIDICA',
  'MATERIAL_DE_CONSUMO',
  'EQUIPAMENTOS_E_MATERIAL_PERMANENTE',
  'MATERIAL_PARA_DISTRIBUICAO_GRATUITA',
  'SERVICOS_TECNOLOGIA_INFORMACAO_COMUNICACAO',
  'SERVICOS_DE_CONSULTORIA',
] as const;

export type ExpenseNature = (typeof EXPENSE_NATURES)[number];

export interface AnalysisPeriod {
  ano?: number;
  dataInicial?: string;
  dataFinal?: string;
}

export interface PaginationInput {
  pagina: number;
  limite: number;
}

export interface SearchMunicipalProcurementsInput extends PaginationInput {
  codigoMunicipioIbge: string;
  periodo: AnalysisPeriod;
  naturezasDespesa?: ExpenseNature[];
  situacoes?: string[];
}

export interface GetLocalMeParticipationInput {
  codigoMunicipioIbge: string;
  periodo: AnalysisPeriod;
  naturezasDespesa?: ExpenseNature[];
}

export interface SearchMeProcurementsInput extends PaginationInput {
  codigoMunicipioIbge: string;
  periodo: AnalysisPeriod;
  apenasEmpresasLocais: boolean;
  naturezasDespesa?: ExpenseNature[];
}

export interface SearchCompanyProcurementsInput extends PaginationInput {
  cnpj: string;
  codigoMunicipioIbge?: string;
  periodo: AnalysisPeriod;
}

export interface SearchProcurementContractsInput extends PaginationInput {
  identificadorLicitacao: string;
  identificadorItem?: string;
}

export interface MunicipalityData {
  codigoIbge: string;
  nome: string;
  uf: string;
}

export interface ProcurementItemData {
  identificador: string;
  descricao: string;
  quantidade: string | null;
  valorUnitario: string | null;
  valorTotal: string | null;
}

export interface ProcurementData {
  identificador: string;
  numero: string;
  modalidade: string;
  objeto: string;
  orgaoComprador: string;
  dataPublicacao: string | null;
  situacao: string;
  valorEstimado: string | null;
  valorHomologado: string | null;
  fonteDados: string;
  itensFornecidos?: ProcurementItemData[];
}

export interface PaginationData {
  pagina: number;
  limite: number;
  totalRegistros: number;
  totalPaginas: number;
}

export interface MunicipalProcurementsData {
  municipio: MunicipalityData;
  licitacoes: ProcurementData[];
  paginacao: PaginationData;
}

export interface LocalMeParticipationData {
  municipio: MunicipalityData;
  periodo: AnalysisPeriod;
  valorTotalCompras: string;
  valorComprasMeLocal: string;
  percentualMeLocal: string | null;
  quantidadeTotalLicitacoes: number;
  quantidadeLicitacoesMeLocal: number;
  quantidadeFornecedoresNaoClassificados: number;
  metodologia: {
    versao: string;
    formula: string;
    criterioEmpresaLocal: string;
  };
}

export type MeProcurementsData = MunicipalProcurementsData;

export interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  porte: string;
  municipio: string | null;
  uf: string | null;
  dataConsultaPorte: string | null;
}

export interface CompanyProcurementsData {
  empresa: CompanyData;
  licitacoes: ProcurementData[];
  paginacao: PaginationData;
}

export interface ContractData {
  identificador: string;
  numero: string;
  identificadorItem: string | null;
  cnpjFornecedor: string;
  razaoSocialFornecedor: string;
  valorInicial: string;
  valorAtualizado: string | null;
  dataInicioVigencia: string | null;
  dataFimVigencia: string | null;
  situacao: string;
}

export interface ProcurementContractsData {
  identificadorLicitacao: string;
  contratos: ContractData[];
  paginacao: PaginationData;
}

export enum AnalysisOperation {
  MUNICIPAL_PROCUREMENTS = 'licitacoes-municipais',
  LOCAL_ME_PARTICIPATION = 'participacao-me-local',
  ME_PROCUREMENTS = 'licitacoes-me',
  COMPANY_PROCUREMENTS = 'licitacoes-por-empresa',
  PROCUREMENT_CONTRACTS = 'contratos-da-licitacao',
}
