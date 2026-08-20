import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AnalysisOperation } from '../contracts/analysis-contracts';

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        const item = (value as Record<string, unknown>)[key];

        if (item !== undefined) {
          result[key] = canonicalize(item);
        }

        return result;
      }, {});
  }

  return value;
}

@Injectable()
export class CacheKeyGenerator {
  generate(operation: AnalysisOperation, input: unknown): string {
    const normalized = JSON.stringify(canonicalize(input));
    const digest = createHash('sha256').update(normalized).digest('hex');

    return `analysis:v1:${operation}:${digest}`;
  }
}
