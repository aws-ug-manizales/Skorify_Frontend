'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import { useMatchesList } from '@features/matches/hooks/useMatchesList';
import FinishedMatchCard from '@features/matches/components/molecules/FinishedMatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

// Función para traducciones
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

export default function ResultsPage() {
  const t = useTranslations('results');
  const m = useTranslations('matches');
  const locale = useLocale();

  // Inicializar con filtro de partidos finalizados
  const { items, loading, total } = useMatchesList(20, 'filterFinished');

  // Filtrar solo partidos finalizados y ordenar por fecha más reciente
  const finishedMatches = useMemo(() => {
    // Filtrar solo partidos finalizados y ordenar por kickoffAt descendente
    return [...items]
      .filter((match) => match.status === 'finished')
      .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime());
  }, [items]);

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 1,
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '-0.02em',
        }}
      >
        {t('title', { defaultValue: 'Resultados' })}
      </Typography>

      <Typography
        sx={{
          mb: 4,
          color: tokens.onSurfaceVariant,
          fontSize: '0.875rem',
        }}
      >
        {t('subtitle', {
          count: finishedMatches.length,
          defaultValue: `Historial de partidos finalizados y predicciones (${finishedMatches.length})`,
        })}
      </Typography>

      {loading ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            color: tokens.onSurfaceVariant,
          }}
        >
          <Typography>{t('loading', { defaultValue: 'Cargando resultados...' })}</Typography>
        </Box>
      ) : total === 0 || finishedMatches.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            color: tokens.onSurfaceVariant,
          }}
        >
          <Typography>
            {t('noMatches', { defaultValue: 'Aún no hay partidos finalizados.' })}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
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
}
