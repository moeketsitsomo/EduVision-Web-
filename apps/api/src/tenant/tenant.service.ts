import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { School } from '@prisma/client';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveFromRequest(req: any, fallback = false): Promise<School | null> {
    const slug =
      req.headers['x-school-slug'] ||
      req.headers['x-tenant-slug'] ||
      req.query?.schoolSlug;
    if (slug && typeof slug === 'string') {
      const bySlug = await this.resolveBySlug(slug);
      if (bySlug) return bySlug;
    }

    const schoolId = req.headers['x-school-id'];
    if (schoolId && typeof schoolId === 'string') {
      const byId = await this.prisma.school.findUnique({ where: { id: schoolId } });
      if (byId) return byId;
    }

    const host = req.headers['host'] || req.hostname;
    if (host && typeof host === 'string') {
      const byHost = await this.resolveByHost(host);
      if (byHost) return byHost;
    }

    if (fallback) {
      return this.resolveDefaultSchool();
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

  async countActiveSchools(): Promise<number> {
    return this.prisma.school.count({ where: { isActive: true } });
  }

  async resolveDefaultSchool(): Promise<School | null> {
    const fallbackSlug = process.env.DEFAULT_SCHOOL_SLUG;
    if (fallbackSlug) {
      const bySlug = await this.resolveBySlug(fallbackSlug);
      if (bySlug?.isActive) return bySlug;
    }

    const active = await this.prisma.school.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    return active || null;
  }
}
