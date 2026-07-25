import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.page.findMany({
      where: { schoolId },
      orderBy: [{ showInMenu: 'desc' }, { menuOrder: 'asc' }, { title: 'asc' }],
    });
  }

  findPublished(schoolId: string) {
    return this.prisma.page.findMany({
      where: { schoolId, isPublished: true },
      orderBy: [{ showInMenu: 'desc' }, { menuOrder: 'asc' }, { title: 'asc' }],
    });
  }

  async findBySlug(schoolId: string, slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { schoolId_slug: { schoolId, slug } },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findPublishedBySlug(schoolId: string, slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { schoolId_slug: { schoolId, slug } },
    });
    if (!page || !page.isPublished) throw new NotFoundException('Page not found');
    return page;
  }

  async create(schoolId: string, data: any) {
    try {
      return await this.prisma.page.create({
        data: { ...data, schoolId } as any,
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('A page with this slug already exists');
      }
      throw e;
    }
  }

  async update(schoolId: string, slug: string, data: any) {
    const page = await this.findBySlug(schoolId, slug);
    return this.prisma.page.update({
      where: { id: page.id },
      data,
    });
  }

  async remove(schoolId: string, slug: string) {
    const page = await this.findBySlug(schoolId, slug);
    return this.prisma.page.delete({ where: { id: page.id } });
  }
}
