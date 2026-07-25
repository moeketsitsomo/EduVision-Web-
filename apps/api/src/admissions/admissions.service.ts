import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.admissionApplication.findMany({
      where: { schoolId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findByIdOrThrow(schoolId: string, id: string) {
    const app = await this.prisma.admissionApplication.findFirst({ where: { id, schoolId } });
    if (!app) throw new NotFoundException('Admission application not found');
    return app;
  }

  create(schoolId: string, dto: CreateAdmissionDto) {
    return this.prisma.admissionApplication.create({
      data: {
        ...dto,
        schoolId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        documentUrls: dto.documentUrls ? JSON.stringify(dto.documentUrls) : undefined,
      },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateAdmissionDto) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.admissionApplication.update({ where: { id }, data: dto });
  }

  async remove(schoolId: string, id: string) {
    await this.findByIdOrThrow(schoolId, id);
    return this.prisma.admissionApplication.delete({ where: { id } });
  }
}
