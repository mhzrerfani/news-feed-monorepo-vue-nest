import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { SECTIONS, SOURCES } from '../constants';

export class TopStoriesQueryDto {
  @IsOptional()
  @IsIn(SECTIONS as unknown as string[])
  section?: (typeof SECTIONS)[number];

  @IsOptional()
  @IsIn(SOURCES as unknown as string[])
  source?: (typeof SOURCES)[number];

  @IsOptional() @IsString() q?: string; // filter title/abstract/byline
  @IsOptional() @IsString() subsection?: string; // optional subsection match
  @IsOptional() @IsDateString() from?: string; // ISO
  @IsOptional() @IsDateString() to?: string; // ISO
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() step?: string;
}
