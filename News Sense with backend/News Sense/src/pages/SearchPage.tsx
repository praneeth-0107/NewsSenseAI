import { useEffect, useState, type FormEvent } from 'react';
import { searchNews } from '../lib/newsApi';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Article } from '../types';

export default function SearchPage() {
  const { searchQuery, setSearchQuery, addHistoryArticle, recentSearches, addRecentSearch, clearRecentSearches } = useAppContext();
  const [query, setQuery] = useState(searchQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      return;
    }

    async function loadResults() {
      setLoading(true);
      setError('');
      try {
        const data = await searchNews(query.trim(), page);
        setArticles(prev => (page === 1 ? data : [...prev, ...data]));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to fetch search results.');
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query, page]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    setQuery(trimmed);
    setPage(1);
    addRecentSearch(trimmed);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Search News</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Query the latest articles across sources and industries in real time.</p>
        </div>

        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search articles</span>
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search for AI, finance, healthcare, or any business topic..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
            />
          </label>
          <button type="submit" className="rounded-3xl bg-brand-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-700">
            Search
          </button>
        </form>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Search results</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Articles matching your query will appear below.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={clearRecentSearches}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear recent searches
              </button>
            )}
            {query && (
              <button
                type="button"
                onClick={() => setPage(prev => prev + 1)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Load more
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>
        ) : !query.trim() ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Enter a search term to discover news across the industry.
            </div>
            {recentSearches.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent searches</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tap to revisit previous queries.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setQuery(term);
                        setPage(1);
                      }}
                      className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No articles found yet. Try a broader search term or remove filters.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {articles.map(article => (
              <ArticleCard key={article.url} article={article} onSelect={addHistoryArticle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
