import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string) {
    return this.prisma.post.findMany({
      where: { schoolId },
      orderBy: { publishedAt: 'desc' },
    });
  }

  findPublished(schoolId: string, category?: string) {
    return this.prisma.post.findMany({
      where: {
        schoolId,
        isPublished: true,
        ...(category ? { category } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(schoolId: string, slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { schoolId_slug: { schoolId, slug } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findPublishedBySlug(schoolId: string, slug: string) {
    const post = await this.findBySlug(schoolId, slug);
    if (!post.isPublished) throw new NotFoundException('Post not found');
    return post;
  }

  async create(schoolId: string, data: any) {
    const slug = data.slug ? data.slug.toLowerCase() : slugify(data.title);
    try {
      return await this.prisma.post.create({
        data: {
          ...data,
          slug,
          schoolId,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('A post with this slug already exists');
      }
      throw e;
    }
  }

  async update(schoolId: string, slug: string, data: any) {
    const post = await this.findBySlug(schoolId, slug);
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
    return this.prisma.post.update({
      where: { id: post.id },
      data,
    });
  }

  async remove(schoolId: string, slug: string) {
    const post = await this.findBySlug(schoolId, slug);
    return this.prisma.post.delete({ where: { id: post.id } });
  }
}
