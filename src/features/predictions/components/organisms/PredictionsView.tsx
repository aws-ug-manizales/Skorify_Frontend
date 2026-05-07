'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useLocale, useTranslations } from 'next-intl';
import PageHeader from '@shared/components/molecules/PageHeader';
import { tokens } from '@lib/theme/theme';
import useSnackbar from '@shared/hooks/useSnackbar';
import { MOCK_MATCHES } from '@features/matches/constants/matches.mock';
import { getWorldCupWeekOptions2026 } from '@shared/components/organisms/MatchList/weekOptions';
import PredictionsToolbar, { type PredictionsToolbarValues } from '../molecules/PredictionsToolbar';
import MatchesPanel, { type MatchesPanelSavedPrediction } from '../molecules/MatchesPanel';
import { isMatchLocked } from '../../hooks/useMatchCountdown';
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
  const snackbar = useSnackbar();

  const matches = useMemo(() => MOCK_MATCHES as unknown as PredictionMatch[], []);
  const weekOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  const savedMessages = useMemo(() => t.raw('savedMessages') as string[], [t]);

  const { control, reset } = useForm<PredictionsToolbarValues>({
    defaultValues: FILTER_DEFAULTS,
    mode: 'onChange',
  });
  const filterValues = useWatch({ control });

  const [savedPredictions, setSavedPredictions] = useState<
    Record<string, MatchesPanelSavedPrediction>
  >(() => {
    const initial: Record<string, MatchesPanelSavedPrediction> = {};
    matches.forEach((match) => {
      if (match.isUserPredicted) initial[match.id] = { homeGoals: 2, awayGoals: 1 };
    });
    return initial;
  });

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

  const handleSave = useCallback<
    (matchId: string, values: { homeGoals: number; awayGoals: number }) => Promise<boolean>
  >(
    async (matchId, values) => {
      // TODO: replace with useMakePrediction once the backend wires up.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSavedPredictions((prev) => ({ ...prev, [matchId]: values }));
      const message = savedMessages[Math.floor(Math.random() * savedMessages.length)];
      snackbar.success(message);
      return true;
    },
    [savedMessages, snackbar],
  );

  const renderOpenPanel = (showHeader: boolean) => (
    <MatchesPanel
      matches={openMatches}
      title={t('openPanelTitle')}
      emptyMessage={t('noOpenMatches')}
      savedPredictions={savedPredictions}
      onSave={handleSave}
      showHeader={showHeader}
    />
  );

  const renderClosedPanel = (showHeader: boolean) => (
    <MatchesPanel
      matches={closedMatches}
      title={t('closedPanelTitle')}
      emptyMessage={t('noClosedMatches')}
      savedPredictions={savedPredictions}
      onSave={handleSave}
      showHeader={showHeader}
    />
  );

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <PageHeader
        title={t('pageTitle')}
        subtitle={t('matchesCount', { count: filteredMatches.length })}
      />

      <PredictionsToolbar
        control={control}
        weekOptions={weekOptions}
        hasActiveFilters={hasActiveFilters}
        onClear={handleClearFilters}
      />

      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Tabs
          value={activeTab}
          onChange={(_event, value: PanelKey) => setActiveTab(value)}
          variant="fullWidth"
          sx={{
            mb: 2,
            borderBottom: `1px solid ${tokens.outlineVariant}26`,
            '& .MuiTab-root': { textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem' },
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
    </Box>
  );
};

export default PredictionsView;
