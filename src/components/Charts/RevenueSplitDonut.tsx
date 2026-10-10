import React, { useState } from 'react';
import { MovieFinancialSummary, NonTheatricalRights } from '../../types/boxOffice';
import { formatCurrencyCr } from '../../utils/calculations';

interface RevenueSplitDonutProps {
  financialSummary: MovieFinancialSummary;
  nonTheatricalRights: NonTheatricalRights;
}

export const RevenueSplitDonut: React.FC<RevenueSplitDonutProps> = ({
  financialSummary,
  nonTheatricalRights,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const segments = [
    {
      name: 'Worldwide Theatrical Share',
      val: financialSummary.totalDistributorShareCr,
      color: '#F59E0B', // Amber
      sub: 'Box office ticket returns',
    },
    {
      name: 'Digital / OTT Rights',
      val: nonTheatricalRights.digitalOttCr,
      color: '#3B82F6', // Blue
      sub: nonTheatricalRights.digitalOttBuyer || 'Streaming rights',
    },
    {
      name: 'Satellite / TV Rights',
      val: nonTheatricalRights.satelliteCr,
      color: '#10B981', // Emerald
      sub: nonTheatricalRights.satelliteBuyer || 'Television broadcast',
    },
    {
      name: 'Music / Audio Rights',
      val: nonTheatricalRights.musicAudioCr,
      color: '#EC4899', // Pink
      sub: nonTheatricalRights.musicBuyer || 'Music labels',
    },
    {
      name: 'Ancillary / Overseas Dubbing',
      val: nonTheatricalRights.ancillaryCr,
      color: '#8B5CF6', // Purple
      sub: 'International & licensing',
    },
  ].filter((s) => s.val > 0);

  const totalRevenue = segments.reduce((acc, s) => acc + s.val, 0);

  // Calculate arc slices
  let cumulativeAngle = 0;
  const radius = 80;
  const strokeWidth = 26;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  const slices = segments.map((s) => {
    const fraction = totalRevenue > 0 ? s.val / totalRevenue : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle * circumference;
    cumulativeAngle += fraction;

    return {
      ...s,
      fraction,
      percent: (fraction * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-100">Total Monetization & Rights Portfolio</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Producers & Distributors Total Realized Revenue: {formatCurrencyCr(totalRevenue)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <svg viewBox="0 0 200 200" className="w-52 h-52 -rotate-90 select-none">
            {slices.map((slice) => {
              const isHovered = hoveredSlice === slice.name;
              return (
                <circle
                  key={slice.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.name)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium">Aggregate</span>
            <span className="text-lg font-bold font-mono text-slate-100">
              ₹{Math.round(totalRevenue)} Cr
            </span>
            <span className="text-[11px] text-emerald-400">Total Realized</span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="md:col-span-7 space-y-2.5">
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.name;
            return (
              <div
                key={slice.name}
                onMouseEnter={() => setHoveredSlice(slice.name)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/90 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/40 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    ></span>
                    <div>
                      <span className="font-medium text-slate-200">{slice.name}</span>
                      <span className="text-[11px] text-slate-500 block">{slice.sub}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-slate-100">
                      {formatCurrencyCr(slice.val)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {slice.percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
