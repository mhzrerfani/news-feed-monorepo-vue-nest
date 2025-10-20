export interface NewsProvider {
  topStories(
    section: string,
    subsection?: string,
    query?: string,
    from?: string,
    to?: string,
  ): Promise<NewsStory[]>;
  search(query: string, from?: string, to?: string): Promise<NewsStory[]>;
}

export interface NewsStory {
  id: string;
  title: string;
  abstract: string;
  url: string;
  cover: string | null;
  publishedDate: string;
  section: string;
  subsection?: string;
  byline?: string;
  source: 'nytimes' | 'guardian';
}
