import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.student.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdOrThrow(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({ where: { id, schoolId } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  create(schoolId: string, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        ...dto,
        schoolId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    await this.findByIdOrThrow(schoolId, id);
    const data: any = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.student.delete({ where: { id } });
  }
}
