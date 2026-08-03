import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsUrl,
  Matches,
  MinLength,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { PlanType } from '@prisma/client';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase letters, numbers, and hyphens only',
  })
  slug: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  logoUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  websiteTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Admin password must be at least 8 characters' })
  adminPassword?: string;

  @IsOptional()
  @IsString()
  adminFirstName?: string;

  @IsOptional()
  @IsString()
  adminLastName?: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  trialDays?: number;

  @IsOptional()
  @IsEmail()
  billingEmail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxStorageMb?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxUsers?: number;

  @IsOptional()
  @IsString()
  bannerImageUrl?: string;

  @IsOptional()
  @IsString()
  admissionsEmail?: string;

  @IsOptional()
  @IsString()
  admissionsPhone?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsString()
  principalName?: string;

  @IsOptional()
  @IsString()
  principalMessage?: string;

  @IsOptional()
  @IsString()
  mission?: string;

  @IsOptional()
  @IsString()
  vision?: string;

  @IsOptional()
  @IsString()
  values?: string;

  @IsOptional()
  @IsString()
  history?: string;

  @IsOptional()
  @IsInt()
  establishedYear?: number;

  @IsOptional()
  @IsInt()
  enrollmentCount?: number;

  @IsOptional()
  @IsInt()
  teacherCount?: number;

  @IsOptional()
  @IsInt()
  classroomCount?: number;

  @IsOptional()
  @IsNumber()
  passRate?: number;

  @IsOptional()
  facilities?: any;

  @IsOptional()
  awards?: any;

  @IsOptional()
  @IsString()
  officeHours?: string;

  @IsOptional()
  @IsString()
  googleMapsUrl?: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;
}
