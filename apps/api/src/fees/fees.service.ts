import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string, year?: string) {
    return this.prisma.schoolFee.findMany({
      where: { schoolId, ...(year ? { year } : {}) },
      orderBy: [{ year: 'desc' }, { grade: 'asc' }, { item: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const fee = await this.prisma.schoolFee.findFirst({
      where: { id, schoolId },
    });
    if (!fee) throw new NotFoundException('Fee not found');
    return fee;
  }

  create(schoolId: string, data: any) {
    return this.prisma.schoolFee.create({
      data: { ...data, amount: data.amount, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const fee = await this.findById(schoolId, id);
    return this.prisma.schoolFee.update({
      where: { id: fee.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const fee = await this.findById(schoolId, id);
    return this.prisma.schoolFee.delete({ where: { id: fee.id } });
  }
}
