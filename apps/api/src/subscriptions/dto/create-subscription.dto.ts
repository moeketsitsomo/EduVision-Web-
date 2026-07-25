import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean } from 'class-validator';
import { PlanType, BillingCycle } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsString()
  schoolId: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
