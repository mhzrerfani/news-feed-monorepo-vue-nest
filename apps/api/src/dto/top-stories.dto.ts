import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

const SECTIONS = [
  'arts',
  'automobiles',
  'books',
  'business',
  'fashion',
  'food',
  'health',
  'home',
  'insider',
  'magazine',
  'movies',
  'nyregion',
  'obituaries',
  'opinion',
  'politics',
  'realestate',
  'science',
  'sports',
  'sundayreview',
  'technology',
  'theater',
  't-magazine',
  'travel',
  'upshot',
  'us',
  'world',
] as const;

const SOURCES = ['nytimes', 'guardian'] as const;

export class TopStoriesQueryDto {
  @IsIn(SECTIONS as unknown as string[])
  section!: (typeof SECTIONS)[number];

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
