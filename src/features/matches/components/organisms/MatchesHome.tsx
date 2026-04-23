'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import { formatKickoff } from '../../utils/formatKickoff';
import MatchCard from '../molecules/MatchCard';
import MatchesEmptyState from '../molecules/MatchesEmptyState';
import MatchesHeader from '../molecules/MatchesHeader';
import PaginatedMatchesGrid from '../molecules/PaginatedMatchesGrid';
import MatchesToolbar from '../molecules/MatchesToolbar';
import { useMatchesList } from '../../hooks/useMatchesList';
import { getWorldCupWeekOptions2026 } from '../../filters/weekOptions';

const MatchesHome = () => {
  const t = useTranslations('matches');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { query, setStatusFilter, setTeam, setWeek, setPage, loading, items, total, resetFilters } =
    useMatchesList(10);

  const monthOptions = useMemo(() => getWorldCupWeekOptions2026(locale), [locale]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
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

      {loading ? (
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
              tournamentLabel={t(m.tournamentKey)}
              stageLabel={t(m.stageKey)}
              statusLabel={t(m.status)}
              kickoffLabel={formatKickoff(m.kickoffAt, locale)}
              vsLabel={t('vs')}
              addPredictionLabel={t('addPrediction')}
              editPredictionLabel={t('editPrediction')}
              predictionLabel={t('predictionLabel')}
            />
          )}
        />
      )}
    </Box>
  );
};

export default MatchesHome;

