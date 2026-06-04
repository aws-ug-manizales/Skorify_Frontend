'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

import { tokens } from '@lib/theme/theme';
import { useUserGroups, type UserGroupSummary } from '@features/groups';
import { useAuthSession } from '@features/auth';

type ProfileT = ReturnType<typeof useTranslations<'profile'>>;

// Gradient-orb card used across every section so the profile reads as a
// single coherent surface (mirrors the doxum card stack rhythm).
const cardSx: SxProps<Theme> = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 2,
  border: `1px solid ${tokens.outlineVariant}33`,
  background: `radial-gradient(circle at 100% 0%, ${tokens.primary}14, transparent 55%), radial-gradient(circle at 0% 100%, ${tokens.secondary}12, transparent 55%), ${tokens.surfaceContainerLow}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 12px 32px -18px rgba(0,0,0,0.7)',
  p: { xs: 2.5, md: 3.5 },
};

const eyebrowSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: tokens.onSurfaceVariant,
};

const metaLabelSx: SxProps<Theme> = {
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: tokens.onSurfaceVariant,
};

export default function ProfileDashboard() {
  const t = useTranslations('profile');
  const { session } = useAuthSession();
  const { groups, isLoading: groupsLoading } = useUserGroups();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={{ xs: 2.5, md: 4 }} sx={{ width: '100%', maxWidth: 720 }}>
        {/* Welcome header */}
        <Stack spacing={0.75}>
          <Typography sx={eyebrowSx}>{t('eyebrow')}</Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {t('title')}
          </Typography>
          <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.95rem', maxWidth: 520 }}>
            {t('subtitle')}
          </Typography>
        </Stack>

        <IdentityCard displayName={session?.user.displayName ?? ''} t={t} />
        <AccountCard
          email={session?.user.email ?? ''}
          emailVerified={session?.user.emailVerified ?? false}
          provider={session?.user.provider ?? 'email'}
          createdAt={session?.createdAt}
          t={t}
        />
        <GroupsCard groups={groups} loading={groupsLoading} t={t} />
      </Stack>
    </Box>
  );
}

interface IdentityCardProps {
  displayName: string;
  t: ProfileT;
}

const IdentityCard = ({ displayName, t }: IdentityCardProps) => (
  <Box component="section" sx={cardSx}>
    <Stack spacing={0.5} sx={{ mb: 2.5 }}>
      <Typography sx={{ fontSize: '1.125rem', fontWeight: 800 }}>{t('identityTitle')}</Typography>
      <Typography sx={{ fontSize: '0.85rem', color: tokens.onSurfaceVariant }}>
        {t('identitySubtitle')}
      </Typography>
    </Stack>

    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      alignItems={{ xs: 'center', sm: 'flex-start' }}
    >
      <Box sx={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: -8,
            background: tokens.ctaGradient,
            borderRadius: '50%',
            opacity: 0.18,
            filter: 'blur(20px)',
          }}
        />
        <Avatar
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: tokens.surfaceContainerHigh,
            border: `1px solid ${tokens.outlineVariant}40`,
          }}
        >
          <PersonIcon sx={{ color: tokens.primary, fontSize: 44 }} />
        </Avatar>
      </Box>

      <Stack spacing={0.75} sx={{ flex: 1, width: '100%', minWidth: 0 }}>
        <Typography sx={metaLabelSx}>{t('displayNameLabel')}</Typography>
        <TextField
          value={displayName}
          fullWidth
          size="small"
          disabled
          slotProps={{ input: { readOnly: true } }}
        />
        <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
          {t('displayNameHint')}
        </Typography>
      </Stack>
    </Stack>

    {/* Photo personalization is on the roadmap — invite the user to it
          instead of a non-functional upload control. */}
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: 1.5,
        border: `1px solid ${tokens.primary}33`,
        background: `linear-gradient(135deg, ${tokens.primary}14, ${tokens.secondary}10)`,
      }}
    >
      <AutoAwesomeIcon sx={{ color: tokens.primary, fontSize: 20, mt: 0.25, flexShrink: 0 }} />
      <Stack spacing={0.25}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
          {t('photoComingSoonTitle')}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: tokens.onSurfaceVariant, lineHeight: 1.5 }}>
          {t('photoComingSoonBody')}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);

interface AccountCardProps {
  email: string;
  emailVerified: boolean;
  provider: 'email' | 'google';
  createdAt?: string;
  t: ProfileT;
}

const AccountCard = ({ email, emailVerified, provider, createdAt, t }: AccountCardProps) => {
  const locale = useLocale();
  const memberSince = useMemo(() => {
    if (!createdAt) return null;
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }, [createdAt, locale]);

  return (
    <Box component="section" sx={cardSx}>
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 800 }}>{t('accountTitle')}</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: tokens.onSurfaceVariant }}>
          {t('accountSubtitle')}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <MetaRow icon={<EmailIcon />} label={t('emailLabel')}>
          <Typography sx={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{email}</Typography>
          <Chip
            label={emailVerified ? t('emailVerified') : t('emailUnverified')}
            size="small"
            sx={pillSx(emailVerified ? 'ok' : 'warn')}
          />
        </MetaRow>

        <MetaRow
          icon={provider === 'google' ? <GoogleIcon /> : <EmailIcon />}
          label={t('signInMethodLabel')}
        >
          <Typography sx={{ fontSize: '0.9rem' }}>
            {provider === 'google' ? t('providerGoogle') : t('providerEmail')}
          </Typography>
        </MetaRow>

        {memberSince && (
          <MetaRow icon={<CalendarTodayIcon />} label={t('memberSinceLabel')}>
            <Typography sx={{ fontSize: '0.9rem' }}>{memberSince}</Typography>
          </MetaRow>
        )}
      </Stack>
    </Box>
  );
};

const pillSx = (variant: 'ok' | 'warn'): SxProps<Theme> => {
  const color = variant === 'ok' ? tokens.success : tokens.secondary;
  return {
    bgcolor: `${color}1f`,
    color,
    border: `1px solid ${color}4d`,
    fontWeight: 700,
    height: 22,
    fontSize: '0.6875rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };
};

interface MetaRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const MetaRow = ({ icon, label, children }: MetaRowProps) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 1.5,
        flexShrink: 0,
        bgcolor: tokens.surfaceContainerHigh,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tokens.onSurfaceVariant,
        '& svg': { fontSize: 18 },
      }}
    >
      {icon}
    </Box>
    <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
      <Typography sx={metaLabelSx}>{label}</Typography>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        {children}
      </Stack>
    </Stack>
  </Stack>
);

interface GroupsCardProps {
  groups: UserGroupSummary[];
  loading: boolean;
  t: ProfileT;
}

const GroupsCard = ({ groups, loading, t }: GroupsCardProps) => (
  <Box component="section" sx={cardSx}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2, minHeight: 24 }}
    >
      <Typography sx={{ fontSize: '1.125rem', fontWeight: 800 }}>{t('groups.title')}</Typography>
      {groups.length > 0 && !loading && (
        <Typography
          component={Link}
          href="/groups"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: tokens.primary,
            textDecoration: 'none',
            letterSpacing: '0.04em',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('groups.viewAll')}
        </Typography>
      )}
    </Stack>

    {loading ? (
      <Stack spacing={1}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
      </Stack>
    ) : groups.length === 0 ? (
      <Stack alignItems="center" spacing={1.25} sx={{ py: 2, px: 1, textAlign: 'center' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: tokens.surfaceContainerHigh,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GroupsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 24 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {t('groups.emptyTitle')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: tokens.onSurfaceVariant, maxWidth: 280, lineHeight: 1.45 }}
        >
          {t('groups.emptySubtitle')}
        </Typography>
      </Stack>
    ) : (
      <Stack spacing={0.75}>
        {groups.map((group) => (
          <ListItemButton
            key={group.id}
            component={Link}
            href={`/groups/${group.id}`}
            sx={{
              borderRadius: 1.5,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${tokens.outlineVariant}26`,
              px: 1.5,
              py: 1,
              minHeight: 52,
              gap: 1,
              transition: 'background-color 200ms ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={group.name}
              >
                {group.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: tokens.onSurfaceVariant, fontSize: '0.75rem' }}
              >
                {t('groups.members', { count: group.memberCount })}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
              <Chip
                label={`#${group.rank}`}
                size="small"
                sx={{
                  bgcolor: `${tokens.secondary}26`,
                  color: tokens.secondary,
                  fontWeight: 800,
                  height: 22,
                  fontSize: '0.6875rem',
                }}
              />
              <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 18 }} />
            </Stack>
          </ListItemButton>
        ))}
      </Stack>
    )}
  </Box>
);
