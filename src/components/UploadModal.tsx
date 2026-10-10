import React, { useState, useEffect } from 'react';
import { Movie, DayCollection, CastMember, TerritoryRight, BoxOfficeVerdict, Industry } from '../types/boxOffice';
import { calculateFinancialSummary, formatCurrencyCr, getVerdictTheme } from '../utils/calculations';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Calculator,
  Film,
  Sparkles,
  Download,
  FileCode,
  DollarSign,
  Layers,
  Users,
} from 'lucide-react';

interface UploadModalProps {
  movieToEdit: Movie | null;
  allMovies: Movie[];
  onSaveMovie: (movie: Movie) => void;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  movieToEdit,
  allMovies,
  onSaveMovie,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'basics' | 'budget' | 'rights' | 'days' | 'preview'>('basics');

  // Form State
  const [id, setId] = useState<string>(movieToEdit?.id || `movie-${Date.now()}`);
  const [title, setTitle] = useState<string>(movieToEdit?.title || '');
  const [tagline, setTagline] = useState<string>(movieToEdit?.tagline || '');
  const [posterUrl, setPosterUrl] = useState<string>(
    movieToEdit?.posterUrl || '/src/assets/images/poster_mass_action_1791613999028.jpg'
  );
  const [bannerUrl, setBannerUrl] = useState<string>(
    movieToEdit?.bannerUrl || '/src/assets/images/hero_cinema_boxoffice_1791613970503.jpg'
  );
  const [releaseDate, setReleaseDate] = useState<string>(movieToEdit?.releaseDate || '2024-10-10');
  const [industry, setIndustry] = useState<Industry>(movieToEdit?.industry || 'Bollywood');
  const [originalLanguage, setOriginalLanguage] = useState<string>(movieToEdit?.originalLanguage || 'Hindi');
  const [genres, setGenres] = useState<string>(movieToEdit?.genres?.join(', ') || 'Action, Thriller');
  const [director, setDirector] = useState<string>(movieToEdit?.director || '');
  const [directorRemunerationCr, setDirectorRemunerationCr] = useState<number>(
    movieToEdit?.directorRemunerationCr || 25
  );
  const [runtimeMinutes, setRuntimeMinutes] = useState<number>(movieToEdit?.runtimeMinutes || 165);
  const [censorRating, setCensorRating] = useState<'U' | 'U/A' | 'A' | 'PG-13' | 'R'>(
    movieToEdit?.censorRating || 'U/A'
  );
  const [status, setStatus] = useState<'In Theatres' | 'Closed Run' | 'Upcoming'>(
    movieToEdit?.status || 'In Theatres'
  );
  const [synopsis, setSynopsis] = useState<string>(movieToEdit?.synopsis || '');

  // Cast members
  const [leadCast, setLeadCast] = useState<CastMember[]>(
    movieToEdit?.leadCast || [
      { name: 'Lead Actor', role: 'Protagonist', remunerationCr: 75 },
      { name: 'Lead Actress', role: 'Heroine', remunerationCr: 12 },
    ]
  );

  // Budget
  const [productionCostCr, setProductionCostCr] = useState<number>(movieToEdit?.productionCostCr || 150);
  const [printAndAdvertisingCr, setPrintAndAdvertisingCr] = useState<number>(
    movieToEdit?.printAndAdvertisingCr || 30
  );
  const [totalBudgetCr, setTotalBudgetCr] = useState<number>(movieToEdit?.totalBudgetCr || 280);

  // Theatrical Rights
  const [theatricalRightsCr, setTheatricalRightsCr] = useState<number>(movieToEdit?.theatricalRightsCr || 190);
  const [territoryRights, setTerritoryRights] = useState<TerritoryRight[]>(
    movieToEdit?.territoryRights || [
      { territory: 'North India (Hindi Belt)', rightsCostCr: 100, recoveredShareCr: 110 },
      { territory: 'South India', rightsCostCr: 40, recoveredShareCr: 45 },
      { territory: 'Overseas', rightsCostCr: 50, recoveredShareCr: 55 },
    ]
  );

  // Non-theatricals
  const [digitalOttCr, setDigitalOttCr] = useState<number>(movieToEdit?.nonTheatricalRights?.digitalOttCr || 110);
  const [digitalOttBuyer, setDigitalOttBuyer] = useState<string>(
    movieToEdit?.nonTheatricalRights?.digitalOttBuyer || 'Netflix'
  );
  const [satelliteCr, setSatelliteCr] = useState<number>(movieToEdit?.nonTheatricalRights?.satelliteCr || 45);
  const [satelliteBuyer, setSatelliteBuyer] = useState<string>(
    movieToEdit?.nonTheatricalRights?.satelliteBuyer || 'Star Gold'
  );
  const [musicAudioCr, setMusicAudioCr] = useState<number>(movieToEdit?.nonTheatricalRights?.musicAudioCr || 18);
  const [musicBuyer, setMusicBuyer] = useState<string>(
    movieToEdit?.nonTheatricalRights?.musicBuyer || 'T-Series'
  );
  const [ancillaryCr, setAncillaryCr] = useState<number>(movieToEdit?.nonTheatricalRights?.ancillaryCr || 10);

  // Ratings
  const [criticScore, setCriticScore] = useState<number>(movieToEdit?.ratings?.criticScore || 3.8);
  const [audienceScore, setAudienceScore] = useState<number>(movieToEdit?.ratings?.audienceScore || 4.2);
  const [imdbScore, setImdbScore] = useState<number>(movieToEdit?.ratings?.imdbScore || 7.5);
  const [bmsInterestPercentage, setBmsInterestPercentage] = useState<number>(
    movieToEdit?.ratings?.bmsInterestPercentage || 92
  );

  // Custom Verdict Override
  const [customVerdict, setCustomVerdict] = useState<BoxOfficeVerdict | ''>(
    movieToEdit?.customVerdict || ''
  );

  // Day-wise collections
  const [days, setDays] = useState<DayCollection[]>(
    movieToEdit?.dayWiseCollections || [
      {
        day: 1,
        date: releaseDate,
        dayLabel: 'Day 1 (Opening)',
        indiaNettCr: 45,
        indiaGrossCr: 53.5,
        overseasGrossCr: 25,
        worldwideGrossCr: 78.5,
        distributorShareCr: 39,
        occupancyPercentage: 74,
        notes: 'Grand worldwide opening',
      },
      {
        day: 2,
        date: releaseDate,
        dayLabel: 'Day 2',
        indiaNettCr: 38,
        indiaGrossCr: 45.2,
        overseasGrossCr: 18,
        worldwideGrossCr: 63.2,
        distributorShareCr: 31.5,
        occupancyPercentage: 62,
        notes: 'Strong Friday run',
      },
      {
        day: 3,
        date: releaseDate,
        dayLabel: 'Day 3 (Weekend Peak)',
        indiaNettCr: 48,
        indiaGrossCr: 57.1,
        overseasGrossCr: 22,
        worldwideGrossCr: 79.1,
        distributorShareCr: 39.5,
        occupancyPercentage: 81,
        notes: 'Sunday explosive surge',
      },
    ]
  );

  // Auto-calculate total budget if production + cast changes
  useEffect(() => {
    const castTotal = leadCast.reduce((sum, c) => sum + (Number(c.remunerationCr) || 0), 0);
    const computedTotal = castTotal + Number(directorRemunerationCr || 0) + Number(productionCostCr || 0) + Number(printAndAdvertisingCr || 0);
    setTotalBudgetCr(computedTotal);
  }, [leadCast, directorRemunerationCr, productionCostCr, printAndAdvertisingCr]);

  // Construct draft movie object for live calculations
  const draftMovie: Movie = {
    id,
    title: title || 'Untitled Project',
    tagline,
    posterUrl,
    bannerUrl,
    releaseDate,
    industry,
    originalLanguage,
    dubbedLanguages: [],
    genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
    director,
    directorRemunerationCr,
    leadCast,
    productionCostCr,
    printAndAdvertisingCr,
    totalBudgetCr,
    theatricalRightsCr,
    territoryRights,
    nonTheatricalRights: {
      digitalOttCr,
      digitalOttBuyer,
      satelliteCr,
      satelliteBuyer,
      musicAudioCr,
      musicBuyer,
      ancillaryCr,
      totalNonTheatricalCr: digitalOttCr + satelliteCr + musicAudioCr + ancillaryCr,
    },
    ratings: {
      criticScore,
      audienceScore,
      imdbScore,
      bmsInterestPercentage,
      totalVotesCount: 150000,
    },
    runtimeMinutes,
    censorRating,
    synopsis: synopsis || 'Film synopsis and storyline details.',
    status,
    customVerdict: customVerdict ? (customVerdict as BoxOfficeVerdict) : undefined,
    dayWiseCollections: days,
  };

  const previewSummary = calculateFinancialSummary(draftMovie);
  const verdictTheme = getVerdictTheme(previewSummary.verdict);

  // Day collection operations
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const lastDay = days[days.length - 1];
    const prevNett = lastDay ? lastDay.indiaNettCr : 30;
    const estNett = Number((prevNett * 0.85).toFixed(1));
    const estGross = Number((estNett * 1.18).toFixed(1));
    const estOverseas = Number((estGross * 0.35).toFixed(1));
    const estWW = Number((estGross + estOverseas).toFixed(1));
    const estShare = Number((estGross * 0.5).toFixed(1));

    setDays([
      ...days,
      {
        day: nextDayNum,
        date: releaseDate,
        dayLabel: `Day ${nextDayNum}`,
        indiaNettCr: estNett,
        indiaGrossCr: estGross,
        overseasGrossCr: estOverseas,
        worldwideGrossCr: estWW,
        distributorShareCr: estShare,
        occupancyPercentage: 45,
        notes: `Weekday run`,
      },
    ]);
  };

  const handleUpdateDay = (index: number, field: keyof DayCollection, value: any) => {
    const updated = [...days];
    const current = { ...updated[index], [field]: value };

    // Auto calculate Gross and WW if Nett is typed
    if (field === 'indiaNettCr') {
      const nett = Number(value) || 0;
      current.indiaGrossCr = Number((nett * 1.18).toFixed(1));
      current.worldwideGrossCr = Number((current.indiaGrossCr + (current.overseasGrossCr || 0)).toFixed(1));
      current.distributorShareCr = Number((current.indiaGrossCr * 0.5).toFixed(1));
    } else if (field === 'overseasGrossCr') {
      const ovs = Number(value) || 0;
      current.worldwideGrossCr = Number(((current.indiaGrossCr || 0) + ovs).toFixed(1));
    } else if (field === 'indiaGrossCr') {
      const gross = Number(value) || 0;
      current.worldwideGrossCr = Number((gross + (current.overseasGrossCr || 0)).toFixed(1));
      current.distributorShareCr = Number((gross * 0.5).toFixed(1));
    }

    updated[index] = current;
    setDays(updated);
  };

  const handleRemoveDay = (index: number) => {
    if (days.length > 1) {
      setDays(days.filter((_, i) => i !== index));
    }
  };

  // Add Cast Member
  const handleAddCast = () => {
    setLeadCast([...leadCast, { name: '', role: '', remunerationCr: 5 }]);
  };

  const handleUpdateCast = (index: number, field: keyof CastMember, value: any) => {
    const updated = [...leadCast];
    updated[index] = { ...updated[index], [field]: value };
    setLeadCast(updated);
  };

  const handleRemoveCast = (index: number) => {
    setLeadCast(leadCast.filter((_, i) => i !== index));
  };

  // Save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a movie title');
      return;
    }
    onSaveMovie(draftMovie);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {movieToEdit ? `Edit Box Office Data: ${movieToEdit.title}` : 'Upload New Box Office Data'}
              </h2>
              <p className="text-xs text-slate-400">
                Log day-wise collections, rights, budgets, cast salaries, and auto-compute distributor P/L
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="border-b border-slate-800 px-6 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('basics')}
            className={`py-3 px-3.5 font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'basics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Basic Metadata
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('budget')}
            className={`py-3 px-3.5 font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'budget'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Budget & Cast Remunerations
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('rights')}
            className={`py-3 px-3.5 font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'rights'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Theatrical & Non-Theatrical Rights
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('days')}
            className={`py-3 px-3.5 font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'days'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Day-Wise Collection Ledger ({days.length} Days)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('preview')}
            className={`py-3 px-3.5 font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'preview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Financial Audit & Verdict
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: BASICS */}
          {activeSection === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. War 2, Devara, Singham Again"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. The fire awakens"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bollywood">Bollywood (Hindi)</option>
                    <option value="Tollywood">Tollywood (Telugu)</option>
                    <option value="Kollywood">Kollywood (Tamil)</option>
                    <option value="Mollywood">Mollywood (Malayalam)</option>
                    <option value="Sandalwood">Sandalwood (Kannada)</option>
                    <option value="Hollywood">Hollywood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Director
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="e.g. S.S. Rajamouli"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Genres (comma separated)
                  </label>
                  <input
                    type="text"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    placeholder="Action, Sci-Fi, Thriller"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Poster Image URL (or preset)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPosterUrl(
                          posterUrl.includes('kalki')
                            ? '/src/assets/images/poster_mass_action_1791613999028.jpg'
                            : '/src/assets/images/poster_kalki_scifi_1791613949478.jpg'
                        )
                      }
                      className="bg-slate-800 hover:bg-slate-700 px-3 rounded-lg text-xs text-slate-200 transition-colors"
                    >
                      Cycle Poster
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Runtime (Minutes) & Censor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={runtimeMinutes}
                      onChange={(e) => setRuntimeMinutes(Number(e.target.value))}
                      placeholder="Runtime (min)"
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <select
                      value={censorRating}
                      onChange={(e) => setCensorRating(e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="U">U (Universal)</option>
                      <option value="U/A">U/A</option>
                      <option value="A">A (Adults Only)</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Synopsis
                </label>
                <textarea
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Plot summary and movie storyline..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* SECTION 2: BUDGET & CAST REMUNERATIONS */}
          {activeSection === 'budget' && (
            <div className="space-y-6">
              {/* Cost categories */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Director Remuneration (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={directorRemunerationCr}
                    onChange={(e) => setDirectorRemunerationCr(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Physical Production & VFX (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={productionCostCr}
                    onChange={(e) => setProductionCostCr(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Promotion & Advertising (P&A) (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={printAndAdvertisingCr}
                    onChange={(e) => setPrintAndAdvertisingCr(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cast Members Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">
                    Lead Star Cast Remuneration Breakdown
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddCast}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Actor / Talent</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {leadCast.map((cast, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 items-center text-xs"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Actor Name (e.g. Shah Rukh Khan)"
                          value={cast.name}
                          onChange={(e) => handleUpdateCast(index, 'name', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Character Role"
                          value={cast.role}
                          onChange={(e) => handleUpdateCast(index, 'role', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.5"
                          placeholder="₹ Cr"
                          value={cast.remunerationCr}
                          onChange={(e) =>
                            handleUpdateCast(index, 'remunerationCr', Number(e.target.value))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-amber-400 font-bold"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCast(index)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Budget summary */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Total Calculated Movie Budget:</span>
                  <span className="text-[11px] text-slate-500">
                    Production + P&A + Star cast salaries + Director remuneration
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-amber-400">
                    {formatCurrencyCr(totalBudgetCr)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: RIGHTS */}
          {activeSection === 'rights' && (
            <div className="space-y-6">
              {/* Worldwide Theatrical Rights */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Worldwide Theatrical Rights Valuation (₹ Cr)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Amount distributors paid for theatrical exploitation rights (Breakeven Target)
                  </p>
                  <input
                    type="number"
                    step="1"
                    value={theatricalRightsCr}
                    onChange={(e) => setTheatricalRightsCr(Number(e.target.value))}
                    className="w-full sm:w-72 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Non Theatrical Rights */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-200">
                  Non-Theatrical Rights Portfolio (Pre-Release Sales)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* OTT */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-blue-400 font-semibold block">Digital / OTT Rights</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price in ₹ Cr"
                        value={digitalOttCr}
                        onChange={(e) => setDigitalOttCr(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Buyer (e.g. Netflix)"
                        value={digitalOttBuyer}
                        onChange={(e) => setDigitalOttBuyer(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Satellite */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-emerald-400 font-semibold block">Satellite TV Rights</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price in ₹ Cr"
                        value={satelliteCr}
                        onChange={(e) => setSatelliteCr(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Network (e.g. Zee TV)"
                        value={satelliteBuyer}
                        onChange={(e) => setSatelliteBuyer(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Music */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-pink-400 font-semibold block">Music & Audio Rights</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price in ₹ Cr"
                        value={musicAudioCr}
                        onChange={(e) => setMusicAudioCr(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. T-Series)"
                        value={musicBuyer}
                        onChange={(e) => setMusicBuyer(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Ancillary */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-purple-400 font-semibold block">Ancillary & Dubbing</span>
                    <div>
                      <input
                        type="number"
                        placeholder="Price in ₹ Cr"
                        value={ancillaryCr}
                        onChange={(e) => setAncillaryCr(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: DAY-WISE LEDGER */}
          {activeSection === 'days' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Day-Wise Box Office Collection Editor
                  </h4>
                  <p className="text-xs text-slate-400">
                    Type in India Nett, and Gross / WW / Share will automatically calculate (or edit manually)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Day {days.length + 1}</span>
                </button>
              </div>

              {/* Day collection entries table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-mono">
                      <th className="py-2.5 px-3">Day Label</th>
                      <th className="py-2.5 px-2.5">Date</th>
                      <th className="py-2.5 px-2.5 text-right text-amber-400">Nett (Cr)</th>
                      <th className="py-2.5 px-2.5 text-right">Gross (Cr)</th>
                      <th className="py-2.5 px-2.5 text-right">Overseas (Cr)</th>
                      <th className="py-2.5 px-2.5 text-right text-cyan-400 font-bold">WW Gross</th>
                      <th className="py-2.5 px-2.5 text-right text-emerald-400">Share (Cr)</th>
                      <th className="py-2.5 px-2 text-right">Occ %</th>
                      <th className="py-2.5 px-2.5">Notes</th>
                      <th className="py-2.5 px-2 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {days.map((d, index) => (
                      <tr key={index} className="hover:bg-slate-900/40">
                        <td className="p-2">
                          <input
                            type="text"
                            value={d.dayLabel}
                            onChange={(e) => handleUpdateDay(index, 'dayLabel', e.target.value)}
                            className="w-24 bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={d.date}
                            onChange={(e) => handleUpdateDay(index, 'date', e.target.value)}
                            className="w-24 bg-slate-900 border border-slate-700 rounded p-1 text-slate-300 text-xs font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={d.indiaNettCr}
                            onChange={(e) =>
                              handleUpdateDay(index, 'indiaNettCr', Number(e.target.value))
                            }
                            className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-right text-amber-400 font-mono font-bold text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={d.indiaGrossCr}
                            onChange={(e) =>
                              handleUpdateDay(index, 'indiaGrossCr', Number(e.target.value))
                            }
                            className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-right text-slate-200 font-mono text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={d.overseasGrossCr}
                            onChange={(e) =>
                              handleUpdateDay(index, 'overseasGrossCr', Number(e.target.value))
                            }
                            className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-right text-slate-200 font-mono text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={d.worldwideGrossCr}
                            onChange={(e) =>
                              handleUpdateDay(index, 'worldwideGrossCr', Number(e.target.value))
                            }
                            className="w-22 bg-slate-900 border border-slate-700 rounded p-1 text-right text-cyan-300 font-mono font-bold text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={d.distributorShareCr}
                            onChange={(e) =>
                              handleUpdateDay(index, 'distributorShareCr', Number(e.target.value))
                            }
                            className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-right text-emerald-400 font-mono font-bold text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.5"
                            value={d.occupancyPercentage || 0}
                            onChange={(e) =>
                              handleUpdateDay(index, 'occupancyPercentage', Number(e.target.value))
                            }
                            className="w-14 bg-slate-900 border border-slate-700 rounded p-1 text-right text-slate-300 font-mono text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={d.notes || ''}
                            onChange={(e) => handleUpdateDay(index, 'notes', e.target.value)}
                            placeholder="Holiday / jump notes"
                            className="w-32 bg-slate-900 border border-slate-700 rounded p-1 text-slate-400 text-xs"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: LIVE AUDIT & VERDICT */}
          {activeSection === 'preview' && (
            <div className="space-y-6">
              {/* Computed Totals Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase font-mono">WW Gross</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {formatCurrencyCr(previewSummary.totalWorldwideGrossCr)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase font-mono">India Nett</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {formatCurrencyCr(previewSummary.totalIndiaNettCr)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase font-mono">Dist. Share</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatCurrencyCr(previewSummary.totalDistributorShareCr)}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase font-mono">Recovery %</span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      previewSummary.distributorRecoveryPercent >= 100
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {previewSummary.distributorRecoveryPercent}%
                  </span>
                </div>
              </div>

              {/* Verdict Override & Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      Calculated Verdict:
                    </span>
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded text-xs font-mono border ${verdictTheme.bg} ${verdictTheme.text} ${verdictTheme.border}`}
                    >
                      {previewSummary.verdict}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Manual Verdict Override (Optional):
                    </label>
                    <select
                      value={customVerdict}
                      onChange={(e) => setCustomVerdict(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="">Auto-Calculate (Recommended)</option>
                      <option value="All-Time Blockbuster">All-Time Blockbuster</option>
                      <option value="Blockbuster">Blockbuster</option>
                      <option value="Super Hit">Super Hit</option>
                      <option value="Hit">Hit</option>
                      <option value="Semi Hit">Semi Hit</option>
                      <option value="Average">Average</option>
                      <option value="Below Average">Below Average</option>
                      <option value="Flop">Flop</option>
                      <option value="Disaster">Disaster</option>
                    </select>
                  </div>
                </div>

                {/* Rating Input */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Public & Critic Ratings
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">Critic Score (/5)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        value={criticScore}
                        onChange={(e) => setCriticScore(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">Audience Score (/5)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        value={audienceScore}
                        onChange={(e) => setAudienceScore(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">IMDb (/10)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="10"
                        value={imdbScore}
                        onChange={(e) => setImdbScore(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">BMS Interest %</label>
                      <input
                        type="number"
                        step="1"
                        max="100"
                        value={bmsInterestPercentage}
                        onChange={(e) => setBmsInterestPercentage(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftMovie, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `${draftMovie.id}-boxoffice.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Save & Publish to Platform
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
