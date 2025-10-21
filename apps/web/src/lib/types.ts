export type TopStoriesResponse = NewsStory[]

export interface NewsStory {
    id: string;
    title: string;
    abstract: string;
    url: string;
    publishedDate: string;
    section: string;
    subsection?: string;
    byline?: string;
    source: 'nytimes' | 'guardian';
    cover: string;
}
