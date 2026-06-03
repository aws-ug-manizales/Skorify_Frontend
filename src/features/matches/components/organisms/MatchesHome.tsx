'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import AppButton from '@shared/components/atoms/AppButton';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
import { useGetUserEnrollmentsByUserId } from '@features/groups/hooks/useGetUserEnrollmentsByUserId';
import { useGetMatchesByTournamentId } from '../../hooks/useGetMatchesByTournamentId';
import { useGetTournamentById } from '@features/tournaments/hooks/useGetTournamentById';
import { useGetTeamsByIds } from '@features/teams';
import { formatKickoff } from '../../utils/formatKickoff';
import CreateMatchDrawer from './CreateMatchDrawer';
import MatchCard from '../molecules/MatchCard';
import MatchesEmptyState from '../molecules/MatchesEmptyState';
import MatchesHeader from '../molecules/MatchesHeader';
import PaginatedMatchesGrid from '../molecules/PaginatedMatchesGrid';
import MatchesToolbar from '../molecules/MatchesToolbar';
import { getWorldCupWeekOptions2026 } from '../../filters/weekOptions';
import { worldCupWeekToFromToIso, statusFromFilter } from '../../filters/MatchesQuery';
import type { MatchesFilterKey } from '../molecules/MatchesFilters';
import {
  PredictionDrawer,
  type PredictionDrawerMatch,
  type PredictionDrawerScore,
} from '@features/predictions';
import { getCountryFlagUrl } from '@shared/utils/flag';
import type { Match, MatchStatus } from '../../types';
import type { MatchDto } from '@lib/api/skorify';

const mapStatus = (status: MatchDto['status']): MatchStatus => {
  if (status === 'in_progress') return 'live';
  if (status === 'finished' || status === 'cancelled') return 'finished';
  return 'upcoming';
};

const toPredictionDrawerMatch = (match: Match): PredictionDrawerMatch => ({
  id: match.id,
  homeTeam: match.homeTeam.name,
  homeTeamFlag: getCountryFlagUrl(match.homeTeam.code),
  awayTeam: match.awayTeam.name,
  awayTeamFlag: getCountryFlagUrl(match.awayTeam.code),
  kickoffAt: match.kickoffAt,
});

const PAGE_SIZE = 10;

// ── component ──────────────────────────────────────────────────────────────

const MatchesHome = () => {
  const t = useTranslations('matches');
  const tAdmin = useTranslations('matchesAdmin');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { isAdmin } = useAuthSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // ── enrollments → tournamentId ──────────────────────────────────────────
  const userId = useCurrentUserId();
  const {
    getUserEnrollmentsByUserId,
    data: enrollments,
    isLoading: enrollmentsLoading,
  } = useGetUserEnrollmentsByUserId();

  useEffect(() => {
    if (!userId) return;
    void getUserEnrollmentsByUserId({ userId });
  }, [userId, getUserEnrollmentsByUserId]);

  const tournamentId = enrollments[0]?.tournamentId;

  // ── backend: tournament name ────────────────────────────────────────────
  const { getTournamentById, data: tournament } = useGetTournamentById();

  useEffect(() => {
    if (!tournamentId) return;
    void getTournamentById({ tournamentId });
  }, [tournamentId, getTournamentById]);

  // ── backend: matches by tournament ─────────────────────────────────────
  const { data: backendMatches, isLoading: matchesLoading } = useGetMatchesByTournamentId({
    tournamentId,
  });

  // ── backend: team names ─────────────────────────────────────────────────
  const teamIds = useMemo(() => {
    const ids = new Set<string>();
    backendMatches.forEach((dto) => {
      ids.add(dto.homeTeamId);
      ids.add(dto.awayTeamId);
    });
    return Array.from(ids);
  }, [backendMatches]);

  const { teams: teamsLookup } = useGetTeamsByIds(teamIds);

  // ── map DTOs → Match ────────────────────────────────────────────────────
  const allMatches = useMemo<Match[]>(
    () =>
      [...backendMatches]
        .sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime())
        .map((dto) => {
          const home = teamsLookup[dto.homeTeamId];
          const away = teamsLookup[dto.awayTeamId];
          return {
            id: dto.id,
            tournamentKey: dto.tournamentId,
            stageKey: dto.stage ?? 'group',
            status: mapStatus(dto.status),
            kickoffAt: dto.kickOff,
            homeTeam: { name: home?.name ?? dto.homeTeamId, code: undefined },
            awayTeam: { name: away?.name ?? dto.awayTeamId, code: undefined },
            score:
              typeof dto.homeScore === 'number' && typeof dto.awayScore === 'number'
                ? { home: dto.homeScore, away: dto.awayScore }
                : undefined,
          };
        }),
    [backendMatches, teamsLookup],
  );

  // ── filter state ────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<MatchesFilterKey>('filterAll');
  const [team, setTeam] = useState('');
  const [week, setWeek] = useState('');
  const [page, setPage] = useState(1);

  const resetFilters = useCallback(() => {
    setStatusFilter('filterAll');
    setTeam('');
    setWeek('');
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((f: MatchesFilterKey) => {
    setStatusFilter(f);
    setPage(1);
  }, []);
  const handleTeam = useCallback((v: string) => {
    setTeam(v);
    setPage(1);
  }, []);
  const handleWeek = useCallback((v: string) => {
    setWeek(v);
    setPage(1);
  }, []);

  // ── client-side filter + paginate ───────────────────────────────────────
  const filtered = useMemo(() => {
    const status = statusFromFilter(statusFilter);
    const { from, to } = worldCupWeekToFromToIso(Number(week));
    const fromMs = from ? new Date(from).getTime() : undefined;
    const toMs = to ? new Date(to).getTime() : undefined;
    const q = team.trim().toLowerCase();

    return allMatches.filter((m) => {
      if (status && m.status !== status) return false;
      if (q) {
        const home = `${m.homeTeam.name} ${m.homeTeam.code ?? ''}`.toLowerCase();
        const away = `${m.awayTeam.name} ${m.awayTeam.code ?? ''}`.toLowerCase();
        if (!home.includes(q) && !away.includes(q)) return false;
      }
      const k = new Date(m.kickoffAt).getTime();
      if (fromMs !== undefined && k < fromMs) return false;
      if (toMs !== undefined && k > toMs) return false;
      return true;
    });
  }, [allMatches, statusFilter, team, week]);

  const total = filtered.length;
  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // ── prediction overlay state ────────────────────────────────────────────
  const [predictionsById, setPredictionsById] = useState<Record<string, PredictionDrawerScore>>({});
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const displayedItems = useMemo(
    () =>
      pagedItems.map((match) => ({
        ...match,
        prediction: (() => {
          const saved = predictionsById[match.id];
          if (saved) return { home: saved.homeGoals, away: saved.awayGoals };
          if (match.prediction) return match.prediction;
          return undefined;
        })(),
      })),
    [pagedItems, predictionsById],
  );

  const selectedMatch = useMemo(
    () => displayedItems.find((m) => m.id === selectedMatchId) ?? null,
    [displayedItems, selectedMatchId],
  );

  const selectedDrawerMatch = useMemo(
    () => (selectedMatch ? toPredictionDrawerMatch(selectedMatch) : null),
    [selectedMatch],
  );

  const selectedDrawerScore = useMemo<PredictionDrawerScore | undefined>(() => {
    if (!selectedMatch?.prediction) return undefined;
    return { homeGoals: selectedMatch.prediction.home, awayGoals: selectedMatch.prediction.away };
  }, [selectedMatch]);

  const handleOpenPrediction = useCallback((match: Match) => setSelectedMatchId(match.id), []);
  const handleCloseDrawer = useCallback(() => setSelectedMatchId(null), []);
  const handleSavePrediction = useCallback(
    async (matchId: string, values: PredictionDrawerScore) => {
      setPredictionsById((prev) => ({ ...prev, [matchId]: values }));
      return true;
    },
    [],
  );

  // ── create-match drawer (admin) ─────────────────────────────────────────
  const [createDrawerOpen, setCreateDrawerOpen] = useState(
    () => searchParams.get('create') === '1',
  );

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;
    router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);
  const loading = enrollmentsLoading || matchesLoading;

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {isAdmin && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <AppButton startIcon={<AddIcon />} onClick={() => setCreateDrawerOpen(true)}>
            {tAdmin('submit')}
          </AppButton>
        </Stack>
      )}

      <MatchesHeader
        title={t('title')}
        subtitle={`${total} ${t('matchesCount')}`}
        activeFilter={statusFilter}
        onFilterChange={handleStatusFilter}
        filterLabelFor={(key) => t(key)}
      />

      <MatchesToolbar
        teamValue={team}
        onTeamChange={handleTeam}
        teamPlaceholder={t('teamFilterPlaceholder')}
        weekValue={week}
        onMonthChange={handleWeek}
        monthLabel={t('date')}
        monthAllLabel={t('dateAll')}
        monthOptions={monthOptions}
        clearLabel={t('clearFilters')}
        onClear={resetFilters}
      />

      {loading ? (
        <MatchesEmptyState message={tCommon('loading')} />
      ) : total === 0 ? (
        <MatchesEmptyState message={t('noMatches')} />
      ) : (
        <PaginatedMatchesGrid
          items={displayedItems}
          page={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          getKey={(m) => m.id}
          gridSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
          renderItem={(m) => (
            <MatchCard
              match={m}
              tournamentLabel={tournament?.name ?? m.tournamentKey}
              stageLabel={t(m.stageKey + 'Stage')}
              statusLabel={t(m.status)}
              kickoffLabel={formatKickoff(m.kickoffAt, locale)}
              vsLabel={t('vs')}
              addPredictionLabel={t('addPrediction')}
              editPredictionLabel={t('editPrediction')}
              predictionLabel={t('predictionLabel')}
              onAddPrediction={handleOpenPrediction}
              onEditPrediction={handleOpenPrediction}
            />
          )}
        />
      )}

      <PredictionDrawer
        open={!!selectedDrawerMatch}
        match={selectedDrawerMatch}
        initialScore={selectedDrawerScore}
        onClose={handleCloseDrawer}
        onSave={handleSavePrediction}
      />

      {isAdmin && (
        <CreateMatchDrawer open={createDrawerOpen} onClose={() => setCreateDrawerOpen(false)} />
      )}
    </Box>
  );
};

export default MatchesHome;
