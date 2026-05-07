'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

interface TeamLabelProps {
  name: string;
  flagUrl: string;
  align: 'home' | 'away';
}

const FLAG_WIDTH = 36;
const FLAG_HEIGHT = 24; // 3:2 ratio — preserves real flag proportions

const TeamLabel = ({ name, flagUrl, align }: TeamLabelProps) => {
  const isHome = align === 'home';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: isHome ? '1fr auto' : 'auto 1fr',
        alignItems: 'center',
        gap: 1.25,
        minWidth: 0,
        textAlign: isHome ? 'right' : 'left',
      }}
    >
      {isHome && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: tokens.onSurface,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            wordBreak: 'break-word',
            lineHeight: 1.2,
            fontSize: { xs: '0.75rem', md: '0.9rem' },
          }}
          title={name}
        >
          {name}
        </Typography>
      )}
      <Box
        component="img"
        src={flagUrl}
        alt={name}
        loading="lazy"
        sx={{
          width: FLAG_WIDTH,
          height: FLAG_HEIGHT,
          flexShrink: 0,
          borderRadius: '4px',
          objectFit: 'cover',
          border: `1px solid ${tokens.outlineVariant}33`,
          backgroundColor: tokens.surfaceContainerHigh,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
          display: 'block',
        }}
      />
      {!isHome && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: tokens.onSurface,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            wordBreak: 'break-word',
            lineHeight: 1.2,
            fontSize: { xs: '0.75rem', md: '0.9rem' },
          }}
          title={name}
        >
          {name}
        </Typography>
      )}
    </Box>
  );
};

export default TeamLabel;
