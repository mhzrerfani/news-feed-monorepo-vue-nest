
export const SECTIONS = [
    { value: 'automobiles', label: 'Automobiles', icon: '🚗' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'world', label: 'World', icon: '🌍' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'sports', label: 'Sports', icon: '🏅' },
];

export const SOURCES = [
    { value: 'all', label: 'All sources', icon: '🔀' },
    { value: 'nytimes', label: 'NYTimes', icon: '📰' },
    { value: 'guardian', label: 'The Guardian', icon: '🟩' },
] as const;

export const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : import.meta.env.DEV ? "http://localhost:3010" : "https://news-feed-monorepo-vue-nest-api.vercel.app";