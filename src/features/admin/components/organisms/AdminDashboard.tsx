'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PageHeader from '@shared/components/molecules/PageHeader';
import StatCard from '@shared/components/molecules/StatCard';
import { tokens } from '@lib/theme/theme';
import { useGetAvailableUsers } from '@features/users/hooks/useGetAvailableUsers';
import { useGetAvailableTournaments } from '@features/tournaments/hooks/useGetAvailableTournaments';
import type { TournamentDto } from '@lib/api/skorify';

// A tournament is "in progress" when now falls within its (valid) date range
// and it isn't soft-deleted. Mirrors the status logic used in TournamentsHome.
const isTournamentInProgress = (dto: TournamentDto, now: Date): boolean => {
  if (dto.deletedAt) return false;
  const start = dto.startDate ? new Date(dto.startDate) : null;
  const end = dto.endDate ? new Date(dto.endDate) : null;
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  return now >= start && now <= end;
};

const AdminDashboard = () => {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { data: users, isLoading: usersLoading } = useGetAvailableUsers();
  const { data: tournaments, isLoading: tournamentsLoading } = useGetAvailableTournaments();

  const totalUsers = users.length;
  const activeUsers = useMemo(() => users.filter((u) => !u.deletedAt).length, [users]);
  const activeTournaments = useMemo(() => {
    const now = new Date();
    return tournaments.filter((dto) => isTournamentInProgress(dto, now)).length;
  }, [tournaments]);

  const fmt = (value: number) => value.toLocaleString(locale);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<AdminPanelSettingsIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t('statsUsersTotal')}
            value={fmt(totalUsers)}
            icon={<PeopleIcon />}
            accent={tokens.primary}
            loading={usersLoading && totalUsers === 0}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t('statsUsersActive')}
            value={fmt(activeUsers)}
            icon={<HowToRegIcon />}
            accent={tokens.success}
            loading={usersLoading && totalUsers === 0}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t('statsTournamentsActive')}
            value={fmt(activeTournaments)}
            icon={<EmojiEventsIcon />}
            accent={tokens.info}
            hint={t('statsTournamentsActiveHint', { total: fmt(tournaments.length) })}
            loading={tournamentsLoading && tournaments.length === 0}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
