'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { getInitials } from '@shared/utils/string';
import AppButton from '@shared/components/atoms/AppButton';
import type { Group } from '../../types';

interface GroupHeaderProps {
  group: Group;
  isAdmin: boolean;
  onShare: () => void;
}

const GroupHeader = ({ group, isAdmin, onShare }: GroupHeaderProps) => {
  const t = useTranslations('groups');
  return (
    <Box
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '16px',
        p: { xs: 2.5, md: 3 },
        boxShadow: tokens.shadowSm,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tokens.primaryContainer}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 56, md: 72 },
            height: { xs: 56, md: 72 },
            background: tokens.ctaGradient,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: 700,
            color: tokens.onSurface,
            flexShrink: 0,
          }}
        >
          {getInitials(group.name)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              color: tokens.onSurface,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              mb: group.description ? 0.5 : 1,
            }}
          >
            {group.name}
          </Typography>

          {group.description && (
            <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant, mb: 1 }}>
              {group.description}
            </Typography>
          )}

          <Chip
            icon={<GroupsOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            label={t('memberCount', { count: group.memberCount })}
            size="small"
            sx={{
              bgcolor: tokens.surfaceContainerHighest,
              color: tokens.onSurfaceVariant,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
        </Box>

        {isAdmin && (
          <AppButton
            variant="primary"
            startIcon={<IosShareIcon />}
            onClick={onShare}
            size="small"
            sx={{
              borderRadius: '8px',
              flexShrink: 0,
              alignSelf: { xs: 'flex-start', sm: 'center' },
              ml: { xs: 'auto', sm: 0 },
            }}
          >
            {t('shareButton')}
          </AppButton>
        )}
      </Box>
    </Box>
  );
};

export default GroupHeader;
