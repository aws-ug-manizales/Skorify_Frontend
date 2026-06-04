<<<<<<< HEAD
=======
import type { MatchStage, MatchStatus } from '@lib/api/skorify';

>>>>>>> origin/develop
export interface PredictionMatch {
  id: string;
  homeTeam: string;
  homeTeamFlag: string;
  awayTeam: string;
  awayTeamFlag: string;
  date: string;
  isUserPredicted: boolean;
<<<<<<< HEAD
=======
  /** Group/finals stage, shown like the matches card. */
  stageKey?: MatchStage;
  /** Backend match status, resolved from `_status` when present. */
  status?: MatchStatus;
>>>>>>> origin/develop
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
