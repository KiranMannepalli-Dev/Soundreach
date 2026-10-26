import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Page Not Found | YedZ Media';
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Big 404 */}
        <h1 className="font-podium text-8xl sm:text-9xl leading-none text-red-600 tracking-tight mb-2 select-none">
          404
        </h1>

        {/* Error message */}
        <h2 className="font-podium text-2xl sm:text-3xl uppercase tracking-tight mb-3">
          Page Not Found
        </h2>

        <p className="font-inter text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Go Back buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            <Home className="w-4 h-4" />
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
