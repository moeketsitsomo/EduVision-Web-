import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsUrl,
  Matches,
} from 'class-validator';

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
}
