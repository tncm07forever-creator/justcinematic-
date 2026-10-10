export type Industry = 'Bollywood' | 'Tollywood' | 'Kollywood' | 'Mollywood' | 'Sandalwood' | 'Hollywood';

export type BoxOfficeVerdict =
  | 'All-Time Blockbuster'
  | 'Blockbuster'
  | 'Super Hit'
  | 'Hit'
  | 'Semi Hit'
  | 'Average'
  | 'Below Average'
  | 'Flop'
  | 'Disaster';

export interface CastMember {
  name: string;
  role: string;
  remunerationCr: number; // In Crores (₹)
}

export interface TerritoryRight {
  territory: string; // e.g. "Nizam / Andhra", "Hindi Belt", "Tamil Nadu", "Karnataka", "Kerala", "Overseas"
  rightsCostCr: number;
  recoveredShareCr?: number;
}

export interface NonTheatricalRights {
  digitalOttCr: number;
  digitalOttBuyer: string;
  satelliteCr: number;
  satelliteBuyer: string;
  musicAudioCr: number;
  musicBuyer: string;
  ancillaryCr: number;
  totalNonTheatricalCr: number;
}

export interface DayCollection {
  day: number;
  date: string;
  dayLabel: string; // e.g. "Day 1 (Thu - Opening)"
  indiaNettCr: number;
  indiaGrossCr: number;
  overseasGrossCr: number;
  worldwideGrossCr: number;
  distributorShareCr: number;
  occupancyPercentage?: number;
  notes?: string;
  languageBreakdown?: {
    hindi?: number;
    telugu?: number;
    tamil?: number;
    other?: number;
  };
}

export interface MovieRatings {
  criticScore: number; // e.g. 3.8 / 5
  audienceScore: number; // e.g. 4.2 / 5
  imdbScore: number; // e.g. 7.9 / 10
  bmsInterestPercentage: number; // e.g. 93%
  totalVotesCount: number;
}

export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  posterUrl: string;
  bannerUrl?: string;
  releaseDate: string; // YYYY-MM-DD
  industry: Industry;
  originalLanguage: string;
  dubbedLanguages: string[];
  genres: string[];
  director: string;
  directorRemunerationCr: number;
  leadCast: CastMember[];
  productionCostCr: number; // Sets, VFX, production crew
  printAndAdvertisingCr: number; // P&A
  totalBudgetCr: number; // Computed or explicit total cost of production
  
  theatricalRightsCr: number; // Worldwide theatrical distribution rights sold for
  territoryRights: TerritoryRight[];
  
  nonTheatricalRights: NonTheatricalRights;
  
  dayWiseCollections: DayCollection[];
  
  ratings: MovieRatings;
  runtimeMinutes: number;
  censorRating: 'U' | 'U/A' | 'A' | 'PG-13' | 'R';
  synopsis: string;
  status: 'In Theatres' | 'Closed Run' | 'Upcoming';
  
  // Custom manual verdict override (optional, defaults to calculated)
  customVerdict?: BoxOfficeVerdict;
}

export interface MovieFinancialSummary {
  totalIndiaNettCr: number;
  totalIndiaGrossCr: number;
  totalOverseasGrossCr: number;
  totalWorldwideGrossCr: number;
  totalDistributorShareCr: number;
  
  theatricalRightsCr: number;
  distributorProfitLossCr: number;
  distributorRecoveryPercent: number; // e.g. 115% means 15% profit
  
  totalNonTheatricalRecoveryCr: number;
  totalProducerRevenueCr: number; // Theatrical rights sold + Non-theatrical rights
  producerProfitLossCr: number;
  producerTableProfitPercent: number;
  
  breakevenShareCr: number;
  verdict: BoxOfficeVerdict;
  firstWeekendNettCr: number;
  firstWeekNettCr: number;
  openingDayWorldwideGrossCr: number;
}
