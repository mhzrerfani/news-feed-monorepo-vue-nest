import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NewsProvider, NewsStory, NytTopStory, NytMultimedia } from '../types';

const BASE_URL = 'https://api.nytimes.com/svc';

@Injectable()
export class NytimesService implements NewsProvider {
  constructor(private readonly http: HttpService) {}

  private get apiKey() {
    const k = process.env.NYT_API_KEY;
    if (!k) throw new InternalServerErrorException('NYT_API_KEY missing');
    return k;
  }

  async topStories(
    section: string,
    subsection?: string,
    query?: string,
    from?: string,
    to?: string,
  ): Promise<NewsStory[]> {
    const url = `${BASE_URL}/topstories/v2/${section}.json`;
    const { data } = await firstValueFrom(
      this.http.get<{ results: NytTopStory[] }>(url, {
        params: { 'api-key': this.apiKey },
      }),
    );
    let results = data?.results ?? [];

    if (subsection) {
      results = results.filter(
        (r) => (r.subsection ?? '').toLowerCase() === subsection.toLowerCase(),
      );
    }
    if (query) {
      const needle = query.toLowerCase();
      results = results.filter(
        (r) =>
          (r.title ?? '').toLowerCase().includes(needle) ||
          (r.abstract ?? '').toLowerCase().includes(needle) ||
          (r.byline ?? '').toLowerCase().includes(needle),
      );
    }
    if (from) {
      const fromDate = new Date(from).getTime();
      results = results.filter(
        (r) => new Date(r.published_date).getTime() >= fromDate,
      );
    }
    if (to) {
      const toDate = new Date(to).getTime();
      results = results.filter(
        (r) => new Date(r.published_date).getTime() <= toDate,
      );
    }

    return results.map(this.mapNytToNewsStory);
  }

  private bestImage(media?: NytMultimedia[]): string {
    if (!media || media.length === 0) return '';
    // Prefer threeByTwoSmallAt2X, else the largest (Super Jumbo), else first
    const preferredOrder = ['threeByTwoSmallAt2X', 'Super Jumbo'];
    for (const key of preferredOrder) {
      const m = media.find((x) => x.format === key);
      if (m) return m.url ?? '';
    }
    return media[0].url ?? '';
  }

  private mapNytToNewsStory = (story: NytTopStory): NewsStory => {
    return {
      id: story.uri,
      title: story.title,
      abstract: story.abstract,
      url: story.url,
      publishedDate: story.published_date,
      section: story.section,
      subsection: story.subsection || undefined,
      byline: story.byline,
      cover: this.bestImage(story.multimedia),
      source: 'nytimes',
    };
  };
}
