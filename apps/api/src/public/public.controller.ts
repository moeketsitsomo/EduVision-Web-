import { Controller, Get, Param, Query, Post, Body, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant } from '../tenant/tenant.decorator';
import { CreateAdmissionDto } from '../admissions/dto/create-admission.dto';
import { ContactMessageDto } from './dto/contact-message.dto';
import { NoticeAudience } from '@prisma/client';
import { CacheService } from '../cache/cache.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CacheService) private readonly cache: CacheService,
  ) {}

  @Get('site')
  async site(@Tenant('id') schoolId: string) {
    const cacheKey = `public:site:${schoolId}`;
    const cached = await this.cache.get<Record<string, any>>(cacheKey);
    if (cached) return cached;

    const [
      school,
      pages,
      posts,
      staff,
      events,
      galleries,
      downloads,
      contacts,
      socials,
      fees,
      navigation,
      notices,
      subjects,
    ] = await Promise.all([
      this.prisma.school.findUnique({ where: { id: schoolId } }),
      this.prisma.page.findMany({
        where: { schoolId, isPublished: true },
        orderBy: [{ showInMenu: 'desc' }, { menuOrder: 'asc' }, { title: 'asc' }],
      }),
      this.prisma.post.findMany({
        where: { schoolId, isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      }),
      this.prisma.staff.findMany({
        where: { schoolId, isPublished: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.event.findMany({
        where: { schoolId, isPublished: true },
        orderBy: { startAt: 'asc' },
        take: 20,
      }),
      this.prisma.gallery.findMany({
        where: { schoolId },
        include: { items: { include: { media: true }, orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.download.findMany({
        where: { schoolId },
        include: { media: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.emergencyContact.findMany({
        where: { schoolId },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.socialLink.findMany({
        where: { schoolId },
        orderBy: [{ order: 'asc' }, { platform: 'asc' }],
      }),
      this.prisma.schoolFee.findMany({
        where: { schoolId },
        orderBy: [{ year: 'desc' }, { grade: 'asc' }],
      }),
      this.prisma.navigationItem.findMany({
        where: { schoolId, visible: true },
        orderBy: [{ order: 'asc' }, { label: 'asc' }],
      }),
      this.prisma.notice.findMany({
        where: { schoolId, isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      }),
      this.prisma.subject.findMany({
        where: { schoolId, isPublished: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
    ]);

    const result = {
      school,
      pages,
      posts,
      staff,
      events,
      galleries,
      downloads,
      contacts,
      socials,
      fees,
      navigation,
      notices,
      subjects,
    };

    await this.cache.set(cacheKey, result, 60_000);
    return result;
  }

  @Get('notices')
  async notices(
    @Tenant('id') schoolId: string,
    @Query('audience') audience?: NoticeAudience,
  ) {
    const cacheKey = `public:notices:${schoolId}:${audience || 'all'}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.prisma.notice.findMany({
      where: {
        schoolId,
        isPublished: true,
        ...(audience ? { audience: { in: [audience, 'ALL'] } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    });

    await this.cache.set(cacheKey, result, 60_000);
    return result;
  }

  @Get('calendar')
  async calendar(@Tenant('id') schoolId: string) {
    const cacheKey = `public:calendar:${schoolId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.prisma.event.findMany({
      where: { schoolId, isPublished: true },
      orderBy: { startAt: 'asc' },
    });

    await this.cache.set(cacheKey, result, 60_000);
    return result;
  }

  @Post('admissions')
  async apply(@Tenant('id') schoolId: string, @Body() dto: CreateAdmissionDto) {
    return this.prisma.admissionApplication.create({
      data: {
        ...dto,
        schoolId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        documentUrls: dto.documentUrls as any,
      },
    });
  }

  @Post('contact')
  async contact(@Tenant('id') schoolId: string, @Body() dto: ContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: {
        ...dto,
        schoolId,
      },
    });
  }

  @Get('pages/:slug')
  async page(@Tenant('id') schoolId: string, @Param('slug') slug: string) {
    const cacheKey = `public:page:${schoolId}:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.prisma.page.findFirst({
      where: { schoolId, slug, isPublished: true },
    });

    if (result) await this.cache.set(cacheKey, result, 60_000);
    return result;
  }
}
