import type { MatchStatus as ApiMatchStatus } from '@lib/api/skorify';

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchTeam = {
  name: string;
  code?: string;
  image?: string; // shieldUrl resolved from the team lookup
  loading?: boolean; // team name/shield is still being resolved
};

export type MatchScore = {
  home: number;
  away: number;
};

export type MatchPrediction = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  tournamentKey: string;
  stageKey: string;
  status: MatchStatus;
  // Raw backend status (e.g. 'calculated'), preserved because the UI `status`
  // above collapses 'finished' | 'calculated' | 'cancelled' into 'finished'.
  rawStatus?: ApiMatchStatus;
  kickoffAt: string; // ISO
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score?: MatchScore;
  prediction?: MatchPrediction;
};
