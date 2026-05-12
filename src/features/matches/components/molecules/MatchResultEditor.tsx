'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormField from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import type {
  MatchResultFormValues,
  MatchResultEditorProps,
} from '../../models/matchResultForm.model';

const MatchResultEditor = ({
  control,
  labels,
  validation,
  statusOptions,
  disabled,
  saveDisabled,
  homeTeamName,
  awayTeamName,
  onSubmit,
}: MatchResultEditorProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        sx={{
          fontSize: '1.25rem',
          color: tokens.onSurface,
          fontWeight: 800,
          mb: 1,
        }}
      >
        {labels.title}
      </Typography>

      <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant, mb: 4 }}>
        {labels.description}
      </Typography>

      <Box
        component="form"
        id="match-result-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {/* Marcador Visual */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            bgcolor: tokens.surfaceVariant,
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: tokens.onSurfaceVariant,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              {homeTeamName || labels.fallbackHome || labels.homeGoals}
            </Typography>
            <FormField<MatchResultFormValues>
              name="homeGoals"
              control={control}
              label=""
              type="number"
              rules={validation.homeGoals}
              disabled={disabled}
              fullWidth
              inputProps={{
                min: 0,
                inputMode: 'numeric',
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  padding: '12px 14px',
                },
              }}
            />
          </Box>

          <Typography
            sx={{
              mx: 2,
              fontWeight: 900,
              color: tokens.onSurfaceVariant,
              fontSize: '1.25rem',
              mt: 3,
            }}
          >
            VS
          </Typography>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: tokens.onSurfaceVariant,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              {awayTeamName || labels.fallbackAway || labels.awayGoals}
            </Typography>
            <FormField<MatchResultFormValues>
              name="awayGoals"
              control={control}
              label=""
              type="number"
              rules={validation.awayGoals}
              disabled={disabled}
              fullWidth
              inputProps={{
                min: 0,
                inputMode: 'numeric',
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  padding: '12px 14px',
                },
              }}
            />
          </Box>
        </Box>

        {/* Estado del Partido */}
        <Box sx={{ mb: 4 }}>
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
        </Box>
      </Box>
    </Box>

    <Box sx={{ mt: 'auto', pt: 3 }}>
      <AppButton
        type="submit"
        form="match-result-form"
        disabled={disabled || saveDisabled}
        fullWidth
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        {labels.save}
      </AppButton>
    </Box>
  </Box>
);

export default MatchResultEditor;
