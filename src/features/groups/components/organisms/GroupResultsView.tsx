'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocale, useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useMatchesList } from '@features/matches/hooks/useMatchesList';
import FinishedMatchCard from '@features/matches/components/molecules/FinishedMatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import PageHeader from '@shared/components/molecules/PageHeader';
import { useMemo } from 'react';

interface GroupResultsViewProps {
  groupId: string;
}

const getTournamentLabel = (key: string, t: (key: string) => string) => {
  try {
    return t(key);
  } catch {
    return key;
  }
};

const getStageLabel = (key: string, t: (key: string) => string) => {
  try {
    return t(key);
  } catch {
    return key;
  }
};

const GroupResultsView = ({ groupId }: GroupResultsViewProps) => {
  const g = useTranslations('groups');
  const t = useTranslations('results');
  const m = useTranslations('matches');
  const locale = useLocale();
  const router = useRouter();

  // Inicializar con filtro de partidos finalizados
  const { items, loading } = useMatchesList(20, 'filterFinished');

  // Filtrar solo partidos finalizados y ordenar por fecha más reciente
  const finishedMatches = useMemo(() => {
    return [...items]
      .filter((match) => match.status === 'finished')
      .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime());
  }, [items]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      <AppButton
        variant="tertiary"
        onClick={() => router.push(`/groups/${groupId}`)}
        sx={{ mb: 2, color: tokens.onSurfaceVariant }}
      >
        <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
        {g('backToGroup') || 'Volver al grupo'}
      </AppButton>

      <PageHeader
        title={g('finishedMatchesTitle') || 'Resultados'}
        subtitle={g('finishedMatchesSubtitle') || 'Partidos finalizados y predicciones'}
      />

      {loading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
            {t('loading', { defaultValue: 'Cargando resultados...' })}
          </Typography>
        </Box>
      ) : finishedMatches.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
            {t('noMatches', { defaultValue: 'Aún no hay partidos finalizados.' })}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr' }}>
          {finishedMatches.map((match) => (
            <FinishedMatchCard
              key={match.id}
              match={match}
              tournamentLabel={getTournamentLabel(match.tournamentKey, m)}
              stageLabel={getStageLabel(match.stageKey, m)}
              kickoffLabel={formatKickoff(match.kickoffAt, locale)}
              exactLabel={t('exact', { defaultValue: 'Acierto exacto' })}
              partialLabel={t('partial', { defaultValue: 'Acierto parcial' })}
              wrongLabel={t('wrong', { defaultValue: 'Incorrecto' })}
              noPredictionLabel={t('noPrediction', { defaultValue: 'Sin predicción' })}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GroupResultsView;
