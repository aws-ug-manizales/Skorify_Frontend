import { type Control, type RegisterOptions } from 'react-hook-form';
import { type FormFieldOption } from '@shared/components/atoms/FormField';
import { type MatchStatus } from '../types/match';

export interface MatchResultFormValues {
  matchId: string;
  homeGoals: string;
  awayGoals: string;
  status: MatchStatus;
}

export interface MatchResultEditorLabels {
  title: string;
  description: string;
  homeGoals: string;
  awayGoals: string;
  status: string;
  statusHelper: string;
  save: string;
  fallbackHome?: string;
  fallbackAway?: string;
}

export interface MatchResultEditorValidation {
  homeGoals: RegisterOptions<MatchResultFormValues, 'homeGoals'>;
  awayGoals: RegisterOptions<MatchResultFormValues, 'awayGoals'>;
  status: RegisterOptions<MatchResultFormValues, 'status'>;
}

export interface MatchResultEditorProps {
  control: Control<MatchResultFormValues>;
  labels: MatchResultEditorLabels;
  validation: MatchResultEditorValidation;
  statusOptions: FormFieldOption[];
  disabled: boolean;
  saveDisabled: boolean;
  homeTeamName?: string;
  awayTeamName?: string;
  onSubmit: () => void;
}

export interface SubmitFeedback {
  kind: 'success' | 'error';
  message: string;
  matchId: string;
}
