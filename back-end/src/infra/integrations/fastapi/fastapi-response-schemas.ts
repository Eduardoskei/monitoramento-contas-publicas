import { z } from 'zod';

const decimalSchema = z.string().regex(/^-?\d+(\.\d+)?$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const municipalitySchema = z.object({
  codigoIbge: z.string().regex(/^\d{7}$/),
  nome: z.string().min(1),
  uf: z.string().length(2),
});

const analysisPeriodSchema = z.object({
  ano: z.number().int().min(2000).max(2100).optional(),
  dataInicial: dateSchema.optional(),
  dataFinal: dateSchema.optional(),
});

const paginationSchema = z.object({
  pagina: z.number().int().positive(),
  limite: z.number().int().positive(),
  totalRegistros: z.number().int().nonnegative(),
  totalPaginas: z.number().int().nonnegative(),
});

const procurementItemSchema = z.object({
  identificador: z.string().min(1),
  descricao: z.string().min(1),
  quantidade: decimalSchema.nullable(),
  valorUnitario: decimalSchema.nullable(),
  valorTotal: decimalSchema.nullable(),
});

const procurementSchema = z.object({
  identificador: z.string().min(1),
  numero: z.string().min(1),
  modalidade: z.string().min(1),
  objeto: z.string().min(1),
  orgaoComprador: z.string().min(1),
  dataPublicacao: dateSchema.nullable(),
  situacao: z.string().min(1),
  valorEstimado: decimalSchema.nullable(),
  valorHomologado: decimalSchema.nullable(),
  fonteDados: z.string().min(1),
  itensFornecidos: z.array(procurementItemSchema).optional(),
});

export const municipalProcurementsResponseSchema = z.object({
  municipio: municipalitySchema,
  licitacoes: z.array(procurementSchema),
  paginacao: paginationSchema,
});

export const localMeParticipationResponseSchema = z.object({
  municipio: municipalitySchema,
  periodo: analysisPeriodSchema,
  valorTotalCompras: decimalSchema,
  valorComprasMeLocal: decimalSchema,
  percentualMeLocal: decimalSchema.nullable(),
  quantidadeTotalLicitacoes: z.number().int().nonnegative(),
  quantidadeLicitacoesMeLocal: z.number().int().nonnegative(),
  quantidadeFornecedoresNaoClassificados: z.number().int().nonnegative(),
  metodologia: z.object({
    versao: z.string().min(1),
    formula: z.string().min(1),
    criterioEmpresaLocal: z.string().min(1),
  }),
});

export const meProcurementsResponseSchema = municipalProcurementsResponseSchema;

export const companyProcurementsResponseSchema = z.object({
  empresa: z.object({
    cnpj: z.string().regex(/^\d{14}$/),
    razaoSocial: z.string().min(1),
    porte: z.string().min(1),
    municipio: z.string().min(1).nullable(),
    uf: z.string().length(2).nullable(),
    dataConsultaPorte: dateSchema.nullable(),
  }),
  licitacoes: z.array(procurementSchema),
  paginacao: paginationSchema,
});

export const procurementContractsResponseSchema = z.object({
  identificadorLicitacao: z.string().min(1),
  contratos: z.array(
    z.object({
      identificador: z.string().min(1),
      numero: z.string().min(1),
      identificadorItem: z.string().min(1).nullable(),
      cnpjFornecedor: z.string().regex(/^\d{14}$/),
      razaoSocialFornecedor: z.string().min(1),
      valorInicial: decimalSchema,
      valorAtualizado: decimalSchema.nullable(),
      dataInicioVigencia: dateSchema.nullable(),
      dataFimVigencia: dateSchema.nullable(),
      situacao: z.string().min(1),
    }),
  ),
  paginacao: paginationSchema,
});
