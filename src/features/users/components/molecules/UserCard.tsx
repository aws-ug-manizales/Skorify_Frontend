'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import UserAvatar from '../atoms/UserAvatar';
import StatusBadge from '../atoms/StatusBadge';
import type { User } from '@features/users/types/user';

const STATUS_COLORS: Record<User['status'], string> = {
  active: tokens.success,
  suspended: tokens.error,
};

type Props = {
  user: User;
  locale: string;
  onToggleStatus: (userId: string) => void;
};

const UserCard = ({ user, locale, onToggleStatus }: Props) => {
  const t = useTranslations('users');
  const statusColor = STATUS_COLORS[user.status];

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
        gap: 2,
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
          bgcolor: `${statusColor}0D`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <UserAvatar name={user.name} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: tokens.onSurface,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: tokens.onSurfaceVariant,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      <StatusBadge status={user.status} />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SportsSoccerIcon sx={{ fontSize: '0.875rem', color: tokens.primary }} />
          <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
            {user.predictions.toLocaleString(locale)} {t('predictions')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PeopleIcon sx={{ fontSize: '0.875rem', color: tokens.primary }} />
          <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
            {user.groups} {t('groups')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TrendingUpIcon sx={{ fontSize: '0.875rem', color: tokens.tertiary }} />
        <Typography sx={{ fontSize: '0.75rem', color: tokens.onSurfaceVariant }}>
          {user.accuracyRate}% {t('accuracy')}
        </Typography>
      </Box>

      <AppButton
        variant={user.status === 'active' ? 'secondary' : 'primary'}
        fullWidth
        onClick={() => onToggleStatus(user.id)}
        sx={{
          mt: 'auto',
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        {user.status === 'active' ? t('suspendUser') : t('activateUser')}
      </AppButton>
    </Box>
  );
};

export default UserCard;
