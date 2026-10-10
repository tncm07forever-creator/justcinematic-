import React, { useState } from 'react';
import { Movie } from '../types/boxOffice';
import {
  calculateFinancialSummary,
  formatCurrencyCr,
  formatPercentage,
  getVerdictTheme,
} from '../utils/calculations';
import { ComparisonChart } from './Charts/ComparisonChart';
import { GitCompare, Trophy, TrendingUp, Star, Plus, X } from 'lucide-react';

interface ComparisonToolProps {
  allMovies: Movie[];
  selectedMovieIds: string[];
  onSelectMovieIds: (ids: string[]) => void;
  onOpenMovieDetail: (movie: Movie) => void;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({
  allMovies,
  selectedMovieIds,
  onSelectMovieIds,
  onOpenMovieDetail,
}) => {
  // If fewer than 2 movies selected, default to top 2
  const activeIds = selectedMovieIds.length >= 2
    ? selectedMovieIds
    : allMovies.slice(0, 2).map((m) => m.id);

  const selectedMovies = allMovies.filter((m) => activeIds.includes(m.id));

  const addMovie = (id: string) => {
    if (!activeIds.includes(id) && activeIds.length < 4) {
      onSelectMovieIds([...activeIds, id]);
    }
  };

  const removeMovie = (id: string) => {
    if (activeIds.length > 2) {
      onSelectMovieIds(activeIds.filter((mId) => mId !== id));
    }
  };

  const summaries = selectedMovies.map((m) => ({
    movie: m,
    summary: calculateFinancialSummary(m),
  }));

  // Identify winners
  const highestWW = Math.max(...summaries.map((s) => s.summary.totalWorldwideGrossCr));
  const highestOpener = Math.max(...summaries.map((s) => s.summary.openingDayWorldwideGrossCr));
  const highestNett = Math.max(...summaries.map((s) => s.summary.totalIndiaNettCr));
  const highestROI = Math.max(...summaries.map((s) => s.summary.distributorRecoveryPercent));

  return (
    <div className="space-y-6">
      {/* Title & Selector Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <GitCompare className="w-4 h-4" />
              <span>Head-to-Head Comparison</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Historical Box Office Clash of Titans
            </h2>
            <p className="text-xs text-slate-400">
              Benchmark opening pace, collection trajectory, distributor recovery, and ROI side by side
            </p>
          </div>

          {/* Add another movie dropdown */}
          {activeIds.length < 4 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addMovie(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  + Add film to comparison (Max 4)
                </option>
                {allMovies
                  .filter((m) => !activeIds.includes(m.id))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.releaseDate.substring(0, 4)})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Film Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">Comparing:</span>
          {selectedMovies.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs text-slate-200"
            >
              <span className="font-semibold">{m.title}</span>
              {activeIds.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeMovie(m.id)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trajectory Curve Chart */}
      <ComparisonChart movies={selectedMovies} />

      {/* Side-by-Side Detailed Benchmark Matrix */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800">
              <th className="p-4 w-52 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                Benchmark Metric
              </th>
              {summaries.map(({ movie, summary }) => {
                const verdictTheme = getVerdictTheme(summary.verdict);
                return (
                  <th key={movie.id} className="p-4 min-w-[200px] align-top">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-12 h-16 rounded object-cover shadow border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-sm text-white">{movie.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {movie.originalLanguage} · {movie.releaseDate.substring(0, 4)}
                          </div>
                          <span
                            className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[10px] font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                          >
                            {summary.verdict}
                          </span>
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {/* Opening Day WW */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Opening Day WW Gross</td>
              {summaries.map(({ movie, summary }) => {
                const isWinner = summary.openingDayWorldwideGrossCr === highestOpener && summaries.length > 1;
                return (
                  <td key={movie.id} className="p-3.5 font-mono text-sm">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={isWinner ? 'text-amber-400' : 'text-slate-100'}>
                        {formatCurrencyCr(summary.openingDayWorldwideGrossCr)}
                      </span>
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Weekend 1 Nett */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Opening Weekend India Nett</td>
              {summaries.map(({ movie, summary }) => (
                <td key={movie.id} className="p-3.5 font-mono text-slate-200">
                  {formatCurrencyCr(summary.firstWeekendNettCr)}
                </td>
              ))}
            </tr>

            {/* Week 1 Nett */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Week 1 India Nett</td>
              {summaries.map(({ movie, summary }) => (
                <td key={movie.id} className="p-3.5 font-mono text-slate-200">
                  {formatCurrencyCr(summary.firstWeekNettCr)}
                </td>
              ))}
            </tr>

            {/* India Nett Lifetime */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">India Nett Total</td>
              {summaries.map(({ movie, summary }) => {
                const isWinner = summary.totalIndiaNettCr === highestNett && summaries.length > 1;
                return (
                  <td key={movie.id} className="p-3.5 font-mono text-sm">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={isWinner ? 'text-amber-400' : 'text-slate-100'}>
                        {formatCurrencyCr(summary.totalIndiaNettCr)}
                      </span>
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Worldwide Gross Total */}
            <tr className="hover:bg-slate-800/20 bg-slate-950/40 font-bold">
              <td className="p-3.5 text-slate-300">Lifetime Worldwide Gross</td>
              {summaries.map(({ movie, summary }) => {
                const isWinner = summary.totalWorldwideGrossCr === highestWW && summaries.length > 1;
                return (
                  <td key={movie.id} className="p-3.5 font-mono text-base">
                    <div className="flex items-center gap-1.5">
                      <span className={isWinner ? 'text-cyan-400' : 'text-slate-100'}>
                        {formatCurrencyCr(summary.totalWorldwideGrossCr)}
                      </span>
                      {isWinner && <Trophy className="w-4 h-4 text-cyan-400 inline" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Budget */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Total Budget (Cr)</td>
              {summaries.map(({ movie }) => (
                <td key={movie.id} className="p-3.5 font-mono text-slate-300">
                  {formatCurrencyCr(movie.totalBudgetCr)}
                </td>
              ))}
            </tr>

            {/* Theatrical Rights Cost */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Theatrical Rights Value</td>
              {summaries.map(({ movie, summary }) => (
                <td key={movie.id} className="p-3.5 font-mono text-slate-300">
                  {formatCurrencyCr(summary.theatricalRightsCr)}
                </td>
              ))}
            </tr>

            {/* Worldwide Share Recovered */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Distributor Share Realized</td>
              {summaries.map(({ movie, summary }) => (
                <td key={movie.id} className="p-3.5 font-mono text-emerald-400 font-semibold">
                  {formatCurrencyCr(summary.totalDistributorShareCr)}
                </td>
              ))}
            </tr>

            {/* Distributor Recovery Ratio */}
            <tr className="hover:bg-slate-800/20 font-bold">
              <td className="p-3.5 text-slate-300">Distributor Recovery %</td>
              {summaries.map(({ movie, summary }) => {
                const isWinner = summary.distributorRecoveryPercent === highestROI && summaries.length > 1;
                return (
                  <td key={movie.id} className="p-3.5 font-mono text-sm">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          summary.distributorRecoveryPercent >= 100
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }
                      >
                        {summary.distributorRecoveryPercent}%
                      </span>
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-emerald-400 inline" />}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Distributor Profit / Loss */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Distributor Profit / Loss</td>
              {summaries.map(({ movie, summary }) => (
                <td
                  key={movie.id}
                  className={`p-3.5 font-mono font-bold ${
                    summary.distributorProfitLossCr >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrencyCr(summary.distributorProfitLossCr)}
                </td>
              ))}
            </tr>

            {/* Star Remunerations */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">Lead Star Remuneration</td>
              {summaries.map(({ movie }) => {
                const topActor = movie.leadCast?.[0];
                return (
                  <td key={movie.id} className="p-3.5 text-slate-300">
                    {topActor ? (
                      <div>
                        <span>{topActor.name}</span>
                        <span className="font-mono text-amber-400 font-semibold block">
                          {formatCurrencyCr(topActor.remunerationCr)}
                        </span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Ratings */}
            <tr className="hover:bg-slate-800/20">
              <td className="p-3.5 font-medium text-slate-400">IMDb & Audience Rating</td>
              {summaries.map(({ movie }) => (
                <td key={movie.id} className="p-3.5">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.ratings?.imdbScore?.toFixed(1) || '—'}/10</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    BMS: {movie.ratings?.bmsInterestPercentage}%
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
