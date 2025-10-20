export type Multimedia = {
    url: string
    format: string
    height: number
    width: number
    type: string
    subtype: string
    caption: string
    copyright: string
}

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


export function bestImage(media?: Multimedia[]): Multimedia | undefined {
    if (!media || media.length === 0) return undefined
    // Prefer threeByTwoSmallAt2X, else the largest (Super Jumbo), else first
    const preferredOrder = ['threeByTwoSmallAt2X', 'Super Jumbo']
    for (const key of preferredOrder) {
        const m = media.find((x) => x.format === key)
        if (m) return m
    }
    return media[0]
}