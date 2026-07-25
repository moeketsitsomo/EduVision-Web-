import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalSchools,
      activeSchools,
      suspendedSchools,
      trialSchools,
      expiredSchools,
      totalUsers,
      totalPages,
      totalPosts,
      totalMedia,
      totalInvoices,
      unpaidInvoices,
    ] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.school.count({ where: { isActive: true } }),
      this.prisma.school.count({ where: { isActive: false } }),
      this.prisma.school.count({ where: { subscriptionStatus: 'TRIAL' } }),
      this.prisma.school.count({ where: { subscriptionStatus: 'EXPIRED' } }),
      this.prisma.user.count(),
      this.prisma.page.count(),
      this.prisma.post.count(),
      this.prisma.media.count(),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: { not: 'PAID' } } }),
    ]);
    return {
      totalSchools,
      activeSchools,
      suspendedSchools,
      trialSchools,
      expiredSchools,
      totalUsers,
      totalPages,
      totalPosts,
      totalMedia,
      totalInvoices,
      unpaidInvoices,
    };
  }

  async getRecentActivity(limit = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { email: true, firstName: true, lastName: true } }, school: { select: { name: true } } },
    });
  }
}
