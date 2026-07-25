import { IsString, IsOptional, IsInt, Min, IsUrl } from 'class-validator';

export class CreateSocialDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
