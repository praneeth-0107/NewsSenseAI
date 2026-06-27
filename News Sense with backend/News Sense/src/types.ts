export type NewsCategory = 'Business' | 'Technology' | 'Health' | 'Sports' | 'Entertainment';

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface UserProfile {
  username: string;
  password: string;
  preferredCategories: NewsCategory[];
}

export interface FilterPreferences {
  keywords: string;
  source: string;
}

export interface AppState {
  user: UserProfile | null;
  theme: 'light' | 'dark';
  selectedCategories: NewsCategory[];
  filterPreferences: FilterPreferences;
  history: Article[];
  bookmarks: Article[];
  searchQuery: string;
  recentSearches: string[];
}

export interface AppContextValue extends AppState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  updateProfile: (username: string) => Promise<void>;
  updatePreferences: (categories: NewsCategory[]) => void;
  addHistoryArticle: (article: Article) => void;
  toggleBookmark: (article: Article) => void;
  saveFilters: (filters: FilterPreferences) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearHistory: () => void;
  clearBookmarks: () => void;
}
