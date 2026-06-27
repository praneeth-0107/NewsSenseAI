import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Search', to: '/search', icon: '🔍' },
  { label: 'Categories', to: '/categories', icon: '📂' },
  { label: 'Filters', to: '/filters', icon: '⚡' },
  { label: 'History', to: '/history', icon: '📜' },
  { label: 'Bookmarks', to: '/bookmarks', icon: '⭐' },
  { label: 'Settings', to: '/settings', icon: '⚙️' },
];

export default function Navbar() {
  const { logout, theme, toggleTheme, user } = useAppContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${theme === 'dark' ? 'border-slate-800/50 bg-slate-950/90 shadow-glow' : 'border-slate-200/50 bg-white/90 shadow-soft'}`}>
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/')} className="group flex flex-col">
            <span className="text-xl font-bold tracking-tight text-black dark:text-white transition-all duration-300">
              NewsSense AI
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black dark:text-white transition-colors">
              Smart News Intelligence
            </span>
          </button>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative rounded-full p-2.5 transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-black dark:text-white">{user?.username}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="hidden rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40 hover:scale-105 md:block"
          >
            Logout
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full p-2.5 text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 transition-all duration-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 animate-slide-down">
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg'
                      : 'text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
