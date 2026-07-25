import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AdmissionStatus } from '@prisma/client';


export class CreateAdmissionDto {
  @IsString()
  studentFirstName: string;

  @IsOptional()
  @IsString()
  studentLastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsString()
  gradeApplying: string;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsString()
  parentName: string;

  @IsEmail()
  parentEmail: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AdmissionStatus)
  status?: AdmissionStatus;

  @IsOptional()
  documentUrls?: string[];
}
