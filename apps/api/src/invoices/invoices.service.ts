import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId?: string) {
    return this.prisma.invoice.findMany({
      where: schoolId ? { schoolId } : {},
      include: { school: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdOrThrow(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { school: { select: { name: true, slug: true } } },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  create(dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        items: dto.items as any,
      },
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    await this.findByIdOrThrow(id);
    const data: any = { ...dto };
    if (dto.paidAt) data.paidAt = new Date(dto.paidAt);
    return this.prisma.invoice.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.invoice.delete({ where: { id } });
  }
}
