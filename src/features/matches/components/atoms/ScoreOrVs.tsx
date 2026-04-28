'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

type Props = {
  showScore: boolean;
  score?: { home: number; away: number };
  vsLabel: string;
};

const ScoreOrVs = ({ showScore, score, vsLabel }: Props) => (
  <Box sx={{ textAlign: 'center' }}>
    {showScore ? (
      <Typography sx={{ color: tokens.onSurface, fontWeight: 900, fontSize: '1.15rem' }}>
        {score?.home ?? 0} - {score?.away ?? 0}
      </Typography>
    ) : (
      <Typography
        sx={{
          color: tokens.onSurfaceVariant,
          fontWeight: 800,
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {vsLabel}
      </Typography>
    )}
  </Box>
);

export default ScoreOrVs;

