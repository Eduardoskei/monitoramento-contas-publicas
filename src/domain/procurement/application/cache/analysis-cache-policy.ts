import { AnalysisOperation } from '../contracts/analysis-contracts';

export abstract class AnalysisCachePolicy {
  abstract ttlFor(operation: AnalysisOperation): number;
}
