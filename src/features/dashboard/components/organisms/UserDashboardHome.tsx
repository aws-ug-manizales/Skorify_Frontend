'use client';

<<<<<<< HEAD
import { useMemo, useState } from 'react';
=======
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
>>>>>>> origin/develop
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
<<<<<<< HEAD
=======
import GlobalStyles from '@mui/material/GlobalStyles';
>>>>>>> origin/develop
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
<<<<<<< HEAD
=======
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
>>>>>>> origin/develop
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { tokens, avatarPalette } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { getInitials } from '@shared/utils/string';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useUserGroups, type UserGroupSummary } from '@features/groups/hooks/useUserGroups';
import JoinGroupDialog from '@features/groups/components/organisms/JoinGroupDialog';
<<<<<<< HEAD
import { useGetAvailableTournaments } from '@features/tournaments/hooks/useGetAvailableTournaments';
import type { TournamentDto } from '@lib/api/skorify';
=======
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
>>>>>>> origin/develop

const numberFormatter = new Intl.NumberFormat('es-CO');

type RankingRow = { id: string; name: string; points: number };
type RecentPrediction = {
  id: string;
  match: string;
  tournament: string;
  points: number;
  hit: boolean;
};
type FriendActivity = { id: string; userKey: string; textKey: string; timeKey: string };

const RANKING: RankingRow[] = [];
const RECENT_PREDICTIONS: RecentPrediction[] = [];
const FRIEND_ACTIVITY: FriendActivity[] = [];

const CURRENT_USER_RANK = { rank: 0, points: 0 };
const USER_STREAK = 0;
const WEEK_POINTS = 0;
const ACCURACY = 0;

const colorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const ACTIVE_TOURNAMENTS_LIMIT = 5;

const UserDashboardHome = () => {
  const t = useTranslations('userDashboard');
  const locale = useLocale();
<<<<<<< HEAD
  const { session } = useAuthSession();
  const { groups, isLoading: groupsLoading } = useUserGroups();
=======
  const { session, canCreateGroups } = useAuthSession();
  const { groups, isLoading: groupsLoading, refresh: refreshGroups } = useUserGroups();
>>>>>>> origin/develop
  const { data: tournaments, isLoading: tournamentsLoading } = useGetAvailableTournaments();

  const displayName = session?.user.displayName ?? t('defaultUser');
  const activeTournaments = useMemo(
    () =>
      tournaments
        .filter(
          (tournament) =>
<<<<<<< HEAD
            !!tournament.start_date &&
            !!tournament.end_date &&
            !Number.isNaN(new Date(tournament.start_date).getTime()) &&
            !Number.isNaN(new Date(tournament.end_date).getTime()),
=======
            !!tournament.startDate &&
            !!tournament.endDate &&
            !Number.isNaN(new Date(tournament.startDate).getTime()) &&
            !Number.isNaN(new Date(tournament.endDate).getTime()),
>>>>>>> origin/develop
        )
        .slice(0, ACTIVE_TOURNAMENTS_LIMIT),
    [tournaments],
  );
<<<<<<< HEAD
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <WelcomeBanner
        displayName={displayName}
        streak={USER_STREAK}
        t={t}
        onJoinGroup={() => setJoinDialogOpen(true)}
=======
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
        streak={USER_STREAK}
        canCreateGroups={canCreateGroups}
        t={t}
        onJoinGroup={openJoinDialog}
        onStartTour={handleStartTour}
>>>>>>> origin/develop
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={3}>
<<<<<<< HEAD
            <MyGroupsCard groups={groups} loading={groupsLoading} t={t} />
=======
            <Box data-tour="groups">
              <MyGroupsCard groups={groups} loading={groupsLoading} t={t} />
            </Box>
>>>>>>> origin/develop
            <RankingCard t={t} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ActiveTournamentsSection
            tournaments={activeTournaments}
            loading={tournamentsLoading}
            locale={locale}
            t={t}
<<<<<<< HEAD
=======
            onSelectTournament={setTournamentDetailId}
>>>>>>> origin/develop
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={3}>
            <PointsSummaryCard t={t} />
            <RecentPredictionsCard t={t} />
            <FriendActivityCard t={t} />
          </Stack>
        </Grid>
      </Grid>

<<<<<<< HEAD
      <JoinGroupDialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} />
=======
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
>>>>>>> origin/develop
    </Box>
  );
};

export default UserDashboardHome;

interface ActiveTournamentsSectionProps {
  tournaments: TournamentDto[];
  loading: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
<<<<<<< HEAD
=======
  onSelectTournament: (id: string) => void;
>>>>>>> origin/develop
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
<<<<<<< HEAD
}: ActiveTournamentsSectionProps) => (
  <Stack spacing={3}>
=======
  onSelectTournament,
}: ActiveTournamentsSectionProps) => (
  <Stack spacing={3} data-tour="tournaments">
>>>>>>> origin/develop
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
<<<<<<< HEAD
      <AppButton
        component={Link}
        href="/tournaments"
        variant="tertiary"
        sx={{ fontSize: '0.6875rem' }}
      >
        {t('viewAllTournaments')}
      </AppButton>
=======
>>>>>>> origin/develop
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
<<<<<<< HEAD
        {tournaments.map((tournament) => (
          <AppCard key={tournament.id} variant="interactive" href={`/tournaments/${tournament.id}`}>
=======
        {tournaments.map((tournament, index) => (
          <AppCard
            key={tournament.id}
            variant="interactive"
            onClick={() => onSelectTournament(tournament.id)}
            data-tour={index === 0 ? 'tournament-card' : undefined}
          >
>>>>>>> origin/develop
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
<<<<<<< HEAD
                  {formatDateRange(tournament.start_date, tournament.end_date, locale)}
=======
                  {formatDateRange(tournament.startDate, tournament.endDate, locale)}
>>>>>>> origin/develop
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
  streak: number;
<<<<<<< HEAD
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
  onJoinGroup: () => void;
}

const WelcomeBanner = ({ displayName, streak, t, onJoinGroup }: WelcomeBannerProps) => (
=======
  canCreateGroups: boolean;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
  onJoinGroup: () => void;
  onStartTour: () => void;
}

const WelcomeBanner = ({
  displayName,
  streak,
  canCreateGroups,
  t,
  onJoinGroup,
  onStartTour,
}: WelcomeBannerProps) => (
>>>>>>> origin/develop
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
        {t.rich('streakText', {
          highlight: (chunks) => (
            <Box component="span" sx={{ color: tokens.primary, fontWeight: 800 }}>
              {chunks}
            </Box>
          ),
          count: streak,
        })}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3.5 }}>
<<<<<<< HEAD
        <AppButton
          component={Link}
          href="/groups?create=1"
          startIcon={<AddCircleOutlineIcon />}
          size="large"
        >
          {t('createGroup')}
        </AppButton>
=======
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
>>>>>>> origin/develop
        <AppButton
          onClick={onJoinGroup}
          variant="secondary"
          startIcon={<GroupAddIcon />}
          size="large"
        >
          {t('joinGroup')}
        </AppButton>
<<<<<<< HEAD
=======
        <AppButton
          onClick={onStartTour}
          variant="tertiary"
          startIcon={<HelpOutlineIcon />}
          size="large"
        >
          {t('tour.startCta')}
        </AppButton>
>>>>>>> origin/develop
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

interface CardWithTProps {
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
}

const RankingCard = ({ t }: CardWithTProps) => (
  <SectionCard title={t('rankingTitle')}>
    <Stack spacing={1.5}>
      {RANKING.map((row, idx) => {
        const accent = colorForId(row.id);
        return (
          <Stack
            key={row.id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  width: 16,
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: tokens.onSurfaceVariant,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {idx + 1}
              </Typography>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, ${tokens.surfaceContainerHigh})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.onSurface,
                  fontWeight: 800,
                  fontSize: '0.6875rem',
                  flexShrink: 0,
                }}
              >
                {getInitials(row.name)}
              </Box>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: tokens.onSurface,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.name}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: tokens.primary,
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
              }}
            >
              {numberFormatter.format(row.points)} {t('pointsShort')}
            </Typography>
          </Stack>
        );
      })}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mt: 0.5,
          p: 1.25,
          borderRadius: 2,
          bgcolor: `${tokens.primary}0F`,
          border: `1px solid ${tokens.primary}33`,
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              width: 16,
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: tokens.primary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {CURRENT_USER_RANK.rank}
          </Typography>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: tokens.ctaGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.onSurface,
              fontWeight: 800,
              fontSize: '0.6875rem',
              flexShrink: 0,
            }}
          >
            <LeaderboardIcon sx={{ fontSize: 14 }} />
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 800, color: tokens.primary }}>
            {t('youLabel')}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: tokens.primary,
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }}
        >
          {numberFormatter.format(CURRENT_USER_RANK.points)} {t('pointsShort')}
        </Typography>
      </Stack>
    </Stack>
  </SectionCard>
);

const PointsSummaryCard = ({ t }: CardWithTProps) => (
  <AppCard variant="elevated">
    <Box sx={{ position: 'relative', overflow: 'hidden', p: 2.5 }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 128,
          height: 128,
          borderRadius: '50%',
          bgcolor: `${tokens.primary}1A`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: tokens.onSurface,
          }}
        >
          {t('pointsSummaryTitle')}
        </Typography>

        <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
          <Typography
            sx={{
              fontSize: '2.75rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              background: tokens.ctaGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {numberFormatter.format(CURRENT_USER_RANK.points)}
          </Typography>
          <Typography
            variant="overline"
            sx={{
              color: tokens.onSurfaceVariant,
              fontWeight: 700,
              letterSpacing: '0.12em',
              fontSize: '0.625rem',
            }}
          >
            {t('totalPoints')}
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          <Grid size={6}>
            <StatTile
              label={t('weekLabel')}
              value={`+${WEEK_POINTS}`}
              color={tokens.primary}
              Icon={WhatshotIcon}
            />
          </Grid>
          <Grid size={6}>
            <StatTile
              label={t('accuracyLabel')}
              value={`${ACCURACY}%`}
              color={tokens.secondary}
              Icon={EmojiEventsIcon}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  </AppCard>
);

interface StatTileProps {
  label: string;
  value: string;
  color: string;
  Icon: typeof WhatshotIcon;
}

const StatTile = ({ label, value, color, Icon }: StatTileProps) => (
  <Box
    sx={{
      bgcolor: tokens.surfaceContainerLowest,
      borderRadius: 2,
      p: 1.25,
      border: `1px solid ${tokens.outlineVariant}1A`,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
      <Icon sx={{ fontSize: 14, color }} />
      <Typography
        variant="overline"
        sx={{
          fontSize: '0.625rem',
          color: tokens.onSurfaceVariant,
          fontWeight: 700,
          letterSpacing: '0.08em',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Stack>
    <Typography
      sx={{
        fontSize: '1.125rem',
        fontWeight: 900,
        color,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </Typography>
  </Box>
);

const RecentPredictionsCard = ({ t }: CardWithTProps) => (
  <SectionCard
    title={t('recentPredictionsTitle')}
    rightSlot={
      <AppButton
        component={Link}
        href="/predictions"
        variant="tertiary"
        sx={{ fontSize: '0.625rem', minHeight: 'unset', px: 0.75, py: 0.25 }}
      >
        {t('seeAll')}
      </AppButton>
    }
  >
    <Stack spacing={2}>
      {RECENT_PREDICTIONS.map((p) => {
        const HitIcon = p.hit ? CheckCircleOutlineIcon : CancelOutlinedIcon;
        const hitColor = p.hit ? tokens.success : tokens.error;
        return (
          <Stack key={p.id} direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1.5,
                bgcolor: `${hitColor}1F`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HitIcon sx={{ fontSize: 18, color: hitColor }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: tokens.onSurface,
                  lineHeight: 1.2,
                }}
              >
                {p.match}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.625rem',
                  color: tokens.onSurfaceVariant,
                  mt: 0.25,
                  mb: 0.5,
                }}
              >
                {p.tournament}
              </Typography>
              <Chip
                label={
                  p.points > 0
                    ? t('predictionPointsPlus', { points: p.points })
                    : t('predictionPointsZero')
                }
                size="small"
                sx={{
                  bgcolor: `${hitColor}1A`,
                  color: hitColor,
                  height: 18,
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  letterSpacing: 0,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
          </Stack>
        );
      })}
    </Stack>
  </SectionCard>
);

const FriendActivityCard = ({ t }: CardWithTProps) => (
  <SectionCard title={t('friendActivityTitle')}>
    <Stack spacing={1.75}>
      {FRIEND_ACTIVITY.map((item) => {
        const userName = t(`activity.${item.userKey}`);
        const accent = colorForId(item.id);
        return (
          <Stack key={item.id} direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accent}, ${tokens.surfaceContainerHigh})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tokens.onSurface,
                fontWeight: 800,
                fontSize: '0.625rem',
                flexShrink: 0,
              }}
            >
              {getInitials(userName)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurface, lineHeight: 1.4 }}>
                <Box component="span" sx={{ fontWeight: 800 }}>
                  {userName}
                </Box>{' '}
                {t(`activity.${item.textKey}`)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.625rem',
                  color: tokens.onSurfaceVariant,
                  mt: 0.25,
                }}
              >
                {t(`activity.${item.timeKey}`)}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  </SectionCard>
);
