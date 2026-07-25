import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalSchools,
      activeSchools,
      suspendedSchools,
      totalUsers,
      totalPages,
      totalPosts,
      totalMedia,
    ] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.school.count({ where: { isActive: true } }),
      this.prisma.school.count({ where: { isActive: false } }),
      this.prisma.user.count(),
      this.prisma.page.count(),
      this.prisma.post.count(),
      this.prisma.media.count(),
    ]);
    return {
      totalSchools,
      activeSchools,
      suspendedSchools,
      totalUsers,
      totalPages,
      totalPosts,
      totalMedia,
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
