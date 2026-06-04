'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useGetAvailableTournaments } from '@features/tournaments';
import { formatKickoff } from '../../utils/formatKickoff';
import CreateMatchDrawer from './CreateMatchDrawer';
import MatchCard from '../molecules/MatchCard';
import MatchAdminActions from '../molecules/MatchAdminActions';
import MatchesEmptyState from '../molecules/MatchesEmptyState';
import MatchesHeader from '../molecules/MatchesHeader';
import PaginatedMatchesGrid from '../molecules/PaginatedMatchesGrid';
import MatchesToolbar from '../molecules/MatchesToolbar';
import { useMatchesList } from '../../hooks/useMatchesList';
import { getWorldCupWeekOptions2026 } from '../../filters/weekOptions';

const MatchesHome = () => {
  const t = useTranslations('matches');
  const tAdmin = useTranslations('matchesAdmin');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { isAdmin } = useAuthSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { data: tournaments } = useGetAvailableTournaments();
  const [tournamentId, setTournamentId] = useState<string>(
    () => searchParams.get('tournamentId') ?? '',
  );
  const selectedTournamentName =
    tournaments.find((tournament) => tournament.id === tournamentId)?.name ?? '';

  const handleTournamentChange = useCallback(
    (id: string) => {
      setTournamentId(id);
      const next = new URLSearchParams(searchParams.toString());
      if (id) next.set('tournamentId', id);
      else next.delete('tournamentId');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const {
    query,
    setStatusFilter,
    setTeam,
    setWeek,
    setPage,
    loading,
    items,
    total,
    resetFilters,
    reload,
  } = useMatchesList(10, 'filterAll', tournamentId || undefined);
  // Open the drawer on mount when arriving with `?create=1` (linked from the
  // admin nav). Reads the param once via lazy init to avoid effect cascades.
  const [createDrawerOpen, setCreateDrawerOpen] = useState(
    () => searchParams.get('create') === '1',
  );

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;
    // Consume the param so reloads/back-nav don't reopen the drawer.
    router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The matches endpoint already returns resolved team names + shields inline.
  const monthOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {isAdmin && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mb: 2 }}>
          <AppButton startIcon={<AddIcon />} onClick={() => setCreateDrawerOpen(true)}>
            {tAdmin('submit')}
          </AppButton>
        </Stack>
      )}

      <Stack sx={{ mb: 3, maxWidth: { sm: 360 } }}>
        <TextField
          select
          size="small"
          label={tAdmin('tournamentLabel')}
          value={tournamentId}
          onChange={(e) => handleTournamentChange(e.target.value)}
          fullWidth
        >
          <MenuItem value="">{tAdmin('tournamentPlaceholder')}</MenuItem>
          {tournaments.map((tournament) => (
            <MenuItem key={tournament.id} value={tournament.id}>
              {tournament.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <MatchesHeader
        title={t('title')}
        subtitle={`${total} ${t('matchesCount')}`}
        activeFilter={query.statusFilter}
        onFilterChange={setStatusFilter}
        filterLabelFor={(key) => t(key)}
      />

      <MatchesToolbar
        teamValue={query.team}
        onTeamChange={setTeam}
        teamPlaceholder={t('teamFilterPlaceholder')}
        weekValue={query.week}
        onMonthChange={setWeek}
        monthLabel={t('date')}
        monthAllLabel={t('dateAll')}
        monthOptions={monthOptions}
        clearLabel={t('clearFilters')}
        onClear={resetFilters}
      />

      {!tournamentId ? (
        <MatchesEmptyState message={tAdmin('actions.selectTournamentPrompt')} />
      ) : loading ? (
        <MatchesEmptyState message={tCommon('loading')} />
      ) : total === 0 ? (
        <MatchesEmptyState message={t('noMatches')} />
      ) : (
        <PaginatedMatchesGrid
          items={items}
          page={query.page}
          totalItems={total}
          pageSize={query.pageSize}
          onPageChange={setPage}
          getKey={(m) => m.id}
          gridSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
          renderItem={(m) => (
            <MatchCard
              match={m}
              tournamentLabel={selectedTournamentName}
              stageLabel={m.stageKey === 'finals' ? t('stageFinals') : t('stageGroup')}
              statusLabel={t(m.status)}
              kickoffLabel={formatKickoff(m.kickoffAt, locale)}
              vsLabel={t('vs')}
              predictionLabel={t('predictionLabel')}
              actions={
                isAdmin ? (
                  <MatchAdminActions
                    matchId={m.id}
                    tournamentId={tournamentId}
                    matchStatus={m.status}
                    homeTeam={m.homeTeam}
                    awayTeam={m.awayTeam}
                    onChanged={reload}
                  />
                ) : undefined
              }
            />
          )}
        />
      )}

      {isAdmin && (
        <CreateMatchDrawer
          open={createDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
          onCreated={reload}
        />
      )}
    </Box>
  );
};

export default MatchesHome;
