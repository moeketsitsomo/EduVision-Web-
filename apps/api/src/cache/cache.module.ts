import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createCache } from 'cache-manager';
import Keyv from 'keyv';
import { createKeyv } from '@keyv/redis';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        const stores: Keyv[] = [new Keyv({ namespace: 'eduvision' })];
        if (redisUrl) {
          stores.push(createKeyv(redisUrl));
        }
        return createCache({ stores, ttl: 60_000 });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
