import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

const SOURCES = ['nytimes', 'guardian'] as const;

export class SearchQueryDto {
  @IsString() q!: string;

  @IsOptional()
  @IsIn(SOURCES as unknown as string[])
  source?: (typeof SOURCES)[number];

  @IsOptional() @IsString() section?: string; // NYT section_name
  @IsOptional() @IsDateString() from?: string; // ISO -> YYYYMMDD
  @IsOptional() @IsDateString() to?: string;

  @IsOptional()
  @IsIn(['newest', 'oldest', 'relevance'])
  sort?: 'newest' | 'oldest' | 'relevance';

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  page?: number;
}
