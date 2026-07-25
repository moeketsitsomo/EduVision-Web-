import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.staff.findMany({
      where: { schoolId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  findPublished(schoolId: string) {
    return this.prisma.staff.findMany({
      where: { schoolId, isPublished: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const staff = await this.prisma.staff.findFirst({ where: { id, schoolId } });
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  create(schoolId: string, data: any) {
    return this.prisma.staff.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const staff = await this.findById(schoolId, id);
    return this.prisma.staff.update({ where: { id: staff.id }, data });
  }

  async remove(schoolId: string, id: string) {
    const staff = await this.findById(schoolId, id);
    return this.prisma.staff.delete({ where: { id: staff.id } });
  }
}
