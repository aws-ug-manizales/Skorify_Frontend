'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import MatchPredictionCard from '../organisms/MatchPredictionCard';
import type { PredictionMatch } from '../../types/prediction';

export interface MatchesPanelSavedPrediction {
  homeGoals: number;
  awayGoals: number;
}

interface MatchesPanelProps {
  matches: PredictionMatch[];
  title?: string;
  emptyMessage: string;
  savedPredictions: Record<string, MatchesPanelSavedPrediction>;
  onSave: (
    matchId: string,
    values: { homeGoals: number; awayGoals: number },
  ) => Promise<boolean> | boolean;
  showHeader?: boolean;
}

const MatchesPanel = ({
  matches,
  title,
  emptyMessage,
  savedPredictions,
  onSave,
  showHeader = true,
}: MatchesPanelProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {showHeader && title && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: tokens.onSurfaceVariant,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {title}
        </Typography>
        <Chip
          label={matches.length}
          size="small"
          sx={{
            bgcolor: tokens.surfaceContainerHigh,
            color: tokens.onSurface,
            fontWeight: 700,
            height: 22,
          }}
        />
      </Box>
    )}

    {matches.length === 0 ? (
      <Box
        sx={{
          py: 5,
          px: 2,
          textAlign: 'center',
          color: tokens.onSurfaceVariant,
          border: `1px dashed ${tokens.outlineVariant}33`,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">{emptyMessage}</Typography>
      </Box>
    ) : (
      <Stack spacing={2}>
        {matches.map((match) => {
          const saved = savedPredictions[match.id];
          return (
            <MatchPredictionCard
              key={match.id}
              match={match}
              isSaved={!!saved}
              initialHomeGoals={saved?.homeGoals}
              initialAwayGoals={saved?.awayGoals}
              onSave={onSave}
            />
          );
        })}
      </Stack>
    )}
  </Box>
);

export default MatchesPanel;
