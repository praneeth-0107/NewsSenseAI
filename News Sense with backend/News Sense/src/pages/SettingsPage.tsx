import { useState, type FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import type { NewsCategory } from '../types';

const categories: NewsCategory[] = ['Business', 'Technology', 'Health', 'Sports', 'Entertainment'];

export default function SettingsPage() {
  const { user, theme, toggleTheme, updateProfile, updatePreferences, clearHistory, clearBookmarks } = useAppContext();
  const [username, setUsername] = useState(user?.username ?? '');
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(user?.preferredCategories ?? ['Business', 'Technology']);
  const [message, setMessage] = useState('');

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) return;
    await updateProfile(username.trim());
    await updatePreferences(selectedCategories.length ? selectedCategories : ['Business']);
    setMessage('Settings updated. Refresh the page if needed.');
  };

  const toggleCategory = (category: NewsCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(item => item !== category) : [...prev, category]
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your profile, personalize categories, and control app preferences.</p>
        </div>

        <form onSubmit={saveSettings} className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode for a modern reading experience.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {theme === 'dark' ? 'Light' : 'Dark'} mode
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Favorite categories</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Select the topics that should guide your personalized recommendations.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                    selectedCategories.includes(category)
                      ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:border-brand-300 dark:bg-brand-300/10 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Data controls</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clear saved history and bookmarks from your browser.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={clearHistory}
                  className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Clear history
                </button>
                <button
                  type="button"
                  onClick={clearBookmarks}
                  className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Clear bookmarks
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="rounded-3xl bg-brand-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-700">
              Save settings
            </button>
            {message && <span className="text-sm text-brand-600">{message}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}
