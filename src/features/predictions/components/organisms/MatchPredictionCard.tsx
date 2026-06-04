'use client';

<<<<<<< HEAD
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
=======
import { useLocale, useTranslations } from 'next-intl';
import AppButton from '@shared/components/atoms/AppButton';
import MatchCard from '@features/matches/components/molecules/MatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import type { Match } from '@features/matches';
import useMatchCountdown, { isStatusClosedForPrediction } from '../../hooks/useMatchCountdown';
>>>>>>> origin/develop
import type { PredictionMatch } from '../../types/prediction';

interface MatchPredictionCardProps {
  match: PredictionMatch;
  isSaved: boolean;
  initialHomeGoals?: number;
  initialAwayGoals?: number;
  onOpenPrediction: (match: PredictionMatch) => void;
<<<<<<< HEAD
=======
  tournamentLabel?: string;
>>>>>>> origin/develop
}

const MatchPredictionCard = ({
  match,
  isSaved,
  initialHomeGoals,
  initialAwayGoals,
  onOpenPrediction,
<<<<<<< HEAD
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
=======
  tournamentLabel,
}: MatchPredictionCardProps) => {
  const t = useTranslations('predictions');
  const tMatches = useTranslations('matches');
  const locale = useLocale();
  const { isLocked: timeLocked } = useMatchCountdown(match.date);
  // A match is closed for prediction once it's within the lock window OR its
  // status has moved to in_progress/finished — shown, but no longer predictable.
  const isLocked = timeLocked || isStatusClosedForPrediction(match.status);

  const prediction =
    isSaved && initialHomeGoals !== undefined && initialAwayGoals !== undefined
      ? { home: initialHomeGoals, away: initialAwayGoals }
      : undefined;

  // Map the prediction match onto the shape the shared MatchCard expects so the
  // predictions list looks exactly like the matches list. The real match score
  // isn't available here, so we keep the status as "upcoming" (VS view) and let
  // the saved prediction render as the prediction badge.
  const mappedMatch: Match = {
    id: match.id,
    tournamentKey: '',
    stageKey: match.stageKey ?? 'group',
    status: 'upcoming',
    kickoffAt: match.date,
    homeTeamId: '',
    awayTeamId: '',
    homeTeam: { name: match.homeTeam, image: match.homeTeamFlag, code: '' },
    awayTeam: { name: match.awayTeam, image: match.awayTeamFlag, code: '' },
    score: undefined,
    prediction,
  };

  const stageLabel = match.stageKey === 'finals' ? tMatches('stageFinals') : tMatches('stageGroup');

  return (
    <MatchCard
      match={mappedMatch}
      tournamentLabel={tournamentLabel ?? ''}
      stageLabel={stageLabel}
      statusLabel={isLocked ? t('closed') : t('open')}
      kickoffLabel={formatKickoff(match.date, locale)}
      vsLabel={tMatches('vs')}
      predictionLabel={tMatches('predictionLabel')}
      footer={
        !isLocked ? (
>>>>>>> origin/develop
          <AppButton
            variant="primary"
            size="small"
            type="button"
            onClick={() => onOpenPrediction(match)}
<<<<<<< HEAD
            sx={{ minWidth: 180 }}
          >
            {isSaved ? t('editCta') : t('predictCta')}
          </AppButton>
        </Box>
      )}
    </AppCard>
=======
          >
            {isSaved ? t('editCta') : t('predictCta')}
          </AppButton>
        ) : undefined
      }
    />
>>>>>>> origin/develop
  );
};

export default MatchPredictionCard;
