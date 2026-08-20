import {
  AnalysisCache,
  CachedExecution,
} from '@/domain/procurement/application/cache/analysis-cache';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

export const MEMORY_CACHE_OPTIONS = Symbol('MEMORY_CACHE_OPTIONS');

export interface MemoryCacheOptions {
  maxEntries: number;
  maxValueBytes: number;
  maxTotalBytes: number;
  cleanupIntervalSeconds: number;
}

interface CacheEntry {
  value: unknown;
  expiresAt: number;
  lastAccess: number;
  sizeBytes: number;
}

@Injectable()
export class InMemoryAnalysisCache implements AnalysisCache, OnModuleDestroy {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<
    string,
    Promise<CachedExecution<unknown>>
  >();
  private readonly cleanupTimer: NodeJS.Timeout;
  private currentSizeBytes = 0;

  constructor(
    @Inject(MEMORY_CACHE_OPTIONS)
    private readonly options: MemoryCacheOptions,
  ) {
    this.cleanupTimer = setInterval(
      () => this.removeExpiredEntries(),
      options.cleanupIntervalSeconds * 1000,
    );
    this.cleanupTimer.unref();
  }

  get<T>(key: string): Promise<CachedExecution<T> | null> {
    const entry = this.entries.get(key);

    if (!entry) {
      return Promise.resolve(null);
    }

    if (entry.expiresAt <= Date.now()) {
      this.removeEntry(key);
      return Promise.resolve(null);
    }

    entry.lastAccess = Date.now();

    return Promise.resolve({
      value: structuredClone(entry.value) as T,
      hit: true,
      expiresAt: new Date(entry.expiresAt),
    });
  }

  set<T>(key: string, value: T, ttlSeconds: number): Promise<Date | null> {
    if (ttlSeconds <= 0) {
      return Promise.resolve(null);
    }

    const clonedValue = structuredClone(value);
    const sizeBytes = Buffer.byteLength(JSON.stringify(clonedValue), 'utf8');

    if (
      sizeBytes > this.options.maxValueBytes ||
      sizeBytes > this.options.maxTotalBytes
    ) {
      return Promise.resolve(null);
    }

    this.removeExpiredEntries();
    this.removeEntry(key);

    while (
      this.entries.size >= this.options.maxEntries ||
      this.currentSizeBytes + sizeBytes > this.options.maxTotalBytes
    ) {
      if (!this.evictLeastRecentlyUsed()) {
        return Promise.resolve(null);
      }
    }

    const now = Date.now();
    const expiresAt = now + ttlSeconds * 1000;

    this.entries.set(key, {
      value: clonedValue,
      expiresAt,
      lastAccess: now,
      sizeBytes,
    });
    this.currentSizeBytes += sizeBytes;

    return Promise.resolve(new Date(expiresAt));
  }

  delete(key: string): Promise<void> {
    this.removeEntry(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    this.entries.clear();
    this.inFlight.clear();
    this.currentSizeBytes = 0;
    return Promise.resolve();
  }

  async remember<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<CachedExecution<T>> {
    const cached = await this.get<T>(key);

    if (cached) {
      return cached;
    }

    const pending = this.inFlight.get(key);

    if (pending) {
      return pending as Promise<CachedExecution<T>>;
    }

    const execution = factory()
      .then(async (value) => {
        const expiresAt = await this.set(key, value, ttlSeconds);

        return {
          value,
          hit: false,
          expiresAt,
        };
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, execution);

    return execution;
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupTimer);
  }

  private removeExpiredEntries(): void {
    const now = Date.now();

    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt <= now) {
        this.removeEntry(key);
      }
    }
  }

  private evictLeastRecentlyUsed(): boolean {
    let leastRecentlyUsedKey: string | null = null;
    let leastRecentAccess = Number.POSITIVE_INFINITY;

    for (const [key, entry] of this.entries.entries()) {
      if (entry.lastAccess < leastRecentAccess) {
        leastRecentAccess = entry.lastAccess;
        leastRecentlyUsedKey = key;
      }
    }

    if (!leastRecentlyUsedKey) {
      return false;
    }

    this.removeEntry(leastRecentlyUsedKey);
    return true;
  }

  private removeEntry(key: string): void {
    const entry = this.entries.get(key);

    if (!entry) {
      return;
    }

    this.entries.delete(key);
    this.currentSizeBytes -= entry.sizeBytes;
  }
}
