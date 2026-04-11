'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';

type FilterKey = 'filterAll' | 'filterActive' | 'filterUpcoming' | 'filterFinished';

const FILTERS: FilterKey[] = ['filterAll', 'filterActive', 'filterUpcoming', 'filterFinished'];

const TOURNAMENTS = [
  {
    key: 'champions',
    nameKey: 'championsName',
    status: 'active' as const,
    participants: 1284,
    daysLeft: 12,
    prizeKey: 'free',
    color: tokens.primary,
  },
  {
    key: 'laliga',
    nameKey: 'laligaName',
    status: 'active' as const,
    participants: 893,
    daysLeft: 5,
    prizeKey: 'free',
    color: tokens.tertiary,
  },
  {
    key: 'worldcup',
    nameKey: 'worldcupName',
    status: 'upcoming' as const,
    participants: 342,
    daysLeft: 47,
    prizeKey: 'free',
    color: tokens.success,
  },
  {
    key: 'premier',
    nameKey: 'premierName',
    status: 'finished' as const,
    participants: 2107,
    daysLeft: 0,
    prizeKey: 'free',
    color: tokens.onSurfaceVariant,
  },
] as const;

const STATUS_COLORS: Record<string, string> = {
  active: tokens.success,
  upcoming: tokens.tertiary,
  finished: tokens.onSurfaceVariant,
};

const TournamentsHome = () => {
  const t = useTranslations('tournaments');
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('filterAll');

  const filtered = TOURNAMENTS.filter((tournament) => {
    if (activeFilter === 'filterAll') return true;
    if (activeFilter === 'filterActive') return tournament.status === 'active';
    if (activeFilter === 'filterUpcoming') return tournament.status === 'upcoming';
    if (activeFilter === 'filterFinished') return tournament.status === 'finished';
    return true;
  });

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 6,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.04em',
              color: tokens.onSurface,
              textTransform: 'uppercase',
              lineHeight: 1,
              mb: 1.5,
            }}
          >
            {t('title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEventsIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: tokens.onSurfaceVariant,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {TOURNAMENTS.filter((item) => item.status === 'active').length}{' '}
              {t('active').toLowerCase()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {FILTERS.map((f) => (
            <IconButton
              key={f}
              onClick={() => setActiveFilter(f)}
              size="small"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                borderRadius: '4px',
                px: 1.5,
                py: 0.5,
                color: activeFilter === f ? tokens.primary : tokens.onSurfaceVariant,
                bgcolor:
                  activeFilter === f ? `${tokens.primaryContainer}26` : tokens.surfaceContainerHigh,
              }}
            >
              {t(f)}
            </IconButton>
          ))}
        </Box>
      </Box>

      {filtered.length === 0 ? (
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
          <EmojiEventsIcon sx={{ fontSize: '3rem', color: `${tokens.onSurfaceVariant}4D` }} />
          <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
            {t('noActive')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(({ key, nameKey, status, participants, daysLeft, color }) => (
            <Grid key={key} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box
                sx={{
                  bgcolor: tokens.surfaceContainerLow,
                  borderRadius: '8px',
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  transition: 'box-shadow 200ms ease',
                  '&:hover': { boxShadow: tokens.glowHover },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    bgcolor: `${color}0D`,
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ bgcolor: tokens.surfaceContainerHigh, p: 1, borderRadius: '8px' }}>
                    <WorkspacePremiumIcon sx={{ color, fontSize: '1.25rem', display: 'block' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: STATUS_COLORS[status],
                      bgcolor: `${STATUS_COLORS[status]}1A`,
                      px: 1,
                      py: 0.25,
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {t(status)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.625rem',
                      color: tokens.onSurfaceVariant,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {t(nameKey)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <GroupIcon sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant }} />
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
                      {participants.toLocaleString(locale)} {t('participants')}
                    </Typography>
                  </Box>
                  {status !== 'finished' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CalendarMonthIcon
                        sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant }}
                      />
                      <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
                        {status === 'active' ? t('endsIn') : t('startsIn')} {daysLeft}d
                      </Typography>
                    </Box>
                  )}
                </Box>

                <AppButton
                  variant={status === 'active' ? 'primary' : 'secondary'}
                  fullWidth
                  sx={{
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {status === 'active' ? t('join') : t('view')}
                </AppButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TournamentsHome;
