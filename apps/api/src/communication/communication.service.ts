import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.communication.findMany({
      where: { schoolId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const item = await this.prisma.communication.findFirst({
      where: { id, schoolId },
    });
    if (!item) throw new NotFoundException('Communication not found');
    return item;
  }

  create(schoolId: string, data: any) {
    return this.prisma.communication.create({
      data: {
        ...data,
        schoolId,
        sentAt: new Date(),
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const item = await this.findById(schoolId, id);
    return this.prisma.communication.update({
      where: { id: item.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const item = await this.findById(schoolId, id);
    return this.prisma.communication.delete({ where: { id: item.id } });
  }
}
