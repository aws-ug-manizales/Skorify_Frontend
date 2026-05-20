'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens, avatarPalette } from '@lib/theme/theme';
import useSnackbar from '@shared/hooks/useSnackbar';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import type { TournamentDto } from '@lib/api/skorify';
import useFilterTournaments from '../../hooks/useFilterTournaments';
import CreateTournamentDrawer from './CreateTournamentDrawer';
import TournamentDetailDialog from './TournamentDetailDialog';

type FilterKey = 'filterAll' | 'filterActive' | 'filterUpcoming' | 'filterFinished';
type TournamentStatus = 'active' | 'upcoming' | 'finished';

const FILTERS: FilterKey[] = ['filterAll', 'filterActive', 'filterUpcoming', 'filterFinished'];

const STATUS_COLORS: Record<TournamentStatus, string> = {
  active: tokens.success,
  upcoming: tokens.tertiary,
  finished: tokens.onSurfaceVariant,
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const colorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const deriveStatus = (start: Date, end: Date, now: Date): TournamentStatus => {
  if (now < start) return 'upcoming';
  if (now > end) return 'finished';
  return 'active';
};

const daysBetween = (from: Date, to: Date) =>
  Math.max(0, Math.ceil((to.getTime() - from.getTime()) / MS_PER_DAY));

interface DerivedTournament {
  id: string;
  name: string;
  status: TournamentStatus;
  daysLeft: number;
  color: string;
}

const deriveTournament = (dto: TournamentDto, now: Date): DerivedTournament => {
  const start = new Date(dto.startDate);
  const end = new Date(dto.endDate);
  const status = deriveStatus(start, end, now);
  const daysLeft = status === 'upcoming' ? daysBetween(now, start) : daysBetween(now, end);
  return {
    id: dto.id,
    name: dto.name,
    status,
    daysLeft,
    color: colorForId(dto.id),
  };
};

const TournamentsHome = () => {
  const t = useTranslations('tournaments');
  const { isAdmin } = useAuthSession();
  const snackbar = useSnackbar();
  const { data, isLoading, error, filterTournaments } = useFilterTournaments();

  const [activeFilter, setActiveFilter] = useState<FilterKey>('filterAll');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Show one error toast per failed load (not on every re-render).
  useEffect(() => {
    if (error) snackbar.error(t('loadError'));
  }, [error, snackbar, t]);

  const now = useMemo(() => new Date(), []);
  const derived = useMemo(() => data.map((dto) => deriveTournament(dto, now)), [data, now]);

  const filtered = derived.filter((tournament) => {
    if (activeFilter === 'filterAll') return true;
    if (activeFilter === 'filterActive') return tournament.status === 'active';
    if (activeFilter === 'filterUpcoming') return tournament.status === 'upcoming';
    if (activeFilter === 'filterFinished') return tournament.status === 'finished';
    return true;
  });

  const activeCount = derived.filter((item) => item.status === 'active').length;

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
              {activeCount} {t('active').toLowerCase()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
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
                    activeFilter === f
                      ? `${tokens.primaryContainer}26`
                      : tokens.surfaceContainerHigh,
                }}
              >
                {t(f)}
              </IconButton>
            ))}
          </Box>
          {isAdmin && (
            <AppButton startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              {t('create')}
            </AppButton>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[0, 1, 2].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={196} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
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
          {filtered.map(({ id, name, status, daysLeft, color }) => (
            <Grid key={id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
                      fontSize: '0.875rem',
                      color: tokens.onSurface,
                      letterSpacing: '0.04em',
                      fontWeight: 800,
                      mb: 0.5,
                    }}
                  >
                    {name}
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

                <AppButton
                  variant={status === 'active' ? 'primary' : 'secondary'}
                  fullWidth
                  onClick={() => setDetailId(id)}
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

      {isAdmin && (
        <CreateTournamentDrawer
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => void filterTournaments({})}
        />
      )}

      <TournamentDetailDialog
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        tournamentId={detailId}
      />
    </Box>
  );
};

export default TournamentsHome;
