import React, { useState } from 'react';
import { Movie } from '../types/boxOffice';
import { calculateFinancialSummary, formatCurrencyCr, getVerdictTheme } from '../utils/calculations';
import { Award, Flame, TrendingUp, Star, Filter } from 'lucide-react';

interface AllTimeRecordsProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const AllTimeRecords: React.FC<AllTimeRecordsProps> = ({ movies, onSelectMovie }) => {
  const [rankingCategory, setRankingCategory] = useState<'ww' | 'day1' | 'nett' | 'roi'>('ww');

  const movieSummaries = movies.map((m) => ({
    movie: m,
    summary: calculateFinancialSummary(m),
  }));

  // Sort based on category
  const sorted = [...movieSummaries].sort((a, b) => {
    if (rankingCategory === 'ww') {
      return b.summary.totalWorldwideGrossCr - a.summary.totalWorldwideGrossCr;
    } else if (rankingCategory === 'day1') {
      return b.summary.openingDayWorldwideGrossCr - a.summary.openingDayWorldwideGrossCr;
    } else if (rankingCategory === 'nett') {
      return b.summary.totalIndiaNettCr - a.summary.totalIndiaNettCr;
    } else {
      return b.summary.distributorRecoveryPercent - a.summary.distributorRecoveryPercent;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header & Category Filter Buttons */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Award className="w-4 h-4" />
              <span>Record Books & Hall of Fame</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              All-Time Box Office Leaderboard
            </h2>
            <p className="text-xs text-slate-400">
              Rankings across global gross, highest day 1 openings, domestic nett, and distributor returns
            </p>
          </div>

          {/* Interactive filter controls as styled segmented buttons (compliant with constitution) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setRankingCategory('ww')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                rankingCategory === 'ww'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Highest WW Gross
            </button>
            <button
              type="button"
              onClick={() => setRankingCategory('day1')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                rankingCategory === 'day1'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Day 1 Openers
            </button>
            <button
              type="button"
              onClick={() => setRankingCategory('nett')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                rankingCategory === 'nett'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              India Nett Record
            </button>
            <button
              type="button"
              onClick={() => setRankingCategory('roi')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                rankingCategory === 'roi'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Highest ROI %
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">Movie & Release</th>
              <th className="py-3.5 px-4 text-right">
                {rankingCategory === 'ww' && 'Worldwide Gross'}
                {rankingCategory === 'day1' && 'Day 1 WW Gross'}
                {rankingCategory === 'nett' && 'India Nett Total'}
                {rankingCategory === 'roi' && 'Distributor Recovery %'}
              </th>
              <th className="py-3.5 px-4 text-right">Theatrical Rights</th>
              <th className="py-3.5 px-4 text-right">Distributor P/L</th>
              <th className="py-3.5 px-4 text-center">Verdict</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {sorted.map(({ movie, summary }, idx) => {
              const verdictTheme = getVerdictTheme(summary.verdict);
              const rank = idx + 1;

              return (
                <tr
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                    {rank === 1 ? (
                      <span className="text-amber-400">#1 👑</span>
                    ) : rank === 2 ? (
                      <span className="text-slate-200">#2 🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-amber-600">#3 🥉</span>
                    ) : (
                      <span className="text-slate-500">#{rank}</span>
                    )}
                  </td>

                  {/* Movie Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 rounded object-cover shadow border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                          {movie.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {movie.originalLanguage} · {movie.releaseDate.substring(0, 4)} · Dir. {movie.director}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Primary metric according to active category */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                    {rankingCategory === 'ww' && (
                      <span className="text-cyan-400">
                        {formatCurrencyCr(summary.totalWorldwideGrossCr)}
                      </span>
                    )}
                    {rankingCategory === 'day1' && (
                      <span className="text-amber-400">
                        {formatCurrencyCr(summary.openingDayWorldwideGrossCr)}
                      </span>
                    )}
                    {rankingCategory === 'nett' && (
                      <span className="text-amber-400">
                        {formatCurrencyCr(summary.totalIndiaNettCr)}
                      </span>
                    )}
                    {rankingCategory === 'roi' && (
                      <span className="text-emerald-400">
                        {summary.distributorRecoveryPercent}%
                      </span>
                    )}
                  </td>

                  {/* Theatrical Rights */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {formatCurrencyCr(summary.theatricalRightsCr)}
                  </td>

                  {/* Distributor P/L */}
                  <td
                    className={`py-3.5 px-4 text-right font-mono font-semibold ${
                      summary.distributorProfitLossCr >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrencyCr(summary.distributorProfitLossCr)}
                  </td>

                  {/* Verdict Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                    >
                      {summary.verdict}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMovie(movie);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                    >
                      View Ledger →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
