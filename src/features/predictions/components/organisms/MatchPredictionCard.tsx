'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import MatchCountdown from '../atoms/MatchCountdown';
import TeamLabel from '../atoms/TeamLabel';
import ScoreEditor from '../molecules/ScoreEditor';
import useMatchCountdown from '../../hooks/useMatchCountdown';
import type { PredictionMatch } from '../../types/prediction';

interface MatchPredictionCardProps {
  match: PredictionMatch;
  isSaved: boolean;
  initialHomeGoals?: number;
  initialAwayGoals?: number;
  editResetKey?: number;
  onSave: (
    matchId: string,
    values: { homeGoals: number; awayGoals: number },
  ) => Promise<boolean> | boolean;
}

interface RowFormValues {
  homeGoals: string;
  awayGoals: string;
}

// Fixed center-column width keeps the flag positions consistent across all
// cards regardless of name length or whether the row is in display/edit mode.
const SCORE_COLUMN_WIDTH = 152;

const buildDefaults = (
  isSaved: boolean,
  initialHome?: number,
  initialAway?: number,
): RowFormValues => ({
  homeGoals: isSaved && initialHome !== undefined ? String(initialHome) : '',
  awayGoals: isSaved && initialAway !== undefined ? String(initialAway) : '',
});

const MatchPredictionCard = ({
  match,
  isSaved,
  initialHomeGoals,
  initialAwayGoals,
  editResetKey,
  onSave,
}: MatchPredictionCardProps) => {
  const t = useTranslations('predictions');
  const { isLocked } = useMatchCountdown(match.date);

  const [mode, setMode] = useState<'display' | 'editing'>(isSaved ? 'display' : 'editing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<RowFormValues>({
    defaultValues: buildDefaults(isSaved, initialHomeGoals, initialAwayGoals),
    mode: 'onTouched',
  });

  // The form values come from `defaultValues` on mount. When `match.id` changes
  // the parent should pass a new `key`, which remounts this card with fresh
  // defaults — no in-place sync via reset() needed (and calling reset() during
  // render would trigger setState on the Controller children, which React
  // forbids across components).

  const homeGoals = useWatch({ control, name: 'homeGoals' });
  const awayGoals = useWatch({ control, name: 'awayGoals' });

  const valuesChanged =
    isSaved &&
    (Number(homeGoals) !== (initialHomeGoals ?? -1) ||
      Number(awayGoals) !== (initialAwayGoals ?? -1));

  useEffect(() => {
    if (mode === 'editing' && isSaved) setMode('display');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHomeGoals, initialAwayGoals]);

  useEffect(() => {
    if (!editResetKey) return;
    reset(buildDefaults(isSaved, initialHomeGoals, initialAwayGoals));
    setMode('display');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editResetKey]);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const ok = await onSave(match.id, {
      homeGoals: Number(values.homeGoals),
      awayGoals: Number(values.awayGoals),
    });
    setIsSubmitting(false);
    if (ok) setMode('display');
  });

  const handlePrimaryClick = () => {
    if (isLocked) return;
    if (mode === 'display') {
      setMode('editing');
      return;
    }
    if (isSaved && !valuesChanged) {
      setMode('display');
      return;
    }
    void onSubmit();
  };

  const buttonLabel = mode === 'display' ? t('editCta') : isSaved ? t('saveCta') : t('predictCta');
  const showInputs = mode === 'editing' && !isLocked;
  const submitDisabled = isSubmitting || (showInputs && !isValid);

  return (
    <AppCard
      component="form"
      onSubmit={onSubmit}
      sx={{
        p: 0,
        overflow: 'hidden',
        border: `1px solid ${tokens.outlineVariant}26`,
      }}
    >
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
          display: 'grid',
          gridTemplateColumns: `minmax(0, 1fr) ${SCORE_COLUMN_WIDTH}px minmax(0, 1fr)`,
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          px: { xs: 2, md: 3 },
          py: 2.5,
        }}
      >
        <TeamLabel name={match.homeTeam} flagUrl={match.homeTeamFlag} align="home" />

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {showInputs ? (
            <ScoreEditor<RowFormValues>
              control={control}
              homeName="homeGoals"
              awayName="awayGoals"
              disabled={isSubmitting}
              homeAriaLabel={t('homeGoalsLabel')}
              awayAriaLabel={t('awayGoalsLabel')}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: '0.2em',
                color: isLocked && !isSaved ? `${tokens.onSurface}33` : tokens.onSurface,
              }}
            >
              {isSaved ? `${homeGoals} – ${awayGoals}` : t('scorePlaceholder')}
            </Typography>
          )}
        </Box>

        <TeamLabel name={match.awayTeam} flagUrl={match.awayTeamFlag} align="away" />
      </Box>

      {!isLocked && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: 2,
            pb: 2.5,
            pt: 0,
          }}
        >
          <AppButton
            variant="primary"
            size="small"
            type="button"
            disabled={submitDisabled}
            onClick={handlePrimaryClick}
            sx={{ minWidth: 180 }}
          >
            {isSubmitting ? <CircularProgress size={18} color="inherit" /> : buttonLabel}
          </AppButton>
        </Box>
      )}
    </AppCard>
  );
};

export default MatchPredictionCard;
