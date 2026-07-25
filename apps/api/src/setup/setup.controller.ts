import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

class SetupDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Controller('setup')
export class SetupController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  async status() {
    const exists = await this.prisma.school.findUnique({ where: { slug: 'platform' } });
    return { setupRequired: !exists };
  }

  @Post()
  async setup(@Body() dto: SetupDto) {
    const existing = await this.prisma.school.findUnique({ where: { slug: 'platform' } });
    if (existing) {
      throw new BadRequestException('Setup has already been completed.');
    }
    const platform = await this.prisma.school.create({
      data: {
        name: 'EduVision Platform',
        slug: 'platform',
        isActive: true,
        subscriptionStatus: 'ACTIVE',
        plan: 'ENTERPRISE',
      },
    });
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'SUPER_ADMIN',
        isActive: true,
        schoolId: platform.id,
      },
    });
    return { school: platform, user: { id: user.id, email: user.email, role: user.role } };
  }
}
