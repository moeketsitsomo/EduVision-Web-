import { IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';

export class UpdateLicenseDto {
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
