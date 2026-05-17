'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import CountryFlag from '@shared/components/atoms/CountryFlag';

interface TeamLabelProps {
  name: string;
  flagUrl: string;
  align: 'home' | 'away';
}

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
      <CountryFlag src={flagUrl} alt={name} size={24} />
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
