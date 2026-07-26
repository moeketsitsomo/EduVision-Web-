import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.financeTransaction.findMany({
      where: { schoolId },
      orderBy: { date: 'desc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const tx = await this.prisma.financeTransaction.findFirst({
      where: { id, schoolId },
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  create(schoolId: string, data: any) {
    return this.prisma.financeTransaction.create({
      data: {
        ...data,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
        schoolId,
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const tx = await this.findById(schoolId, id);
    if (data.date) data.date = new Date(data.date);
    return this.prisma.financeTransaction.update({
      where: { id: tx.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const tx = await this.findById(schoolId, id);
    return this.prisma.financeTransaction.delete({ where: { id: tx.id } });
  }
}
