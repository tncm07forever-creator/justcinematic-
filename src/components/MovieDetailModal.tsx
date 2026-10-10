import React, { useState } from 'react';
import { Movie, DayCollection } from '../types/boxOffice';
import {
  calculateFinancialSummary,
  formatCurrencyCr,
  formatPercentage,
  getVerdictTheme,
} from '../utils/calculations';
import { DailyTrendChart } from './Charts/DailyTrendChart';
import { RevenueSplitDonut } from './Charts/RevenueSplitDonut';
import { TerritoryBarChart } from './Charts/TerritoryBarChart';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Film,
  Award,
  DollarSign,
  PieChart,
  Users,
  Layers,
  Edit3,
  ExternalLink,
  Star,
} from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onEditMovie: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onEditMovie,
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'financials' | 'charts' | 'cast'>('ledger');
  const summary = calculateFinancialSummary(movie);
  const verdictTheme = getVerdictTheme(summary.verdict);
  const isDistributorProfit = summary.distributorProfitLossCr >= 0;
  const isProducerProfit = summary.producerProfitLossCr >= 0;

  // Star remuneration sum
  const castSalarySum = (movie.leadCast || []).reduce(
    (sum, c) => sum + (Number(c.remunerationCr) || 0),
    0
  );
  const totalSalaries = castSalarySum + (movie.directorRemunerationCr || 0);
  const castShareOfBudget = movie.totalBudgetCr > 0
    ? ((totalSalaries / movie.totalBudgetCr) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section */}
        <div className="relative w-full bg-slate-950 overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 opacity-25">
            <img
              src={movie.bannerUrl || movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

          <div className="relative p-6 sm:p-8 pt-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Poster */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-32 sm:w-44 aspect-[3/4] object-cover rounded-xl shadow-2xl border border-slate-700/80 shrink-0"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/src/assets/images/poster_mass_action_1791613999028.jpg';
                }}
              />

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded text-xs font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                  >
                    {summary.verdict}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    STATUS: {movie.status.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditMovie(movie)}
                    className="ml-auto flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit / Update Ledger</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-sm text-slate-400 italic">"{movie.tagline}"</p>
                )}

                {/* Metadata line */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{movie.releaseDate}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{movie.runtimeMinutes} mins</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{movie.censorRating}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{movie.originalLanguage} ({movie.industry})</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Dir. {movie.director}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-3xl leading-relaxed">
                  {movie.synopsis}
                </p>

                {/* Quick Rating badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold font-mono text-white text-sm">
                      {movie.ratings?.imdbScore?.toFixed(1) || '—'}
                    </span>
                    <span className="text-slate-400">/10 IMDb</span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-400">Critics: </span>
                    <span className="font-mono font-semibold text-slate-200">
                      {movie.ratings?.criticScore?.toFixed(1)}/5
                    </span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-400">Audience: </span>
                    <span className="font-mono font-semibold text-slate-200">
                      {movie.ratings?.audienceScore?.toFixed(1)}/5
                    </span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-400">BMS Interest: </span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {movie.ratings?.bmsInterestPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Highlights Matrix Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Worldwide Gross</span>
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">
                  {formatCurrencyCr(summary.totalWorldwideGrossCr)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Total tickets globally</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">India Nett</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
                  {formatCurrencyCr(summary.totalIndiaNettCr)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Gross: {formatCurrencyCr(summary.totalIndiaGrossCr)}</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Overseas Gross</span>
                <span className="text-base sm:text-lg font-bold font-mono text-slate-200">
                  {formatCurrencyCr(summary.totalOverseasGrossCr)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">International territories</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Theatrical Rights</span>
                <span className="text-base sm:text-lg font-bold font-mono text-slate-300">
                  {formatCurrencyCr(summary.theatricalRightsCr)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">WW Distribution Cost</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Distributor Share</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {formatCurrencyCr(summary.totalDistributorShareCr)}
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  Rec: {summary.distributorRecoveryPercent}%
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Distributor Profit/Loss</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isDistributorProfit ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span
                    className={`text-base sm:text-lg font-bold font-mono ${
                      isDistributorProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrencyCr(summary.distributorProfitLossCr)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {isDistributorProfit ? 'Net profit in pocket' : 'Theatrical deficit'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 px-6 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'ledger'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Day-Wise Collection Ledger ({movie.dayWiseCollections?.length || 0} Days)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'financials'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Budget, Rights & Non-Theatricals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'charts'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Visual Analytics & Breakeven Charts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cast')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'cast'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Cast & Remuneration Audit</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: SACNILK STYLE DAY-WISE LEDGER */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    Official Day-Wise Box Office Collections (India & Global)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sacnilk-standard tracked daily nett, gross, distributor share, and occupancy
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditMovie(movie)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add / Modify Days</span>
                  </button>
                </div>
              </div>

              {/* Day-Wise Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-mono">
                      <th className="py-3 px-3.5">Day</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3.5 text-right text-amber-400">India Nett</th>
                      <th className="py-3 px-3.5 text-right">India Gross</th>
                      <th className="py-3 px-3.5 text-right">Overseas</th>
                      <th className="py-3 px-3.5 text-right text-cyan-400 font-bold">WW Gross</th>
                      <th className="py-3 px-3.5 text-right text-emerald-400">Dist. Share</th>
                      <th className="py-3 px-3 text-right">Occ %</th>
                      <th className="py-3 px-4">Trade Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {(movie.dayWiseCollections || []).map((dayItem, idx) => {
                      const prevDay = idx > 0 ? movie.dayWiseCollections[idx - 1] : null;
                      const nettGrowth = prevDay
                        ? ((dayItem.indiaNettCr - prevDay.indiaNettCr) / prevDay.indiaNettCr) * 100
                        : null;

                      return (
                        <tr
                          key={dayItem.day}
                          className="hover:bg-slate-800/40 transition-colors font-mono"
                        >
                          <td className="py-2.5 px-3.5 font-bold text-slate-200">
                            {dayItem.dayLabel || `Day ${dayItem.day}`}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{dayItem.date}</td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-amber-400">
                            {formatCurrencyCr(dayItem.indiaNettCr)}
                            {nettGrowth !== null && (
                              <span
                                className={`block text-[10px] ${
                                  nettGrowth >= 0 ? 'text-emerald-400' : 'text-slate-500'
                                }`}
                              >
                                {nettGrowth >= 0 ? '+' : ''}
                                {nettGrowth.toFixed(1)}%
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-slate-300">
                            {formatCurrencyCr(dayItem.indiaGrossCr)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-slate-300">
                            {formatCurrencyCr(dayItem.overseasGrossCr)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-cyan-300">
                            {formatCurrencyCr(dayItem.worldwideGrossCr)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-semibold text-emerald-400">
                            {formatCurrencyCr(dayItem.distributorShareCr)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400">
                            {dayItem.occupancyPercentage ? `${dayItem.occupancyPercentage}%` : '—'}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-xs text-slate-400">
                            {dayItem.notes || '—'}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Total Summary Row */}
                    <tr className="bg-slate-900/90 font-bold text-slate-100 border-t-2 border-slate-700 text-xs">
                      <td colSpan={2} className="py-3.5 px-3.5 uppercase font-sans">
                        Total Tracked Lifetime
                      </td>
                      <td className="py-3.5 px-3.5 text-right text-amber-400 font-mono text-sm">
                        {formatCurrencyCr(summary.totalIndiaNettCr)}
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-sm">
                        {formatCurrencyCr(summary.totalIndiaGrossCr)}
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-sm">
                        {formatCurrencyCr(summary.totalOverseasGrossCr)}
                      </td>
                      <td className="py-3.5 px-3.5 text-right text-cyan-300 font-mono text-sm">
                        {formatCurrencyCr(summary.totalWorldwideGrossCr)}
                      </td>
                      <td className="py-3.5 px-3.5 text-right text-emerald-400 font-mono text-sm">
                        {formatCurrencyCr(summary.totalDistributorShareCr)}
                      </td>
                      <td colSpan={2} className="py-3.5 px-3 text-right text-slate-400 font-sans">
                        Verdict: <span className={verdictTheme.text}>{summary.verdict}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL INTELLIGENCE & RIGHTS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Producer vs Distributor Ledger Balance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Distributor Balance Card */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">
                        Distributors Financial Balance Sheet
                      </h4>
                      <p className="text-xs text-slate-400">Worldwide Theatrical Recovery</p>
                    </div>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-xs font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                    >
                      {summary.verdict}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Total Theatrical Rights Paid:</span>
                      <span className="font-mono text-slate-200 font-semibold">
                        {formatCurrencyCr(summary.theatricalRightsCr)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Worldwide Share Collected:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {formatCurrencyCr(summary.totalDistributorShareCr)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Distributor Recovery Ratio:</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {summary.distributorRecoveryPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 bg-slate-900/60 px-3 rounded-lg">
                      <span className="text-slate-300 font-medium">Net Profit / Loss for Distributors:</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          isDistributorProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatCurrencyCr(summary.distributorProfitLossCr)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Producer Table Profit Card */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">
                        Producer Table Profit & Total Recovery
                      </h4>
                      <p className="text-xs text-slate-400">Pre-Release & Theatrical Monies</p>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isProducerProfit ? 'text-emerald-400 bg-emerald-950/50' : 'text-rose-400 bg-rose-950/50'
                      }`}
                    >
                      {isProducerProfit ? 'TABLE PROFIT' : 'TABLE DEFICIT'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Total Production & P&A Budget:</span>
                      <span className="font-mono text-slate-200 font-semibold">
                        {formatCurrencyCr(movie.totalBudgetCr)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Theatrical Rights Sold For:</span>
                      <span className="font-mono text-slate-200">
                        {formatCurrencyCr(summary.theatricalRightsCr)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Non-Theatrical Revenue (OTT/TV/Music):</span>
                      <span className="font-mono text-slate-200">
                        {formatCurrencyCr(summary.totalNonTheatricalRecoveryCr)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 bg-slate-900/60 px-3 rounded-lg">
                      <span className="text-slate-300 font-medium">Producer Net Margin:</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          isProducerProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatCurrencyCr(summary.producerProfitLossCr)} ({formatPercentage(summary.producerTableProfitPercent)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non Theatrical Rights Breakdown */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-semibold text-slate-100">
                  Non-Theatrical Rights Breakdown (Digital, Satellite & Music)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-blue-400 block font-semibold">Digital / OTT</span>
                    <span className="text-lg font-bold font-mono text-slate-100">
                      {formatCurrencyCr(movie.nonTheatricalRights?.digitalOttCr)}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Partner: {movie.nonTheatricalRights?.digitalOttBuyer || 'Not disclosed'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-emerald-400 block font-semibold">Satellite TV</span>
                    <span className="text-lg font-bold font-mono text-slate-100">
                      {formatCurrencyCr(movie.nonTheatricalRights?.satelliteCr)}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Network: {movie.nonTheatricalRights?.satelliteBuyer || 'Not disclosed'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-pink-400 block font-semibold">Music & Audio</span>
                    <span className="text-lg font-bold font-mono text-slate-100">
                      {formatCurrencyCr(movie.nonTheatricalRights?.musicAudioCr)}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Label: {movie.nonTheatricalRights?.musicBuyer || 'Not disclosed'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-[11px] text-purple-400 block font-semibold">Ancillary / Dubbing</span>
                    <span className="text-lg font-bold font-mono text-slate-100">
                      {formatCurrencyCr(movie.nonTheatricalRights?.ancillaryCr)}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Merchandise & Dubbing Rights
                    </span>
                  </div>
                </div>
              </div>

              {/* Territory Bar Chart */}
              {movie.territoryRights && movie.territoryRights.length > 0 && (
                <TerritoryBarChart territories={movie.territoryRights} />
              )}
            </div>
          )}

          {/* TAB 3: VISUAL ANALYTICS & CHARTS */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <DailyTrendChart
                dayCollections={movie.dayWiseCollections}
                theatricalRightsCr={summary.theatricalRightsCr}
              />
              <RevenueSplitDonut
                financialSummary={summary}
                nonTheatricalRights={movie.nonTheatricalRights}
              />
            </div>
          )}

          {/* TAB 4: CAST & REMUNERATION AUDIT */}
          {activeTab === 'cast' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    Cast & Crew Remuneration Audit
                  </h3>
                  <p className="text-xs text-slate-400">
                    Star power payroll breakdown vs physical VFX and production budget
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="text-slate-400">Star Payroll:</span>
                  <span className="font-mono text-amber-400 font-bold">{formatCurrencyCr(totalSalaries)}</span>
                  <span className="text-slate-500">({castShareOfBudget}% of budget)</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-mono">
                      <th className="py-3 px-4">Talent Name</th>
                      <th className="py-3 px-3">Role / Character</th>
                      <th className="py-3 px-4 text-right">Remuneration (Cr)</th>
                      <th className="py-3 px-4 text-right">% of Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {/* Director */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {movie.director}
                      </td>
                      <td className="py-3 px-3 text-slate-400">Director / Creator</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                        {formatCurrencyCr(movie.directorRemunerationCr)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {movie.totalBudgetCr > 0
                          ? ((movie.directorRemunerationCr / movie.totalBudgetCr) * 100).toFixed(1)
                          : '0'}
                        %
                      </td>
                    </tr>

                    {/* Actors */}
                    {(movie.leadCast || []).map((cast) => {
                      const pct = movie.totalBudgetCr > 0
                        ? ((cast.remunerationCr / movie.totalBudgetCr) * 100).toFixed(1)
                        : '0';

                      return (
                        <tr key={cast.name} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-semibold text-slate-200">{cast.name}</td>
                          <td className="py-3 px-3 text-slate-400">{cast.role || 'Lead Role'}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                            {formatCurrencyCr(cast.remunerationCr)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-400">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}

                    {/* Physical Production & VFX */}
                    <tr className="bg-slate-900/50 border-t border-slate-800 font-semibold">
                      <td className="py-3 px-4 text-slate-200">Sets, VFX, Stunts & Production</td>
                      <td className="py-3 px-3 text-slate-400">Physical Craft & Filming</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {formatCurrencyCr(movie.productionCostCr)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {movie.totalBudgetCr > 0
                          ? ((movie.productionCostCr / movie.totalBudgetCr) * 100).toFixed(1)
                          : '0'}
                        %
                      </td>
                    </tr>

                    {/* P&A */}
                    <tr className="bg-slate-900/50 font-semibold">
                      <td className="py-3 px-4 text-slate-200">Promotion & Advertising (P&A)</td>
                      <td className="py-3 px-3 text-slate-400">Marketing & Distribution Prints</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {formatCurrencyCr(movie.printAndAdvertisingCr)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {movie.totalBudgetCr > 0
                          ? ((movie.printAndAdvertisingCr / movie.totalBudgetCr) * 100).toFixed(1)
                          : '0'}
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Data sourced from trade returns, official studio figures & verified distributors.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
