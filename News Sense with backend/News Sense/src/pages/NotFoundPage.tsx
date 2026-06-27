import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center px-4 py-16">
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft dark:border-slate-700 dark:bg-slate-950">
        <h1 className="text-5xl font-semibold text-slate-900 dark:text-white">404</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Page not found — explore the latest insights from the dashboard.</p>
        <Link className="mt-8 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
