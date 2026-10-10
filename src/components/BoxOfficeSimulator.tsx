import React, { useState } from 'react';
import { BoxOfficeVerdict } from '../types/boxOffice';
import { formatCurrencyCr, formatPercentage, getVerdictTheme } from '../utils/calculations';
import { Calculator, Sparkles, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const BoxOfficeSimulator: React.FC = () => {
  // Simulator inputs
  const [budget, setBudget] = useState<number>(250);
  const [theatricalRights, setTheatricalRights] = useState<number>(180);
  const [nonTheatricals, setNonTheatricals] = useState<number>(120);
  const [starSalary, setStarSalary] = useState<number>(80);
  const [day1Nett, setDay1Nett] = useState<number>(45);
  const [lifetimeMultiplier, setLifetimeMultiplier] = useState<number>(4.2);
  const [overseasShareRatio, setOverseasShareRatio] = useState<number>(0.35); // 35% of total gross is overseas
  const [shareRatio, setShareRatio] = useState<number>(0.50); // 50% distributor share of India Gross

  // Calculations
  const projectedIndiaNett = Number((day1Nett * lifetimeMultiplier).toFixed(2));
  const projectedIndiaGross = Number((projectedIndiaNett * 1.18).toFixed(2)); // ~18% GST/taxes
  const projectedOverseasGross = Number((projectedIndiaGross * overseasShareRatio).toFixed(2));
  const projectedWorldwideGross = Number((projectedIndiaGross + projectedOverseasGross).toFixed(2));

  // Domestic share (~50%) + Overseas share (~40% of overseas gross)
  const domesticShare = projectedIndiaGross * shareRatio;
  const overseasShare = projectedOverseasGross * 0.40;
  const projectedTotalShare = Number((domesticShare + overseasShare).toFixed(2));

  // Distributor economics
  const distributorProfitLoss = Number((projectedTotalShare - theatricalRights).toFixed(2));
  const recoveryPercent = theatricalRights > 0
    ? Number(((projectedTotalShare / theatricalRights) * 100).toFixed(1))
    : 0;

  // Producer economics
  const totalProducerInflow = theatricalRights + nonTheatricals;
  const producerProfitLoss = Number((totalProducerInflow - budget).toFixed(2));
  const producerROI = budget > 0 ? ((producerProfitLoss / budget) * 100).toFixed(1) : '0';

  // Verdict simulation
  let simulatedVerdict: BoxOfficeVerdict = 'Average';
  if (recoveryPercent >= 180 && projectedWorldwideGross >= 500) {
    simulatedVerdict = 'All-Time Blockbuster';
  } else if (recoveryPercent >= 150) {
    simulatedVerdict = 'Blockbuster';
  } else if (recoveryPercent >= 120) {
    simulatedVerdict = 'Super Hit';
  } else if (recoveryPercent >= 102) {
    simulatedVerdict = 'Hit';
  } else if (recoveryPercent >= 92) {
    simulatedVerdict = 'Semi Hit';
  } else if (recoveryPercent >= 80) {
    simulatedVerdict = 'Average';
  } else if (recoveryPercent >= 65) {
    simulatedVerdict = 'Below Average';
  } else if (recoveryPercent >= 45) {
    simulatedVerdict = 'Flop';
  } else {
    simulatedVerdict = 'Disaster';
  }

  const verdictTheme = getVerdictTheme(simulatedVerdict);
  const isDistProfit = distributorProfitLoss >= 0;

  const resetToSample = (preset: 'mass_blockbuster' | 'mid_superhit' | 'costly_disaster') => {
    if (preset === 'mass_blockbuster') {
      setBudget(450);
      setTheatricalRights(320);
      setNonTheatricals(210);
      setStarSalary(120);
      setDay1Nett(85);
      setLifetimeMultiplier(5.5);
      setOverseasShareRatio(0.40);
    } else if (preset === 'mid_superhit') {
      setBudget(50);
      setTheatricalRights(45);
      setNonTheatricals(40);
      setStarSalary(10);
      setDay1Nett(12);
      setLifetimeMultiplier(7.0);
      setOverseasShareRatio(0.25);
    } else {
      setBudget(300);
      setTheatricalRights(200);
      setNonTheatricals(100);
      setStarSalary(90);
      setDay1Nett(18);
      setLifetimeMultiplier(2.5);
      setOverseasShareRatio(0.20);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Calculator className="w-4 h-4" />
              <span>Real-Time Trade Forecaster</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Box Office Breakeven & Profit/Loss Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Model opening day numbers, lifetime legs multiplier, theatrical rights, and forecast verdict
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-slate-400">Load Trade Presets:</span>
            <button
              type="button"
              onClick={() => resetToSample('mass_blockbuster')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              Pan-India Mega Blockbuster
            </button>
            <button
              type="button"
              onClick={() => resetToSample('mid_superhit')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              High-ROI sleeper hit
            </button>
            <button
              type="button"
              onClick={() => resetToSample('costly_disaster')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              High-Budget Theatrical Loss
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Simulation Parameters
          </h3>

          <div className="space-y-4 text-xs">
            {/* Total Budget */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Total Movie Budget (Cost of Production + P&A):</span>
                <span className="font-mono text-amber-400 font-bold">{formatCurrencyCr(budget)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="800"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Theatrical Rights */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Worldwide Theatrical Rights Sold For (Distributor Cost):</span>
                <span className="font-mono text-amber-400 font-bold">{formatCurrencyCr(theatricalRights)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="700"
                step="5"
                value={theatricalRights}
                onChange={(e) => setTheatricalRights(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Non-Theatricals */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Non-Theatrical Rights (OTT, TV Satellite, Music Audio):</span>
                <span className="font-mono text-blue-400 font-bold">{formatCurrencyCr(nonTheatricals)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={nonTheatricals}
                onChange={(e) => setNonTheatricals(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Day 1 India Nett */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Opening Day 1 India Nett:</span>
                <span className="font-mono text-cyan-400 font-bold">{formatCurrencyCr(day1Nett)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="180"
                step="1"
                value={day1Nett}
                onChange={(e) => setDay1Nett(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Lifetime Multiplier */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Lifetime Legs Multiplier (x Day 1 Nett):</span>
                <span className="font-mono text-emerald-400 font-bold">{lifetimeMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="10.0"
                step="0.1"
                value={lifetimeMultiplier}
                onChange={(e) => setLifetimeMultiplier(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Front-loaded (2.0x)</span>
                <span>Average (3.5x)</span>
                <span>Historic Legs (7.0x+)</span>
              </div>
            </div>

            {/* Overseas ratio */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Overseas Gross Ratio:</span>
                <span className="font-mono text-slate-200 font-bold">{(overseasShareRatio * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={overseasShareRatio}
                onChange={(e) => setOverseasShareRatio(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Real-time Result Forecast Card */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
                  Projected Verdict
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-lg font-bold font-mono px-3 py-1 rounded-lg border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                  >
                    {simulatedVerdict}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Distributor Recovery</span>
                <span
                  className={`text-xl font-bold font-mono ${
                    recoveryPercent >= 100 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {recoveryPercent}%
                </span>
              </div>
            </div>

            {/* Projections Matrix */}
            <div className="grid grid-cols-2 gap-3 mt-5 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Projected Worldwide Gross</span>
                <span className="text-lg font-bold font-mono text-cyan-300">
                  {formatCurrencyCr(projectedWorldwideGross)}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Projected India Nett</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {formatCurrencyCr(projectedIndiaNett)}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Worldwide Share Realized</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {formatCurrencyCr(projectedTotalShare)}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Distributor Profit / Loss</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {isDistProfit ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  <span
                    className={`text-lg font-bold font-mono ${
                      isDistProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrencyCr(distributorProfitLoss)}
                  </span>
                </div>
              </div>
            </div>

            {/* Producer Table Profit */}
            <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Producer Table Profit / Margin:</span>
                <span className="text-[11px] text-slate-500">
                  Rights revenue ({formatCurrencyCr(totalProducerInflow)}) - Budget ({formatCurrencyCr(budget)})
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`font-mono font-bold text-base ${
                    producerProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrencyCr(producerProfitLoss)}
                </span>
                <span className="block text-[11px] font-mono text-slate-400">
                  ROI: {producerROI}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Note: Trade formulas use standard territorial revenue sharing benchmarks: India Nett to Gross ~1.18x, Distributor Share ~50% of domestic gross and ~40% of overseas gross.
          </div>
        </div>
      </div>
    </div>
  );
};
