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

export abstract class AnalysisGateway {
  abstract searchMunicipalProcurements(
    input: SearchMunicipalProcurementsInput,
  ): Promise<MunicipalProcurementsData>;

  abstract getLocalMeParticipation(
    input: GetLocalMeParticipationInput,
  ): Promise<LocalMeParticipationData>;

  abstract searchMeProcurements(
    input: SearchMeProcurementsInput,
  ): Promise<MeProcurementsData>;

  abstract searchCompanyProcurements(
    input: SearchCompanyProcurementsInput,
  ): Promise<CompanyProcurementsData>;

  abstract searchProcurementContracts(
    input: SearchProcurementContractsInput,
  ): Promise<ProcurementContractsData>;
}
