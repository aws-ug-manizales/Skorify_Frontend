'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useLocale, useTranslations } from 'next-intl';
import PageHeader from '@shared/components/molecules/PageHeader';
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
import { useGetMatchesByTournamentId } from '@features/matches/hooks/useGetMatchesByTournamentId';
import { useTeamsLookup } from '@features/teams';
import type { MatchDto, PredictionDto } from '@lib/api/skorify';
import PredictionsToolbar, { type PredictionsToolbarValues } from '../molecules/PredictionsToolbar';
import MatchesPanel, { type MatchesPanelSavedPrediction } from './MatchesPanel';
import PredictionDrawer, { type PredictionDrawerMatch } from './PredictionDrawer';
import { isMatchLocked } from '../../hooks/useMatchCountdown';
import { useMakePrediction } from '../../hooks/useMakePrediction';
import { useEditPrediction } from '../../hooks/useEditPrediction';
import { useGetPredictionsByUser } from '../../hooks/useGetPredictionsByUser';
import type { PredictionMatch } from '../../types/prediction';

type PanelKey = 'open' | 'closed';

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

const PANEL_PAPER_SX = {
  p: { xs: 2, md: 3 },
  bgcolor: tokens.surfaceContainerLow,
  borderRadius: 2,
  border: `1px solid ${tokens.outlineVariant}26`,
  boxShadow: 'none',
} as const;

const PredictionsView = () => {
  const t = useTranslations('predictions');
  const locale = useLocale();
  const { show: notify } = useNotification();

  const userId = useCurrentUserId();

  const {
    getUserEnrollmentsByUserId,
    data: enrollments,
    isLoading: enrollmentsLoading,
  } = useGetUserEnrollmentsByUserId();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const tournamentInstanceId = selectedInstanceId ?? enrollments[0]?.tournamentInstanceId ?? '';

  useEffect(() => {
    if (!userId) return;
    void getUserEnrollmentsByUserId({ userId });
  }, [userId, getUserEnrollmentsByUserId]);

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

  const teamIds = useMemo(() => {
    const ids = new Set<string>();
    backendMatches.forEach((dto) => {
      ids.add(dto.homeTeamId);
      ids.add(dto.awayTeamId);
    });
    return Array.from(ids);
  }, [backendMatches]);
  const { teams: teamsLookup } = useTeamsLookup(teamIds);

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
    return backendMatches.map((dto: MatchDto) => {
      const home = teamsLookup[dto.homeTeamId];
      const away = teamsLookup[dto.awayTeamId];
      return {
        id: dto.id,
        homeTeam: home?.name ?? dto.homeTeamId,
        awayTeam: away?.name ?? dto.awayTeamId,
        homeTeamFlag: home?.shieldUrl ?? '',
        awayTeamFlag: away?.shieldUrl ?? '',
        date: dto.kickOff,
        isUserPredicted: dto.id in savedPredictions,
      };
    });
  }, [backendMatches, teamsLookup, savedPredictions]);

  const savedMessages = useMemo(() => t.raw('savedMessages') as string[], [t]);

  const { control, reset } = useForm<PredictionsToolbarValues>({
    defaultValues: FILTER_DEFAULTS,
    mode: 'onChange',
  });
  const filterValues = useWatch({ control });

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PanelKey>('open');

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

  const { openMatches, closedMatches } = useMemo(() => {
    const reference = new Date();
    const open: PredictionMatch[] = [];
    const closed: PredictionMatch[] = [];
    filteredMatches.forEach((match) => {
      if (isMatchLocked(match.date, reference)) closed.push(match);
      else open.push(match);
    });
    return { openMatches: open, closedMatches: closed };
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
        onSuccess?.();
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
    ],
  );

  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    return matches.find((match) => match.id === selectedMatchId) ?? null;
  }, [matches, selectedMatchId]);

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
    if (!selectedMatchId) return undefined;
    const saved = savedPredictions[selectedMatchId];
    if (!saved) return undefined;
    return { homeGoals: saved.homeGoals, awayGoals: saved.awayGoals };
  }, [savedPredictions, selectedMatchId]);

  const handleOpenPrediction = useCallback((match: PredictionMatch) => {
    if (isMatchLocked(match.date)) return;
    setSelectedMatchId(match.id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedMatchId(null);
  }, []);

  const renderOpenPanel = (showHeader: boolean) => (
    <MatchesPanel
      matches={openMatches}
      title={t('openPanelTitle')}
      emptyMessage={t('noOpenMatches')}
      savedPredictions={savedPredictions}
      onOpenPrediction={handleOpenPrediction}
      showHeader={showHeader}
    />
  );

  const renderClosedPanel = (showHeader: boolean) => (
    <MatchesPanel
      matches={closedMatches}
      title={t('closedPanelTitle')}
      emptyMessage={t('noClosedMatches')}
      savedPredictions={savedPredictions}
      onOpenPrediction={handleOpenPrediction}
      showHeader={showHeader}
    />
  );

  const weekOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  const isLoading = enrollmentsLoading || matchesLoading || predictionsLoading;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <PageHeader
        title={t('pageTitle')}
        subtitle={t('matchesCount', { count: filteredMatches.length })}
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
              {enrollment.tournamentInstanceId}
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
        <>
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <Tabs
              value={activeTab}
              onChange={(_event, value: PanelKey) => setActiveTab(value)}
              variant="fullWidth"
              sx={{
                mb: 2,
                borderBottom: `1px solid ${tokens.outlineVariant}26`,
                '& .MuiTab-root': {
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                },
              }}
            >
              <Tab value="open" label={`${t('openTab')} (${openMatches.length})`} />
              <Tab value="closed" label={`${t('closedTab')} (${closedMatches.length})`} />
            </Tabs>

            <Box role="tabpanel" hidden={activeTab !== 'open'}>
              {activeTab === 'open' && renderOpenPanel(false)}
            </Box>
            <Box role="tabpanel" hidden={activeTab !== 'closed'}>
              {activeTab === 'closed' && renderClosedPanel(false)}
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', lg: 'grid' },
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Paper sx={PANEL_PAPER_SX}>{renderOpenPanel(true)}</Paper>
            <Paper sx={PANEL_PAPER_SX}>{renderClosedPanel(true)}</Paper>
          </Box>
        </>
      )}

      <PredictionDrawer
        open={!!selectedDrawerMatch}
        match={selectedDrawerMatch}
        initialScore={selectedDrawerScore}
        onClose={handleCloseDrawer}
        onSave={handleSave}
      />
    </Box>
  );
};

export default PredictionsView;
