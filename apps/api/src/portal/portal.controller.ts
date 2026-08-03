import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole, NoticeAudience } from '@prisma/client';

@Controller('portal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PARENT, UserRole.TEACHER, UserRole.LEARNER)
export class PortalController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async me(@CurrentUser() user: any) {
    const u = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { school: true, student: true },
    });
    const { passwordHash, twoFactorSecret, ...safe } = u as any;
    return safe;
  }

  @Get('notices')
  async notices(@CurrentUser() user: any) {
    const audience =
      user.role === UserRole.PARENT
        ? NoticeAudience.PARENTS
        : user.role === UserRole.TEACHER
          ? NoticeAudience.TEACHERS
          : user.role === UserRole.LEARNER
            ? NoticeAudience.LEARNERS
            : NoticeAudience.ALL;
    return this.prisma.notice.findMany({
      where: {
        schoolId: user.schoolId,
        isPublished: true,
        audience: { in: [NoticeAudience.ALL, audience] },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  @Get('calendar')
  async calendar(@CurrentUser() user: any) {
    return this.prisma.event.findMany({
      where: { schoolId: user.schoolId, isPublished: true },
      orderBy: { startAt: 'asc' },
    });
  }

  @Get('results')
  async results(
    @CurrentUser() user: any,
    @Query('academicYear') academicYear?: string,
    @Query('term') term?: string,
  ) {
    const schoolId = user.schoolId;
    let where: any = { schoolId, isPublished: true };
    if (user.role === UserRole.LEARNER || user.role === UserRole.PARENT) {
      if (user.studentId) {
        where = { ...where, studentId: user.studentId };
      } else if (user.role === UserRole.LEARNER) {
        return [];
      }
    }
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;
    return this.prisma.result.findMany({ where, orderBy: [{ academicYear: 'desc' }, { term: 'asc' }, { subject: 'asc' }] });
  }

  @Get('attendance')
  async attendance(
    @CurrentUser() user: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const schoolId = user.schoolId;
    let where: any = { schoolId };
    if (user.role === UserRole.LEARNER || user.role === UserRole.PARENT) {
      if (user.studentId) {
        where = { ...where, studentId: user.studentId };
      } else if (user.role === UserRole.LEARNER) {
        return [];
      }
    }
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }
    return this.prisma.attendance.findMany({ where, orderBy: { date: 'desc' } });
  }

  @Get('homework')
  async homework(@CurrentUser() user: any) {
    const schoolId = user.schoolId;
    let where: any = { schoolId, isPublished: true };
    if (user.role === UserRole.LEARNER || user.role === UserRole.PARENT) {
      if (user.studentId) {
        where = { OR: [{ studentId: user.studentId }, { grade: null }, { grade: (user.student as any)?.grade }], ...where };
      } else if (user.role === UserRole.LEARNER) {
        return [];
      }
    }
    return this.prisma.homework.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { assignedAt: 'desc' }],
    });
  }
}
