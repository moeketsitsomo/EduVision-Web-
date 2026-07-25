import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  log(schoolId: string | null, userId: string | null, action: string, entity: string, entityId?: string, metadata?: any) {
    return this.prisma.auditLog.create({
      data: {
        schoolId,
        userId,
        action,
        entity,
        entityId,
        metadata: metadata || undefined,
      },
    });
  }

  findBySchool(schoolId: string, skip = 0, take = 100) {
    return this.prisma.auditLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  findAll(skip = 0, take = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}
