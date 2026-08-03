import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.report.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, schoolId },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  create(schoolId: string, data: any) {
    return this.prisma.report.create({
      data: {
        name: data.name,
        type: data.type,
        filters: data.filters || {},
        status: data.status || 'PENDING',
        schoolId,
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const report = await this.findById(schoolId, id);
    return this.prisma.report.update({
      where: { id: report.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const report = await this.findById(schoolId, id);
    return this.prisma.report.delete({ where: { id: report.id } });
  }
}
