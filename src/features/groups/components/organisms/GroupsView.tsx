'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { tokens, avatarPalette } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import PageHeader from '@shared/components/molecules/PageHeader';
import { getInitials } from '@shared/utils/string';
import CreateGroupDrawer from './CreateGroupDrawer';
import { useUserGroups, type UserGroupSummary } from '../../hooks/useUserGroups';

const numberFormatter = new Intl.NumberFormat('es-CO');

const colorForGroup = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const GroupsView = () => {
  const t = useTranslations('groups');
  const { groups, isLoading } = useUserGroups();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // Open the drawer on initial mount when arriving with `?create=1` (linked
  // from the user dashboard CTA). The URL param is read once via lazy init —
  // avoids cascading renders that setting state inside an effect would cause.
  const [drawerOpen, setDrawerOpen] = useState(() => searchParams.get('create') === '1');

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;
    // Strip the param now that it has been consumed, so reloads/back-nav
    // don't keep re-opening the drawer.
    router.replace(pathname, { scroll: false });
    // Intentionally mount-only — subsequent URL changes shouldn't reopen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <PageHeader
        title={t('title')}
        subtitle={isLoading ? t('subtitle') : t('listSubtitle', { count: groups.length })}
        icon={<GroupsIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />}
        rightSlot={
          <AppButton startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
            {t('create')}
          </AppButton>
        }
      />

      {isLoading ? (
        <Grid container spacing={2.5}>
          {[0, 1, 2].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={196} />
            </Grid>
          ))}
        </Grid>
      ) : groups.length === 0 ? (
        <EmptyState onCreate={() => setDrawerOpen(true)} t={t} />
      ) : (
        <Grid container spacing={2.5}>
          {groups.map((group) => (
            <Grid key={group.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <GroupCard group={group} t={t} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateGroupDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
};

export default GroupsView;

interface GroupCardProps {
  group: UserGroupSummary;
  t: ReturnType<typeof useTranslations<'groups'>>;
}

const GroupCard = ({ group, t }: GroupCardProps) => {
  const accent = colorForGroup(group.id);
  return (
    <AppCard variant="interactive" href={`/groups/${group.id}`} sx={{ height: '100%' }}>
      <Stack sx={{ p: 2.5, height: '100%' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${accent}, ${tokens.secondaryContainer})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.onSurface,
              fontWeight: 800,
              fontSize: '1.125rem',
              flexShrink: 0,
            }}
          >
            {getInitials(group.name)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 800,
                color: tokens.onSurface,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={group.name}
            >
              {group.name}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ color: tokens.onSurfaceVariant, mt: 0.5 }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} />
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {t('memberCount', { count: group.memberCount })}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {group.description && (
          <Typography
            variant="body2"
            sx={{
              color: tokens.onSurfaceVariant,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 36,
            }}
          >
            {group.description}
          </Typography>
        )}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 'auto', pt: 1, borderTop: `1px solid ${tokens.outlineVariant}1F` }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Chip
              label={`#${group.rank}`}
              size="small"
              sx={{
                bgcolor: `${tokens.secondary}26`,
                color: tokens.secondary,
                fontWeight: 800,
                height: 24,
                fontSize: '0.75rem',
                letterSpacing: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: tokens.onSurface,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {numberFormatter.format(group.points)}
              </Typography>
              <Typography
                variant="overline"
                sx={{
                  color: tokens.onSurfaceVariant,
                  fontWeight: 700,
                  fontSize: '0.625rem',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                }}
              >
                {t('pointsLabel')}
              </Typography>
            </Box>
          </Stack>
          <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 20 }} />
        </Stack>
      </Stack>
    </AppCard>
  );
};

interface EmptyStateProps {
  onCreate: () => void;
  t: ReturnType<typeof useTranslations<'groups'>>;
}

const EmptyState = ({ onCreate, t }: EmptyStateProps) => (
  <AppCard>
    <Stack alignItems="center" spacing={2} sx={{ py: 6, px: 3, textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: tokens.surfaceContainerHigh,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GroupsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 40 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {t('pageEmptyTitle')}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, maxWidth: 360 }}>
        {t('pageEmptySubtitle')}
      </Typography>
      <Box sx={{ pt: 1 }}>
        <AppButton startIcon={<AddIcon />} onClick={onCreate}>
          {t('pageEmptyCta')}
        </AppButton>
      </Box>
    </Stack>
  </AppCard>
);
