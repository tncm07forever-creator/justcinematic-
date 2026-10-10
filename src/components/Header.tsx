import React from 'react';
import { Film, PlusCircle, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: 'browse' | 'ledger' | 'compare' | 'simulator' | 'records';
  onSelectTab: (tab: 'browse' | 'ledger' | 'compare' | 'simulator' | 'records') => void;
  onOpenUpload: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenUpload,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onSelectTab('browse')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Cine<span className="text-amber-400">Track</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 ml-2">
              BOX OFFICE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => onSelectTab('browse')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'browse'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Live Box Office
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'compare'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Historical Comparison
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Profit & Verdict Simulator
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('records')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'records'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            All-Time Records
          </button>
        </nav>

        {/* Zone 3: Search + 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden xl:block w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movie..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs py-2 px-4 rounded-lg shadow-sm shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Upload Box Office Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
