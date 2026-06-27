import { useEffect, useMemo, useState } from 'react';
import { fetchCategoryNews } from '../lib/newsApi';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import CategoryTiles from '../components/CategoryTiles';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { NewsCategory } from '../types';

const categoryOptions: NewsCategory[] = ['Business', 'Technology', 'Health', 'Sports', 'Entertainment'];

export default function CategoriesPage() {
  const { selectedCategories, updatePreferences, addHistoryArticle } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(selectedCategories[0] ?? 'Business');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCategoryNews(activeCategory);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load category news');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory]);

  const selected = useMemo(() => selectedCategories, [selectedCategories]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Categories</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse sector-specific news and choose favorites for future recommendations.</p>
          </div>
          <button
            type="button"
            onClick={() => updatePreferences(selected)}
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Save favorites
          </button>
        </div>
        <CategoryTiles categories={categoryOptions} activeCategories={selected} onToggle={category => {
          const exists = selected.includes(category);
          const updated = exists ? selected.filter(c => c !== category) : [...selected, category];
          updatePreferences(updated.length ? updated : [category]);
        }} />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{activeCategory} News</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Latest headlines for the category you selected.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>
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
