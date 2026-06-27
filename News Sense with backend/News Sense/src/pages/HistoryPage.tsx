import ArticleCard from '../components/ArticleCard';
import { useAppContext } from '../context/AppContext';

export default function HistoryPage() {
  const { history, clearHistory, addHistoryArticle } = useAppContext();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Viewing history</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">All articles you have opened, saved locally for reference and recommendation logic.</p>
          </div>
          <button
            type="button"
            onClick={clearHistory}
            className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Clear history
          </button>
        </div>
      </section>

      {history.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {history.map(article => (
            <ArticleCard key={article.url} article={article} onSelect={() => window.open(article.url, '_blank')} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-soft dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          <p className="text-lg font-medium">No viewed articles yet.</p>
          <p className="mt-3 text-sm">Click headlines and search through the Home tab to build up reading history.</p>
        </div>
      )}
    </div>
  );
}
