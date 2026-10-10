import { Movie } from '../types/boxOffice';
import { calculateFinancialSummary, formatCurrencyCr } from '../utils/calculations';
import { TrendingUp, Sparkles } from 'lucide-react';

interface LiveTickerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ movies, onSelectMovie }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase tracking-wider text-[11px] shrink-0 font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live Ticker</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-slate-300">
          {movies.slice(0, 6).map((movie, idx) => {
            const summary = calculateFinancialSummary(movie);
            const latestDay = movie.dayWiseCollections?.[movie.dayWiseCollections.length - 1];

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="flex items-center gap-2 cursor-pointer hover:text-amber-300 transition-colors shrink-0 group"
              >
                <span className="font-semibold text-slate-100 group-hover:text-amber-400">
                  {movie.title}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">
                  WW: <span className="text-slate-200 font-medium">{formatCurrencyCr(summary.totalWorldwideGrossCr)}</span>
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">
                  Nett: <span className="text-slate-200">{formatCurrencyCr(summary.totalIndiaNettCr)}</span>
                </span>
                {latestDay?.occupancyPercentage && (
                  <>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="font-mono text-cyan-400">
                      Occ: {latestDay.occupancyPercentage}%
                    </span>
                  </>
                )}
                {idx < Math.min(movies.length - 1, 5) && (
                  <span className="text-slate-700 ml-4 font-mono">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
