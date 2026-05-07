import type { MatchStatus } from '../types';
import type { MatchesFilterKey } from '../components/molecules/MatchesFilters';

export type MatchesQuery = {
  statusFilter: MatchesFilterKey;
  team: string;
  week: string; // '' | '01'..'12' (2026)
  page: number; // 1-based
  pageSize: number;
};

export const statusFromFilter = (filter: MatchesFilterKey): MatchStatus | undefined => {
  if (filter === 'filterUpcoming') return 'upcoming';
  if (filter === 'filterLive') return 'live';
  if (filter === 'filterFinished') return 'finished';
  return undefined;
};

export const monthToFromToIso = (month: string) => {
  if (!month) return { from: undefined as string | undefined, to: undefined as string | undefined };
  const m = month.padStart(2, '0');
  const from = new Date(`2026-${m}-01T00:00:00`).toISOString();
  const lastDay = new Date(2026, Number(m), 0).getDate(); // month is 1-based here due to Number(m)
  const to = new Date(`2026-${m}-${String(lastDay).padStart(2, '0')}T23:59:59`).toISOString();
  return { from, to };
};

export const worldCupWeekToFromToIso = (week: number) => {
  if (week == null || week < 1) {
    return { from: undefined as string | undefined, to: undefined as string | undefined };
  }

  const startDate = new Date('2026-06-11T00:00:00'); // inicio mundial

  // cada semana suma 7 días
  const fromDate = new Date(startDate);
  fromDate.setDate(startDate.getDate() + (week - 1) * 7);

  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + 6); // semana completa

  // opcional: cortar al final real del mundial
  const worldCupEnd = new Date('2026-07-19T23:59:59');
  if (toDate > worldCupEnd) {
    toDate.setTime(worldCupEnd.getTime());
  }

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
};
