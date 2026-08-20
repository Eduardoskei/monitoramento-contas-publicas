import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  searchCompanyProcurementsSchema,
  searchMunicipalProcurementsSchema,
} from './analysis-request-schemas';

describe('Analysis request schemas', () => {
  it('should apply Portuguese pagination defaults', () => {
    const result = searchMunicipalProcurementsSchema.parse({
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
    });

    expect(result).toMatchObject({ pagina: 1, limite: 20 });
  });

  it('should reject a period containing both year and dates', () => {
    const result = searchMunicipalProcurementsSchema.safeParse({
      codigoMunicipioIbge: '2300754',
      periodo: {
        ano: 2025,
        dataInicial: '2025-01-01',
        dataFinal: '2025-12-31',
      },
    });

    expect(result.success).toBe(false);
  });

  it('should reject an inverted date range', () => {
    const result = searchMunicipalProcurementsSchema.safeParse({
      codigoMunicipioIbge: '2300754',
      periodo: {
        dataInicial: '2025-12-31',
        dataFinal: '2025-01-01',
      },
    });

    expect(result.success).toBe(false);
  });

  it('should reject invalid municipality and company identifiers', () => {
    expect(
      searchCompanyProcurementsSchema.safeParse({
        cnpj: '123',
        codigoMunicipioIbge: '23',
        periodo: { ano: 2025 },
      }).success,
    ).toBe(false);
  });

  it('should expose validation errors in Portuguese', () => {
    const pipe = new ZodValidationPipe(searchMunicipalProcurementsSchema);

    try {
      pipe.transform({ codigoMunicipioIbge: 'invalid', periodo: {} });
      expect.fail('The validation pipe should throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        codigoErro: 'DADOS_DE_ENTRADA_INVALIDOS',
        mensagem: 'Os dados enviados são inválidos.',
      });
    }
  });
});
