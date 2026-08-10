import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import * as bcrypt from 'bcryptjs';
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsArray,
  IsUrl,
} from 'class-validator';

class SchoolSocialDto {
  @IsString()
  platform: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  url: string;
}

class SetupDto {
  @IsString()
  @MinLength(2)
  schoolName: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  principalName?: string;

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  logoUrl?: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  faviconUrl?: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  bannerImageUrl?: string;

  @IsString()
  @IsOptional()
  heroTitle?: string;

  @IsString()
  @IsOptional()
  heroDescription?: string;

  @IsString()
  @IsOptional()
  welcomeTitle?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  websiteTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  footerText?: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsString()
  @IsOptional()
  vision?: string;

  @IsString()
  @IsOptional()
  values?: string;

  @IsArray()
  @IsOptional()
  socials?: SchoolSocialDto[];

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8, { message: 'Admin password must be at least 8 characters' })
  adminPassword: string;

  @IsString()
  @IsOptional()
  adminFirstName?: string;

  @IsString()
  @IsOptional()
  adminLastName?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Controller('setup')
export class SetupController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  @Get('status')
  async status() {
    const activeCount = await this.prisma.school.count({ where: { isActive: true } });
    return { setupRequired: activeCount === 0 };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const stored = await this.storage.save(file, 'setup', 'images');
    return { url: stored.url };
  }

  @Post()
  async setup(@Body() dto: SetupDto) {
    const existing = await this.prisma.school.count({ where: { isActive: true } });
    if (existing > 0) {
      throw new BadRequestException('Setup has already been completed.');
    }

    let slug = dto.slug ? slugify(dto.slug) : slugify(dto.schoolName);
    if (!slug) slug = 'school';

    const existingSlug = await this.prisma.school.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const primaryColor = dto.primaryColor || '#2563eb';
    const secondaryColor = dto.secondaryColor || '#1e293b';
    const websiteTitle = dto.websiteTitle || dto.schoolName;
    const metaDescription = dto.metaDescription || `Welcome to ${dto.schoolName}`;
    const footerText = dto.footerText || `© ${new Date().getFullYear()} ${dto.schoolName}. All rights reserved.`;

    const school = await this.prisma.school.create({
      data: {
        name: dto.schoolName,
        slug,
        isActive: true,
        subscriptionStatus: 'ACTIVE',
        plan: 'ENTERPRISE',
        address: dto.address,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        admissionsEmail: dto.contactEmail,
        admissionsPhone: dto.contactPhone,
        principalName: dto.principalName,
        primaryColor,
        secondaryColor,
        logoUrl: dto.logoUrl,
        faviconUrl: dto.faviconUrl,
        bannerImageUrl: dto.bannerImageUrl,
        heroTitle: dto.heroTitle,
        heroDescription: dto.heroDescription,
        welcomeTitle: dto.welcomeTitle,
        welcomeMessage: dto.welcomeMessage,
        websiteTitle,
        metaDescription,
        footerText,
        mission: dto.mission,
        vision: dto.vision,
        values: dto.values,
      },
    });

    if (dto.socials && dto.socials.length > 0) {
      await this.prisma.socialLink.createMany({
        data: dto.socials
          .filter((s) => s.platform && s.url)
          .map((s, idx) => ({
            platform: s.platform,
            url: s.url,
            order: idx + 1,
            schoolId: school.id,
          })),
      });
    }

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.adminEmail.toLowerCase(),
        passwordHash,
        firstName: dto.adminFirstName || 'School',
        lastName: dto.adminLastName || 'Administrator',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        schoolId: school.id,
      },
    });

    return {
      school: { id: school.id, name: school.name, slug: school.slug },
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
