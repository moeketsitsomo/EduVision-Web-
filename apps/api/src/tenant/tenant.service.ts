import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { School } from '@prisma/client';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveFromRequest(req: any): Promise<School | null> {
    const slug =
      req.headers['x-school-slug'] ||
      req.headers['x-tenant-slug'] ||
      req.query?.schoolSlug;
    if (slug && typeof slug === 'string') {
      return this.resolveBySlug(slug);
    }

    const schoolId = req.headers['x-school-id'];
    if (schoolId && typeof schoolId === 'string') {
      return this.prisma.school.findUnique({ where: { id: schoolId } });
    }

    const host = req.headers['host'] || req.hostname;
    if (host && typeof host === 'string') {
      return this.resolveByHost(host);
    }

    return null;
  }

  async resolveBySlug(slug: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { slug: slug.toLowerCase() } });
  }

  async resolveByHost(host: string): Promise<School | null> {
    const lower = host.toLowerCase().split(':')[0];

    const byDomain = await this.prisma.school.findUnique({
      where: { customDomain: lower },
    });
    if (byDomain) return byDomain;

    const parts = lower.split('.');
    if (parts.length >= 2 && !['www', 'admin', 'api', 'app'].includes(parts[0])) {
      return this.prisma.school.findUnique({ where: { slug: parts[0] } });
    }

    return null;
  }
}
