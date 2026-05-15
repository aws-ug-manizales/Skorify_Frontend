'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import type { Group } from '../../types';

interface GroupHeaderProps {
  group: Group;
  isAdmin: boolean;
  onShare: () => void;
  onLeave: () => void;
}

const GroupHeader = ({ group, isAdmin, onShare, onLeave }: GroupHeaderProps) => {
  const t = useTranslations('groups');
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        boxShadow: tokens.shadowSm,
        border: `1px solid ${tokens.outlineVariant}1A`,
        bgcolor: tokens.surfaceContainerLow,
        minHeight: { xs: 220, md: 240 },
        display: 'flex',
        alignItems: 'flex-end',
        p: { xs: 2.5, md: 4 },
      }}
    >
      <Box
        component="img"
        src="/group-banner.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.4,
          filter: 'grayscale(0.3)',
          transition: 'filter 700ms ease, opacity 700ms ease',
          zIndex: 0,
          '&:hover': { filter: 'grayscale(0)', opacity: 0.5 },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, ${tokens.surfaceContainerLow}99 50%, ${tokens.surfaceContainerLow} 100%), radial-gradient(circle at 0% 0%, ${tokens.primaryContainer}33 0%, transparent 55%)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={t('groupTagLabel')}
              size="small"
              sx={{
                bgcolor: `${tokens.primaryContainer}33`,
                color: tokens.primary,
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                height: 22,
                border: `1px solid ${tokens.primary}33`,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: tokens.onSurfaceVariant,
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              <GroupsOutlinedIcon sx={{ fontSize: 16 }} />
              {t('memberCount', { count: group.memberCount })}
            </Box>
          </Box>

          <Typography
            sx={{
              color: tokens.onSurface,
              fontSize: { xs: '1.875rem', md: '2.75rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1,
              mb: group.description ? 1 : 0,
            }}
          >
            {group.name}
          </Typography>

          {group.description && (
            <Typography
              variant="body2"
              sx={{
                color: tokens.onSurfaceVariant,
                maxWidth: 560,
                fontSize: '0.875rem',
              }}
            >
              {group.description}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexShrink: 0,
            alignSelf: { xs: 'flex-start', md: 'flex-end' },
            flexWrap: 'wrap',
          }}
        >
          {isAdmin && (
            <AppButton
              variant="primary"
              startIcon={<IosShareIcon />}
              onClick={onShare}
              size="small"
            >
              {t('shareButton')}
            </AppButton>
          )}
          <AppButton
            variant="secondary"
            startIcon={<ExitToAppIcon />}
            onClick={onLeave}
            size="small"
            sx={{
              color: tokens.error,
              borderColor: tokens.error,
              '&:hover': { bgcolor: `${tokens.error}14` },
            }}
          >
            {t('leaveButton')}
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupHeader;
