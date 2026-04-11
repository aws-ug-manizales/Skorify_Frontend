'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';

const CHART_BARS = [40, 35, 60, 75, 50, 95, 65, 45, 30, 55, 40, 80];
const CHART_LABELS = ['00:00', '06:00', '12:00', '18:00', '23:59'];
const TIME_FILTERS = ['24H', '7D', '30D'] as const;

const METRIC_CARDS = [
  {
    key: 'totalUsers',
    value: '124.8K',
    badgeKey: 'badgeGrowth',
    badgeColor: tokens.tertiary,
    Icon: PersonAddIcon,
  },
  {
    key: 'activePredictions',
    value: '8,291',
    badgeKey: 'badgeRealtime',
    badgeColor: tokens.onSurfaceVariant,
    Icon: QueryStatsIcon,
  },
  {
    key: 'matchesToday',
    value: '14',
    badgeKey: 'badgeLive',
    badgeColor: tokens.success,
    Icon: SportsSoccerIcon,
  },
] as const;

const QUICK_ACTIONS = [
  { key: 'users', href: '/profile', Icon: PersonAddIcon },
  { key: 'matches', href: '/matches', Icon: CalendarMonthIcon },
  { key: 'groups', href: '/groups', Icon: GroupIcon },
  { key: 'tournaments', href: '/tournaments', Icon: EmojiEventsIcon },
] as const;

const RECENT_EVENTS = [
  { color: tokens.success, textKey: 'event0Text', timeKey: 'event0Time' },
  { color: tokens.primary, textKey: 'event1Text', timeKey: 'event1Time' },
  { color: tokens.tertiary, textKey: 'event2Text', timeKey: 'event2Time' },
  { color: tokens.onSurfaceVariant, textKey: 'event3Text', timeKey: 'event3Time' },
] as const;

const DashboardHome = () => {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<(typeof TIME_FILTERS)[number]>('24H');

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
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: tokens.tertiary,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.3 },
                },
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: tokens.onSurfaceVariant,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('liveStatus')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              fontSize: '0.625rem',
              color: tokens.onSurfaceVariant,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              mb: 0.5,
            }}
          >
            {t('lastUpdate')}
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
            {new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {METRIC_CARDS.map(({ key, value, badgeKey, badgeColor, Icon }) => (
          <Grid key={key} size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                bgcolor: tokens.surfaceContainerLow,
                borderRadius: '8px',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
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
                  width: 128,
                  height: 128,
                  borderRadius: '50%',
                  bgcolor: `${tokens.primary}0D`,
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Box sx={{ bgcolor: tokens.surfaceContainerHigh, p: 1, borderRadius: '8px' }}>
                  <Icon sx={{ color: tokens.primary, fontSize: '1.25rem', display: 'block' }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: badgeColor,
                    bgcolor: `${badgeColor}1A`,
                    px: 1,
                    py: 0.25,
                    borderRadius: '4px',
                  }}
                >
                  {t(badgeKey)}
                </Typography>
              </Box>
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
                {t(key)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{ bgcolor: tokens.surfaceContainerLow, borderRadius: '8px', p: 3, height: '100%' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    mb: 0.5,
                  }}
                >
                  {t('analyticsTitle')}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
                  {t('analyticsSubtitle')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {TIME_FILTERS.map((f) => (
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
                        activeFilter === f
                          ? `${tokens.primaryContainer}26`
                          : tokens.surfaceContainerHigh,
                    }}
                  >
                    {f}
                  </IconButton>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 160, px: 1 }}>
              {CHART_BARS.map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {h === 95 && (
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: -24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: tokens.primary,
                        color: tokens.background,
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: '3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('peak')}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      width: '100%',
                      height: `${h}%`,
                      bgcolor:
                        h === 95 ? `${tokens.primaryContainer}CC` : `${tokens.primaryContainer}33`,
                      borderRadius: '4px 4px 0 0',
                      transition: 'background 200ms ease',
                      '&:hover': { bgcolor: `${tokens.primaryContainer}99` },
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, px: 1 }}>
              {CHART_LABELS.map((label) => (
                <Typography
                  key={label}
                  sx={{ fontSize: '0.625rem', color: tokens.onSurfaceVariant, fontWeight: 500 }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              bgcolor: tokens.surfaceContainerLow,
              borderRadius: '8px',
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              {t('recentEvents')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
              {RECENT_EVENTS.map(({ color, textKey, timeKey }, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, mt: 0.5 }}
                    />
                    {i < RECENT_EVENTS.length - 1 && (
                      <Box
                        sx={{
                          width: 1,
                          flexGrow: 1,
                          bgcolor: `${tokens.outlineVariant}33`,
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ pb: i < RECENT_EVENTS.length - 1 ? 2 : 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: tokens.onSurface,
                        mb: 0.5,
                      }}
                    >
                      {t(textKey)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6875rem', color: tokens.onSurfaceVariant }}>
                      {t(timeKey)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <AppButton
              variant="secondary"
              fullWidth
              sx={{
                mt: 3,
                fontSize: '0.6875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {t('viewAll')}
            </AppButton>
          </Box>
        </Grid>
      </Grid>

      <Box>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            mb: 3,
          }}
        >
          {t('quickActions')}
        </Typography>
        <Grid container spacing={2}>
          {QUICK_ACTIONS.map(({ key, href, Icon }) => (
            <Grid key={key} size={{ xs: 6, sm: 3 }}>
              <Box
                component={Link}
                href={href}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  bgcolor: tokens.surfaceContainer,
                  borderRadius: '8px',
                  border: `1px solid ${tokens.outlineVariant}1A`,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 200ms ease, box-shadow 200ms ease',
                  '&:hover': {
                    bgcolor: tokens.primaryContainer,
                    boxShadow: tokens.glowHover,
                    '& .action-icon': { color: tokens.primary },
                    '& .action-title': { color: tokens.onSurface },
                    '& .action-desc': { color: `${tokens.onSurface}99` },
                  },
                }}
              >
                <Icon
                  className="action-icon"
                  sx={{
                    color: tokens.primary,
                    fontSize: '1.75rem',
                    mb: 1.5,
                    transition: 'color 200ms ease',
                  }}
                />
                <Typography
                  className="action-title"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: tokens.onSurface,
                    transition: 'color 200ms ease',
                  }}
                >
                  {t(`actions.${key}`)}
                </Typography>
                <Typography
                  className="action-desc"
                  sx={{
                    fontSize: '0.6875rem',
                    color: tokens.onSurfaceVariant,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    transition: 'color 200ms ease',
                  }}
                >
                  {t(`actions.${key}Desc`)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardHome;
