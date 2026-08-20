import {
  InMemoryAnalysisCache,
  MemoryCacheOptions,
} from './in-memory-analysis-cache';

const defaultOptions: MemoryCacheOptions = {
  maxEntries: 3,
  maxValueBytes: 1024,
  maxTotalBytes: 4096,
  cleanupIntervalSeconds: 60,
};

describe('InMemoryAnalysisCache', () => {
  let cache: InMemoryAnalysisCache;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T12:00:00.000Z'));
    cache = new InMemoryAnalysisCache(defaultOptions);
  });

  afterEach(() => {
    cache.onModuleDestroy();
    vi.useRealTimers();
  });

  it('should store a successful result and return a cache hit', async () => {
    const first = await cache.remember('key', 60, () =>
      Promise.resolve({ value: 1 }),
    );
    const second = await cache.remember('key', 60, () =>
      Promise.resolve({ value: 2 }),
    );

    expect(first.hit).toBe(false);
    expect(first.expiresAt?.toISOString()).toBe('2026-08-20T12:01:00.000Z');
    expect(second).toEqual({
      value: { value: 1 },
      hit: true,
      expiresAt: first.expiresAt,
    });
  });

  it('should expire an entry after its ttl', async () => {
    const factory = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second');

    await cache.remember('key', 10, factory);
    vi.advanceTimersByTime(10_001);
    const result = await cache.remember('key', 10, factory);

    expect(result.value).toBe('second');
    expect(result.hit).toBe(false);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should evict the least recently used entry', async () => {
    await cache.set('a', { value: 'a' }, 60);
    vi.advanceTimersByTime(1);
    await cache.set('b', { value: 'b' }, 60);
    vi.advanceTimersByTime(1);
    await cache.set('c', { value: 'c' }, 60);
    await cache.get('a');
    vi.advanceTimersByTime(1);
    await cache.set('d', { value: 'd' }, 60);

    expect(await cache.get('a')).not.toBeNull();
    expect(await cache.get('b')).toBeNull();
    expect(await cache.get('d')).not.toBeNull();
  });

  it('should deduplicate concurrent requests for the same key', async () => {
    let resolveFactory: ((value: string) => void) | undefined;
    const factory = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveFactory = resolve;
        }),
    );

    const first = cache.remember('key', 60, factory);
    const second = cache.remember('key', 60, factory);
    await Promise.resolve();
    resolveFactory?.('result');

    await expect(first).resolves.toMatchObject({ value: 'result', hit: false });
    await expect(second).resolves.toMatchObject({
      value: 'result',
      hit: false,
    });
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('should not cache failed executions', async () => {
    const factory = vi
      .fn()
      .mockRejectedValueOnce(new Error('failure'))
      .mockResolvedValueOnce('success');

    await expect(cache.remember('key', 60, factory)).rejects.toThrow('failure');
    await expect(cache.remember('key', 60, factory)).resolves.toMatchObject({
      value: 'success',
      hit: false,
    });
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should not cache a value that exceeds the configured limit', async () => {
    cache.onModuleDestroy();
    cache = new InMemoryAnalysisCache({
      ...defaultOptions,
      maxValueBytes: 5,
    });

    const result = await cache.remember('key', 60, () =>
      Promise.resolve('too-large'),
    );

    expect(result.expiresAt).toBeNull();
    expect(await cache.get('key')).toBeNull();
  });

  it('should return isolated copies of cached values', async () => {
    const source = { nested: { value: 1 } };
    await cache.set('key', source, 60);
    source.nested.value = 2;

    const cached = await cache.get<typeof source>('key');
    if (cached) {
      cached.value.nested.value = 3;
    }

    expect((await cache.get<typeof source>('key'))?.value.nested.value).toBe(1);
  });
});
