'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { tokens } from '@lib/theme/theme';

export type MatchesFilterKey = 'filterAll' | 'filterUpcoming' | 'filterLive' | 'filterFinished';

const FILTERS: MatchesFilterKey[] = ['filterAll', 'filterUpcoming', 'filterLive', 'filterFinished'];

type Props = {
  active: MatchesFilterKey;
  onChange: (filter: MatchesFilterKey) => void;
  labelFor: (filter: MatchesFilterKey) => string;
};

const MatchesFilters = ({ active, onChange, labelFor }: Props) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {FILTERS.map((f) => (
      <IconButton
        key={f}
        onClick={() => onChange(f)}
        size="small"
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          borderRadius: '4px',
          px: 1.5,
          py: 0.5,
          color: active === f ? tokens.primary : tokens.onSurfaceVariant,
          bgcolor: active === f ? `${tokens.primaryContainer}26` : tokens.surfaceContainerHigh,
        }}
      >
        {labelFor(f)}
      </IconButton>
    ))}
  </Box>
);

export default MatchesFilters;
