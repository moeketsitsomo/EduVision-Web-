import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.timetableEntry.findMany({
      where: { schoolId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const entry = await this.prisma.timetableEntry.findFirst({
      where: { id, schoolId },
    });
    if (!entry) throw new NotFoundException('Timetable entry not found');
    return entry;
  }

  create(schoolId: string, data: any) {
    return this.prisma.timetableEntry.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const entry = await this.findById(schoolId, id);
    return this.prisma.timetableEntry.update({
      where: { id: entry.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const entry = await this.findById(schoolId, id);
    return this.prisma.timetableEntry.delete({ where: { id: entry.id } });
  }
}
