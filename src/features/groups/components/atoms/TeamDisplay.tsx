'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';

interface TeamDisplayProps {
  name: string;
}

const TeamDisplay = ({ name }: TeamDisplayProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, flex: 1 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: tokens.surfaceContainerHighest,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SportsSoccerIcon sx={{ fontSize: 22, color: tokens.onSurfaceVariant }} />
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: tokens.onSurface,
        fontWeight: 600,
        textAlign: 'center',
        fontSize: '0.75rem',
      }}
    >
      {name}
    </Typography>
  </Box>
);

export default TeamDisplay;
