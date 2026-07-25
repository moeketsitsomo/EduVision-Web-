import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.navigationItem.findMany({
      where: { schoolId },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });
  }

  findVisible(schoolId: string) {
    return this.prisma.navigationItem.findMany({
      where: { schoolId, visible: true },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const item = await this.prisma.navigationItem.findFirst({
      where: { id, schoolId },
    });
    if (!item) throw new NotFoundException('Navigation item not found');
    return item;
  }

  create(schoolId: string, data: any) {
    return this.prisma.navigationItem.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const item = await this.findById(schoolId, id);
    return this.prisma.navigationItem.update({
      where: { id: item.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const item = await this.findById(schoolId, id);
    return this.prisma.navigationItem.delete({ where: { id: item.id } });
  }
}
