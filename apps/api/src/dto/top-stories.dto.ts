import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SECTIONS, SOURCES } from '../constants';

export class TopStoriesQueryDto {
  @IsOptional()
  @IsIn(SECTIONS as unknown as string[])
  section?: (typeof SECTIONS)[number];

  @IsOptional()
  @IsIn(SOURCES as unknown as string[])
  source?: (typeof SOURCES)[number];

  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() subsection?: string;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  step?: number;
}
