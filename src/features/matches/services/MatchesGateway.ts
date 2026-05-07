import type { Match, MatchStatus } from '../types';

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ListMatchesParams = {
  tournamentId?: string;
  status?: MatchStatus;
  team?: string;
  from?: string; // ISO
  to?: string; // ISO
  page?: number; // 1-based
  pageSize?: number;
};

export interface MatchesGateway {
  listMatches(params?: ListMatchesParams): Promise<PaginatedResult<Match>>;
}
