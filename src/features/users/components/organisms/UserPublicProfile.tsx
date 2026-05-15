'use client';

import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { getAvatarColor, getInitials } from '@shared/utils/string';
import { getPublicProfile } from '../../data/publicProfiles';

interface UserPublicProfileProps {
  userId: string;
}

const UserPublicProfile = ({ userId }: UserPublicProfileProps) => {
  const t = useTranslations('userProfile');
  const profile = getPublicProfile(userId);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <AppButton
          component={Link}
          href="/groups"
          variant="tertiary"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          sx={{ fontSize: '0.6875rem', minHeight: 'unset', px: 1, py: 0.5 }}
        >
          {t('backToGroups')}
        </AppButton>
      </Box>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: `1px solid ${tokens.outlineVariant}1A`,
          minHeight: { xs: 200, md: 240 },
          mb: 4,
        }}
      >
        <Box
          component="img"
          src="/group-banner.png"
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
            zIndex: 0,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 0%, ${tokens.surfaceContainerLow}99 60%, ${tokens.surfaceContainerLow} 100%), radial-gradient(circle at 0% 0%, ${tokens.primaryContainer}33 0%, transparent 50%)`,
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: { xs: 2, md: 3 },
            p: { xs: 3, md: 4 },
            height: '100%',
            minHeight: { xs: 200, md: 240 },
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            sx={{
              width: { xs: 88, md: 120 },
              height: { xs: 88, md: 120 },
              bgcolor: getAvatarColor(profile.name),
              border: `4px solid ${tokens.surfaceContainerLow}`,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 900,
              color: tokens.onSurface,
              boxShadow: `0 8px 32px ${tokens.background}CC`,
            }}
          >
            {getInitials(profile.name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip
              label={t('publicProfileLabel')}
              size="small"
              sx={{
                bgcolor: `${tokens.primaryContainer}33`,
                color: tokens.primary,
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                height: 20,
                mb: 1,
                border: `1px solid ${tokens.primary}33`,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: '1.875rem', md: '2.5rem' },
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                lineHeight: 1,
                color: tokens.onSurface,
                mb: 0.5,
              }}
            >
              {profile.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: tokens.onSurfaceVariant, fontSize: '0.8125rem' }}
            >
              {t('memberSince', { date: profile.memberSince })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <StatCard
          label={t('totalPoints')}
          value={profile.totalPoints.toLocaleString()}
          Icon={LeaderboardIcon}
          accent={tokens.primary}
        />
        <StatCard
          label={t('accuracy')}
          value={`${profile.accuracy}%`}
          Icon={WhatshotIcon}
          accent={tokens.secondary}
        />
        <StatCard
          label={t('predictionsMade')}
          value={profile.predictions.toLocaleString()}
          Icon={SportsSoccerIcon}
          accent={tokens.tertiary}
        />
        <StatCard
          label={t('streak')}
          value={`${profile.streak} 🔥`}
          Icon={WhatshotIcon}
          accent={tokens.secondary}
        />
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AppCard>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <GroupsIcon sx={{ color: tokens.primary, fontSize: 18 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: tokens.onSurface,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t('sharedGroupsTitle')}
                </Typography>
              </Stack>
              {profile.sharedGroups.length === 0 ? (
                <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                  {t('sharedGroupsEmpty')}
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {profile.sharedGroups.map((group) => (
                    <Box
                      key={group.id}
                      component={Link}
                      href={`/groups/${group.id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: '10px',
                        bgcolor: tokens.surfaceContainerLowest,
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background 200ms ease',
                        '&:hover': { bgcolor: tokens.surfaceContainerHigh },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: tokens.ctaGradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: tokens.onSurface,
                          fontWeight: 800,
                          fontSize: '0.8125rem',
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
                        >
                          {group.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6875rem', color: tokens.onSurfaceVariant }}>
                          {t('rankInGroup', { rank: group.rank })}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </AppCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AppCard>
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CalendarMonthIcon sx={{ color: tokens.primary, fontSize: 18 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: tokens.onSurface,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t('recentPredictionsTitle')}
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {profile.recentPredictions.map((p) => (
                  <Stack
                    key={p.id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ gap: 1 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: tokens.onSurface,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.match}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: tokens.onSurfaceVariant }}>
                        {p.tournament}
                      </Typography>
                    </Box>
                    <Chip
                      label={p.hit ? t('hit', { points: p.points }) : t('miss')}
                      size="small"
                      sx={{
                        bgcolor: p.hit ? `${tokens.success}1A` : `${tokens.error}1A`,
                        color: p.hit ? tokens.success : tokens.error,
                        fontSize: '0.625rem',
                        height: 20,
                        fontWeight: 800,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Box>
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  Icon: typeof LeaderboardIcon;
  accent: string;
}

const StatCard = ({ label, value, Icon, accent }: StatCardProps) => (
  <Grid size={{ xs: 6, md: 3 }}>
    <Box
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '14px',
        p: 2,
        border: `1px solid ${tokens.outlineVariant}1A`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': { boxShadow: tokens.glowHover },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -32,
          right: -32,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: `${accent}14`,
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
        <Icon sx={{ fontSize: 16, color: accent }} />
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.625rem',
            color: tokens.onSurfaceVariant,
            fontWeight: 700,
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: { xs: '1.5rem', md: '1.875rem' },
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.03em',
          color: tokens.onSurface,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Grid>
);

export default UserPublicProfile;
