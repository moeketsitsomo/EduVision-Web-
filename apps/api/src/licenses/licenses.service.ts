import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@Injectable()
export class LicensesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.license.findMany({
      include: { school: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findBySchool(schoolId: string) {
    return this.prisma.license.findUnique({
      where: { schoolId },
      include: { school: { select: { name: true } } },
    });
  }

  async create(dto: CreateLicenseDto) {
    const existing = await this.prisma.license.findUnique({ where: { schoolId: dto.schoolId } });
    if (existing) throw new ConflictException('License already exists for this school');
    const key = dto.key || `EV-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
    const license = await this.prisma.license.create({
      data: {
        schoolId: dto.schoolId,
        key,
        seats: dto.seats ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
      },
    });
    await this.prisma.school.update({
      where: { id: dto.schoolId },
      data: { licenseKey: key },
    });
    return license;
  }

  async update(id: string, dto: UpdateLicenseDto) {
    const license = await this.prisma.license.findUnique({ where: { id } });
    if (!license) throw new NotFoundException('License not found');
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.license.update({ where: { id }, data });
  }

  async remove(id: string) {
    const license = await this.prisma.license.findUnique({ where: { id } });
    if (!license) throw new NotFoundException('License not found');
    await this.prisma.school.update({
      where: { id: license.schoolId },
      data: { licenseKey: null },
    });
    return this.prisma.license.delete({ where: { id } });
  }
}
