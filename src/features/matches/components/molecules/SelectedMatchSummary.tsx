'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';

type MatchSummaryFields = {
  teams: string;
  tournament: string;
  kickOff: string;
  stage: string;
  venue: string;
  status: string;
};

type SelectedMatchSummaryData = {
  teams: string;
  tournament: string;
  kickOff: string;
  stage: string;
  venue: string;
  status: string;
};

type SelectedMatchSummaryProps = {
  title: string;
  emptyStateLabel: string;
  fields: MatchSummaryFields;
  matchSummary?: SelectedMatchSummaryData;
};

const SelectedMatchSummary = ({
  title,
  emptyStateLabel,
  fields,
  matchSummary,
}: SelectedMatchSummaryProps) => (
  <AppCard variant="outlined" sx={{ p: 3 }}>
    <Typography
      sx={{
        fontSize: '0.75rem',
        color: tokens.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 700,
        mb: 2,
      }}
    >
      {title}
    </Typography>

    {!matchSummary ? (
      <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant }}>
        {emptyStateLabel}
      </Typography>
    ) : (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <SummaryItem label={fields.teams} value={matchSummary.teams} />
        <SummaryItem label={fields.tournament} value={matchSummary.tournament} />
        <SummaryItem label={fields.kickOff} value={matchSummary.kickOff} />
        <SummaryItem label={fields.stage} value={matchSummary.stage} />
        <SummaryItem label={fields.venue} value={matchSummary.venue} />
        <SummaryItem label={fields.status} value={matchSummary.status} />
      </Box>
    )}
  </AppCard>
);

type SummaryItemProps = {
  label: string;
  value: string;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => (
  <Box>
    <Typography
      sx={{
        fontSize: '0.625rem',
        color: tokens.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 700,
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurface, fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

export default SelectedMatchSummary;
