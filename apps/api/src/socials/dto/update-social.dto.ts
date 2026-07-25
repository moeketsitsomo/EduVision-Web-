import { IsString, IsOptional, IsInt, Min, IsUrl } from 'class-validator';

export class UpdateSocialDto {
  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
