import type { ApiResult } from './types';

export type Id = string;

export interface SkorifyMeta {
  code: string;
  time?: {
    nano: number;
    micro: number;
    mili: number;
    sec: number;
  };
}

export interface SkorifyEnvelope<T> {
  meta: SkorifyMeta;
  data: T;
}

export type SkorifyResult<T> = ApiResult<SkorifyEnvelope<T>>;

// ──────────────────────────── User ────────────────────────────

export interface UserDto {
  id: Id;
  name: string;
  email: string;
  notificationToken: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
}

export interface GetUserByIdParams {
  userId: Id;
}

export interface RegisterNotificationTokenPayload {
  userId: Id;
  token: string;
}

// ──────────────────────────── Match ───────────────────────────

export type MatchStatus = 'draft' | 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
export type MatchStage = 'group' | 'finals';

export interface MatchDto {
  id: Id;
  homeTeamId: Id;
  awayTeamId: Id;
  tournamentId: Id;
  kickOff: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  status: MatchStatus;
  stage?: MatchStage;
  venue?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateMatchPayload {
  homeTeamId: Id;
  awayTeamId: Id;
  tournamentId: Id;
  kickOff: string;
  stage?: MatchStage;
  venue?: string;
}

export interface EditMatchPayload {
  matchId: Id;
  homeTeamId: Id;
  awayTeamId: Id;
  date: string;
  status: MatchStatus;
}

export interface GetMatchByIdParams {
  matchId: Id;
}

export interface CalculateMatchScorePayload {
  matchId: Id;
}

// ──────────────────────────── Prediction ──────────────────────

export interface PredictionDto {
  id: Id;
  userId: Id;
  matchId: Id;
  awayTeamScore: number;
  localTeamScore: number;
  score: number;
  createdAt: string;
}

export interface MakePredictionPayload {
  userId: Id;
  matchId: Id;
  awayTeamScore: number;
  localTeamScore: number;
}

export interface GetPredictionsByUserParams {
  userId: Id;
  tournamentInstanceId: Id;
}

// ──────────────────────────── Tournament ──────────────────────

export interface TournamentDto {
  id: Id;
  name: string;
  startDate: string;
  endDate: string;
  token: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTournamentPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface GetTournamentByIdParams {
  tournamentId: Id;
}

// ──────────────────────────── Tournament Instance ─────────────

export type TournamentInstanceState = 'active' | 'inactive' | 'supended' | 'terminated';

export interface TournamentInstanceDto {
  id: Id;
  name: string;
  state: TournamentInstanceState;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTournamentInstancePayload {
  tournamentId: Id;
  owner: Id;
  name: string;
}

// ──────────────────────────── Endpoints ───────────────────────

export const skorifyEndpoints = {
  user: {
    create: '/user/create-user',
    getById: '/user/get-user-by-id',
    registerNotificationToken: '/user/register-notification-token',
  },
  match: {
    create: '/match/create-match',
    edit: '/match/edit-match',
    getById: '/match/get-match-by-id',
    calculateScore: '/match/calculate-match-score',
  },
  prediction: {
    make: '/prediction/make-prediction',
    getByUser: '/prediction/get-predictions-by-user',
  },
  tournament: {
    create: '/tournament/create-tournament',
    getById: '/tournament/get-tournament-by-id',
  },
  tournamentInstance: {
    create: '/tournament-instance/create-tournament-instance',
  },
} as const;
