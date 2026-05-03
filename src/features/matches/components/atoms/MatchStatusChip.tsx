'use client';

import Typography from '@mui/material/Typography';
import type { MatchStatus } from '../../types';
import { tokens } from '@lib/theme/theme';

const STATUS_COLORS: Record<MatchStatus, string> = {
  upcoming: tokens.tertiary,
  live: tokens.secondary,
  finished: tokens.success,
};

type Props = {
  status: MatchStatus;
  label: string;
};

const MatchStatusChip = ({ status, label }: Props) => {
  const color = STATUS_COLORS[status];
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        color,
        bgcolor: `${color}1A`,
        px: 1,
        py: 0.25,
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </Typography>
  );
};

export default MatchStatusChip;
