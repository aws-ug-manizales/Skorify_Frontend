import type { MatchStage } from '@lib/api/skorify';

export interface PredictionMatch {
  id: string;
  homeTeam: string;
  homeTeamFlag: string;
  awayTeam: string;
  awayTeamFlag: string;
  date: string;
  isUserPredicted: boolean;
  /** Group/finals stage, shown like the matches card. */
  stageKey?: MatchStage;
}

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
