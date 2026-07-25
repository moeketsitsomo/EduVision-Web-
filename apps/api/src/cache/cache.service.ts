import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlMs = 60_000): Promise<T> {
    return this.cache.set<T>(key, value, ttlMs);
  }

  async del(key: string): Promise<boolean> {
    return this.cache.del(key);
  }
}
