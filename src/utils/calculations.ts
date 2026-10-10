import { Movie, MovieFinancialSummary, BoxOfficeVerdict, DayCollection } from '../types/boxOffice';

export function calculateFinancialSummary(movie: Movie): MovieFinancialSummary {
  const days = movie.dayWiseCollections || [];
  
  const totalIndiaNettCr = Number(days.reduce((sum, d) => sum + (Number(d.indiaNettCr) || 0), 0).toFixed(2));
  const totalIndiaGrossCr = Number(days.reduce((sum, d) => sum + (Number(d.indiaGrossCr) || 0), 0).toFixed(2));
  const totalOverseasGrossCr = Number(days.reduce((sum, d) => sum + (Number(d.overseasGrossCr) || 0), 0).toFixed(2));
  const totalWorldwideGrossCr = Number(days.reduce((sum, d) => sum + (Number(d.worldwideGrossCr) || 0), 0).toFixed(2));
  const totalDistributorShareCr = Number(days.reduce((sum, d) => sum + (Number(d.distributorShareCr) || 0), 0).toFixed(2));
  
  const theatricalRightsCr = Number(movie.theatricalRightsCr) || 0;
  const distributorProfitLossCr = Number((totalDistributorShareCr - theatricalRightsCr).toFixed(2));
  
  const distributorRecoveryPercent = theatricalRightsCr > 0
    ? Number(((totalDistributorShareCr / theatricalRightsCr) * 100).toFixed(1))
    : 0;

  const totalNonTheatricalRecoveryCr = Number(
    (
      (movie.nonTheatricalRights?.digitalOttCr || 0) +
      (movie.nonTheatricalRights?.satelliteCr || 0) +
      (movie.nonTheatricalRights?.musicAudioCr || 0) +
      (movie.nonTheatricalRights?.ancillaryCr || 0)
    ).toFixed(2)
  );

  const totalProducerRevenueCr = Number((theatricalRightsCr + totalNonTheatricalRecoveryCr).toFixed(2));
  const totalBudgetCr = Number(movie.totalBudgetCr) || 1;
  const producerProfitLossCr = Number((totalProducerRevenueCr - totalBudgetCr).toFixed(2));
  const producerTableProfitPercent = Number(((producerProfitLossCr / totalBudgetCr) * 100).toFixed(1));

  // Opening day WW gross
  const openingDay = days[0];
  const openingDayWorldwideGrossCr = openingDay ? Number(openingDay.worldwideGrossCr) || 0 : 0;

  // Weekend (first 3 days)
  const firstWeekendNettCr = Number(
    days.slice(0, 3).reduce((sum, d) => sum + (Number(d.indiaNettCr) || 0), 0).toFixed(2)
  );

  // First 7 days
  const firstWeekNettCr = Number(
    days.slice(0, 7).reduce((sum, d) => sum + (Number(d.indiaNettCr) || 0), 0).toFixed(2)
  );

  // Verdict determination
  let computedVerdict: BoxOfficeVerdict = 'Average';
  if (movie.customVerdict) {
    computedVerdict = movie.customVerdict;
  } else if (distributorRecoveryPercent >= 180 && totalWorldwideGrossCr >= 600) {
    computedVerdict = 'All-Time Blockbuster';
  } else if (distributorRecoveryPercent >= 150) {
    computedVerdict = 'Blockbuster';
  } else if (distributorRecoveryPercent >= 120) {
    computedVerdict = 'Super Hit';
  } else if (distributorRecoveryPercent >= 102) {
    computedVerdict = 'Hit';
  } else if (distributorRecoveryPercent >= 92) {
    computedVerdict = 'Semi Hit';
  } else if (distributorRecoveryPercent >= 80) {
    computedVerdict = 'Average';
  } else if (distributorRecoveryPercent >= 65) {
    computedVerdict = 'Below Average';
  } else if (distributorRecoveryPercent >= 45) {
    computedVerdict = 'Flop';
  } else {
    computedVerdict = 'Disaster';
  }

  return {
    totalIndiaNettCr,
    totalIndiaGrossCr,
    totalOverseasGrossCr,
    totalWorldwideGrossCr,
    totalDistributorShareCr,
    theatricalRightsCr,
    distributorProfitLossCr,
    distributorRecoveryPercent,
    totalNonTheatricalRecoveryCr,
    totalProducerRevenueCr,
    producerProfitLossCr,
    producerTableProfitPercent,
    breakevenShareCr: theatricalRightsCr,
    verdict: computedVerdict,
    firstWeekendNettCr,
    firstWeekNettCr,
    openingDayWorldwideGrossCr,
  };
}

export function formatCurrencyCr(val: number | undefined): string {
  if (val === undefined || isNaN(val)) return '₹0.00 Cr';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  return `${sign}₹${abs.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Cr`;
}

export function formatPercentage(val: number | undefined): string {
  if (val === undefined || isNaN(val)) return '0.0%';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

export function getVerdictTheme(verdict: BoxOfficeVerdict) {
  switch (verdict) {
    case 'All-Time Blockbuster':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
        glow: 'shadow-amber-500/20',
        indicator: 'bg-amber-400',
      };
    case 'Blockbuster':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
        indicator: 'bg-emerald-400',
      };
    case 'Super Hit':
    case 'Hit':
      return {
        bg: 'bg-teal-950/40',
        text: 'text-teal-400',
        border: 'border-teal-500/40',
        glow: 'shadow-teal-500/20',
        indicator: 'bg-teal-400',
      };
    case 'Semi Hit':
    case 'Average':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-400',
        border: 'border-blue-500/40',
        glow: 'shadow-blue-500/20',
        indicator: 'bg-blue-400',
      };
    case 'Below Average':
      return {
        bg: 'bg-yellow-950/40',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        glow: 'shadow-yellow-500/20',
        indicator: 'bg-yellow-400',
      };
    case 'Flop':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        glow: 'shadow-rose-500/20',
        indicator: 'bg-rose-400',
      };
    case 'Disaster':
    default:
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-400',
        border: 'border-red-600/50',
        glow: 'shadow-red-500/20',
        indicator: 'bg-red-500',
      };
  }
}
