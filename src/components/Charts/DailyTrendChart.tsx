import React, { useState } from 'react';
import { DayCollection } from '../../types/boxOffice';
import { formatCurrencyCr } from '../../utils/calculations';

interface DailyTrendChartProps {
  dayCollections: DayCollection[];
  theatricalRightsCr: number;
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({
  dayCollections,
  theatricalRightsCr,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!dayCollections || dayCollections.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No day-wise collection data available
      </div>
    );
  }

  // Calculate cumulative share
  let runningShare = 0;
  const dataWithCumulative = dayCollections.map((d, index) => {
    runningShare += Number(d.distributorShareCr) || 0;
    return {
      ...d,
      cumulativeShare: runningShare,
      index,
    };
  });

  const maxDailyNett = Math.max(...dayCollections.map((d) => d.indiaNettCr), 10);
  const maxCumulative = Math.max(
    runningShare,
    theatricalRightsCr * 1.15,
    100
  );

  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 60, bottom: 40, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const getX = (i: number) => padding.left + (i / Math.max(dayCollections.length - 1, 1)) * chartWidth;
  const getYDaily = (val: number) => height - padding.bottom - (val / (maxDailyNett * 1.1)) * chartHeight;
  const getYCumulative = (val: number) => height - padding.bottom - (val / maxCumulative) * chartHeight;

  // Build points for cumulative line
  const linePoints = dataWithCumulative
    .map((d) => `${getX(d.index)},${getYCumulative(d.cumulativeShare)}`)
    .join(' ');

  // Breakeven Y coordinate
  const breakevenY = getYCumulative(theatricalRightsCr);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Daily Trajectory & Recovery Arc</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            India Nett bars paired with Cumulative Distributor Share vs. Rights Breakeven
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/80 rounded-sm"></span>
            <span className="text-slate-300">India Nett (Daily)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400"></span>
            <span className="text-slate-300">Cumulative Share</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-rose-400"></span>
            <span className="text-slate-300">Breakeven ({formatCurrencyCr(theatricalRightsCr)})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding.bottom - pct * chartHeight;
            const val = maxCumulative * pct;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray={pct === 0 ? 'none' : '3 3'}
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 4}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="start"
                >
                  ₹{Math.round(val)}Cr
                </text>
              </g>
            );
          })}

          {/* Breakeven line */}
          {theatricalRightsCr > 0 && breakevenY >= padding.top && breakevenY <= height - padding.bottom && (
            <g>
              <line
                x1={padding.left}
                y1={breakevenY}
                x2={width - padding.right}
                y2={breakevenY}
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left + 8}
                y={breakevenY - 6}
                fill="#F43F5E"
                fontSize="10"
                fontFamily="JetBrains Mono"
                fontWeight="600"
              >
                Breakeven Target: ₹{theatricalRightsCr} Cr
              </text>
            </g>
          )}

          {/* Daily Nett Bars */}
          {dataWithCumulative.map((d) => {
            const cx = getX(d.index);
            const barWidth = Math.max(Math.min(chartWidth / (dataWithCumulative.length * 2), 24), 8);
            const barHeight = Math.max(height - padding.bottom - getYDaily(d.indiaNettCr), 2);
            const isHovered = hoveredIdx === d.index;

            return (
              <g
                key={`bar-${d.day}`}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIdx(d.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <rect
                  x={cx - barWidth / 2}
                  y={height - padding.bottom - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  fill={isHovered ? '#F59E0B' : '#D97706'}
                  opacity={isHovered ? 1 : 0.75}
                />
              </g>
            );
          })}

          {/* Cumulative Area Gradient */}
          <defs>
            <linearGradient id="cumulGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            points={`${padding.left},${height - padding.bottom} ${linePoints} ${getX(
              dataWithCumulative.length - 1
            )},${height - padding.bottom}`}
            fill="url(#cumulGradient)"
          />

          {/* Cumulative Line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cumulative Points & X labels */}
          {dataWithCumulative.map((d) => {
            const cx = getX(d.index);
            const cy = getYCumulative(d.cumulativeShare);
            const isHovered = hoveredIdx === d.index;

            return (
              <g
                key={`point-${d.day}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(d.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill="#0B0F17"
                  stroke="#22D3EE"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />
                {/* X-axis label */}
                <text
                  x={cx}
                  y={height - padding.bottom + 18}
                  fill={isHovered ? '#F8FAFC' : '#64748B'}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  D{d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredIdx !== null && dataWithCumulative[hoveredIdx] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-950/95 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-md flex flex-wrap items-center gap-4 text-xs z-20"
          >
            <div>
              <span className="text-slate-400 block">{dataWithCumulative[hoveredIdx].dayLabel}</span>
              <span className="text-slate-200 font-mono font-medium">{dataWithCumulative[hoveredIdx].date}</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-amber-400 block font-semibold">India Nett</span>
              <span className="text-slate-100 font-mono">{formatCurrencyCr(dataWithCumulative[hoveredIdx].indiaNettCr)}</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-cyan-400 block font-semibold">WW Gross</span>
              <span className="text-slate-100 font-mono">{formatCurrencyCr(dataWithCumulative[hoveredIdx].worldwideGrossCr)}</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-emerald-400 block font-semibold">Cumul Share</span>
              <span className="text-slate-100 font-mono">{formatCurrencyCr(dataWithCumulative[hoveredIdx].cumulativeShare)}</span>
            </div>
            {dataWithCumulative[hoveredIdx].occupancyPercentage && (
              <div className="border-l border-slate-800 pl-3">
                <span className="text-slate-400 block">Occupancy</span>
                <span className="text-slate-200 font-mono">{dataWithCumulative[hoveredIdx].occupancyPercentage}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
