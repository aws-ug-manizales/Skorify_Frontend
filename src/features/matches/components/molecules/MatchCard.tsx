'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { tokens } from '@lib/theme/theme';
import type { Match, MatchStatus } from '../../types';
import TeamBlock from '../atoms/TeamBlock';
import ScoreOrVs from '../atoms/ScoreOrVs';
import MatchStatusChip from '../atoms/MatchStatusChip';
import AppButton from '@shared/components/atoms/AppButton';

const STATUS_META: Record<MatchStatus, { color: string; Icon: typeof AccessTimeIcon }> = {
  upcoming: { color: tokens.tertiary, Icon: AccessTimeIcon },
  live: { color: tokens.secondary, Icon: WhatshotIcon },
  finished: { color: tokens.success, Icon: CheckCircleIcon },
};

type Props = {
  match: Match;
  tournamentLabel: string;
  stageLabel: string;
  statusLabel: string;
  kickoffLabel: string;
  vsLabel: string;
  addPredictionLabel: string;
  editPredictionLabel: string;
  predictionLabel: string;
  onAddPrediction?: (match: Match) => void;
  onEditPrediction?: (match: Match) => void;
};

const MatchCard = ({
  match,
  tournamentLabel,
  stageLabel,
  statusLabel,
  kickoffLabel,
  vsLabel,
  addPredictionLabel,
  editPredictionLabel,
  predictionLabel,
  onAddPrediction,
  onEditPrediction,
}: Props) => {
  const meta = STATUS_META[match.status];
  const StatusIcon = meta.Icon;
  const showScore = match.status === 'live' || match.status === 'finished';
  const hasPrediction = Boolean(match.prediction);

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
        transition: 'box-shadow 200ms ease',
        '&:hover': { boxShadow: tokens.glowHover },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: `${meta.color}0D`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ bgcolor: tokens.surfaceContainerHigh, p: 1, borderRadius: '8px' }}>
          <StatusIcon sx={{ color: meta.color, fontSize: '1.25rem', display: 'block' }} />
        </Box>
        <MatchStatusChip status={match.status} label={statusLabel} />
      </Box>

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
        <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.75rem' }}>{kickoffLabel}</Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TeamBlock name={match.homeTeam.name} code={match.homeTeam.code} />
        <ScoreOrVs showScore={showScore} score={match.score} vsLabel={vsLabel} />
        <TeamBlock name={match.awayTeam.name} code={match.awayTeam.code} align="right" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        {hasPrediction ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'space-between', sm: 'flex-start' },
              gap: 1.25,
              bgcolor: `${tokens.primaryContainer}1A`,
              border: `1px solid ${tokens.outlineVariant}26`,
              borderRadius: 2,
              px: 1.25,
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
              {predictionLabel}
            </Typography>
            <Typography sx={{ color: tokens.onSurface, fontWeight: 900, fontSize: '0.95rem' }}>
              {match.prediction?.home ?? 0} - {match.prediction?.away ?? 0}
            </Typography>
          </Box>
        ) : (
          <Box />
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>

          <AppButton
            variant="primary"
            onClick={() => (hasPrediction ? onEditPrediction?.(match) : onAddPrediction?.(match))}
            sx={{ flex: { xs: 1, sm: 'unset' } }}
          >
            {hasPrediction ? editPredictionLabel : addPredictionLabel}
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MatchCard;

