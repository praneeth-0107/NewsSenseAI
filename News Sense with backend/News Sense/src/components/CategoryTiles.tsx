import type { NewsCategory } from '../types';

interface Props {
  categories: NewsCategory[];
  activeCategories: NewsCategory[];
  onToggle: (category: NewsCategory) => void;
}

const categoryIcons: Record<NewsCategory, string> = {
  Business: '💼',
  Technology: '💻',
  Health: '🏥',
  Sports: '⚽',
  Entertainment: '🎬',
};

const categoryGradients: Record<NewsCategory, string> = {
  Business: 'from-blue-500 to-cyan-500',
  Technology: 'from-purple-500 to-pink-500',
  Health: 'from-green-500 to-emerald-500',
  Sports: 'from-orange-500 to-red-500',
  Entertainment: 'from-pink-500 to-rose-500',
};

export default function CategoryTiles({ categories, activeCategories, onToggle }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {categories.map((category, index) => {
        const active = activeCategories.includes(category);
        const gradient = categoryGradients[category];
        const icon = categoryIcons[category];
        
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            style={{ animationDelay: `${index * 100}ms` }}
            className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 hover:scale-105 animate-slide-up ${
              active
                ? 'border-transparent bg-gradient-to-br shadow-lg shadow-brand-500/25'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand-500'
            } ${active ? gradient : ''}`}
          >
            {active && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            )}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
                {active && (
                  <div className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {category}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${active ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                Tailored news and insights for your industry focus
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
