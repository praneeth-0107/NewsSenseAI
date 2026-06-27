import { useEffect, useState, type FormEvent } from 'react';
import { fetchFilteredNews } from '../lib/newsApi';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Article } from '../types';

export default function FiltersPage() {
  const { filterPreferences, saveFilters, addHistoryArticle } = useAppContext();
  const [filters, setFilters] = useState(filterPreferences);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFilteredNews({ ...filters, page: 1 });
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load filtered news');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveFilters(filters);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFilteredNews({ ...filters, page: 1 });
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load filtered news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Filters</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Customize your search by keywords and source.</p>
        </div>
        <form onSubmit={handleApply} className="grid gap-6 lg:grid-cols-[minmax(320px,_380px)_1fr]">
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Keywords</label>
              <input
                value={filters.keywords}
                onChange={e => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="Supply chain, startup valuation..."
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Source</label>
              <input
                value={filters.source}
                onChange={e => setFilters(prev => ({ ...prev, source: e.target.value }))}
                placeholder="cnn, bloomberg, forbes"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
              />
            </div>
            <button type="submit" className="w-full rounded-3xl bg-brand-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-700">
              Apply filters
            </button>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filter preview</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Save your preferences and let NewsSense show filtered news based on your selected keywords and source.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><span className="font-semibold text-slate-900 dark:text-white">Keywords:</span> {filters.keywords || 'Any'}</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Source:</span> {filters.source || 'Any'}</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Search results</h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Explore articles matching your current filter settings.</p>
            </div>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {articles.map(article => (
              <ArticleCard key={article.url} article={article} onSelect={addHistoryArticle} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            No news matched your filters. Try broader keywords or leave the source field empty.
          </div>
        )}
      </section>
    </div>
  );
}
