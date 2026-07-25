import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { NoticeAudience } from '@prisma/client';

export class CreateNoticeDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(NoticeAudience)
  audience?: NoticeAudience;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
