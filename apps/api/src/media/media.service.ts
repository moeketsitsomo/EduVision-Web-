import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  findAll(schoolId: string, type?: string, category?: string) {
    const where: any = { schoolId };
    if (type) where.type = type as MediaType;
    if (category) where.category = category;
    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async categories(schoolId: string) {
    const rows = await this.prisma.media.findMany({
      where: { schoolId },
      select: { category: true },
    });
    const categories = Array.from(new Set(rows.map((r) => r.category).filter(Boolean)));
    return categories;
  }

  async findById(schoolId: string, id: string) {
    const media = await this.prisma.media.findFirst({ where: { id, schoolId } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async upload(file: Express.Multer.File, schoolId: string, uploadedById: string, category?: string, folder = 'files') {
    const folderName = this.folderForType(file.mimetype);
    const stored = await this.storage.save(file, schoolId, folderName);
    const type = this.detectType(file.mimetype);
    return this.prisma.media.create({
      data: {
        ...stored,
        type,
        category,
        schoolId,
        uploadedById,
      },
    });
  }

  async remove(schoolId: string, id: string) {
    const media = await this.findById(schoolId, id);
    await this.storage.delete(media.url);
    return this.prisma.media.delete({ where: { id: media.id } });
  }

  private folderForType(mime: string): string {
    if (mime.startsWith('image/')) return 'images';
    if (mime.startsWith('video/')) return 'videos';
    if (mime === 'application/pdf') return 'documents';
    return 'files';
  }

  private detectType(mime: string): MediaType {
    if (mime.startsWith('image/')) return MediaType.IMAGE;
    if (mime.startsWith('video/')) return MediaType.VIDEO;
    if (mime === 'application/pdf' || mime.includes('word') || mime.includes('excel') || mime.includes('powerpoint')) {
      return MediaType.DOCUMENT;
    }
    if (mime.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.OTHER;
  }
}
