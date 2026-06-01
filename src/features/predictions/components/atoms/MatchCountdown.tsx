'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import useMatchCountdown from '../../hooks/useMatchCountdown';

interface MatchCountdownProps {
  kickOff: string;
}

const MatchCountdown = ({ kickOff }: MatchCountdownProps) => {
  const t = useTranslations('predictions');
  const tUnits = useTranslations('predictions.unit');
  const { isMounted, isLocked, months, days, hours, minutes, seconds } = useMatchCountdown(kickOff);

  const formattedTime = useMemo(() => {
    const part = (value: number, key: string) => `${value}${tUnits(key)}`;
    if (months > 0)
      return [part(months, 'month'), part(days, 'day'), part(hours, 'hour')].join(' ');
    if (days > 0)
      return [part(days, 'day'), part(hours, 'hour'), part(minutes, 'minute')].join(' ');
    if (hours > 0) {
      return [part(hours, 'hour'), part(minutes, 'minute'), part(seconds, 'second')].join(' ');
    }
    return [part(minutes, 'minute'), part(seconds, 'second')].join(' ');
  }, [months, days, hours, minutes, seconds, tUnits]);

  if (!isMounted) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.3 }}>
        {t('loading')}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.25,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: isLocked ? tokens.error : tokens.onSurfaceVariant,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {isLocked ? t('matchStartsIn') : t('closesIn')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 900,
          color: isLocked ? tokens.error : tokens.primary,
          letterSpacing: '0.04em',
          fontSize: { xs: '0.875rem', md: '0.95rem' },
        }}
      >
        {formattedTime}
      </Typography>
    </Box>
  );
};

export default MatchCountdown;
