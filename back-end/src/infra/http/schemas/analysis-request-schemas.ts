import { EXPENSE_NATURES } from '@/domain/procurement/application/contracts/analysis-contracts';
import { z } from 'zod';

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'A data deve estar no formato AAAA-MM-DD.',
});

const periodSchema = z
  .object({
    ano: z.coerce.number().int().min(2000).max(2100).optional(),
    dataInicial: isoDateSchema.optional(),
    dataFinal: isoDateSchema.optional(),
  })
  .superRefine((period, context) => {
    const hasYear = period.ano !== undefined;
    const hasDates =
      period.dataInicial !== undefined || period.dataFinal !== undefined;

    if (!hasYear && !hasDates) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o ano ou o intervalo de datas.',
      });
    }

    if (hasYear && hasDates) {
      context.addIssue({
        code: 'custom',
        message: 'Informe apenas o ano ou o intervalo de datas.',
      });
    }

    if (hasDates && (!period.dataInicial || !period.dataFinal)) {
      context.addIssue({
        code: 'custom',
        message: 'As datas inicial e final devem ser informadas em conjunto.',
      });
    }

    if (
      period.dataInicial &&
      period.dataFinal &&
      period.dataInicial > period.dataFinal
    ) {
      context.addIssue({
        code: 'custom',
        message: 'A data inicial não pode ser posterior à data final.',
      });
    }
  });

const paginationShape = {
  pagina: z.coerce.number().int().positive().optional().default(1),
  limite: z.coerce.number().int().min(1).max(100).optional().default(20),
};

const municipalityCodeSchema = z.string().regex(/^\d{7}$/, {
  message: 'O código do município deve conter sete dígitos.',
});

const expenseNaturesSchema = z
  .array(z.enum(EXPENSE_NATURES))
  .min(1)
  .max(EXPENSE_NATURES.length)
  .optional();

export const searchMunicipalProcurementsSchema = z.object({
  codigoMunicipioIbge: municipalityCodeSchema,
  periodo: periodSchema,
  naturezasDespesa: expenseNaturesSchema,
  situacoes: z.array(z.string().trim().min(1).max(100)).max(20).optional(),
  ...paginationShape,
});

export const getLocalMeParticipationSchema = z.object({
  codigoMunicipioIbge: municipalityCodeSchema,
  periodo: periodSchema,
  naturezasDespesa: expenseNaturesSchema,
});

export const searchMeProcurementsSchema = z.object({
  codigoMunicipioIbge: municipalityCodeSchema,
  periodo: periodSchema,
  apenasEmpresasLocais: z.boolean().optional().default(false),
  naturezasDespesa: expenseNaturesSchema,
  ...paginationShape,
});

export const searchCompanyProcurementsSchema = z.object({
  cnpj: z.string().regex(/^\d{14}$/, {
    message: 'O CNPJ deve conter quatorze dígitos.',
  }),
  codigoMunicipioIbge: municipalityCodeSchema.optional(),
  periodo: periodSchema,
  ...paginationShape,
});

export const searchProcurementContractsSchema = z.object({
  identificadorLicitacao: z.string().trim().min(1).max(128),
  identificadorItem: z.string().trim().min(1).max(128).optional(),
  ...paginationShape,
});
