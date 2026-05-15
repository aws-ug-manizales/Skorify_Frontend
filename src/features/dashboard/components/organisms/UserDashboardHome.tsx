'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { tokens, avatarPalette } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { getInitials } from '@shared/utils/string';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useUserGroups, type UserGroupSummary } from '@features/groups/hooks/useUserGroups';
import JoinGroupDialog from '@features/groups/components/organisms/JoinGroupDialog';
import { useMatchesList } from '@features/matches/hooks/useMatchesList';
import MatchCard from '@features/matches/components/molecules/MatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';

const numberFormatter = new Intl.NumberFormat('es-CO');

const MOCK_RANKING = [
  { id: 'r1', name: 'MarcG10', points: 4820 },
  { id: 'r2', name: 'Elena_FUT', points: 4795 },
  { id: 'r3', name: 'Juan_P', points: 4610 },
] as const;

const MOCK_RECENT_PREDICTIONS = [
  { id: 'p1', match: 'Bayern 3 - 0 Lazio', tournament: 'Champions League', points: 100, hit: true },
  { id: 'p2', match: 'PSG 1 - 1 Nice', tournament: 'Ligue 1', points: 0, hit: false },
  { id: 'p3', match: 'Inter 1 - 0 Genoa', tournament: 'Serie A', points: 50, hit: true },
] as const;

const MOCK_FRIEND_ACTIVITY = [
  { id: 'a1', userKey: 'friend1Name', textKey: 'friend1Text', timeKey: 'friend1Time' },
  { id: 'a2', userKey: 'friend2Name', textKey: 'friend2Text', timeKey: 'friend2Time' },
  { id: 'a3', userKey: 'friend3Name', textKey: 'friend3Text', timeKey: 'friend3Time' },
] as const;

const MOCK_CURRENT_USER_RANK = { rank: 42, points: 3210 } as const;
const MOCK_USER_STREAK = 5;
const MOCK_WEEK_POINTS = 450;
const MOCK_ACCURACY = 68;

const colorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const UserDashboardHome = () => {
  const t = useTranslations('userDashboard');
  const tMatches = useTranslations('matches');
  const locale = useLocale();
  const { session } = useAuthSession();
  const { groups, isLoading: groupsLoading } = useUserGroups();
  const { loading: matchesLoading, items: matches } = useMatchesList(3);

  const displayName = session?.user.displayName ?? t('defaultUser');
  const topMatches = matches.slice(0, 3);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <WelcomeBanner
        displayName={displayName}
        streak={MOCK_USER_STREAK}
        t={t}
        onJoinGroup={() => setJoinDialogOpen(true)}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={3}>
            <MyGroupsCard groups={groups} loading={groupsLoading} t={t} />
            <RankingCard t={t} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack spacing={3}>
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
                  {t('upcomingMatches')}
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
              <AppButton
                component={Link}
                href="/matches"
                variant="tertiary"
                sx={{ fontSize: '0.6875rem' }}
              >
                {t('viewAllMatches')}
              </AppButton>
            </Stack>

            {matchesLoading ? (
              <Stack spacing={2}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} variant="rounded" height={220} />
                ))}
              </Stack>
            ) : topMatches.length === 0 ? (
              <AppCard>
                <Stack alignItems="center" spacing={1.5} sx={{ py: 5, px: 3, textAlign: 'center' }}>
                  <SportsSoccerIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 40 }} />
                  <Typography sx={{ color: tokens.onSurfaceVariant }}>
                    {tMatches('noMatches')}
                  </Typography>
                </Stack>
              </AppCard>
            ) : (
              <Stack spacing={2}>
                {topMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    tournamentLabel={tMatches(match.tournamentKey)}
                    stageLabel={tMatches(match.stageKey)}
                    statusLabel={tMatches(match.status)}
                    kickoffLabel={formatKickoff(match.kickoffAt, locale)}
                    vsLabel={tMatches('vs')}
                    addPredictionLabel={tMatches('addPrediction')}
                    editPredictionLabel={tMatches('editPrediction')}
                    predictionLabel={tMatches('predictionLabel')}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={3}>
            <PointsSummaryCard t={t} />
            <RecentPredictionsCard t={t} />
            <FriendActivityCard t={t} />
          </Stack>
        </Grid>
      </Grid>

      <JoinGroupDialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} />
    </Box>
  );
};

export default UserDashboardHome;

interface WelcomeBannerProps {
  displayName: string;
  streak: number;
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
  onJoinGroup: () => void;
}

const WelcomeBanner = ({ displayName, streak, t, onJoinGroup }: WelcomeBannerProps) => (
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
        <AppButton
          component={Link}
          href="/groups?create=1"
          startIcon={<AddCircleOutlineIcon />}
          size="large"
        >
          {t('createGroup')}
        </AppButton>
        <AppButton
          onClick={onJoinGroup}
          variant="secondary"
          startIcon={<GroupAddIcon />}
          size="large"
        >
          {t('joinGroup')}
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

interface CardWithTProps {
  t: ReturnType<typeof useTranslations<'userDashboard'>>;
}

const RankingCard = ({ t }: CardWithTProps) => (
  <SectionCard title={t('rankingTitle')}>
    <Stack spacing={1.5}>
      {MOCK_RANKING.map((row, idx) => {
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
            {MOCK_CURRENT_USER_RANK.rank}
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
          {numberFormatter.format(MOCK_CURRENT_USER_RANK.points)} {t('pointsShort')}
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
            {numberFormatter.format(MOCK_CURRENT_USER_RANK.points)}
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
              value={`+${MOCK_WEEK_POINTS}`}
              color={tokens.primary}
              Icon={WhatshotIcon}
            />
          </Grid>
          <Grid size={6}>
            <StatTile
              label={t('accuracyLabel')}
              value={`${MOCK_ACCURACY}%`}
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
      {MOCK_RECENT_PREDICTIONS.map((p) => {
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
      {MOCK_FRIEND_ACTIVITY.map((item) => {
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
