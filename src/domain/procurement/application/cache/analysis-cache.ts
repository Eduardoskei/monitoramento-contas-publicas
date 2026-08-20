export interface CachedExecution<T> {
  value: T;
  hit: boolean;
  expiresAt: Date | null;
}

export abstract class AnalysisCache {
  abstract get<T>(key: string): Promise<CachedExecution<T> | null>;
  abstract set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<Date | null>;
  abstract delete(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract remember<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<CachedExecution<T>>;
}
