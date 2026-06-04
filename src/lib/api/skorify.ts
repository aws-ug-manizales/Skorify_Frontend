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

export interface DeleteUserPayload {
  Id: Id;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
}

export interface GetUserBySubPayload {
  sub: string;
}

export interface GetUserBySubResult {
  id: Id;
  name: string;
  is_active: boolean;
  notification_token: string | null;
  email: string;
  sub: string;
  image: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ──────────────────────────── Match ───────────────────────────

export type MatchStatus =
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'finished'
  | 'calculated'
  | 'cancelled';
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
  // `get-matches-by-tournament-id` serializes the status as `_status`
  // (a private entity field), so consumers must fall back to it.
  _status?: MatchStatus;
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

// get-matches-by-tournament-id now returns each match joined with its resolved
// home/away team (name + shield), so the frontend no longer resolves team
// names separately.
export interface MatchWithTeamsDto {
  match: MatchDto;
  homeTeam: TeamDto;
  awayTeam: TeamDto;
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

export interface PredictionScoreRuleDto {
  name: string;
  score: number;
}

export interface StreakBonusRuleDto {
  key: number;
  value: number;
}

export interface PredictionScoringConfigDto {
  rules: PredictionScoreRuleDto[];
  streakBonusRules: StreakBonusRuleDto[];
}

export interface EditPredictionDirectlyPayload {
  predictionId: Id;
  homeScore: number;
  awayScore: number;
  earnedPoints: number;
  hasExactResult: boolean;
}

export interface GetPredictionsByMatchAndTournamentInstanceParams {
  matchId: Id;
  tournamentInstanceId: Id;
}

export interface SimulatePredictionPayload {
  predictionHomeScore: number;
  predictionAwayScore: number;
  matchHomeScore: number;
  matchAwayScore: number;
  streak: number;
}

export interface PredictionScoreBreakdownItem {
  rule: string;
  points: number;
}

export interface SimulatePredictionResult {
  total: number;
  breakdown: PredictionScoreBreakdownItem[];
}

// ──────────────────────────── Team ────────────────────────────

export interface TeamDto {
  id: Id;
  name: string;
  code?: string;
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

export interface EditTeamPayload {
  teamId: Id;
  name: string;
}

export interface GetTeamsByQueryParams {
  query: string;
}

// ──────────────────────────── Tournament ──────────────────────

export type MatchType = 'single_match_per_round' | 'home_and_away_per_round';

export interface TournamentDto {
  id: Id;
  name: string;
  startDate: string | null;
  endDate: string | null;
  matchType: MatchType | null;
  token: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  // Id of the auto-created "Global" tournament instance. Present on the
  // get-available-tournaments response; used to enroll a user directly.
  globalInstanceId?: string | null;
}

export interface CreateTournamentPayload {
  name: string;
  matchType: MatchType;
  startDate: string;
  endDate: string;
  // Owner of the tournament; the backend validates this user exists and uses it
  // as the owner of the auto-created global tournament instance.
  userId: Id;
}

export interface GetTournamentByIdParams {
  tournamentId: Id;
}

export interface FilterTournamentsParams {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateTournamentPayload {
  tournamentId: Id;
  name: string;
  matchType: MatchType;
  startDate: string;
  endDate: string;
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

export interface GetTournamentInstancesByQueryParams {
  query: string;
}

export interface GetTournamentInstancesByTournamentIdParams {
  tournamentId: Id;
}

export interface GetCurrentRankingParams {
  tournamentInstanceId: Id;
}

export interface RankingItemDto {
  userId: Id;
  userName: string;
  // Both positions are 1-based; the backend sends `-1` when a standing hasn't
  // been calculated yet. `lastPosition` is the position before the latest score
  // calculation, used to animate rank changes.
  currentPosition: number;
  lastPosition: number;
  score: number;
  points: number;
  maxStreak: number;
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

export interface GetUserEnrollmentByIdParams {
  userEnrollmentId: Id;
}

export interface GetUserEnrollmentsByTournamentIdParams {
  tournamentId: Id;
}

export interface GetEnrollmentsWithoutPredictionParams {
  matchId: Id;
  tournamentInstanceId: Id;
}

export interface IsAUserInTournamentInstancePayload {
  tournamentInstanceId: Id;
  userId: Id;
}

export interface IsAUserInTournamentInstanceResult {
  userEnrollmentId?: Id;
}

export interface UpdateUserEnrollmentPayload {
  userEnrollmentId: Id;
  points: number;
  isExact: boolean;
}

// ──────────────────────────── Endpoints ───────────────────────

export const skorifyEndpoints = {
  user: {
    create: '/user/create-user',
    getById: '/user/get-user-by-id',
    getBySub: '/user/get-user-by-sub',
    getAvailable: '/user/get-available-users',
    registerNotificationToken: '/user/register-notification-token',
    delete: '/user/delete-user',
    register: '/user/register-user',
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
    getRules: '/prediction/get-prediction-rules',
    editDirectly: '/prediction/edit-prediction-directly',
    getByMatchAndTournamentInstance: '/prediction/get-predictions-by-match-and-tournament-instance',
    simulate: '/prediction/simulate-prediction',
  },
  team: {
    create: '/team/create-team',
    getById: '/team/get-team-by-id',
    getByIds: '/team/get-team-by-ids',
    edit: '/team/edit-team',
    getByQuery: '/team/get-teams-by-query',
  },
  tournament: {
    create: '/tournament/create-tournament',
    getById: '/tournament/get-tournament-by-id',
    filter: '/tournament/filter-tournaments',
    getAvailable: '/tournament/get-available-tournaments',
    update: '/tournament/update-tournament',
  },
  tournamentInstance: {
    create: '/tournament-instance/create-tournament-instance',
    getById: '/tournament-instance/get-tournament-instance-by-id',
    getByInviteCode: '/tournament-instance/get-tournament-instance-by-invite-code',
    getCurrentRanking: '/tournament-instance/get-current-ranking',
    getByQuery: '/tournament-instance/get-tournament-instances-by-query',
    getByTournamentId: '/tournament-instance/get-tournament-instances-by-tournament-id',
  },
  userEnrollment: {
    create: '/user-enrollment/create-user-enrollment',
    getByUserId: '/user-enrollment/get-user-enrollments-by-user-id',
    getByTournamentInstanceId: '/user-enrollment/get-user-enrollments-by-tournament-instance-id',
    getById: '/user-enrollment/get-user-enrollment-by-id',
    getByTournamentId: '/user-enrollment/get-user-enrollments-by-tournament-id',
    getWithoutPrediction: '/user-enrollment/get-enrollments-without-prediction',
    isUserInTournamentInstance: '/user-enrollment/is-a-user-in-tournament-instance',
    update: '/user-enrollment/update-user-enrollment',
  },
} as const;
