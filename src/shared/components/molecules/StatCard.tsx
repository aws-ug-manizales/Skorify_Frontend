'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';

interface StatCardProps {
  /** Uppercase caption shown above the value. */
  label: string;
  /** The headline metric. */
  value: ReactNode;
  icon: ReactNode;
  /** Accent color for the icon chip and value. Defaults to the brand primary. */
  accent?: string;
  /** Small secondary line under the value (e.g. "of 12 total"). */
  hint?: string;
  loading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon,
  accent = tokens.primary,
  hint,
  loading,
}: StatCardProps) => (
  <AppCard variant="outlined" sx={{ height: '100%' }}>
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: tokens.onSurfaceVariant,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${accent}1A`,
            color: accent,
            '& svg': { fontSize: '1.25rem' },
          }}
        >
          {icon}
        </Box>
      </Box>

      {loading ? (
        <CircularProgress size={28} sx={{ color: accent, my: 0.5 }} />
      ) : (
        <Typography
          sx={{
            fontSize: '2.25rem',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: tokens.onSurface,
          }}
        >
          {value}
        </Typography>
      )}

      {hint && (
        <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>{hint}</Typography>
      )}
    </Box>
  </AppCard>
);

export default StatCard;
