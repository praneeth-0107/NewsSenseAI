import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppContextValue, AppState, Article, FilterPreferences, NewsCategory, UserProfile } from '../types';
import {
  loadBookmarks,
  loadCategories,
  loadCurrentUser,
  loadFilters,
  loadHistory,
  loadRecentSearches,
  loadSearchQuery,
  loadTheme,
  loadUsers,
  saveBookmarks,
  saveCategories,
  saveCurrentUser,
  saveFilters,
  saveHistory,
  saveRecentSearches,
  saveSearchQuery,
  saveTheme,
} from '../lib/storage';
import { apiLogin, apiRegister, apiUpdatePreferences, apiUpdateProfile } from '../lib/api';

const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultFilters: FilterPreferences = {
  keywords: '',
  source: '',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => loadCurrentUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(() => loadCategories());
  const [filterPreferences, setFilterPreferences] = useState<FilterPreferences>(() => loadFilters());
  const [history, setHistory] = useState<Article[]>(() => loadHistory());
  const [bookmarks, setBookmarks] = useState<Article[]>(() => loadBookmarks());
  const [searchQuery, setSearchQueryState] = useState<string>(() => loadSearchQuery());
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveCategories(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    saveFilters(filterPreferences);
  }, [filterPreferences]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  const login = async (username: string, password: string) => {
    try {
      const matched = await apiLogin(username, password);
      setUser(matched);
      return true;
    } catch (e) {
      return false;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const newUser = await apiRegister(username, password);
      setUser(newUser);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  const updateProfile = async (username: string) => {
    if (!user || user.username === username) return;
    try {
      await apiUpdateProfile(user.username, username);
      const updatedUser = { ...user, username };
      setUser(updatedUser);
    } catch (e) {
      // Ignored for UX simplicity
    }
  };

  const updatePreferences = async (categories: NewsCategory[]) => {
    if (!user) return;
    try {
      await apiUpdatePreferences(user.username, categories);
      const updatedUser = { ...user, preferredCategories: categories };
      setUser(updatedUser);
      setSelectedCategories(categories);
    } catch (e) {
      // Ignored for UX simplicity
    }
  };

  const addHistoryArticle = (article: Article) => {
    setHistory(current => {
      const exists = current.some(item => item.url === article.url);
      if (exists) return current;
      return [article, ...current].slice(0, 50);
    });
  };

  const toggleBookmark = (article: Article) => {
    setBookmarks(current => {
      const exists = current.some(item => item.url === article.url);
      if (exists) {
        return current.filter(item => item.url !== article.url);
      }
      return [article, ...current].slice(0, 50);
    });
  };

  const saveFilters = (filters: FilterPreferences) => {
    setFilterPreferences(filters);
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(current => {
      const next = [trimmed, ...current.filter(item => item.toLowerCase() !== trimmed.toLowerCase())];
      return next.slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  const value: AppContextValue = useMemo(
    () => ({
      user,
      theme,
      selectedCategories,
      filterPreferences,
      history,
      bookmarks,
      searchQuery,
      recentSearches,
      login,
      register,
      logout,
      toggleTheme,
      updateProfile,
      updatePreferences,
      addHistoryArticle,
      toggleBookmark,
      saveFilters,
      setSearchQuery,
      addRecentSearch,
      clearRecentSearches,
      clearHistory,
      clearBookmarks,
    }),
    [user, theme, selectedCategories, filterPreferences, history, bookmarks, searchQuery, recentSearches]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
