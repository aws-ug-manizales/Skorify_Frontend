'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';

type Props = {
  message: string;
};

const MatchesEmptyState = ({ message }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 12,
      gap: 2,
    }}
  >
    <SportsSoccerIcon sx={{ fontSize: '3rem', color: `${tokens.onSurfaceVariant}4D` }} />
    <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>{message}</Typography>
  </Box>
);

export default MatchesEmptyState;
