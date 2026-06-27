import type { Article, FilterPreferences, NewsCategory, UserProfile } from '../types';

const USER_KEY = 'news-sense-users';
const CURRENT_USER_KEY = 'news-sense-current-user';
const THEME_KEY = 'news-sense-theme';
const CATEGORY_KEY = 'news-sense-categories';
const FILTERS_KEY = 'news-sense-filters';
const HISTORY_KEY = 'news-sense-history';
const BOOKMARKS_KEY = 'news-sense-bookmarks';
const SEARCH_KEY = 'news-sense-search';
const RECENT_SEARCHES_KEY = 'news-sense-recent-searches';

export function loadUsers(): UserProfile[] {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as UserProfile[]; } catch { return []; }
}

export function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export function loadCurrentUser(): UserProfile | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}

export function saveCurrentUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function loadTheme(): 'light' | 'dark' {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === 'dark' ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadCategories(): NewsCategory[] {
  const raw = localStorage.getItem(CATEGORY_KEY);
  if (!raw) return ['Business', 'Technology'];
  try { return JSON.parse(raw) as NewsCategory[]; } catch { return ['Business', 'Technology']; }
}

export function saveCategories(categories: NewsCategory[]) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

export function loadFilters(): FilterPreferences {
  const raw = localStorage.getItem(FILTERS_KEY);
  if (!raw) return { keywords: '', source: '' };
  try { return JSON.parse(raw) as FilterPreferences; } catch {
    return { keywords: '', source: '' };
  }
}

export function saveFilters(filters: FilterPreferences) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

export function loadHistory(): Article[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Article[]; } catch { return []; }
}

export function saveHistory(history: Article[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadBookmarks(): Article[] {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Article[]; } catch { return []; }
}

export function saveBookmarks(bookmarks: Article[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function loadSearchQuery(): string {
  return localStorage.getItem(SEARCH_KEY) ?? '';
}

export function saveSearchQuery(query: string) {
  localStorage.setItem(SEARCH_KEY, query);
}

export function loadRecentSearches(): string[] {
  const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

export function saveRecentSearches(searches: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}
