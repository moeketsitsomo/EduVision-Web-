import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string, date?: string) {
    return this.prisma.attendance.findMany({
      where: { schoolId, ...(date ? { date: new Date(date) } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdOrThrow(schoolId: string, id: string) {
    const record = await this.prisma.attendance.findFirst({ where: { id, schoolId } });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  create(schoolId: string, dto: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        ...dto,
        schoolId,
        date: new Date(dto.date),
      },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateAttendanceDto) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.attendance.update({ where: { id }, data: dto });
  }

  async remove(schoolId: string, id: string) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.attendance.delete({ where: { id } });
  }
}
