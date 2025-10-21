import { Injectable } from '@nestjs/common';
import { TopStoriesQueryDto } from './dto/top-stories.dto';
import { SECTIONS } from './constants';
import { NytimesService } from './services/nytimes.service';
import { GuardianService } from './services/guardian.service';
import { NewsStory } from './types';

type CacheEntry = { data: NewsStory[]; expiresAt: number };

@Injectable()
export class AppService {
  constructor(
    private readonly nytimes: NytimesService,
    private readonly guardian: GuardianService,
  ) {}

  private cache = new Map<string, CacheEntry>();
  private CACHE_TTL_MS = 60_000;

  private buildCacheKey(prefix: string, parts: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, step, ...rest } = parts;
    return `${prefix}:${JSON.stringify(rest)}`;
  }

  private paginate<T>(items: T[], page = 1, step = 10): T[] {
    const safePage = Math.max(1, Number(page) || 1);
    const safeStep = Math.min(100, Math.max(1, Number(step) || 10));
    const start = (safePage - 1) * safeStep;
    const end = start + safeStep;
    return items.slice(start, end);
  }

  private getFromCache(key: string): NewsStory[] | null {
    const hit = this.cache.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return hit.data;
  }

  private setCache(key: string, data: NewsStory[]) {
    this.cache.set(key, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  async topStories(q: TopStoriesQueryDto): Promise<NewsStory[]> {
    const section =
      q.section ?? SECTIONS[Math.floor(Math.random() * SECTIONS.length)];

    const cacheKey = this.buildCacheKey('topStories', {
      section,
      subsection: q.subsection,
      q: q.q,
      from: q.from,
      to: q.to,
      source: q.source,
    });

    let combined = this.getFromCache(cacheKey);
    if (!combined) {
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
        if (r.status === 'fulfilled') results.push(...r.value);
        else console.warn(`Provider ${idx} failed:`, r.reason);
      });

      combined = results.sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      );

      this.setCache(cacheKey, combined);
    }

    return this.paginate(combined, q.page, q.step);
  }
}
