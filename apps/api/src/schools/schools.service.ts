import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, School, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<School> {
    const school = await this.findById(id);
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async findBySlug(slug: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { slug: slug.toLowerCase() } });
  }

  async create(data: Prisma.SchoolCreateInput): Promise<School> {
    const slug = (data.slug as string).toLowerCase();
    const existing = await this.prisma.school.findFirst({
      where: { OR: [{ slug }, { customDomain: data.customDomain || undefined }] },
    });
    if (existing) {
      throw new ConflictException('School slug or custom domain already exists');
    }
    return this.prisma.school.create({
      data: {
        ...data,
        slug,
        subscriptionStatus: SubscriptionStatus.TRIAL,
      },
    });
  }

  async update(id: string, data: Prisma.SchoolUpdateInput): Promise<School> {
    await this.findByIdOrThrow(id);
    if (data.slug) {
      data.slug = (data.slug as string).toLowerCase();
    }
    return this.prisma.school.update({ where: { id }, data });
  }

  async setActive(id: string, active: boolean): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data: { isActive: active },
    });
  }

  async remove(id: string): Promise<School> {
    await this.findByIdOrThrow(id);
    return this.prisma.school.delete({ where: { id } });
  }
}
