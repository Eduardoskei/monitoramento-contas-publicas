import { AnalysisOperation } from '../contracts/analysis-contracts';
import { CacheKeyGenerator } from './cache-key-generator';

describe('CacheKeyGenerator', () => {
  const generator = new CacheKeyGenerator();

  it('should generate the same key regardless of object property order', () => {
    const first = generator.generate(AnalysisOperation.MUNICIPAL_PROCUREMENTS, {
      pagina: 1,
      filtros: { ano: 2025, municipio: '2300754' },
    });
    const second = generator.generate(
      AnalysisOperation.MUNICIPAL_PROCUREMENTS,
      {
        filtros: { municipio: '2300754', ano: 2025 },
        pagina: 1,
      },
    );

    expect(first).toBe(second);
  });

  it('should isolate cache keys by analysis operation', () => {
    const input = { codigoMunicipioIbge: '2300754' };

    expect(
      generator.generate(AnalysisOperation.MUNICIPAL_PROCUREMENTS, input),
    ).not.toBe(generator.generate(AnalysisOperation.ME_PROCUREMENTS, input));
  });
});
