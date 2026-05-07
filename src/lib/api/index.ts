export { api, default as apiInstance } from './instance';
export type { ApiResult, ApiSuccess, ApiFailure, ApiError, BackendEnvelope } from './types';
export {
  SKORIFY_DOMAIN_ERROR_CODES,
  getSkorifyErrorTranslationKey,
  isDomainErrorCode,
  isSkorifyEnvelope,
  stripControllerPrefix,
} from './skorify-events';
export { useApiErrorMessage } from './hooks/useApiErrorMessage';
export { useApiAlert } from './hooks/useApiAlert';
export {
  skorifyEndpoints,
  type SkorifyMeta,
  type SkorifyEnvelope,
  type SkorifyResult,
  type Id,
  type UserDto,
  type CreateUserPayload,
  type GetUserByIdParams,
  type RegisterNotificationTokenPayload,
  type MatchDto,
  type MatchStage,
  type MatchStatus,
  type CreateMatchPayload,
  type EditMatchPayload,
  type GetMatchByIdParams,
  type CalculateMatchScorePayload,
  type PredictionDto,
  type MakePredictionPayload,
  type GetPredictionsByUserParams,
  type TournamentDto,
  type CreateTournamentPayload,
  type GetTournamentByIdParams,
  type TournamentInstanceDto,
  type TournamentInstanceState,
  type CreateTournamentInstancePayload,
} from './skorify';
