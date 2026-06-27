import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchTopHeadlines, searchNews } from '../lib/newsApi';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import CategoryTiles from '../components/CategoryTiles';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Article, NewsCategory } from '../types';

const categoryOptions: NewsCategory[] = ['Business', 'Technology', 'Health', 'Sports', 'Entertainment'];

function getRecommendedArticles(articles: Article[], selectedCategories: NewsCategory[], history: Article[], query: string) {
  const historyKeywords = history.map(item => item.title).join(' ').toLowerCase();
  return articles
    .filter(article => article.title && article.url)
    .sort((a, b) => {
      const score = (article: Article) => {
        let match = 0;
        const content = `${article.title} ${article.description ?? ''}`.toLowerCase();
        selectedCategories.forEach(category => {
          if (content.includes(category.toLowerCase())) match += 2;
        });
        if (query && content.includes(query.toLowerCase())) match += 3;
        if (historyKeywords && historyKeywords.split(' ').some(word => word.length > 4 && content.includes(word))) match += 1;
        return match;
      };
      return score(b) - score(a);
    })
    .slice(0, 4);
}

export default function HomePage() {
  const { searchQuery, setSearchQuery, selectedCategories, addHistoryArticle, history, user, updatePreferences, theme } = useAppContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const queryText = searchQuery.trim();

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError(null);
      try {
        const data = queryText ? await searchNews(queryText, page) : await fetchTopHeadlines(page);
        setArticles(prev => (page === 1 ? data : [...prev, ...data]));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load news');
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [queryText, page]);

  const recommended = useMemo(
    () => getRecommendedArticles(articles, selectedCategories, history, queryText),
    [articles, selectedCategories, history, queryText]
  );

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <section className={`relative overflow-hidden rounded-[40px] border p-8 sm:p-10 transition-all duration-500 ${theme === 'dark' ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-glow' : 'border-slate-200/50 bg-gradient-to-br from-white via-slate-50 to-white shadow-soft'}`}>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-400/20 blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-gradient-to-tr from-accent-400/20 to-brand-400/20 blur-3xl opacity-50 animate-pulse-slow"></div>
        
        <div className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-100 to-accent-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-700 dark:from-brand-900/50 dark:to-accent-900/50 dark:text-brand-200 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                Welcome back
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                {user?.username}, discover the latest{' '}
                <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                  industry insights
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Explore curated news, search across sources, and get personalized AI-powered recommendations based on your interests.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:w-80">
              <div className={`rounded-3xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200/50 bg-white/50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎯</span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your interests</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(cat => (
                      <span key={cat} className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">No categories selected</span>
                  )}
                </div>
              </div>
              <div className={`rounded-3xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200/50 bg-white/50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔥</span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trending now</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryOptions.slice(0, 4).map(category => (
                    <span key={category} className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSearchSubmit} className="mt-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex gap-3">
                <label className="relative flex-1 block">
                  <span className="sr-only">Search news</span>
                  <input
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search business, AI, healthcare trends..."
                    className={`w-full rounded-2xl border px-6 py-4 text-base text-slate-900 outline-none transition-all duration-300 focus:ring-2 dark:text-slate-100 ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-900/80 backdrop-blur-sm focus:border-brand-500 focus:ring-brand-500/20'
                        : 'border-slate-300 bg-white/80 backdrop-blur-sm focus:border-brand-500 focus:ring-brand-500/20'
                    }`}
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40 hover:scale-105 hover:from-brand-600 hover:to-brand-700"
                >
                  <span className="flex items-center gap-2">
                    <span>🔍</span>
                    Search
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="space-y-6 animate-slide-up">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              Personalized recommendations
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Suggested stories based on your interests, search history, and trending categories.</p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-4">
          {recommended.length > 0 ? (
            recommended.map((article, index) => (
              <div key={article.url} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <ArticleCard article={article} onSelect={addHistoryArticle} />
              </div>
            ))
          ) : (
            <div className={`col-span-full rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No recommendations yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Start searching or exploring to build your personalized feed.</p>
            </div>
          )}
        </div>
      </section>

      <section className={`rounded-[40px] border p-8 sm:p-10 transition-all duration-500 ${theme === 'dark' ? 'border-slate-800/50 bg-slate-950/50 shadow-glow' : 'border-slate-200/50 bg-white/50 shadow-soft'} animate-slide-up`}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">📰</span>
              Latest headlines
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Browse breaking news from trusted sources in real-time.</p>
          </div>
          <button
            type="button"
            onClick={() => setPage(prev => prev + 1)}
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40 hover:scale-105"
          >
            Load more stories
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200/50 bg-red-50 p-8 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300 flex items-center gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <p className="font-semibold">Unable to load news</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {articles.map((article, index) => (
              <div key={article.url} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <ArticleCard article={article} onSelect={addHistoryArticle} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6 animate-slide-up">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              Explore categories
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Choose favorites to tailor the dashboard to your industry interests.</p>
          </div>
        </div>
        <CategoryTiles
          categories={categoryOptions}
          activeCategories={selectedCategories}
          onToggle={category => {
            const nextSelection = selectedCategories.includes(category)
              ? selectedCategories.filter(item => item !== category)
              : [...selectedCategories, category];
            updatePreferences(nextSelection.length ? nextSelection : [category]);
          }}
        />
      </section>
    </div>
  );
}
