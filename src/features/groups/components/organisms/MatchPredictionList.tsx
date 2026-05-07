'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import MatchPredictionCard from '../molecules/MatchPredictionCard';
import type { PendingMatch } from '../../types';

interface MatchPredictionListProps {
  matches: PendingMatch[];
}

const MatchPredictionList = ({ matches }: MatchPredictionListProps) => {
  const t = useTranslations('groups');
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
        <EventOutlinedIcon sx={{ color: tokens.primary, fontSize: 20, mt: '2px' }} />
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: tokens.onSurface,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            {t('matchesTitle')}
          </Typography>
          {matches.length > 0 && (
            <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, mt: 0.5 }}>
              {matches.length}{' '}
              {matches.length === 1 ? t('pendingMatchesSingular') : t('pendingMatchesPlural')}
            </Typography>
          )}
        </Box>
      </Box>

      {matches.length === 0 ? (
        <Box
          sx={{
            bgcolor: tokens.surfaceContainerLow,
            borderRadius: '16px',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 40 }} />
          <Typography variant="h6" sx={{ color: tokens.onSurface, fontWeight: 600 }}>
            {t('noMatchesTitle')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: tokens.onSurfaceVariant, textAlign: 'center', maxWidth: 280 }}
          >
            {t('noMatchesSubtitle')}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {matches.map((match) => (
            <MatchPredictionCard key={match.id} match={match} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MatchPredictionList;
