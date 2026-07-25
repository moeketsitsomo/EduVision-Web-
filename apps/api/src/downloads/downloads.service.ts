import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DownloadsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.download.findMany({
      where: { schoolId },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublished(schoolId: string) {
    return this.prisma.download.findMany({
      where: { schoolId },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const download = await this.prisma.download.findFirst({
      where: { id, schoolId },
      include: { media: true },
    });
    if (!download) throw new NotFoundException('Download not found');
    return download;
  }

  create(schoolId: string, data: any) {
    return this.prisma.download.create({
      data: { ...data, schoolId },
      include: { media: true },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findById(schoolId, id);
    return this.prisma.download.update({
      where: { id },
      data,
      include: { media: true },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findById(schoolId, id);
    return this.prisma.download.delete({ where: { id } });
  }
}
