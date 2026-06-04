'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useLocale, useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { useMatchesList } from '@features/matches/hooks/useMatchesList';
import FinishedMatchCard from '@features/matches/components/molecules/FinishedMatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import { useGetAvailableTournaments } from '@features/tournaments';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
import { useGetUserEnrollmentsByUserId } from '@features/groups/hooks/useGetUserEnrollmentsByUserId';
import { useGetPredictionsByUser } from '@features/predictions/hooks/useGetPredictionsByUser';

export default function ResultsPage() {
  const t = useTranslations('results');
  const m = useTranslations('matches');
  const tAdmin = useTranslations('matchesAdmin');
  const locale = useLocale();
  const userId = useCurrentUserId();

  const { data: tournaments } = useGetAvailableTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const tournamentId = selectedTournamentId ?? tournaments[0]?.id ?? '';
  const selectedTournamentName =
    tournaments.find((tournament) => tournament.id === tournamentId)?.name ?? '';

  // Bring every match for the tournament and pick the ones with a recorded
  // score on the front. A "closed" match keeps its scheduled/in_progress
  // status but carries a final score, so filtering by status alone would miss
  // it — we treat "has a score" as "is a result".
  const { items, loading } = useMatchesList(200, 'filterAll', tournamentId || undefined);

  // Resolve the user's predictions for this tournament (predictions live on a
  // tournament instance, so we use the user's enrollment for the tournament).
  const { getUserEnrollmentsByUserId, data: enrollments } = useGetUserEnrollmentsByUserId();
  useEffect(() => {
    if (!userId) return;
    void getUserEnrollmentsByUserId({ userId });
  }, [userId, getUserEnrollmentsByUserId]);

  const tournamentInstanceId = useMemo(
    () => enrollments.find((e) => e.tournamentId === tournamentId)?.tournamentInstanceId ?? '',
    [enrollments, tournamentId],
  );

  const { getPredictionsByUser, data: userPredictions } = useGetPredictionsByUser();
  useEffect(() => {
    if (!userId || !tournamentInstanceId) return;
    void getPredictionsByUser({ userId, tournamentInstanceId });
  }, [userId, tournamentInstanceId, getPredictionsByUser]);

  const predictionByMatch = useMemo(() => {
    const map: Record<string, { home: number; away: number }> = {};
    (userPredictions ?? []).forEach((prediction) => {
      map[prediction.matchId] = { home: prediction.homeScore, away: prediction.awayScore };
    });
    return map;
  }, [userPredictions]);

  const finishedMatches = useMemo(
    () =>
      [...items]
        .filter((match) => match.status === 'finished')
        .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime())
        .map((match) => ({
          ...match,
          prediction: predictionByMatch[match.id] ?? match.prediction,
        })),
    [items, predictionByMatch],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1, fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' }}
      >
        {t('title')}
      </Typography>

      <Typography sx={{ mb: 4, color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
        {t('subtitle')}
      </Typography>

      <Stack sx={{ mb: 4, maxWidth: { sm: 360 } }}>
        <TextField
          select
          size="small"
          label={tAdmin('tournamentLabel')}
          value={tournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
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

      {!tournamentId ? (
        <Box sx={{ py: 8, textAlign: 'center', color: tokens.onSurfaceVariant }}>
          <Typography>{tAdmin('actions.selectTournamentPrompt')}</Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ py: 8, textAlign: 'center', color: tokens.onSurfaceVariant }}>
          <Typography>{t('loading')}</Typography>
        </Box>
      ) : finishedMatches.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', color: tokens.onSurfaceVariant }}>
          <Typography>{t('noMatches')}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {finishedMatches.map((match) => (
            <FinishedMatchCard
              key={match.id}
              match={match}
              tournamentLabel={selectedTournamentName}
              stageLabel={match.stageKey === 'finals' ? m('stageFinals') : m('stageGroup')}
              kickoffLabel={formatKickoff(match.kickoffAt, locale)}
              exactLabel={t('exact')}
              partialLabel={t('partial')}
              wrongLabel={t('wrong')}
              noPredictionLabel={t('noPrediction')}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
