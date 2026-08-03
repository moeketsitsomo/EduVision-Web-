import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.subject.findMany({
      where: { schoolId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, schoolId },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  create(schoolId: string, data: any) {
    return this.prisma.subject.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const subject = await this.findById(schoolId, id);
    return this.prisma.subject.update({
      where: { id: subject.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const subject = await this.findById(schoolId, id);
    return this.prisma.subject.delete({ where: { id: subject.id } });
  }
}
