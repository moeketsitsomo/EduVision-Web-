import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SubscriptionStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

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

  async getStorageUsage() {
    const bySchool = await this.prisma.media.groupBy({
      by: ['schoolId'],
      _sum: { size: true },
      _count: { id: true },
    });
    const byType = await this.prisma.media.groupBy({
      by: ['type'],
      _sum: { size: true },
      _count: { id: true },
    });
    const schools = await this.prisma.school.findMany({
      select: { id: true, name: true, slug: true, maxStorageMb: true },
    });

    const schoolMap = new Map(schools.map((s) => [s.id, s]));
    const schoolUsage = bySchool.map((row) => {
      const school = schoolMap.get(row.schoolId);
      const bytes = row._sum.size || 0;
      const mb = Number((bytes / 1024 / 1024).toFixed(2));
      const maxMb = school?.maxStorageMb || 100;
      return {
        schoolId: row.schoolId,
        schoolName: school?.name || row.schoolId,
        schoolSlug: school?.slug,
        fileCount: row._count.id,
        totalBytes: bytes,
        totalMb: mb,
        maxStorageMb: maxMb,
        usedPercent: Number(((mb / maxMb) * 100).toFixed(2)),
      };
    });

    const totalBytes = schoolUsage.reduce((sum, s) => sum + s.totalBytes, 0);

    return {
      totalBytes,
      totalMb: Number((totalBytes / 1024 / 1024).toFixed(2)),
      schoolUsage,
      typeUsage: byType.map((row) => ({
        type: row.type,
        fileCount: row._count.id,
        totalBytes: row._sum.size || 0,
        totalMb: Number(((row._sum.size || 0) / 1024 / 1024).toFixed(2)),
      })),
    };
  }

  async getBackupStatus() {
    const backupDir = this.config.get('BACKUP_DIR') || '/backups';
    let backups: Array<{ name: string; size: number; sizeMb: number; createdAt: string }> = [];
    let status = 'ok';
    let message = '';

    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const files = fs.readdirSync(backupDir);
      backups = files
        .map((name) => {
          const filePath = path.join(backupDir, name);
          const stat = fs.statSync(filePath);
          return {
            name,
            size: stat.size,
            sizeMb: Number((stat.size / 1024 / 1024).toFixed(2)),
            createdAt: stat.mtime.toISOString(),
          };
        })
        .filter((b) => b.size > 0)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err: any) {
      status = 'error';
      message = err.message;
    }

    const lastBackup = backups[0]?.createdAt || null;
    const lastBackupAgeHours = lastBackup
      ? Number(((Date.now() - new Date(lastBackup).getTime()) / 3600000).toFixed(2))
      : null;
    const stale = lastBackupAgeHours === null || lastBackupAgeHours > 26;

    return {
      status: status === 'error' ? 'error' : stale ? 'warning' : 'ok',
      directory: backupDir,
      totalBackups: backups.length,
      totalSizeMb: Number((backups.reduce((sum, b) => sum + b.size, 0) / 1024 / 1024).toFixed(2)),
      lastBackup,
      lastBackupAgeHours,
      backups,
      message,
    };
  }
}
