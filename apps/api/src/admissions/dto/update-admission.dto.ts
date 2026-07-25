import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AdmissionStatus } from '@prisma/client';

export class UpdateAdmissionDto {
  @IsOptional()
  @IsEnum(AdmissionStatus)
  status?: AdmissionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
