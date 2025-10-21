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

export interface NytMultimedia {
  url: string;
  format: string;
  height: number;
  width: number;
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
}

export interface NytTopStory {
  section: string; // e.g. "world"
  subsection: string; // e.g. "canada"
  title: string;
  abstract: string;
  url: string;
  uri: string; // internal NYT URI
  byline: string; // e.g. "By Vjosa Isai"
  item_type: string; // e.g. "Article"
  updated_date: string; // ISO string
  created_date: string; // ISO string
  published_date: string; // ISO string
  material_type_facet: string;
  kicker: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: NytMultimedia[];
  short_url: string;
}
