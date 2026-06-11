'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import GlobalStyles from '@mui/material/GlobalStyles';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { tokens, avatarPalette } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { getInitials } from '@shared/utils/string';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useUserGroups, type UserGroupSummary } from '@features/groups/hooks/useUserGroups';
import JoinGroupDialog from '@features/groups/components/organisms/JoinGroupDialog';
import { PENDING_JOIN_CODE_KEY } from '@features/groups/joinFlag';
import { useGetAvailableTournaments } from '@features/tournaments/hooks/useGetAvailableTournaments';
import TournamentDetailDialog from '@features/tournaments/components/organisms/TournamentDetailDialog';
import type { TournamentDto } from '@lib/api/skorify';
import { useDashboardTour } from '../../hooks/useDashboardTour';
import { TOUR_LOGIN_FLAG } from '../../tourFlag';

// Persisted once the user has seen the guided tour, so it never auto-runs again.
const TOUR_SEEN_KEY = 'skorify.dashboardTourSeen';

// Themes the driver.js guided-tour popover to match the app's color system.
const TOUR_STYLES = {
  '.driver-popover.skorify-tour': {
    backgroundColor: tokens.surfaceContainerHigh,
    color: tokens.onSurface,
    borderRadius: '14px',
    border: `1px solid ${tokens.outlineVariant}33`,
    boxShadow: tokens.shadowMd,
    padding: '18px',
    maxWidth: 340,
  },
  '.driver-popover.skorify-tour .driver-popover-title': {
    color: tokens.onSurface,
    fontSize: '1.05rem',
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  '.driver-popover.skorify-tour .driver-popover-description': {
    color: tokens.onSurfaceVariant,
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  '.driver-popover.skorify-tour .driver-popover-progress-text': {
    color: tokens.onSurfaceVariant,
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  '.driver-popover.skorify-tour .driver-popover-close-btn': {
    color: tokens.onSurfaceVariant,
  },
  '.driver-popover.skorify-tour .driver-popover-close-btn:hover': {
    color: tokens.onSurface,
  },
  '.driver-popover.skorify-tour .driver-popover-footer button': {
    textShadow: 'none',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  '.driver-popover.skorify-tour .driver-popover-prev-btn': {
    backgroundColor: 'transparent',
    color: tokens.onSurfaceVariant,
    border: `1px solid ${tokens.outlineVariant}55`,
  },
  '.driver-popover.skorify-tour .driver-popover-prev-btn:hover': {
    backgroundColor: tokens.surfaceContainerHighest,
    color: tokens.onSurface,
  },
  '.driver-popover.skorify-tour .driver-popover-next-btn': {
    background: tokens.ctaGradient,
    color: '#ffffff',
    border: 'none',
  },
  '.driver-popover.skorify-tour .driver-popover-next-btn:hover': {
    background: tokens.ctaGradient,
    filter: 'brightness(1.08)',
    color: '#ffffff',
  },
  // Arrow inherits the popover background per side.
  '.driver-popover.skorify-tour .driver-popover-arrow-side-left': {
    borderLeftColor: tokens.surfaceContainerHigh,
  },
  '.driver-popover.skorify-tour .driver-popover-arrow-side-right': {
    borderRightColor: tokens.surfaceContainerHigh,
  },
  '.driver-popover.skorify-tour .driver-popover-arrow-side-top': {
    borderTopColor: tokens.surfaceContainerHigh,
  },
  '.driver-popover.skorify-tour .driver-popover-arrow-side-bottom': {
    borderBottomColor: tokens.surfaceContainerHigh,
  },
} as const;

const colorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const ACTIVE_TOURNAMENTS_LIMIT = 5;

const UserDashboardHome = () => {
  const t = useTranslations('userDashboard');
  const locale = useLocale();
  const { session, canCreateGroups } = useAuthSession();
  const { groups, isLoading: groupsLoading, refresh: refreshGroups } = useUserGroups();
  const { data: tournaments, isLoading: tournamentsLoading } = useGetAvailableTournaments();

  const displayName = session?.user.displayName ?? t('defaultUser');
  const activeTournaments = useMemo(
    () =>
      tournaments
        .filter(
          (tournament) =>
            !!tournament.startDate &&
            !!tournament.endDate &&
            !Number.isNaN(new Date(tournament.startDate).getTime()) &&
            !Number.isNaN(new Date(tournament.endDate).getTime()),
        )
        .slice(0, ACTIVE_TOURNAMENTS_LIMIT),
    [tournaments],
  );
  // Resume a join started before login: a guest who opened a `/join/<code>` link
  // was redirected to auth with the code stashed in sessionStorage. Reading it in
  // a lazy initializer (mount-only) opens the dialog prefilled without an effect,
  // and we drop the first-login tour flag so the two don't fight over the screen.
  const [join, setJoin] = useState<{ open: boolean; code: string }>(() => {
    if (typeof window === 'undefined') return { open: false, code: '' };
    const pending = sessionStorage.getItem(PENDING_JOIN_CODE_KEY);
    if (!pending) return { open: false, code: '' };
    sessionStorage.removeItem(PENDING_JOIN_CODE_KEY);
    sessionStorage.removeItem(TOUR_LOGIN_FLAG);
    return { open: true, code: pending };
  });
  const [tournamentDetailId, setTournamentDetailId] = useState<string | null>(null);

  const openJoinDialog = useCallback(() => setJoin({ open: true, code: '' }), []);
  const closeJoinDialog = useCallback(() => setJoin({ open: false, code: '' }), []);

  const { startTour } = useDashboardTour();
  const firstTournamentId = activeTournaments[0]?.id ?? null;
  const openFirstTournament = useCallback(
    () => setTournamentDetailId(firstTournamentId),
    [firstTournamentId],
  );
  const closeTournament = useCallback(() => setTournamentDetailId(null), []);

  const handleStartTour = useCallback(() => {
    startTour({
      hasTournament: !!firstTournamentId,
      openTournament: openFirstTournament,
      closeTournament,
    });
  }, [startTour, firstTournamentId, openFirstTournament, closeTournament]);

  // Run the tour only on the user's first login. The auth flow sets
  // TOUR_LOGIN_FLAG; we consume it once tournaments have loaded (so the anchors
  // exist) and persist TOUR_SEEN_KEY so it never auto-runs again.
  const tourStarted = useRef(false);
  useEffect(() => {
    if (tournamentsLoading || tourStarted.current) return;
    if (sessionStorage.getItem(TOUR_LOGIN_FLAG) !== '1') return;
    sessionStorage.removeItem(TOUR_LOGIN_FLAG);
    if (localStorage.getItem(TOUR_SEEN_KEY)) return;
    tourStarted.current = true;
    localStorage.setItem(TOUR_SEEN_KEY, '1');
    handleStartTour();
  }, [tournamentsLoading, handleStartTour]);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <GlobalStyles styles={TOUR_STYLES} />
      <WelcomeBanner
        displayName={displayName}
        canCreateGroups={canCreateGroups}
        t={t}
        onJoinGroup={openJoinDialog}
        onStartTour={handleStartTour}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box data-tour="groups">
            <MyGroupsCard groups={groups} loading={groupsLoading} t={t} />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ActiveTournamentsSection
            tournaments={activeTournaments}
            loading={tournamentsLoading}
            locale={locale}
            t={t}
            onSelectTournament={setTournamentDetailId}
          />
        </Grid>
      </Grid>

      <JoinGroupDialog open={join.open} onClose={closeJoinDialog} initialCode={join.code} />

      <TournamentDetailDialog
        open={tournamentDetailId !== null}
        onClose={() => setTournamentDetailId(null)}
        tournamentId={tournamentDetailId}
        globalInstanceId={
          tournaments.find((tournament) => tournament.id === tournamentDetailId)?.globalInstanceId
        }
        onJoined={refreshGroups}
      />
    </Box>
  );
};

export default UserDashboardHome;

interface ActiveTournamentsSectionProps {
  tournaments: TournamentDto[];
  loading: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
  onSelectTournament: (id: string) => void;
}

const formatDateSafe = (
  value: string | null | undefined,
  formatter: Intl.DateTimeFormat,
): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return formatter.format(date);
};

const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: string,
): string => {
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  return `${formatDateSafe(startDate, formatter)} - ${formatDateSafe(endDate, formatter)}`;
};

const ActiveTournamentsSection = ({
  tournaments,
  loading,
  locale,
  t,
  onSelectTournament,
}: ActiveTournamentsSectionProps) => (
  <Stack spacing={3} data-tour="tournaments">
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ flexWrap: 'wrap', gap: 1 }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: tokens.onSurface }}
        >
          {t('activeTournamentsTitle')}
        </Typography>
        <Chip
          size="small"
          icon={
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: tokens.secondary,
                '@keyframes pulseLive': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                },
                animation: 'pulseLive 2s ease-in-out infinite',
              }}
            />
          }
          label={t('liveBadge')}
          sx={{
            bgcolor: `${tokens.secondary}1F`,
            color: tokens.secondary,
            fontWeight: 800,
            letterSpacing: '0.08em',
            fontSize: '0.625rem',
            height: 22,
          }}
        />
      </Stack>
    </Stack>

    {loading ? (
      <Stack spacing={2}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={88} />
        ))}
      </Stack>
    ) : tournaments.length === 0 ? (
      <AppCard>
        <Stack alignItems="center" spacing={1.5} sx={{ py: 5, px: 3, textAlign: 'center' }}>
          <EmojiEventsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 40 }} />
          <Typography sx={{ color: tokens.onSurfaceVariant }}>
            {t('noActiveTournaments')}
          </Typography>
        </Stack>
      </AppCard>
    ) : (
      <Stack spacing={1.5}>
        {tournaments.map((tournament, index) => (
          <AppCard
            key={tournament.id}
            variant="interactive"
            onClick={() => onSelectTournament(tournament.id)}
            data-tour={index === 0 ? 'tournament-card' : undefined}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ p: { xs: 2, md: 2.5 } }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: tokens.ctaGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <EmojiEventsIcon sx={{ color: tokens.onSurface, fontSize: 22 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    color: tokens.onSurface,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tournament.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: tokens.onSurfaceVariant,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatDateRange(tournament.startDate, tournament.endDate, locale)}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 20 }} />
            </Stack>
          </AppCard>
        ))}
      </Stack>
    )}
  </Stack>
);

interface WelcomeBannerProps {
  displayName: string;
  canCreateGroups: boolean;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
  onJoinGroup: () => void;
  onStartTour: () => void;
}

const WelcomeBanner = ({
  displayName,
  canCreateGroups,
  t,
  onJoinGroup,
  onStartTour,
}: WelcomeBannerProps) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      bgcolor: tokens.surfaceContainerLow,
      border: `1px solid ${tokens.outlineVariant}1A`,
      p: { xs: 3, md: 5 },
      mb: 4,
    }}
  >
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: { xs: '60%', sm: '50%', md: '45%' },
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Box
        component="img"
        src="/hero-stadium.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: { xs: 0.18, md: 0.35 },
          mixBlendMode: 'screen',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${tokens.surfaceContainerLow} 0%, ${tokens.surfaceContainerLow}99 25%, transparent 70%), radial-gradient(circle at 80% 40%, ${tokens.primaryContainer}40 0%, transparent 60%)`,
        }}
      />
    </Box>
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 20% 100%, ${tokens.secondaryContainer}26 0%, transparent 55%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
    <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
      <Typography
        variant="overline"
        sx={{
          color: tokens.primary,
          fontWeight: 800,
          letterSpacing: '0.18em',
          fontSize: '0.6875rem',
        }}
      >
        {t('eyebrow')}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '1.75rem', md: '2.5rem' },
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          lineHeight: 1.05,
          mt: 0.5,
          mb: 1.5,
          color: tokens.onSurface,
        }}
      >
        {t('greeting', { name: displayName })}
      </Typography>
      <Typography
        sx={{
          color: tokens.onSurfaceVariant,
          fontSize: { xs: '0.875rem', md: '1rem' },
          lineHeight: 1.6,
          maxWidth: 520,
        }}
      >
        {t('welcomeText')}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
        {canCreateGroups && (
          <AppButton
            component={Link}
            href="/groups?create=1"
            startIcon={<AddCircleOutlineIcon />}
            size="large"
          >
            {t('createGroup')}
          </AppButton>
        )}
        <AppButton
          onClick={onJoinGroup}
          variant="secondary"
          startIcon={<GroupAddIcon />}
          size="large"
        >
          {t('joinGroup')}
        </AppButton>
        <AppButton
          onClick={onStartTour}
          variant="tertiary"
          startIcon={<HelpOutlineIcon />}
          size="large"
        >
          {t('tour.startCta')}
        </AppButton>
      </Stack>
    </Box>
  </Box>
);

interface SectionCardProps {
  title: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({ title, rightSlot, children }: SectionCardProps) => (
  <AppCard>
    <Stack sx={{ p: 2.5 }} spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: tokens.onSurface,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>
        {rightSlot}
      </Stack>
      {children}
    </Stack>
  </AppCard>
);

interface MyGroupsCardProps {
  groups: UserGroupSummary[];
  loading: boolean;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
}

const MyGroupsCard = ({ groups, loading, t }: MyGroupsCardProps) => (
  <SectionCard
    title={t('myGroupsTitle')}
    rightSlot={
      <AppButton
        component={Link}
        href="/groups"
        variant="tertiary"
        sx={{ fontSize: '0.625rem', minHeight: 'unset', px: 0.75, py: 0.25 }}
      >
        {t('seeAll')}
      </AppButton>
    }
  >
    {loading ? (
      <Stack spacing={1.25}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={56} />
        ))}
      </Stack>
    ) : groups.length === 0 ? (
      <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, py: 1 }}>
        {t('myGroupsEmpty')}
      </Typography>
    ) : (
      <Stack spacing={1.25}>
        {groups.slice(0, 3).map((group) => {
          const accent = colorForId(group.id);
          return (
            <Box
              key={group.id}
              component={Link}
              href={`/groups/${group.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.25,
                borderRadius: 2,
                bgcolor: tokens.surfaceContainerLowest,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 200ms ease',
                '&:hover': { bgcolor: tokens.surfaceContainerHigh },
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${accent}, ${tokens.secondaryContainer})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.onSurface,
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                {getInitials(group.name)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: tokens.onSurface,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={group.name}
                >
                  {group.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: tokens.onSurfaceVariant,
                    mt: 0.25,
                  }}
                >
                  {t('groupRank', { rank: group.rank, members: group.memberCount })}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 18 }} />
            </Box>
          );
        })}
      </Stack>
    )}
  </SectionCard>
);
