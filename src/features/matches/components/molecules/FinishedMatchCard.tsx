'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { tokens } from '@lib/theme/theme';
import type { Match } from '../../types';
import TeamBlock from '../atoms/TeamBlock';
import {
  evaluatePrediction,
  getPredictionResultColor,
  getPredictionResultIcon,
  calculatePredictionPoints,
  PredictionResult,
} from '../../utils/predictionEvaluator';

type Props = {
  match: Match;
  tournamentLabel: string;
  stageLabel: string;
  kickoffLabel: string;
  exactLabel: string;
  partialLabel: string;
  wrongLabel: string;
  noPredictionLabel: string;
};

const FinishedMatchCard = ({
  match,
  tournamentLabel,
  stageLabel,
  kickoffLabel,
  exactLabel,
  partialLabel,
  wrongLabel,
  noPredictionLabel,
}: Props) => {
  const predictionResult: PredictionResult = match.score
    ? evaluatePrediction(match.score, match.prediction)
    : 'no-prediction';

  const resultColor = getPredictionResultColor(predictionResult);
  const resultIcon = getPredictionResultIcon(predictionResult);

  const getSafeLabel = (res: PredictionResult) => {
    switch (res) {
      case 'exact':
        return exactLabel || 'Acierto exacto';
      case 'partial':
        return partialLabel || 'Acierto parcial';
      case 'wrong':
        return wrongLabel || 'Incorrecto';
      case 'no-prediction':
      default:
        return noPredictionLabel || 'Sin predicción';
    }
  };

  const resultLabel = getSafeLabel(predictionResult);

  // Calcular puntos obtenidos
  const totalPoints =
    match.score && match.prediction
      ? calculatePredictionPoints(match.score, match.prediction).totalPoints
      : 0;

  return (
    <Box
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '8px',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.25,
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid transparent',
        '&:hover': {
          boxShadow: tokens.glowHover,
          borderColor: `${tokens.primary}26`,
        },
      }}
    >
      {/* Badge de estado finalizado */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: `${tokens.success}1A`,
          color: tokens.success,
          px: 1.5,
          py: 0.5,
          borderRadius: '4px',
          fontSize: '0.625rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: '0.75rem' }} />
        Finalizado
      </Box>

      {/* Encabezado del partido */}
      <Box>
        <Typography
          sx={{
            fontSize: '0.625rem',
            color: tokens.onSurfaceVariant,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          {tournamentLabel} • {stageLabel}
        </Typography>
        <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.75rem' }}>
          {kickoffLabel}
        </Typography>
      </Box>

      {/* Equipos y marcador */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TeamBlock name={match.homeTeam.name} code={match.homeTeam.code} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              color: tokens.onSurface,
              lineHeight: 1,
            }}
          >
            {match.score?.home ?? 0} - {match.score?.away ?? 0}
          </Typography>
        </Box>
        <TeamBlock name={match.awayTeam.name} code={match.awayTeam.code} align="right" />
      </Box>

      {/* Fila de predicción del usuario y estado del resultado */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.25,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.25,
          }}
        >
          {/* 1. Badge de Predicción: [TU PREDICCIÓN 0 - 0] */}
          {match.prediction ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: `${tokens.primary}0F`,
                border: `1px solid ${tokens.primary}33`,
                borderRadius: '6px',
                px: 1.5,
                py: 0.75,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: tokens.primary,
                }}
              >
                Tu predicción
              </Typography>
              <Typography
                sx={{
                  color: tokens.onSurface,
                  fontWeight: 900,
                  fontSize: '0.875rem',
                  ml: 0.5,
                }}
              >
                {match.prediction.home} - {match.prediction.away}
              </Typography>
            </Box>
          ) : null}

          {/* 2. Badge de Resultado: [X INCORRECTO] */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: `${resultColor}12`,
              color: resultColor,
              border: `1px solid ${resultColor}40`,
              borderRadius: '6px',
              px: 1.5,
              py: 0.75,
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <span>{resultIcon}</span>
            {resultLabel}
          </Box>

          {/* 3. Badge de Puntaje Ganado: [+2 PTS] */}
          {match.prediction ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: `${totalPoints > 0 ? tokens.primary : tokens.onSurfaceVariant}12`,
                border: `1px solid ${totalPoints > 0 ? tokens.primary : tokens.onSurfaceVariant}33`,
                borderRadius: '6px',
                px: 1.5,
                py: 0.75,
                fontSize: '0.6875rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: totalPoints > 0 ? tokens.primary : tokens.onSurfaceVariant,
              }}
            >
              {totalPoints > 0 ? `+${totalPoints}` : '0'} {totalPoints === 1 ? 'pt' : 'pts'}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: `${tokens.onSurfaceVariant}12`,
                border: `1px solid ${tokens.onSurfaceVariant}33`,
                borderRadius: '6px',
                px: 1.5,
                py: 0.75,
                fontSize: '0.6875rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: tokens.onSurfaceVariant,
              }}
            >
              0 pts
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinishedMatchCard;
