'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import type { UserStatus } from '@features/users/types/user';

const STATUS_COLORS: Record<UserStatus, string> = {
  active: tokens.success,
  suspended: tokens.error,
};

type Props = {
  status: UserStatus;
};

const StatusBadge = ({ status }: Props) => {
  const t = useTranslations('users');
  const color = STATUS_COLORS[status];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
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
        {t(`status.${status}`)}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
