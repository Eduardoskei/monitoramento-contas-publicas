import { z } from 'zod';

const booleanFromEnvironment = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.toLowerCase() === 'true';
}, z.boolean());

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().int().positive().optional().default(3333),
  FASTAPI_BASE_URL: z.url().optional().default('http://localhost:8000'),
  FASTAPI_SERVICE_TOKEN: z.string().optional(),
  FASTAPI_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(100)
    .optional()
    .default(10_000),
  FASTAPI_RETRY_ATTEMPTS: z.coerce
    .number()
    .int()
    .min(0)
    .max(3)
    .optional()
    .default(1),
  CACHE_MAX_ENTRIES: z.coerce.number().int().positive().optional().default(500),
  CACHE_MAX_VALUE_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(2 * 1024 * 1024),
  CACHE_MAX_TOTAL_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(128 * 1024 * 1024),
  CACHE_CLEANUP_INTERVAL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(60),
  CACHE_TTL_MUNICIPAL_PROCUREMENTS_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(30 * 60),
  CACHE_TTL_LOCAL_ME_PARTICIPATION_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(6 * 60 * 60),
  CACHE_TTL_ME_PROCUREMENTS_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(30 * 60),
  CACHE_TTL_COMPANY_PROCUREMENTS_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(60 * 60),
  CACHE_TTL_PROCUREMENT_CONTRACTS_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(6 * 60 * 60),
  DOCUMENTATION_ENABLED: booleanFromEnvironment.optional().default(true),
  CORS_ORIGINS: z.string().optional().default('http://localhost:3000'),
  THROTTLE_LIMIT: z.coerce.number().int().positive().optional().default(60),
  THROTTLE_TTL_MS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(60_000),
});

export type Env = z.infer<typeof envSchema>;
