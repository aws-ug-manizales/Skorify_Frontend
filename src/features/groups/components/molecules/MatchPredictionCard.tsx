'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import type { PendingMatch } from '../../types';

const formatMatchDate = (dateStr: string) =>
  new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));

const TeamDisplay = ({ name }: { name: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, flex: 1 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: tokens.surfaceContainerHighest,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SportsSoccerIcon sx={{ fontSize: 22, color: tokens.onSurfaceVariant }} />
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: tokens.onSurface,
        fontWeight: 600,
        textAlign: 'center',
        fontSize: '0.75rem',
      }}
    >
      {name}
    </Typography>
  </Box>
);

interface MatchPredictionCardProps {
  match: PendingMatch;
}

const MatchPredictionCard = ({ match }: MatchPredictionCardProps) => (
  <Box
    sx={{
      bgcolor: tokens.surfaceContainerHigh,
      borderRadius: '12px',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {match.tournament && (
        <Chip
          icon={
            <EmojiEventsOutlinedIcon
              sx={{ fontSize: '14px !important', color: `${tokens.tertiary} !important` }}
            />
          }
          label={match.tournament}
          size="small"
          sx={{
            bgcolor: `${tokens.tertiary}15`,
            color: tokens.tertiary,
            fontSize: '0.65rem',
            height: 22,
            fontWeight: 600,
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{ color: tokens.onSurfaceVariant, fontSize: '0.68rem', ml: 'auto' }}
      >
        {formatMatchDate(match.matchDate)}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TeamDisplay name={match.homeTeam.name} />
      <Typography
        variant="h5"
        sx={{ color: tokens.onSurfaceVariant, fontWeight: 700, px: 0.5, flexShrink: 0 }}
      >
        vs
      </Typography>
      <TeamDisplay name={match.awayTeam.name} />
    </Box>

    <AppButton
      variant={match.hasPrediction ? 'secondary' : 'primary'}
      fullWidth
      size="small"
      sx={{ borderRadius: '8px' }}
    >
      {match.hasPrediction ? 'Editar predicción' : 'Predecir'}
    </AppButton>
  </Box>
);

export default MatchPredictionCard;
