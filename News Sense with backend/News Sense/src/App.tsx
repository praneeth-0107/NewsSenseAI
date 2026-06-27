import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CategoriesPage from './pages/CategoriesPage';
import FiltersPage from './pages/FiltersPage';
import HistoryPage from './pages/HistoryPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user, theme } = useAppContext();
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const pageClasses = useMemo(
    () =>
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100 min-h-screen'
        : 'bg-slate-50 text-slate-900 min-h-screen',
    [theme]
  );

  if (!user && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  if (user && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`${pageClasses} transition-colors duration-300`}>
      {user && <Navbar />}
      <main className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
