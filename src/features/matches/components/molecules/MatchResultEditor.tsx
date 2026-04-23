'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { type Control, type RegisterOptions } from 'react-hook-form';
import FormField, { type FormFieldOption } from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import { type MatchStatus } from '../../types/match';

export interface MatchResultFormValues {
  matchId: string;
  homeGoals: string;
  awayGoals: string;
  status: MatchStatus;
}

type MatchResultEditorLabels = {
  title: string;
  description: string;
  homeGoals: string;
  awayGoals: string;
  status: string;
  statusHelper: string;
  save: string;
};

type MatchResultEditorValidation = {
  homeGoals: RegisterOptions<MatchResultFormValues, 'homeGoals'>;
  awayGoals: RegisterOptions<MatchResultFormValues, 'awayGoals'>;
  status: RegisterOptions<MatchResultFormValues, 'status'>;
};

type MatchResultEditorProps = {
  control: Control<MatchResultFormValues>;
  labels: MatchResultEditorLabels;
  validation: MatchResultEditorValidation;
  statusOptions: FormFieldOption[];
  disabled: boolean;
  saveDisabled: boolean;
  onSubmit: () => void;
};

const MatchResultEditor = ({
  control,
  labels,
  validation,
  statusOptions,
  disabled,
  saveDisabled,
  onSubmit,
}: MatchResultEditorProps) => (
  <AppCard variant="outlined" sx={{ p: 3 }}>
    <Typography
      sx={{
        fontSize: '0.75rem',
        color: tokens.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 700,
        mb: 1,
      }}
    >
      {labels.title}
    </Typography>

    <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant, mb: 2.5 }}>
      {labels.description}
    </Typography>

    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormField<MatchResultFormValues>
            name="homeGoals"
            control={control}
            label={labels.homeGoals}
            type="number"
            rules={validation.homeGoals}
            disabled={disabled}
            fullWidth
            inputProps={{ min: 0, inputMode: 'numeric' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormField<MatchResultFormValues>
            name="awayGoals"
            control={control}
            label={labels.awayGoals}
            type="number"
            rules={validation.awayGoals}
            disabled={disabled}
            fullWidth
            inputProps={{ min: 0, inputMode: 'numeric' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormField<MatchResultFormValues>
            name="status"
            control={control}
            label={labels.status}
            rules={validation.status}
            disabled={disabled}
            options={statusOptions}
            helperText={labels.statusHelper}
            fullWidth
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
        <AppButton type="submit" disabled={disabled || saveDisabled}>
          {labels.save}
        </AppButton>
      </Box>
    </Box>
  </AppCard>
);

export default MatchResultEditor;
