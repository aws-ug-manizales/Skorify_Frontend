'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useLocale, useTranslations } from 'next-intl';
import PageHeader from '@shared/components/molecules/PageHeader';
import Confetti from '@shared/components/organisms/Confetti';
import { tokens } from '@lib/theme/theme';
import {
  useNotification,
  NotificationType,
  ToastSeverity,
  NotificationVertical,
  NotificationHorizontal,
} from '@shared/notifications';
import { getWorldCupWeekOptions2026 } from '@shared/components/organisms/MatchList/weekOptions';
import { useCurrentUserId } from '@features/auth/hooks/useCurrentUserId';
import { useGetUserEnrollmentsByUserId } from '@features/groups/hooks/useGetUserEnrollmentsByUserId';
import { useTournamentInstanceNames } from '@features/tournaments/hooks/useTournamentInstanceNames';
import { useGetMatchesByTournamentId } from '@features/matches/hooks/useGetMatchesByTournamentId';
import type { MatchStatus, PredictionDto } from '@lib/api/skorify';
import PredictionsToolbar, { type PredictionsToolbarValues } from '../molecules/PredictionsToolbar';
import MatchesPanel, { type MatchesPanelSavedPrediction } from './MatchesPanel';
import PredictionDrawer, { type PredictionDrawerMatch } from './PredictionDrawer';
import { isMatchLocked, isStatusClosedForPrediction } from '../../hooks/useMatchCountdown';
import { useMakePrediction } from '../../hooks/useMakePrediction';
import { useEditPrediction } from '../../hooks/useEditPrediction';
import { useGetPredictionsByUser } from '../../hooks/useGetPredictionsByUser';
import type { PredictionMatch } from '../../types/prediction';

const FILTER_DEFAULTS: PredictionsToolbarValues = { search: '', week: '' };

const inWeekRange = (matchDate: Date, weekNum: string): boolean => {
  if (!weekNum) return true;
  const weekIndex = Number.parseInt(weekNum, 10);
  if (Number.isNaN(weekIndex)) return true;
  const startDate = new Date('2026-06-11T00:00:00');
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (weekIndex - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return matchDate >= weekStart && matchDate < weekEnd;
};

const PredictionsView = () => {
  const t = useTranslations('predictions');
  const locale = useLocale();
  const { show: notify } = useNotification();

  const userId = useCurrentUserId();

  // Deep-link support: /predictions?group=<instanceId>&match=<matchId> selects
  // the right tournament instance and auto-opens that match's prediction modal.
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupParam = searchParams.get('group');
  const matchParam = searchParams.get('match');

  const {
    getUserEnrollmentsByUserId,
    data: enrollments,
    isLoading: enrollmentsLoading,
  } = useGetUserEnrollmentsByUserId();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  // A manual dropdown selection wins; otherwise fall back to the deep-linked
  // instance (?group=) and finally the first enrollment.
  const tournamentInstanceId =
    selectedInstanceId ?? groupParam ?? enrollments[0]?.tournamentInstanceId ?? '';

  useEffect(() => {
    if (!userId) return;
    void getUserEnrollmentsByUserId({ userId });
  }, [userId, getUserEnrollmentsByUserId]);

  const instanceNames = useTournamentInstanceNames(
    useMemo(() => enrollments.map((e) => e.tournamentInstanceId), [enrollments]),
  );

  const activeEnrollment = useMemo(
    () => enrollments.find((e) => e.tournamentInstanceId === tournamentInstanceId) ?? null,
    [enrollments, tournamentInstanceId],
  );
  const tournamentId = activeEnrollment?.tournamentId;

  const { data: backendMatches, isLoading: matchesLoading } = useGetMatchesByTournamentId({
    tournamentId,
  });

  const {
    getPredictionsByUser,
    data: userPredictions,
    isLoading: predictionsLoading,
  } = useGetPredictionsByUser();

  const refreshPredictions = useCallback(() => {
    if (!userId || !tournamentInstanceId) return;
    void getPredictionsByUser({ userId, tournamentInstanceId });
  }, [userId, tournamentInstanceId, getPredictionsByUser]);

  useEffect(() => {
    refreshPredictions();
  }, [refreshPredictions]);

  const { savedPredictions, predictionIdByMatch } = useMemo(() => {
    const saved: Record<string, MatchesPanelSavedPrediction> = {};
    const ids: Record<string, string> = {};
    (userPredictions ?? []).forEach((prediction: PredictionDto) => {
      saved[prediction.matchId] = {
        homeGoals: prediction.homeScore,
        awayGoals: prediction.awayScore,
      };
      ids[prediction.matchId] = prediction.id;
    });
    return { savedPredictions: saved, predictionIdByMatch: ids };
  }, [userPredictions]);

  const matches = useMemo<PredictionMatch[]>(() => {
    return backendMatches.map(({ match, homeTeam, awayTeam }) => ({
      id: match.id,
      homeTeam: homeTeam?.name ?? match.homeTeamId,
      awayTeam: awayTeam?.name ?? match.awayTeamId,
      homeTeamFlag: homeTeam?.shieldUrl ?? '',
      awayTeamFlag: awayTeam?.shieldUrl ?? '',
      date: match.kickOff,
      isUserPredicted: match.id in savedPredictions,
      stageKey: match.stage,
      // `get-matches-by-tournament-id` serializes the status as `_status`;
      // fall back to it, mirroring ApiMatchesGateway.
      status: match._status ?? match.status,
    }));
  }, [backendMatches, savedPredictions]);

  const tournamentLabel = instanceNames[tournamentInstanceId] ?? '';

  const savedMessages = useMemo(() => t.raw('savedMessages') as string[], [t]);

  const { control, reset } = useForm<PredictionsToolbarValues>({
    defaultValues: FILTER_DEFAULTS,
    mode: 'onChange',
  });
  const filterValues = useWatch({ control });

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [deepLinkConsumed, setDeepLinkConsumed] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // The match whose prediction drawer is open. Derived rather than synced via an
  // effect: a manual selection wins; otherwise the deep-linked match (?match=)
  // opens once it has loaded and is still open, until the user dismisses it.
  const effectiveMatchId = useMemo(() => {
    if (selectedMatchId) return selectedMatchId;
    if (deepLinkConsumed || !matchParam) return null;
    const target = matches.find((match) => match.id === matchParam);
    if (!target || isMatchLocked(target.date)) return null;
    if (isStatusClosedForPrediction(target.status)) return null;
    return matchParam;
  }, [selectedMatchId, deepLinkConsumed, matchParam, matches]);

  const filteredMatches = useMemo(() => {
    const search = (filterValues.search ?? '').trim().toLowerCase();
    const week = filterValues.week ?? '';
    return matches.filter((match) => {
      const matchesSearch =
        !search ||
        match.homeTeam.toLowerCase().includes(search) ||
        match.awayTeam.toLowerCase().includes(search);
      if (!matchesSearch) return false;
      return inWeekRange(new Date(match.date), week);
    });
  }, [filterValues.search, filterValues.week, matches]);

  // Every match that hasn't finished yet is shown, ordered by kickoff (nearest
  // first). Matches within the lock window or already in progress still appear
  // but render as "closed" (no predict button) — only finished/calculated/
  // cancelled matches drop out of the predictions view.
  const visibleMatches = useMemo(() => {
    const finishedStatuses: MatchStatus[] = ['finished', 'calculated', 'cancelled'];
    return filteredMatches
      .filter((match) => !match.status || !finishedStatuses.includes(match.status))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredMatches]);

  const hasActiveFilters = !!(filterValues.search || filterValues.week);

  const handleClearFilters = useCallback(() => {
    reset(FILTER_DEFAULTS);
  }, [reset]);

  const { makePrediction } = useMakePrediction();
  const { editPrediction } = useEditPrediction();

  const handleSave = useCallback<
    (
      matchId: string,
      values: { homeGoals: number; awayGoals: number },
      onSuccess?: () => void,
    ) => Promise<boolean>
  >(
    async (matchId, values, onSuccess) => {
      if (!userId || !tournamentInstanceId) return false;

      const existingId = predictionIdByMatch[matchId];

      const doSave = async () => {
        const result = existingId
          ? await editPrediction({
              predictionId: existingId,
              homeScore: values.homeGoals,
              awayScore: values.awayGoals,
            })
          : await makePrediction({
              userId,
              tournamentInstanceId,
              matchId,
              homeScore: values.homeGoals,
              awayScore: values.awayGoals,
            });

        if (!result) {
          notify({
            type: NotificationType.TOAST,
            messageKey: 'predictions.saveErrorToast',
            severity: ToastSeverity.ERROR,
            position: {
              vertical: NotificationVertical.TOP,
              horizontal: NotificationHorizontal.RIGHT,
            },
          });
          return;
        }

        refreshPredictions();
        setCelebrate(true);
        const message = savedMessages[Math.floor(Math.random() * savedMessages.length)];
        notify({
          type: NotificationType.TOAST,
          titleKey: 'predictions.predictionSaved',
          message,
          severity: ToastSeverity.SUCCESS,
          position: {
            vertical: NotificationVertical.TOP,
            horizontal: NotificationHorizontal.RIGHT,
          },
        });
        onSuccess?.();

        // If we arrived here from a group's upcoming-matches deep link and just
        // predicted that match, return to the group's upcoming-matches tab.
        if (groupParam && matchId === matchParam) {
          router.push(`/groups/${groupParam}?tab=upcoming`);
        }
      };

      if (!existingId) {
        await doSave();
        return true;
      }

      const existing = savedPredictions[matchId];
      if (
        existing &&
        existing.homeGoals === values.homeGoals &&
        existing.awayGoals === values.awayGoals
      ) {
        // Nothing changed: let the user know and, if we came from a group's
        // upcoming-matches deep link, return them to that tab anyway.
        notify({
          type: NotificationType.TOAST,
          messageKey: 'predictions.noChangesToast',
          severity: ToastSeverity.INFO,
          position: {
            vertical: NotificationVertical.TOP,
            horizontal: NotificationHorizontal.RIGHT,
          },
        });
        onSuccess?.();
        if (groupParam && matchId === matchParam) {
          router.push(`/groups/${groupParam}?tab=upcoming`);
        }
        return true;
      }

      notify({
        type: NotificationType.MODAL,
        titleKey: 'predictions.overwriteTitle',
        messageKey: 'predictions.overwriteMessage',
        hasTwoButtons: true,
        actions: [
          {
            labelKey: 'common.confirm',
            onClick: () => {
              void doSave();
            },
          },
          {
            labelKey: 'common.cancel',
            onClick: () => {
              notify({
                type: NotificationType.TOAST,
                messageKey: 'predictions.editCancelledToast',
                severity: ToastSeverity.WARNING,
                position: {
                  vertical: NotificationVertical.TOP,
                  horizontal: NotificationHorizontal.RIGHT,
                },
              });
            },
          },
        ],
      });
      return false;
    },
    [
      userId,
      tournamentInstanceId,
      predictionIdByMatch,
      savedPredictions,
      makePrediction,
      editPrediction,
      notify,
      refreshPredictions,
      savedMessages,
      groupParam,
      matchParam,
      router,
    ],
  );

  const selectedMatch = useMemo(() => {
    if (!effectiveMatchId) return null;
    return matches.find((match) => match.id === effectiveMatchId) ?? null;
  }, [matches, effectiveMatchId]);

  const selectedDrawerMatch = useMemo<PredictionDrawerMatch | null>(() => {
    if (!selectedMatch) return null;
    return {
      id: selectedMatch.id,
      homeTeam: selectedMatch.homeTeam,
      homeTeamFlag: selectedMatch.homeTeamFlag,
      awayTeam: selectedMatch.awayTeam,
      awayTeamFlag: selectedMatch.awayTeamFlag,
      kickoffAt: selectedMatch.date,
    };
  }, [selectedMatch]);

  const selectedDrawerScore = useMemo(() => {
    if (!effectiveMatchId) return undefined;
    const saved = savedPredictions[effectiveMatchId];
    if (!saved) return undefined;
    return { homeGoals: saved.homeGoals, awayGoals: saved.awayGoals };
  }, [savedPredictions, effectiveMatchId]);

  const handleOpenPrediction = useCallback((match: PredictionMatch) => {
    if (isMatchLocked(match.date) || isStatusClosedForPrediction(match.status)) return;
    setSelectedMatchId(match.id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedMatchId(null);
    setDeepLinkConsumed(true);
  }, []);

  const renderOpenPanel = (showHeader: boolean) => (
    <MatchesPanel
      matches={visibleMatches}
      title={t('openPanelTitle')}
      emptyMessage={t('noOpenMatches')}
      savedPredictions={savedPredictions}
      onOpenPrediction={handleOpenPrediction}
      showHeader={showHeader}
      tournamentLabel={tournamentLabel}
    />
  );

  const weekOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  const isLoading = enrollmentsLoading || matchesLoading || predictionsLoading;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <PageHeader
        title={t('pageTitle')}
        subtitle={t('matchesCount', { count: visibleMatches.length })}
      />

      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, letterSpacing: '0.08em' }}
        >
          {t('instanceSelectLabel')}
        </Typography>
        <Select
          size="small"
          value={tournamentInstanceId}
          onChange={(event) => setSelectedInstanceId(event.target.value)}
          displayEmpty
          disabled={enrollments.length === 0}
          sx={{ maxWidth: 360, bgcolor: tokens.surfaceContainerLow }}
        >
          <MenuItem value="" disabled>
            {t('instanceSelectPlaceholder')}
          </MenuItem>
          {enrollments.map((enrollment) => (
            <MenuItem key={enrollment.id} value={enrollment.tournamentInstanceId}>
              {instanceNames[enrollment.tournamentInstanceId] ?? enrollment.tournamentInstanceId}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {enrollments.length === 0 && !enrollmentsLoading && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
          {t('noEnrollments')}
        </Alert>
      )}

      <PredictionsToolbar
        control={control}
        weekOptions={weekOptions}
        hasActiveFilters={hasActiveFilters}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={120} />
        </Box>
      ) : (
        renderOpenPanel(true)
      )}

      <PredictionDrawer
        open={!!selectedDrawerMatch}
        match={selectedDrawerMatch}
        initialScore={selectedDrawerScore}
        onClose={handleCloseDrawer}
        onSave={handleSave}
      />

      <Confetti active={celebrate} onComplete={() => setCelebrate(false)} />
    </Box>
  );
};

export default PredictionsView;
