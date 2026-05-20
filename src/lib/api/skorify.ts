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
  homeScore?: number;
  awayScore?: number;
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

export interface GetMatchesByTournamentIdParams {
  tournamentId: Id;
}

export interface CalculateMatchScorePayload {
  matchId: Id;
  tournamentInstanceId: Id;
}

export interface CloseMatchPayload {
  matchId: Id;
  homeScore?: number;
  awayScore?: number;
}

export interface CloseMatchesPayload {
  matches: CloseMatchPayload[];
}

// ──────────────────────────── Prediction ──────────────────────

export interface PredictionDto {
  id: Id;
  userId: Id;
  userEnrollmentId: Id;
  tournamentInstanceId: Id;
  matchId: Id;
  homeScore: number;
  awayScore: number;
  score: number;
  earnedPoints: number;
  hasExactResult: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface MakePredictionPayload {
  userId: Id;
  tournamentInstanceId: Id;
  matchId: Id;
  homeScore: number;
  awayScore: number;
}

export interface EditPredictionPayload {
  predictionId: Id;
  homeScore: number;
  awayScore: number;
}

export interface GetPredictionByIdParams {
  predictionId: Id;
}

export interface GetPredictionByUserAndMatchParams {
  userId: Id;
  matchId: Id;
  tournamentInstanceId: Id;
}

export interface GetPredictionsByUserParams {
  userId: Id;
  tournamentInstanceId: Id;
}

export interface GetPredictionsByMatchParams {
  matchId: Id;
}

export interface CheckMatchCanBetPayload {
  matchId: Id;
}

export interface CheckMatchCanBetResult {
  canBet: boolean;
}

// ──────────────────────────── Team ────────────────────────────

export interface TeamDto {
  id: Id;
  name: string;
  shieldUrl?: string;
  createdAt: string;
}

export interface CreateTeamPayload {
  name: string;
  shieldUrl?: string;
}

export interface GetTeamByIdParams {
  teamId: Id;
}

export interface GetTeamByIdsParams {
  teamIds: Id[];
}

// ──────────────────────────── Tournament ──────────────────────

export type MatchType = 'single_match_per_round' | 'home_and_away_per_round';

export interface TournamentDto {
  id: Id;
  name: string;
  startDate: string;
  endDate: string;
  matchType: MatchType;
  token: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTournamentPayload {
  name: string;
  matchType: MatchType;
  startDate: string;
  endDate: string;
}

export interface GetTournamentByIdParams {
  tournamentId: Id;
}

export interface FilterTournamentsParams {
  name?: string;
  startDate?: string;
  endDate?: string;
}

// ──────────────────────────── Tournament Instance ─────────────

export type TournamentInstanceState = 'active' | 'inactive' | 'supended' | 'terminated';

export interface TournamentInstanceDto {
  id: Id;
  name: string;
  tournamentId: Id;
  ownerId: Id;
  state: TournamentInstanceState;
  inviteCode: string;
  price?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTournamentInstancePayload {
  tournamentId: Id;
  ownerId: Id;
  name: string;
  price?: number;
}

export interface GetTournamentInstanceByIdParams {
  tournamentInstanceId: Id;
}

export interface GetTournamentInstanceByInviteCodeParams {
  inviteCode: string;
}

export interface GetCurrentRankingParams {
  tournamentInstanceId: Id;
}

export interface RankingItemDto {
  userId: Id;
  userName: string;
  position: number | null;
  points: number;
  streak: number;
}

// ──────────────────────────── User Enrollment ─────────────────

export interface UserEnrollmentDto {
  id: Id;
  userId: Id;
  tournamentInstanceId: Id;
  tournamentId: Id;
  joinedAt?: string;
  lastPosition: number;
  currentPosition: number;
  currentScore: number;
  streak: number;
}

export interface GetUserEnrollmentsByUserIdParams {
  userId: Id;
}

export interface GetUserEnrollmentsByTournamentInstanceIdParams {
  tournamentInstanceId: Id;
}

export interface CreateUserEnrollmentPayload {
  userId: Id;
  tournamentInstanceId: Id;
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
    getByTournamentId: '/match/get-matches-by-tournament-id',
    calculateScore: '/match/calculate-match-score',
    close: '/match/close-match',
    closeMany: '/match/close-matches',
  },
  prediction: {
    make: '/prediction/make-prediction',
    edit: '/prediction/edit-prediction',
    getById: '/prediction/get-prediction-by-id',
    getByUser: '/prediction/get-predictions-by-user',
    getByMatch: '/prediction/get-predictions-by-match',
    getByUserAndMatch: '/prediction/get-prediction-by-user-and-match',
    checkCanBet: '/prediction/check-match-can-bet',
  },
  team: {
    create: '/team/create-team',
    getById: '/team/get-team-by-id',
    getByIds: '/team/get-team-by-ids',
  },
  tournament: {
    create: '/tournament/create-tournament',
    getById: '/tournament/get-tournament-by-id',
    filter: '/tournament/filter-tournaments',
  },
  tournamentInstance: {
    create: '/tournament-instance/create-tournament-instance',
    getById: '/tournament-instance/get-tournament-instance-by-id',
    getByInviteCode: '/tournament-instance/get-tournament-instance-by-invite-code',
    getCurrentRanking: '/tournament-instance/get-current-ranking',
  },
  userEnrollment: {
    create: '/user-enrollment/create-user-enrollment',
    getByUserId: '/user-enrollment/get-user-enrollments-by-user-id',
    getByTournamentInstanceId: '/user-enrollment/get-user-enrollments-by-tournament-instance-id',
  },
} as const;
