import type { Article, NewsCategory } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const BASE_URL = 'https://newsapi.org/v2';

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  return `${BASE_URL}${path}?${query.toString()}`;
}

async function fetchNews(url: string): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    throw new Error('Missing NewsAPI key. Set VITE_NEWSAPI_KEY in .env');
  }
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': NEWS_API_KEY,
    },
  });

  const data = await response.json();
  if (!response.ok || data.status !== 'ok') {
    throw new Error(data.message || 'Failed to load news');
  }
  return data.articles as Article[];
}

export async function fetchTopHeadlines(page = 1): Promise<Article[]> {
  const url = buildUrl('/top-headlines', {
    country: 'us',
    pageSize: 12,
    page,
  });
  return fetchNews(url);
}

export async function searchNews(query: string, page = 1): Promise<Article[]> {
  const url = buildUrl('/everything', {
    q: query,
    sortBy: 'publishedAt',
    language: 'en',
    pageSize: 12,
    page,
  });
  return fetchNews(url);
}

export async function fetchCategoryNews(category: NewsCategory, page = 1): Promise<Article[]> {
  const url = buildUrl('/top-headlines', {
    category: category.toLowerCase(),
    country: 'us',
    pageSize: 10,
    page,
  });
  return fetchNews(url);
}

export async function fetchFilteredNews(params: {
  keywords: string;
  source: string;
  page?: number;
}): Promise<Article[]> {
  const url = buildUrl('/everything', {
    q: params.keywords,
    sources: params.source || undefined,
    sortBy: 'relevancy',
    language: 'en',
    pageSize: 12,
    page: params.page || 1,
  });
  return fetchNews(url);
}
