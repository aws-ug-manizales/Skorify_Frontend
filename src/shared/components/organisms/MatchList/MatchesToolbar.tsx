'use client';

import React from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';

interface Props {
  teamValue: string;
  onTeamChange: (val: string) => void;
  teamPlaceholder: string;
  weekValue: string;
  onMonthChange: (val: string) => void;
  monthLabel: string;
  monthAllLabel: string;
  monthOptions: { value: string; label: string }[];
  onClear: () => void;
}

export const MatchesToolbar = ({
  teamValue,
  onTeamChange,
  teamPlaceholder,
  weekValue,
  onMonthChange,
  monthLabel,
  monthAllLabel,
  monthOptions,
  onClear,
}: Props) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 3, width: '100%' }}
      alignItems="center"
    >
      <TextField
        size="small"
        fullWidth
        placeholder={teamPlaceholder}
        value={teamValue}
        onChange={(e) => onTeamChange(e.target.value)}
        sx={{ flex: 2 }}
      />

      <TextField
        select
        size="small"
        fullWidth
        label={monthLabel}
        value={weekValue}
        onChange={(e) => onMonthChange(e.target.value)}
        sx={{ flex: 1, minWidth: '150px' }}
      >
        <MenuItem value="">{monthAllLabel}</MenuItem>
        {monthOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="outlined" onClick={onClear} sx={{ height: '40px', whiteSpace: 'nowrap' }}>
        Limpiar
      </Button>
    </Stack>
  );
};
