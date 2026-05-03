import type { Match } from '@features/matches/constants/matches.mock';

export type PredictionMatch = Match;

export interface PredictionDraft {
  homeGoals: number | '';
  awayGoals: number | '';
  isDirty: boolean;
  isEditing: boolean;
}

export type PredictionsBySource = Record<string, PredictionDraft>;

export type SavedPredictionsMap = Record<string, boolean>;

export interface MatchPredictionFormValues {
  homeGoals: number | '';
  awayGoals: number | '';
}
