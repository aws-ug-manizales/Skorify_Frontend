'use client';

import type { KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormField from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import type { MatchResultEditorProps } from '../../models/matchResultForm.model';

const FIELD_SX = {
  width: 64,
  '& .MuiOutlinedInput-root': { height: 44 },
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: '1.1rem',
    padding: '8px 4px',
    MozAppearance: 'textfield',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;

const BLOCKED_KEYS = new Set(['-', '+', 'e', 'E', '.', ',']);

const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (BLOCKED_KEYS.has(event.key)) event.preventDefault();
};

const numericSlotProps = {
  htmlInput: {
    min: 0,
    max: 99,
    step: 1,
    inputMode: 'numeric' as const,
    onKeyDown: handleKeyDown,
  },
  formHelperText: { sx: { display: 'none' } },
};

const teamLabelSx = {
  fontWeight: 700,
  color: tokens.onSurface,
  fontSize: { xs: '0.75rem', md: '0.9rem' },
  lineHeight: 1.2,
  wordBreak: 'break-word' as const,
};

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

      <Stack
        component="form"
        id="match-result-form"
        spacing={3}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
            alignItems: 'center',
            gap: 2,
            py: 1.5,
          }}
        >
          <Typography sx={{ ...teamLabelSx, textAlign: 'right' }} title={homeTeamName}>
            {homeTeamName || labels.fallbackHome || labels.homeGoals}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormField
              name="homeGoals"
              control={control}
              rules={validation.homeGoals}
              type="number"
              size="small"
              disabled={disabled}
              sx={FIELD_SX}
              slotProps={numericSlotProps}
            />
            <Typography
              sx={{
                color: tokens.onSurfaceVariant,
                fontWeight: 800,
                fontSize: '1.1rem',
                mx: 0.25,
              }}
            >
              –
            </Typography>
            <FormField
              name="awayGoals"
              control={control}
              rules={validation.awayGoals}
              type="number"
              size="small"
              disabled={disabled}
              sx={FIELD_SX}
              slotProps={numericSlotProps}
            />
          </Box>

          <Typography sx={{ ...teamLabelSx, textAlign: 'left' }} title={awayTeamName}>
            {awayTeamName || labels.fallbackAway || labels.awayGoals}
          </Typography>
        </Box>

        <FormField
          name="status"
          control={control}
          label={labels.status}
          rules={validation.status}
          disabled={disabled}
          options={statusOptions}
          helperText={labels.statusHelper}
          fullWidth
        />
      </Stack>
    </Box>

    <Box sx={{ mt: 'auto', pt: 3 }}>
      <AppButton
        type="submit"
        form="match-result-form"
        disabled={disabled || saveDisabled}
        fullWidth
      >
        {labels.save}
      </AppButton>
    </Box>
  </Box>
);

export default MatchResultEditor;
