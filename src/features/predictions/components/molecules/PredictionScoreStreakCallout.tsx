'use client';

import type { ElementType } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

interface PredictionScoreStreakCalloutProps {
  icon: ElementType;
  title: string;
  description: string;
}

const PredictionScoreStreakCallout = ({
  icon: Icon,
  title,
  description,
}: PredictionScoreStreakCalloutProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      borderRadius: 2,
      border: `1px solid ${tokens.outlineVariant}26`,
      bgcolor: `${tokens.primaryContainer}12`,
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: tokens.surfaceContainerHigh,
        color: tokens.primary,
        flexShrink: 0,
      }}
    >
      <Icon />
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: tokens.onSurface, mb: 0.25 }}>
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.76rem',
          color: tokens.onSurfaceVariant,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);

export default PredictionScoreStreakCallout;
