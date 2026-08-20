import { AnalysisCachePolicy } from '../cache/analysis-cache-policy';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import {
  CompanyProcurementsData,
  GetLocalMeParticipationInput,
  LocalMeParticipationData,
  MeProcurementsData,
  MunicipalProcurementsData,
  ProcurementContractsData,
  SearchCompanyProcurementsInput,
  SearchMeProcurementsInput,
  SearchMunicipalProcurementsInput,
  SearchProcurementContractsInput,
} from '../contracts/analysis-contracts';
import { AnalysisServiceTimeoutError } from '../errors/analysis-errors';
import { AnalysisGateway } from '../gateways/analysis-gateway';
import { InMemoryAnalysisCache } from '@/infra/cache/memory/in-memory-analysis-cache';
import { GetLocalMeParticipationUseCase } from './get-local-me-participation';
import { SearchCompanyProcurementsUseCase } from './search-company-procurements';
import { SearchMeProcurementsUseCase } from './search-me-procurements';
import { SearchMunicipalProcurementsUseCase } from './search-municipal-procurements';
import { SearchProcurementContractsUseCase } from './search-procurement-contracts';

const municipality = {
  codigoIbge: '2300754',
  nome: 'Amontada',
  uf: 'CE',
};

const pagination = {
  pagina: 1,
  limite: 20,
  totalRegistros: 0,
  totalPaginas: 0,
};

const municipalData: MunicipalProcurementsData = {
  municipio: municipality,
  licitacoes: [],
  paginacao: pagination,
};

const participationData: LocalMeParticipationData = {
  municipio: municipality,
  periodo: { ano: 2025 },
  valorTotalCompras: '1000.00',
  valorComprasMeLocal: '400.00',
  percentualMeLocal: '40.00',
  quantidadeTotalLicitacoes: 10,
  quantidadeLicitacoesMeLocal: 4,
  quantidadeFornecedoresNaoClassificados: 0,
  metodologia: {
    versao: '1.0',
    formula:
      'Valor de ME local dividido pelo valor total, multiplicado por 100.',
    criterioEmpresaLocal: 'Mesmo município do órgão comprador.',
  },
};

class FixedCachePolicy implements AnalysisCachePolicy {
  ttlFor(): number {
    return 60;
  }
}

class FakeAnalysisGateway implements AnalysisGateway {
  searchMunicipalProcurements = vi.fn(() => Promise.resolve(municipalData));
  getLocalMeParticipation = vi.fn(() => Promise.resolve(participationData));
  searchMeProcurements = vi.fn((): Promise<MeProcurementsData> =>
    Promise.resolve(municipalData),
  );
  searchCompanyProcurements = vi.fn((): Promise<CompanyProcurementsData> =>
    Promise.resolve({
      empresa: {
        cnpj: '12345678000190',
        razaoSocial: 'Empresa Exemplo Ltda.',
        porte: 'MICROEMPRESA',
        municipio: 'Amontada',
        uf: 'CE',
        dataConsultaPorte: '2025-08-20',
      },
      licitacoes: [],
      paginacao: pagination,
    }),
  );
  searchProcurementContracts = vi.fn(
    (
      input: SearchProcurementContractsInput,
    ): Promise<ProcurementContractsData> =>
      Promise.resolve({
        identificadorLicitacao: input.identificadorLicitacao,
        contratos: [],
        paginacao: pagination,
      }),
  );
}

describe('Analysis use cases', () => {
  let gateway: FakeAnalysisGateway;
  let cache: InMemoryAnalysisCache;
  let keyGenerator: CacheKeyGenerator;
  let cachePolicy: FixedCachePolicy;

  beforeEach(() => {
    gateway = new FakeAnalysisGateway();
    cache = new InMemoryAnalysisCache({
      maxEntries: 100,
      maxValueBytes: 1024 * 1024,
      maxTotalBytes: 10 * 1024 * 1024,
      cleanupIntervalSeconds: 60,
    });
    keyGenerator = new CacheKeyGenerator();
    cachePolicy = new FixedCachePolicy();
  });

  afterEach(() => {
    cache.onModuleDestroy();
  });

  it('should cache repeated municipal procurement analyses', async () => {
    const useCase = new SearchMunicipalProcurementsUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: SearchMunicipalProcurementsInput = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    };

    const first = await useCase.execute(input);
    const second = await useCase.execute(input);

    expect(first.isRight()).toBe(true);
    expect(second.isRight()).toBe(true);
    expect(first.value).toMatchObject({ cache: { hit: false } });
    expect(second.value).toMatchObject({ cache: { hit: true } });
    expect(gateway.searchMunicipalProcurements).toHaveBeenCalledTimes(1);
    expect(gateway.searchMunicipalProcurements).toHaveBeenCalledWith(input);
  });

  it('should forward local ME participation analyses', async () => {
    const useCase = new GetLocalMeParticipationUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: GetLocalMeParticipationInput = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
    };

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({ dados: participationData });
    expect(gateway.getLocalMeParticipation).toHaveBeenCalledWith(input);
  });

  it('should forward ME procurement analyses', async () => {
    const useCase = new SearchMeProcurementsUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: SearchMeProcurementsInput = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      apenasEmpresasLocais: true,
      pagina: 1,
      limite: 20,
    };

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    expect(gateway.searchMeProcurements).toHaveBeenCalledWith(input);
  });

  it('should forward company procurement analyses', async () => {
    const useCase = new SearchCompanyProcurementsUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: SearchCompanyProcurementsInput = {
      cnpj: '12345678000190',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    };

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    expect(gateway.searchCompanyProcurements).toHaveBeenCalledWith(input);
  });

  it('should forward procurement contract analyses', async () => {
    const useCase = new SearchProcurementContractsUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: SearchProcurementContractsInput = {
      identificadorLicitacao: 'LIC-2025-001',
      identificadorItem: 'ITEM-01',
      pagina: 1,
      limite: 20,
    };

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    expect(gateway.searchProcurementContracts).toHaveBeenCalledWith(input);
  });

  it('should return a typed error without caching it', async () => {
    gateway.searchMunicipalProcurements.mockRejectedValue(
      new AnalysisServiceTimeoutError(),
    );
    const useCase = new SearchMunicipalProcurementsUseCase(
      gateway,
      cache,
      keyGenerator,
      cachePolicy,
    );
    const input: SearchMunicipalProcurementsInput = {
      codigoMunicipioIbge: '2300754',
      periodo: { ano: 2025 },
      pagina: 1,
      limite: 20,
    };

    const first = await useCase.execute(input);
    const second = await useCase.execute(input);

    expect(first.isLeft()).toBe(true);
    expect(first.value).toBeInstanceOf(AnalysisServiceTimeoutError);
    expect(second.isLeft()).toBe(true);
    expect(gateway.searchMunicipalProcurements).toHaveBeenCalledTimes(2);
  });
});
