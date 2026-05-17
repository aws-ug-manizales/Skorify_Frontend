'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import AppButton from '@shared/components/atoms/AppButton';
import { APPBAR_HEIGHT } from '@shared/components/organisms/DashboardNavbar';
import { tokens } from '@lib/theme/theme';
import MatchCountdown from '../atoms/MatchCountdown';
import TeamLabel from '../atoms/TeamLabel';
import ScoreEditor from '../molecules/ScoreEditor';
import PredictionScoreRuleCard from '../molecules/PredictionScoreRuleCard';
import PredictionScoreStreakCallout from '../molecules/PredictionScoreStreakCallout';

export interface PredictionDrawerMatch {
  id: string;
  homeTeam: string;
  homeTeamFlag: string;
  awayTeam: string;
  awayTeamFlag: string;
  kickoffAt: string;
}

export interface PredictionDrawerScore {
  homeGoals: number;
  awayGoals: number;
}

interface PredictionDrawerProps {
  open: boolean;
  match: PredictionDrawerMatch | null;
  initialScore?: PredictionDrawerScore;
  onClose: () => void;
  onSave: (
    matchId: string,
    values: PredictionDrawerScore,
    onSuccess?: () => void,
  ) => Promise<boolean>;
}

interface DrawerFormValues {
  homeGoals: string;
  awayGoals: string;
}

const buildDefaults = (initialScore?: PredictionDrawerScore): DrawerFormValues => ({
  homeGoals: initialScore ? String(initialScore.homeGoals) : '',
  awayGoals: initialScore ? String(initialScore.awayGoals) : '',
});

const DRAWER_WIDTH = { xs: '100vw', sm: 560, md: 680, lg: 760 };

const PredictionDrawer = ({
  open,
  match,
  initialScore,
  onClose,
  onSave,
}: PredictionDrawerProps) => {
  const t = useTranslations('predictions');
  const tCommon = useTranslations('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<DrawerFormValues>({
    defaultValues: buildDefaults(initialScore),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) return;
    reset(buildDefaults(initialScore));
  }, [open, initialScore, reset, match?.id]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    if (!match) return;
    setIsSubmitting(true);
    const ok = await onSave(
      match.id,
      {
        homeGoals: Number(values.homeGoals),
        awayGoals: Number(values.awayGoals),
      },
      onClose,
    );
    setIsSubmitting(false);
    if (ok) {
      onClose();
    }
  });

  return (
    <Drawer
      anchor="right"
      open={open && !!match}
      onClose={handleClose}
      PaperProps={{
        sx: {
          top: `${APPBAR_HEIGHT}px`,
          height: `calc(100% - ${APPBAR_HEIGHT}px)`,
          width: DRAWER_WIDTH,
          maxWidth: '100vw',
          bgcolor: tokens.surfaceContainerLowest,
          backgroundImage: 'none',
        },
      }}
    >
      {!match ? null : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              px: 2.5,
              py: 2.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: tokens.onSurfaceVariant,
                  mb: 0.5,
                }}
              >
                {t('make')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: tokens.onSurface,
                  lineHeight: 1.2,
                }}
              >
                {match.homeTeam} vs {match.awayTeam}
              </Typography>
            </Box>

            <IconButton onClick={handleClose} aria-label={tCommon('close')}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Box
            component="form"
            onSubmit={submit}
            sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, px: 2.5, pb: 2.5, gap: 2 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${tokens.outlineVariant}26`,
                bgcolor: tokens.surfaceContainerLow,
                textAlign: 'center',
              }}
            >
              <MatchCountdown kickOff={match.kickoffAt} />
            </Box>

            <Stack spacing={2.5}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TeamLabel name={match.homeTeam} flagUrl={match.homeTeamFlag} align="home" />

                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <ScoreEditor<DrawerFormValues>
                    control={control}
                    homeName="homeGoals"
                    awayName="awayGoals"
                    disabled={isSubmitting}
                    homeAriaLabel={t('homeGoalsLabel')}
                    awayAriaLabel={t('awayGoalsLabel')}
                  />
                </Box>

                <TeamLabel name={match.awayTeam} flagUrl={match.awayTeamFlag} align="away" />
              </Box>
            </Stack>
            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: tokens.onSurfaceVariant,
                  mb: 1,
                }}
              >
                {t('scoreRulesTitle')}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 1,
                }}
              >
                <PredictionScoreRuleCard
                  icon={EmojiEventsIcon}
                  title={t('scoreRules.winnerTitle')}
                  points={t('scoreRules.winnerPoints')}
                  description={t('scoreRules.winnerDescription')}
                />
                <PredictionScoreRuleCard
                  icon={ScoreboardIcon}
                  title={t('scoreRules.lopsidedTitle')}
                  points={t('scoreRules.lopsidedPoints')}
                  description={t('scoreRules.lopsidedDescription')}
                />
                <PredictionScoreRuleCard
                  icon={CheckCircleOutlineIcon}
                  title={t('scoreRules.eachHitTitle')}
                  points={t('scoreRules.eachHitPoints')}
                  description={t('scoreRules.eachHitDescription')}
                />
                <PredictionScoreRuleCard
                  icon={SwapHorizIcon}
                  title={t('scoreRules.reverseTitle')}
                  points={t('scoreRules.reversePoints')}
                  description={t('scoreRules.reverseDescription')}
                />
              </Box>
            </Box>

            <PredictionScoreStreakCallout
              icon={LocalFireDepartmentIcon}
              title={t('scoreRules.streakTitle')}
              description={t('scoreRules.streakDescription')}
            />

            <Box sx={{ mt: 'auto', pt: 1 }}>
              <AppButton
                type="submit"
                disabled={isSubmitting || !formState.isValid}
                fullWidth
                variant="primary"
              >
                {isSubmitting ? <CircularProgress size={18} color="inherit" /> : t('submit')}
              </AppButton>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default PredictionDrawer;
