import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateNavigationDto {
  @IsString()
  label: string;

  @IsString()
  href: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsString()
  postId?: string;
}
