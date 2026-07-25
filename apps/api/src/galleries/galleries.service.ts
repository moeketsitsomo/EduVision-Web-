import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.gallery.findMany({
      where: { schoolId },
      include: { items: { include: { media: true }, orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(schoolId: string, id: string) {
    const gallery = await this.prisma.gallery.findFirst({
      where: { id, schoolId },
      include: { items: { include: { media: true }, orderBy: { order: 'asc' } } },
    });
    if (!gallery) throw new NotFoundException('Gallery not found');
    return gallery;
  }

  create(schoolId: string, data: any) {
    const { items, ...rest } = data;
    return this.prisma.gallery.create({
      data: {
        ...rest,
        schoolId,
        items: items?.length
          ? { create: items.map((it: any, idx: number) => ({ ...it, order: it.order ?? idx })) }
          : undefined,
      },
      include: { items: { include: { media: true }, orderBy: { order: 'asc' } } },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findById(schoolId, id);
    const { items, ...rest } = data;
    const updateData: any = { ...rest };
    if (items) {
      await this.prisma.galleryItem.deleteMany({ where: { galleryId: id } });
      updateData.items = {
        create: items.map((it: any, idx: number) => ({ ...it, order: it.order ?? idx })),
      };
    }
    return this.prisma.gallery.update({
      where: { id },
      data: updateData,
      include: { items: { include: { media: true }, orderBy: { order: 'asc' } } },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findById(schoolId, id);
    return this.prisma.gallery.delete({ where: { id } });
  }
}
