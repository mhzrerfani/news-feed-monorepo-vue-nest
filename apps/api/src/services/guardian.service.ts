import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NewsProvider, NewsStory } from '../types';

const BASE_URL = 'https://content.guardianapis.com';

interface GuardianResponse<T> {
  response: {
    status: string;
    total: number;
    results: T[];
  };
}

interface GuardianStory {
  id: string;
  webTitle: string;
  webUrl: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  pillarName?: string;
  fields?: {
    trailText?: string;
    byline?: string;
    thumbnail?: string;
  };
}

@Injectable()
export class GuardianService implements NewsProvider {
  constructor(private readonly http: HttpService) {}

  private get apiKey() {
    const k = process.env.GUARDIAN_API_KEY;
    if (!k) throw new InternalServerErrorException('GUARDIAN_API_KEY missing');
    return k;
  }

  async topStories(
    section: string,
    subsection?: string,
    query?: string,
    from?: string,
    to?: string,
  ): Promise<NewsStory[]> {
    const url = `${BASE_URL}/search`;
    const { data } = await firstValueFrom(
      this.http.get<GuardianResponse<GuardianStory>>(url, {
        params: {
          'api-key': this.apiKey,
          q: section.toLowerCase(),
          'show-fields': 'trailText,byline,thumbnail',
          ...(query && { q: query }),
          ...(from && { 'from-date': from }),
          ...(to && { 'to-date': to }),
          'order-by': 'newest',
        },
      }),
    );

    let results = data.response.results;

    if (subsection) {
      results = results.filter(
        (r) => r.pillarName?.toLowerCase() === subsection.toLowerCase(),
      );
    }

    return results.map(this.mapGuardianToNewsStory);
  }

  async search(
    query: string,
    from?: string,
    to?: string,
  ): Promise<NewsStory[]> {
    const url = `${BASE_URL}/search`;
    const { data } = await firstValueFrom(
      this.http.get<GuardianResponse<GuardianStory>>(url, {
        params: {
          'api-key': this.apiKey,
          q: query,
          'show-fields': 'trailText,byline,thumbnail',
          ...(from && { 'from-date': from }),
          ...(to && { 'to-date': to }),
        },
      }),
    );

    return data.response.results.map(this.mapGuardianToNewsStory);
  }

  private mapGuardianToNewsStory = (story: GuardianStory): NewsStory => {
    return {
      id: story.id,
      title: story.webTitle,
      abstract: story.fields?.trailText || '',
      url: story.webUrl,
      publishedDate: story.webPublicationDate,
      section: story.sectionName,
      cover: story.fields?.thumbnail || null,
      subsection: story.pillarName,
      byline: story.fields?.byline,
      source: 'guardian',
    };
  };
}
