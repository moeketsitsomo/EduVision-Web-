import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@redis/client';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async basic() {
    return { status: 'ok', service: 'eduvision-api', timestamp: new Date().toISOString() };
  }

  async detailed() {
    const checks: Record<string, any> = {};

    // Database
    try {
      const dbResult = await this.prisma.$queryRaw`SELECT 1 as one`;
      checks.database = { status: 'ok', result: dbResult };
    } catch (err: any) {
      checks.database = { status: 'error', message: err.message };
    }

    // Redis
    const redisUrl = this.config.get('REDIS_URL');
    if (redisUrl) {
      let client: ReturnType<typeof createClient> | undefined;
      try {
        client = createClient({ url: redisUrl });
        await client.connect();
        const pong = await client.ping();
        checks.redis = { status: 'ok', ping: pong };
      } catch (err: any) {
        checks.redis = { status: 'error', message: err.message };
      } finally {
        await client?.quit().catch(() => {});
      }
    } else {
      checks.redis = { status: 'skipped', message: 'REDIS_URL not configured' };
    }

    // Disk for storage root
    try {
      const storageRoot = this.config.get('STORAGE_LOCAL_ROOT') || 'uploads';
      const resolved = path.resolve(storageRoot);
      const stats = fs.statfsSync(resolved);
      const total = stats.bsize * stats.blocks;
      const available = stats.bsize * stats.bavail;
      const used = total - available;
      checks.storage = {
        status: 'ok',
        path: resolved,
        totalBytes: total,
        usedBytes: used,
        availableBytes: available,
        usedPercent: total ? Number(((used / total) * 100).toFixed(2)) : 0,
      };
    } catch (err: any) {
      checks.storage = { status: 'error', message: err.message };
    }

    // Memory / load
    checks.memory = {
      totalBytes: os.totalmem(),
      freeBytes: os.freemem(),
      usedPercent: Number(((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)),
    };
    checks.loadAverage = os.loadavg();
    checks.uptimeSeconds = process.uptime();

    const healthy = Object.values(checks).every((c: any) => c.status !== 'error');
    return { status: healthy ? 'ok' : 'degraded', timestamp: new Date().toISOString(), checks };
  }
}
