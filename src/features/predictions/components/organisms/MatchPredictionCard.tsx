'use client';

import { useLocale, useTranslations } from 'next-intl';
import AppButton from '@shared/components/atoms/AppButton';
import MatchCard from '@features/matches/components/molecules/MatchCard';
import { formatKickoff } from '@features/matches/utils/formatKickoff';
import type { Match } from '@features/matches';
import useMatchCountdown from '../../hooks/useMatchCountdown';
import type { PredictionMatch } from '../../types/prediction';

interface MatchPredictionCardProps {
  match: PredictionMatch;
  isSaved: boolean;
  initialHomeGoals?: number;
  initialAwayGoals?: number;
  onOpenPrediction: (match: PredictionMatch) => void;
  tournamentLabel?: string;
}

const MatchPredictionCard = ({
  match,
  isSaved,
  initialHomeGoals,
  initialAwayGoals,
  onOpenPrediction,
  tournamentLabel,
}: MatchPredictionCardProps) => {
  const t = useTranslations('predictions');
  const tMatches = useTranslations('matches');
  const locale = useLocale();
  const { isLocked } = useMatchCountdown(match.date);

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
          <AppButton
            variant="primary"
            size="small"
            type="button"
            onClick={() => onOpenPrediction(match)}
          >
            {isSaved ? t('editCta') : t('predictCta')}
          </AppButton>
        ) : undefined
      }
    />
  );
};

export default MatchPredictionCard;
