import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string, studentNumber?: string) {
    return this.prisma.result.findMany({
      where: { schoolId, ...(studentNumber ? { studentNumber } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublished(schoolId: string, studentNumber?: string) {
    return this.prisma.result.findMany({
      where: { schoolId, isPublished: true, ...(studentNumber ? { studentNumber } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdOrThrow(schoolId: string, id: string) {
    const result = await this.prisma.result.findFirst({ where: { id, schoolId } });
    if (!result) throw new NotFoundException('Result not found');
    return result;
  }

  create(schoolId: string, dto: CreateResultDto) {
    return this.prisma.result.create({
      data: {
        ...dto,
        schoolId,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateResultDto) {
    await this.findByIdOrThrow(schoolId, id);
    const data: any = { ...dto };
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);
    return this.prisma.result.update({ where: { id }, data });
  }

  async remove(schoolId: string, id: string) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.result.delete({ where: { id } });
  }
}
