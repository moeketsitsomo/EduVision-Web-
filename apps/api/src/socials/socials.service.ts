import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.socialLink.findMany({
      where: { schoolId },
      orderBy: [{ order: 'asc' }, { platform: 'asc' }],
    });
  }

  async findById(schoolId: string, id: string) {
    const social = await this.prisma.socialLink.findFirst({
      where: { id, schoolId },
    });
    if (!social) throw new NotFoundException('Social link not found');
    return social;
  }

  create(schoolId: string, data: any) {
    return this.prisma.socialLink.create({
      data: { ...data, schoolId },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const social = await this.findById(schoolId, id);
    return this.prisma.socialLink.update({
      where: { id: social.id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    const social = await this.findById(schoolId, id);
    return this.prisma.socialLink.delete({ where: { id: social.id } });
  }
}
