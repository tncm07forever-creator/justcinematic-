import React, { useState } from 'react';
import { Movie } from '../../types/boxOffice';
import { formatCurrencyCr } from '../../utils/calculations';

interface ComparisonChartProps {
  movies: Movie[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ movies }) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  // Determine maximum days to show (up to day 14 or min 7)
  const maxDays = Math.min(
    Math.max(
      ...movies.map((m) => m.dayWiseCollections?.length || 0),
      7
    ),
    15
  );

  const colors = ['#22D3EE', '#F59E0B', '#A855F7', '#10B981'];

  // Build series for each movie
  const series = movies.map((m, idx) => {
    let runningWW = 0;
    const dailyPoints: { day: number; cumulativeWW: number; dailyNett: number }[] = [];

    const days = m.dayWiseCollections || [];
    for (let d = 1; d <= maxDays; d++) {
      const match = days.find((item) => item.day === d);
      if (match) {
        runningWW += Number(match.worldwideGrossCr) || 0;
        dailyPoints.push({
          day: d,
          cumulativeWW: runningWW,
          dailyNett: Number(match.indiaNettCr) || 0,
        });
      } else if (days.length > 0 && d > days[days.length - 1].day) {
        // If past recorded daily entries, hold last or break
        break;
      }
    }

    return {
      movie: m,
      color: colors[idx % colors.length],
      points: dailyPoints,
    };
  });

  const maxVal = Math.max(
    ...series.flatMap((s) => s.points.map((p) => p.cumulativeWW)),
    200
  );

  const width = 800;
  const height = 320;
  const padding = { top: 30, right: 70, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (day: number) =>
    padding.left + ((day - 1) / Math.max(maxDays - 1, 1)) * chartWidth;
  const getY = (val: number) =>
    height - padding.bottom - (val / (maxVal * 1.08)) * chartHeight;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Cumulative Worldwide Box Office Pace</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Day 1 to Day {maxDays} comparative acceleration & legs curve
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-xs">
          {series.map((s) => (
            <div key={s.movie.id} className="flex items-center gap-1.5">
              <span
                className="w-3 h-1 rounded-sm"
                style={{ backgroundColor: s.color }}
              ></span>
              <span className="text-slate-200 font-medium">{s.movie.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Horizontal Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding.bottom - pct * chartHeight;
            const val = maxVal * pct;
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
                >
                  ₹{Math.round(val)}Cr
                </text>
              </g>
            );
          })}

          {/* Lines for each movie */}
          {series.map((s) => {
            const linePoints = s.points
              .map((p) => `${getX(p.day)},${getY(p.cumulativeWW)}`)
              .join(' ');

            return (
              <g key={s.movie.id}>
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.points.map((p) => {
                  const cx = getX(p.day);
                  const cy = getY(p.cumulativeWW);
                  const isHovered = hoveredDay === p.day;

                  return (
                    <circle
                      key={`pt-${s.movie.id}-${p.day}`}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5.5 : 3.5}
                      fill="#0B0F17"
                      stroke={s.color}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDay(p.day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Day axis ticks */}
          {Array.from({ length: maxDays }, (_, i) => i + 1).map((day) => {
            const cx = getX(day);
            const isHovered = hoveredDay === day;
            return (
              <g
                key={`tick-${day}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padding.top}
                    x2={cx}
                    y2={height - padding.bottom}
                    stroke="#475569"
                    strokeDasharray="2 2"
                  />
                )}
                <text
                  x={cx}
                  y={height - padding.bottom + 18}
                  fill={isHovered ? '#F8FAFC' : '#64748B'}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  D{day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover info comparison card */}
        {hoveredDay !== null && (
          <div className="absolute top-2 right-4 bg-slate-950/95 border border-slate-700 rounded-lg p-3 text-xs shadow-xl backdrop-blur-md z-20 space-y-2">
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
              Day {hoveredDay} Cumulative Standing
            </div>
            {series.map((s) => {
              const pt = s.points.find((p) => p.day === hoveredDay);
              return (
                <div key={s.movie.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.color }}
                    ></span>
                    <span className="text-slate-300 font-medium">{s.movie.title}:</span>
                  </div>
                  <span className="font-mono text-slate-100 font-semibold">
                    {pt ? formatCurrencyCr(pt.cumulativeWW) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
