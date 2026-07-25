import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant } from '../tenant/tenant.decorator';
import { CreateAdmissionDto } from '../admissions/dto/create-admission.dto';
import { NoticeAudience } from '@prisma/client';

@Controller('public')
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('site')
  async site(@Tenant('id') schoolId: string) {
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
    ]);

    return {
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
    };
  }

  @Get('notices')
  notices(
    @Tenant('id') schoolId: string,
    @Query('audience') audience?: NoticeAudience,
  ) {
    return this.prisma.notice.findMany({
      where: {
        schoolId,
        isPublished: true,
        ...(audience ? { audience: { in: [audience, 'ALL'] } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  @Get('calendar')
  calendar(@Tenant('id') schoolId: string) {
    return this.prisma.event.findMany({
      where: { schoolId, isPublished: true },
      orderBy: { startAt: 'asc' },
    });
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

  @Get('pages/:slug')
  async page(@Tenant('id') schoolId: string, @Param('slug') slug: string) {
    return this.prisma.page.findFirst({
      where: { schoolId, slug, isPublished: true },
    });
  }
}
