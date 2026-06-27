import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim().length === 0 || password.trim().length === 0) {
      setError('Both username and password are required.');
      return;
    }
    const success = await login(username.trim(), password.trim());
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please register or check your password.');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center px-4 py-16">
      <div className="w-full rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Login to NewsSense AI</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Use a simulated frontend login and begin personalizing your news experience.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-brand-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-700">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          New to NewsSense?{' '}
          <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
