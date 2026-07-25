import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeAudience } from '@prisma/client';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string, audience?: NoticeAudience) {
    return this.prisma.notice.findMany({
      where: {
        schoolId,
        isPublished: true,
        ...(audience ? { audience: { in: [audience, 'ALL'] } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  findAdmin(schoolId: string) {
    return this.prisma.notice.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdOrThrow(schoolId: string, id: string) {
    const notice = await this.prisma.notice.findFirst({ where: { id, schoolId } });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  create(schoolId: string, dto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: {
        ...dto,
        schoolId,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateNoticeDto) {
    await this.findByIdOrThrow(schoolId, id);
    const data: any = { ...dto };
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);
    return this.prisma.notice.update({ where: { id }, data });
  }

  async remove(schoolId: string, id: string) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.notice.delete({ where: { id } });
  }
}
