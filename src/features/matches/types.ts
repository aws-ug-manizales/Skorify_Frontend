export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchTeam = {
  name: string;
  code?: string;
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
  kickoffAt: string; // ISO
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score?: MatchScore;
  prediction?: MatchPrediction;
};

