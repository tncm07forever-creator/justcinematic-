import React from 'react';
import { TerritoryRight } from '../../types/boxOffice';
import { formatCurrencyCr } from '../../utils/calculations';

interface TerritoryBarChartProps {
  territories: TerritoryRight[];
}

export const TerritoryBarChart: React.FC<TerritoryBarChartProps> = ({ territories }) => {
  if (!territories || territories.length === 0) {
    return (
      <div className="text-slate-500 text-sm py-4">No territory breakdown available</div>
    );
  }

  const maxVal = Math.max(
    ...territories.flatMap((t) => [t.rightsCostCr, t.recoveredShareCr || 0]),
    10
  );

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Territory-Wise Theatrical Recovery</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rights acquisition price vs. distributor share realized
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-600 rounded-sm"></span>
            <span className="text-slate-300">Rights Price</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
            <span className="text-slate-300">Share Realized</span>
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {territories.map((t) => {
          const cost = t.rightsCostCr || 0;
          const share = t.recoveredShareCr || 0;
          const profitLoss = share - cost;
          const recoveryPct = cost > 0 ? (share / cost) * 100 : 0;
          const isProfitable = profitLoss >= 0;

          return (
            <div key={t.territory} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{t.territory}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">
                    Rights: {formatCurrencyCr(cost)}
                  </span>
                  <span className="font-mono text-slate-200">
                    Share: {formatCurrencyCr(share)}
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      isProfitable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {recoveryPct.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 h-4 bg-slate-950/60 rounded p-0.5 border border-slate-800/60">
                {/* Cost bar */}
                <div className="flex justify-end items-center h-full">
                  <div
                    className="h-full bg-slate-600 rounded-sm transition-all"
                    style={{ width: `${(cost / maxVal) * 100}%` }}
                    title={`Cost: ₹${cost} Cr`}
                  ></div>
                </div>

                {/* Share bar */}
                <div className="flex justify-start items-center h-full">
                  <div
                    className={`h-full rounded-sm transition-all ${
                      isProfitable ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${(share / maxVal) * 100}%` }}
                    title={`Share: ₹${share} Cr`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
