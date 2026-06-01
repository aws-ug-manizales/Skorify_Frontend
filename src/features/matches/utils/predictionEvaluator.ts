import { MatchScore, MatchPrediction } from '../types';

export type PredictionResult = 'exact' | 'partial' | 'wrong' | 'no-prediction';

/**
 * Evalúa el resultado de una predicción comparándola con el marcador real del partido.
 *
 * @param actualScore - Marcador real del partido
 * @param prediction - Predicción del usuario
 * @returns 'exact' si acertó el marcador exacto, 'partial' si acertó el ganador,
 *          'wrong' si se equivocó, 'no-prediction' si no hizo predicción
 */
export const evaluatePrediction = (
  actualScore: MatchScore,
  prediction?: MatchPrediction,
): PredictionResult => {
  if (!prediction) return 'no-prediction';

  const { home: actualHome, away: actualAway } = actualScore;
  const { home: predHome, away: predAway } = prediction;

  // Acierto exacto
  if (actualHome === predHome && actualAway === predAway) {
    return 'exact';
  }

  // Acierto parcial: acertó quién gana o empate
  const actualDiff = actualHome - actualAway;
  const predDiff = predHome - predAway;

  // Mismo signo = mismo resultado (ganó local, empate, o ganó visitante)
  if (
    (actualDiff > 0 && predDiff > 0) ||
    (actualDiff < 0 && predDiff < 0) ||
    (actualDiff === 0 && predDiff === 0)
  ) {
    return 'partial';
  }

  return 'wrong';
};

/**
 * Obtiene un color basado en el resultado de la predicción para visualización en UI.
 */
export const getPredictionResultColor = (result: PredictionResult): string => {
  switch (result) {
    case 'exact':
      return '#00C853'; // Verde - tokens.success
    case 'partial':
      return '#ff8a00'; // Naranja - tokens.secondary
    case 'wrong':
      return '#ff6e84'; // Rojo - tokens.error
    case 'no-prediction':
    default:
      return '#acaab5'; // Gris - tokens.onSurfaceVariant
  }
};

/**
 * Obtiene un icono/emoji basado en el resultado de la predicción.
 */
export const getPredictionResultIcon = (result: PredictionResult): string => {
  switch (result) {
    case 'exact':
      return '👑';
    case 'partial':
      return '⚽';
    case 'wrong':
      return '❌';
    case 'no-prediction':
    default:
      return '—';
  }
};

export type PointModifier = {
  key: string;
  points: number;
};

export type PredictionPointsDetails = {
  totalPoints: number;
  modifiers: PointModifier[];
};

/**
 * Calcula el puntaje obtenido por una predicción en base a las reglas de Skorify.
 */
export const calculatePredictionPoints = (
  actualScore: MatchScore,
  prediction?: MatchPrediction,
): PredictionPointsDetails => {
  if (!prediction) {
    return { totalPoints: 0, modifiers: [] };
  }

  const { home: actualHome, away: actualAway } = actualScore;
  const { home: predHome, away: predAway } = prediction;

  const modifiers: PointModifier[] = [];
  let totalPoints = 0;

  // 1. Ganador (+2 pts)
  const actualDiff = actualHome - actualAway;
  const predDiff = predHome - predAway;
  const isWinnerCorrect =
    (actualDiff > 0 && predDiff > 0) ||
    (actualDiff < 0 && predDiff < 0) ||
    (actualDiff === 0 && predDiff === 0);

  if (isWinnerCorrect) {
    modifiers.push({ key: 'winner', points: 2 });
    totalPoints += 2;
  }

  // 2. Cada aciertos (+1 pt por equipo con goles coincidentes)
  if (actualHome === predHome) {
    modifiers.push({ key: 'homeGoals', points: 1 });
    totalPoints += 1;
  }
  if (actualAway === predAway) {
    modifiers.push({ key: 'awayGoals', points: 1 });
    totalPoints += 1;
  }

  // 3. Marcador abultado (+1 pt) - Goleada: total goles real > 4
  const totalActualGoals = actualHome + actualAway;
  if (totalActualGoals > 4) {
    modifiers.push({ key: 'lopsided', points: 1 });
    totalPoints += 1;
  }

  // 4. Marcador invertido (+1 pt) - Si falló el ganador pero el marcador es al revés (ej: real 2-1, pred 1-2)
  if (
    !isWinnerCorrect &&
    actualHome === predAway &&
    actualAway === predHome &&
    actualHome !== actualAway
  ) {
    modifiers.push({ key: 'reverse', points: 1 });
    totalPoints += 1;
  }

  return { totalPoints, modifiers };
};
