import { Injectable } from '@nestjs/common';
import { TopStoriesQueryDto } from './dto/top-stories.dto';
import { SearchQueryDto } from './dto/search.dto';
import { NytimesService } from './services/nytimes.service';
import { GuardianService } from './services/guardian.service';
import { NewsStory } from './services/types';

@Injectable()
export class AppService {
  constructor(
    private readonly nytimes: NytimesService,
    private readonly guardian: GuardianService,
  ) { }

  async topStories(q: TopStoriesQueryDto): Promise<NewsStory[]> {
    let results: NewsStory[] = [];

    if (!q.source || q.source === 'nytimes') {
      const nytResults = await this.nytimes.topStories(
        q.section,
        q.subsection,
        q.q,
        q.from,
        q.to,
      );
      results = [...results, ...nytResults];
    }

    if (!q.source || q.source === 'guardian') {
      const guardianResults = await this.guardian.topStories(
        q.section,
        q.subsection,
        q.q,
        q.from,
        q.to,
      );
      results = [...results, ...guardianResults];
    }

    return results.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    );
  }

  async search(q: SearchQueryDto): Promise<NewsStory[]> {
    let results: NewsStory[] = [];

    if (!q.source || q.source === 'nytimes') {
      const nytResults = await this.nytimes.search(q.q, q.from, q.to);
      results = [...results, ...nytResults];
    }

    if (!q.source || q.source === 'guardian') {
      const guardianResults = await this.guardian.search(q.q, q.from, q.to);
      results = [...results, ...guardianResults];
    }

    return results.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    );
  }
}
