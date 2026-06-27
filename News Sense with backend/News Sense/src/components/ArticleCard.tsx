import { useState } from 'react';
import type { Article } from '../types';
import { useAppContext } from '../context/AppContext';
import { summarizeArticle } from '../lib/summarizer';

interface Props {
  article: Article;
  onSelect: (article: Article) => void;
}

export default function ArticleCard({ article, onSelect }: Props) {
  const { bookmarks, toggleBookmark, theme } = useAppContext();
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const isBookmarked = bookmarks.some(item => item.url === article.url);
  const hasGroq = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  const handleSummarize = async () => {
    if (!hasGroq) {
      setSummaryError('Summarization requires VITE_GROQ_API_KEY in your .env file.');
      return;
    }
    setSummaryError('');
    setSummarizing(true);
    try {
      const result = await summarizeArticle(article);
      setSummary(result);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Summarization failed.');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <article className={`group overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl animate-scale-in ${theme === 'dark' ? 'border-slate-800 bg-slate-900/80 hover:border-brand-500/30' : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-brand-500/10'}`}>
      <button type="button" onClick={() => onSelect(article)} className="text-left w-full">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
          {article.urlToImage ? (
            <>
              <img 
                src={article.urlToImage} 
                alt={article.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📰</div>
                <div className="text-sm">No preview image</div>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 shadow-lg dark:bg-slate-900/90 dark:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
              {article.source.name}
            </span>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
            {article.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {article.description || article.content || 'Read more about this story.'}
          </p>
        </div>
      </button>
      <div className="border-t border-slate-200/50 px-6 py-4 dark:border-slate-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={summarizing}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
              summarizing
                ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25'
                : theme === 'dark'
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {summarizing ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Summarizing...
              </>
            ) : (
              <>
                <span>✨</span>
                Summarize
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleBookmark(article)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
              isBookmarked
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/25'
                : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40'
            }`}
          >
            {isBookmarked ? (
              <>
                <span>★</span>
                Saved
              </>
            ) : (
              <>
                <span>☆</span>
                Bookmark
              </>
            )}
          </button>
        </div>
        {summary ? (
          <div className={`mt-4 rounded-2xl border p-4 animate-slide-up ${theme === 'dark' ? 'border-brand-500/30 bg-brand-950/30' : 'border-brand-200 bg-brand-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <p className="font-semibold text-slate-900 dark:text-white">AI Summary</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">{summary}</p>
          </div>
        ) : summaryError ? (
          <div className="mt-4 rounded-2xl border border-red-200/50 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30 animate-slide-up">
            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              {summaryError}
            </p>
          </div>
        ) : null}
      </div>
      <div className={`border-t px-6 py-3 text-sm transition-colors duration-300 ${theme === 'dark' ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-200/50 hover:bg-slate-50'}`}>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          Read full article
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
