import React from 'react';
import { Movie } from '../types/boxOffice';
import { calculateFinancialSummary, formatCurrencyCr, getVerdictTheme } from '../utils/calculations';
import { BarChart3, GitCompare, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onCompareToggle?: (movie: Movie) => void;
  isCompared?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onCompareToggle,
  isCompared,
}) => {
  const summary = calculateFinancialSummary(movie);
  const verdictTheme = getVerdictTheme(summary.verdict);
  const isProfit = summary.distributorProfitLossCr >= 0;

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Poster / Backdrop Header with subtle gradient scrim */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            onError={(e) => {
              // Resilient fallback
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/src/assets/images/hero_cinema_boxoffice_1791613970503.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Quick Floating Mini Poster & Star Rating */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-12 h-16 rounded object-cover shadow-lg border border-slate-700/80 shrink-0"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/src/assets/images/poster_mass_action_1791613999028.jpg';
                }}
              />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug truncate group-hover:text-amber-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span>{movie.originalLanguage}</span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.releaseDate.substring(0, 4)}</span>
                </div>
              </div>
            </div>

            {/* IMDb / Critic Rating */}
            <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded px-2 py-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-100">
                {movie.ratings?.imdbScore?.toFixed(1) || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="p-4 space-y-3">
          {/* Unboxed metadata for genre and director */}
          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <span>Dir. {movie.director}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.genres.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{movie.runtimeMinutes} min</span>
          </div>

          {/* Core Numbers 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Worldwide Gross</span>
              <span className="font-mono font-bold text-sm text-slate-100">
                {formatCurrencyCr(summary.totalWorldwideGrossCr)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">India Nett</span>
              <span className="font-mono font-bold text-sm text-amber-400">
                {formatCurrencyCr(summary.totalIndiaNettCr)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Theatrical Rights</span>
              <span className="font-mono text-slate-300 font-medium">
                {formatCurrencyCr(summary.theatricalRightsCr)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Distributor P/L</span>
              <div className="flex items-center gap-1">
                {isProfit ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                )}
                <span
                  className={`font-mono font-bold ${
                    isProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrencyCr(summary.distributorProfitLossCr)}
                </span>
              </div>
            </div>
          </div>

          {/* Verdict and Recovery Ratio */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Verdict:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
              >
                {summary.verdict}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px]">Dist. Recovery: </span>
              <span
                className={`font-mono font-bold ${
                  summary.distributorRecoveryPercent >= 100
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {summary.distributorRecoveryPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-4 pb-3 pt-1 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(movie);
          }}
          className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 font-medium py-1 transition-colors cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Full Ledger & Analytics</span>
        </button>

        {onCompareToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompareToggle(movie);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              isCompared
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitCompare className="w-3 h-3" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
