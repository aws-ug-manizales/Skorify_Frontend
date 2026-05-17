'use client';

import type { ElementType } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

interface PredictionScoreRuleCardProps {
  icon: ElementType;
  title: string;
  points: string;
  description: string;
}

const PredictionScoreRuleCard = ({
  icon: Icon,
  title,
  points,
  description,
}: PredictionScoreRuleCardProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1.25,
      alignItems: 'center',
      p: 1.5,
      borderRadius: 2,
      border: `1px solid ${tokens.outlineVariant}26`,
      bgcolor: tokens.surfaceContainerLow,
      minHeight: 132,
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        alignContent: 'center',
        bgcolor: tokens.surfaceContainerHigh,
        color: tokens.primary,
        flexShrink: 0,
      }}
    >
      <Icon />
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, alignItems: 'center' }}>
      <Typography
        sx={{ fontSize: '0.85rem', fontWeight: 800, color: tokens.onSurface, textAlign: 'center' }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.8rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          color: tokens.primary,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {points}
      </Typography>
    </Box>

    <Typography
      sx={{
        fontSize: '0.8rem',
        color: tokens.onSurfaceVariant,
        lineHeight: 1.5,
        textAlign: 'center',
      }}
    >
      {description}
    </Typography>
  </Box>
);

export default PredictionScoreRuleCard;
