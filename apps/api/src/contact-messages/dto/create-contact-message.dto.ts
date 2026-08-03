import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
