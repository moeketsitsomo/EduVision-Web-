import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  schoolSlug?: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
