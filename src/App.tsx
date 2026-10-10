import React, { useState, useEffect } from 'react';
import { Movie, Industry } from './types/boxOffice';
import { INITIAL_MOVIES } from './data/initialMovies';
import { calculateFinancialSummary, formatCurrencyCr, getVerdictTheme } from './utils/calculations';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { MovieCard } from './components/MovieCard';
import { MovieDetailModal } from './components/MovieDetailModal';
import { ComparisonTool } from './components/ComparisonTool';
import { BoxOfficeSimulator } from './components/BoxOfficeSimulator';
import { AllTimeRecords } from './components/AllTimeRecords';
import { UploadModal } from './components/UploadModal';
import {
  Film,
  TrendingUp,
  Flame,
  Filter,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw,
  PlusCircle,
  Star,
} from 'lucide-react';

const STORAGE_KEY = 'cinetrack_movies_v2';

export default function App() {
  // Movies Database state with localStorage
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved movies', e);
    }
    return INITIAL_MOVIES;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'browse' | 'ledger' | 'compare' | 'simulator' | 'records'>('browse');

  // Filter & Search states
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected movies for comparison
  const [comparedMovieIds, setComparedMovieIds] = useState<string[]>(['pushpa-2-the-rule', 'kalki-2898-ad']);

  // Modals
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error('Failed to save movies', e);
    }
  }, [movies]);

  // Handle saving new or edited movie
  const handleSaveMovie = (savedMovie: Movie) => {
    setMovies((prev) => {
      const existingIdx = prev.findIndex((m) => m.id === savedMovie.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = savedMovie;
        return updated;
      }
      return [savedMovie, ...prev];
    });

    // If currently viewing detail of that movie, refresh it
    if (selectedMovieForDetail && selectedMovieForDetail.id === savedMovie.id) {
      setSelectedMovieForDetail(savedMovie);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset database to default authentic blockbuster collection?')) {
      setMovies(INITIAL_MOVIES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Toggle compare
  const handleCompareToggle = (movie: Movie) => {
    if (comparedMovieIds.includes(movie.id)) {
      if (comparedMovieIds.length > 1) {
        setComparedMovieIds(comparedMovieIds.filter((id) => id !== movie.id));
      }
    } else {
      if (comparedMovieIds.length >= 4) {
        setComparedMovieIds([...comparedMovieIds.slice(1), movie.id]);
      } else {
        setComparedMovieIds([...comparedMovieIds, movie.id]);
      }
      setActiveTab('compare');
    }
  };

  // Filtered movies
  const filteredMovies = movies.filter((m) => {
    const matchesIndustry = selectedIndustry === 'All' || m.industry === selectedIndustry;
    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.leadCast || []).some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  // Spotlight movie (top grosser)
  const spotlightMovie = movies[1] || movies[0]; // Pushpa 2 or Kalki
  const spotlightSummary = spotlightMovie ? calculateFinancialSummary(spotlightMovie) : null;
  const spotlightTheme = spotlightSummary ? getVerdictTheme(spotlightSummary.verdict) : null;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUpload={() => {
          setMovieToEdit(null);
          setIsUploadOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sacnilk Live Box Office Ticker */}
      <LiveTicker
        movies={movies}
        onSelectMovie={(movie) => setSelectedMovieForDetail(movie)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* VIEW 1: BROWSE / DISCOVER */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            {/* Spotlight Banner */}
            {spotlightMovie && spotlightSummary && spotlightTheme && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl">
                <div className="absolute inset-0 opacity-25">
                  <img
                    src={spotlightMovie.bannerUrl || spotlightMovie.posterUrl}
                    alt={spotlightMovie.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

                <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Flame className="w-4 h-4 fill-amber-400" />
                        <span>Featured Box Office Juggernaut</span>
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] font-mono border ${spotlightTheme.bg} ${spotlightTheme.text} ${spotlightTheme.border}`}
                      >
                        {spotlightSummary.verdict}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {spotlightMovie.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {spotlightMovie.synopsis}
                    </p>

                    {/* Quick highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                        <span className="text-[11px] text-slate-400 block font-mono">Worldwide Gross</span>
                        <span className="text-base font-bold font-mono text-cyan-400">
                          {formatCurrencyCr(spotlightSummary.totalWorldwideGrossCr)}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                        <span className="text-[11px] text-slate-400 block font-mono">India Nett</span>
                        <span className="text-base font-bold font-mono text-amber-400">
                          {formatCurrencyCr(spotlightSummary.totalIndiaNettCr)}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                        <span className="text-[11px] text-slate-400 block font-mono">Theatrical Rights</span>
                        <span className="text-base font-bold font-mono text-slate-200">
                          {formatCurrencyCr(spotlightSummary.theatricalRightsCr)}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                        <span className="text-[11px] text-slate-400 block font-mono">Distributor Recovery</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {spotlightSummary.distributorRecoveryPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedMovieForDetail(spotlightMovie)}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs py-2.5 px-5 rounded-lg shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      Open Full Day-Wise Ledger
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComparedMovieIds([spotlightMovie.id, movies[0]?.id || movies[2]?.id]);
                        setActiveTab('compare');
                      }}
                      className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs py-2.5 px-5 rounded-lg border border-slate-700 transition-colors text-center cursor-pointer"
                    >
                      Compare Against Rivals
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto text-xs">
                {['All', 'Bollywood', 'Tollywood', 'Kollywood', 'Mollywood'].map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedIndustry === ind
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ind === 'All' ? 'All Cinema' : ind}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Showing {filteredMovies.length} film profiles</span>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setMovieToEdit(null);
                    setIsUploadOpen(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New Film</span>
                </button>
              </div>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={(m) => setSelectedMovieForDetail(m)}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparedMovieIds.includes(movie.id)}
                />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800/60">
                <Film className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">No matching box office records</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting search or category filter, or upload this film's collection data now.
                </p>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  Upload Film Box Office
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: COMPARISON TOOL */}
        {activeTab === 'compare' && (
          <ComparisonTool
            allMovies={movies}
            selectedMovieIds={comparedMovieIds}
            onSelectMovieIds={setComparedMovieIds}
            onOpenMovieDetail={(m) => setSelectedMovieForDetail(m)}
          />
        )}

        {/* VIEW 3: SIMULATOR & FORECASTER */}
        {activeTab === 'simulator' && <BoxOfficeSimulator />}

        {/* VIEW 4: ALL-TIME RECORDS */}
        {activeTab === 'records' && (
          <AllTimeRecords
            movies={movies}
            onSelectMovie={(m) => setSelectedMovieForDetail(m)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">CineTrack</span>
            <span aria-hidden="true">·</span>
            <span>Independent Theatrical & Non-Theatrical Box Office Registry</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
            <span className="text-slate-800">|</span>
            <span>Trade figures compiled according to standard distributor nett splits</span>
          </div>
        </div>
      </footer>

      {/* Movie Detailed Breakdown Modal */}
      {selectedMovieForDetail && (
        <MovieDetailModal
          movie={selectedMovieForDetail}
          onClose={() => setSelectedMovieForDetail(null)}
          onEditMovie={(m) => {
            setMovieToEdit(m);
            setIsUploadOpen(true);
          }}
        />
      )}

      {/* Upload & Edit Box Office Data Modal */}
      {isUploadOpen && (
        <UploadModal
          movieToEdit={movieToEdit}
          allMovies={movies}
          onSaveMovie={handleSaveMovie}
          onClose={() => {
            setIsUploadOpen(false);
            setMovieToEdit(null);
          }}
        />
      )}
    </div>
  );
}
