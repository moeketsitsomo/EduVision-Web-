import { IsString, IsOptional, IsInt, IsDateString, IsEnum, Min } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';

export class CreateLicenseDto {
  @IsString()
  schoolId: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  seats?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
