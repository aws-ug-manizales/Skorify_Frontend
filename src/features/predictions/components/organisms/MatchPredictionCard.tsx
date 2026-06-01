'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import MatchCountdown from '../atoms/MatchCountdown';
import TeamLabel from '../atoms/TeamLabel';
import useMatchCountdown from '../../hooks/useMatchCountdown';
import type { PredictionMatch } from '../../types/prediction';

interface MatchPredictionCardProps {
  match: PredictionMatch;
  isSaved: boolean;
  initialHomeGoals?: number;
  initialAwayGoals?: number;
  onOpenPrediction: (match: PredictionMatch) => void;
}

const MatchPredictionCard = ({
  match,
  isSaved,
  initialHomeGoals,
  initialAwayGoals,
  onOpenPrediction,
}: MatchPredictionCardProps) => {
  const t = useTranslations('predictions');
  const { isLocked } = useMatchCountdown(match.date);

  const scoreLabel =
    isSaved && initialHomeGoals !== undefined && initialAwayGoals !== undefined
      ? `${initialHomeGoals} - ${initialAwayGoals}`
      : t('scorePlaceholder');

  return (
    <AppCard sx={{ p: 0, overflow: 'hidden', border: `1px solid ${tokens.outlineVariant}26` }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          textAlign: 'center',
          borderBottom: `1px solid ${tokens.outlineVariant}26`,
          bgcolor: `${tokens.surfaceContainerLowest}80`,
        }}
      >
        <MatchCountdown kickOff={match.date} />
      </Box>

      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: isLocked && !isSaved ? `${tokens.onSurface}33` : tokens.onSurface,
            }}
          >
            {scoreLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
          }}
        >
          <TeamLabel name={match.homeTeam} flagUrl={match.homeTeamFlag} align="home" />

          <Chip
            label={isSaved ? t('predictionSaved') : t('make')}
            size="small"
            sx={{
              bgcolor: tokens.surfaceContainerHigh,
              color: tokens.onSurface,
              fontWeight: 700,
            }}
          />

          <TeamLabel name={match.awayTeam} flagUrl={match.awayTeamFlag} align="away" />
        </Box>
      </Box>

      {!isLocked && (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, pb: 2.5, pt: 0 }}>
          <AppButton
            variant="primary"
            size="small"
            type="button"
            onClick={() => onOpenPrediction(match)}
            sx={{ minWidth: 180 }}
          >
            {isSaved ? t('editCta') : t('predictCta')}
          </AppButton>
        </Box>
      )}
    </AppCard>
  );
};

export default MatchPredictionCard;
