import { Injectable } from '@nestjs/common';
import { TopStoriesQueryDto } from './dto/top-stories.dto';
import { SECTIONS } from './constants';
import { SearchQueryDto } from './dto/search.dto';
import { NytimesService } from './services/nytimes.service';
import { GuardianService } from './services/guardian.service';
import { NewsStory } from './types';

@Injectable()
export class AppService {
  constructor(
    private readonly nytimes: NytimesService,
    private readonly guardian: GuardianService,
  ) { }

  async topStories(q: TopStoriesQueryDto): Promise<NewsStory[]> {
    const section =
      q.section ?? SECTIONS[Math.floor(Math.random() * SECTIONS.length)];

    const tasks: Array<Promise<NewsStory[]>> = [];
    if (!q.source || q.source === 'nytimes') {
      tasks.push(
        this.nytimes.topStories(section, q.subsection, q.q, q.from, q.to),
      );
    }
    if (!q.source || q.source === 'guardian') {
      tasks.push(
        this.guardian.topStories(section, q.subsection, q.q, q.from, q.to),
      );
    }

    const settled = await Promise.allSettled(tasks);
    const results: NewsStory[] = [];

    settled.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        results.push(...r.value);
      } else {
        console.warn(`Provider ${idx} failed:`, r.reason);
      }
    });

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
