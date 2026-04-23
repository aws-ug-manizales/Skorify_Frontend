import type { MatchStatus } from '../types';
import type { MatchesFilterKey } from '../components/molecules/MatchesFilters';

export type MatchesQuery = {
  statusFilter: MatchesFilterKey;
  team: string;
  month: string; // '' | '01'..'12' (2026)
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

