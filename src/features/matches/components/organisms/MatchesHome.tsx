'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
<<<<<<< HEAD
import AddIcon from '@mui/icons-material/Add';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
=======
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useGetAvailableTournaments } from '@features/tournaments';
>>>>>>> origin/develop
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
import {
  PredictionDrawer,
  type PredictionDrawerMatch,
  type PredictionDrawerScore,
} from '@features/predictions';
import { getCountryFlagUrl } from '@shared/utils/flag';
import type { Match } from '../../types';

const toPredictionDrawerMatch = (match: Match): PredictionDrawerMatch => ({
  id: match.id,
  homeTeam: match.homeTeam.name,
  homeTeamFlag: getCountryFlagUrl(match.homeTeam.code),
  awayTeam: match.awayTeam.name,
  awayTeamFlag: getCountryFlagUrl(match.awayTeam.code),
  kickoffAt: match.kickoffAt,
});

const MatchesHome = () => {
  const t = useTranslations('matches');
  const tAdmin = useTranslations('matchesAdmin');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { isAdmin } = useAuthSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
<<<<<<< HEAD
  const { query, setStatusFilter, setTeam, setWeek, setPage, loading, items, total, resetFilters } =
    useMatchesList(10);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
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
  const [predictionsById, setPredictionsById] = useState<Record<string, PredictionDrawerScore>>(
    () =>
      items.reduce<Record<string, PredictionDrawerScore>>((acc, match) => {
        if (match.prediction) {
          acc[match.id] = { homeGoals: match.prediction.home, awayGoals: match.prediction.away };
        }
        return acc;
      }, {}),
  );
=======
>>>>>>> origin/develop

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
  const displayedItems = useMemo(
    () =>
      items.map((match) => ({
        ...match,
        prediction: (() => {
          const saved = predictionsById[match.id];
          if (saved) return { home: saved.homeGoals, away: saved.awayGoals };
          if (match.prediction) return match.prediction;
          return undefined;
        })(),
      })),
    [items, predictionsById],
  );

  const selectedMatch = useMemo(
    () => displayedItems.find((match) => match.id === selectedMatchId) ?? null,
    [displayedItems, selectedMatchId],
  );

  const selectedDrawerMatch = useMemo(
    () => (selectedMatch ? toPredictionDrawerMatch(selectedMatch) : null),
    [selectedMatch],
  );

  const selectedDrawerScore = useMemo<PredictionDrawerScore | undefined>(() => {
    if (!selectedMatch) return undefined;
    const prediction = selectedMatch.prediction;
    if (!prediction) return undefined;
    return { homeGoals: prediction.home, awayGoals: prediction.away };
  }, [selectedMatch]);

  const handleOpenPrediction = useCallback((match: Match) => {
    setSelectedMatchId(match.id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedMatchId(null);
  }, []);

  const handleSavePrediction = useCallback(
    async (matchId: string, values: PredictionDrawerScore) => {
      setPredictionsById((prev) => ({ ...prev, [matchId]: values }));
      return true;
    },
    [],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {isAdmin && (
<<<<<<< HEAD
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
=======
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mb: 2 }}>
>>>>>>> origin/develop
          <AppButton startIcon={<AddIcon />} onClick={() => setCreateDrawerOpen(true)}>
            {tAdmin('submit')}
          </AppButton>
        </Stack>
      )}

<<<<<<< HEAD
=======
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

>>>>>>> origin/develop
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
          items={displayedItems}
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
<<<<<<< HEAD
              onAddPrediction={handleOpenPrediction}
              onEditPrediction={handleOpenPrediction}
=======
              showPrediction={!isAdmin}
              actions={
                isAdmin ? (
                  <MatchAdminActions
                    matchId={m.id}
                    tournamentId={tournamentId}
                    matchStatus={m.status}
                    rawStatus={m.rawStatus}
                    homeTeam={m.homeTeam}
                    awayTeam={m.awayTeam}
                    onChanged={reload}
                  />
                ) : undefined
              }
>>>>>>> origin/develop
            />
          )}
        />
      )}

<<<<<<< HEAD
      <PredictionDrawer
        open={!!selectedDrawerMatch}
        match={selectedDrawerMatch}
        initialScore={selectedDrawerScore}
        onClose={handleCloseDrawer}
        onSave={handleSavePrediction}
      />

      {isAdmin && (
        <CreateMatchDrawer open={createDrawerOpen} onClose={() => setCreateDrawerOpen(false)} />
=======
      {isAdmin && (
        <CreateMatchDrawer
          open={createDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
          onCreated={reload}
        />
>>>>>>> origin/develop
      )}
    </Box>
  );
};

export default MatchesHome;
