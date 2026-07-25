import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsUrl,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { PlanType, SubscriptionStatus } from '@prisma/client';

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string;

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
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscriptionStatus?: SubscriptionStatus;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

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
  licenseKey?: string;
}
