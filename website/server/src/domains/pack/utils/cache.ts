import { promisify } from 'node:util';
import * as zlib from 'node:zlib';
import type { PackOptions } from '../../../types.js';

const inflateAsync = promisify(zlib.inflate);
const deflateAsync = promisify(zlib.deflate);

interface CacheEntry {
  value: Uint8Array; // Compressed data
  timestamp: number;
}

export class RequestCache<T> {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly ttl: number;

  constructor(ttlInSeconds = 60) {
    this.ttl = ttlInSeconds * 1000;

    // Set up periodic cache cleanup
    setInterval(() => this.cleanup(), ttlInSeconds * 1000);
  }

  async get(key: string): Promise<T | undefined> {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    try {
      // Decompress and return the data
      const decompressedData = await inflateAsync(entry.value);
      return JSON.parse(decompressedData.toString('utf8'));
    } catch (error) {
      console.error('Error decompressing cache entry:', error);
      this.cache.delete(key);
      return undefined;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      // Convert data to JSON string and compress
      const jsonString = JSON.stringify(value);
      const compressedData = await deflateAsync(Buffer.from(jsonString, 'utf8'));

      this.cache.set(key, {
        value: compressedData,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error compressing cache entry:', error);
    }
  }

  // Remove expired entries from cache
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache key generation utility
export function generateCacheKey(
  identifier: string,
  format: string,
  options: PackOptions,
  type: 'url' | 'file',
): string {
  return JSON.stringify({
    identifier,
    format,
    options,
    type,
  });
}
