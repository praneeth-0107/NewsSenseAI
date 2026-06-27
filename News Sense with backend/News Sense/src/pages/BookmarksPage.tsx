import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../context/AppContext';

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks, addHistoryArticle } = useAppContext();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Bookmarks</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your saved articles are stored locally so you can revisit them anytime.</p>
          </div>
          <button
            type="button"
            onClick={clearBookmarks}
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Clear bookmarks
          </button>
        </div>
      </section>

      {bookmarks.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {bookmarks.map(article => (
            <ArticleCard key={article.url} article={article} onSelect={() => window.open(article.url, '_blank')} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-soft dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          <p className="text-lg font-medium">No bookmarks yet.</p>
          <p className="mt-3 text-sm">Tap the bookmark button on any article to keep it in your collection.</p>
        </div>
      )}
    </div>
  );
}
