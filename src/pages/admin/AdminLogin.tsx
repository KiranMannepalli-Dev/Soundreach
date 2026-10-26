import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const CURRENT_YEAR = new Date().getFullYear();

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your admin password');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await login(pin, email || undefined);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Authentication failed');
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-inter transition-colors duration-200">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icon.png" alt="YedZ Media" className="h-7 w-7 object-contain" />
          <span className="font-bold text-base text-slate-900 dark:text-white">
            YedZ <span className="text-red-600">Admin</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1">
            <div className="h-10 w-10 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
            <p className="text-xs text-slate-500">Sign in to access the YedZ operations center</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="admin-pin" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <input
                id="admin-pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter password"
                autoComplete="off"
                spellCheck="false"
                required
                autoFocus
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 text-xs rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        &copy; {CURRENT_YEAR} YedZ Media Operations Center
      </footer>

    </div>
  );
}
