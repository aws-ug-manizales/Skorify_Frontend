'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { getAvatarColor, getInitials } from '@shared/utils/string';
import type { GroupMember } from '../../types';

interface MemberListItemProps {
  member: GroupMember;
  isCurrentUser: boolean;
}

const MemberListItem = ({ member, isCurrentUser }: MemberListItemProps) => {
  const t = useTranslations('groups');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 0.75,
        px: 1.5,
        borderRadius: '8px',
        bgcolor: isCurrentUser ? `${tokens.primaryContainer}18` : 'transparent',
        borderLeft: isCurrentUser ? `3px solid ${tokens.primary}` : '3px solid transparent',
        transition: 'background-color 150ms ease',
        '&:hover': { bgcolor: `${tokens.primary}0D` },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: getAvatarColor(member.name),
          fontSize: '0.7rem',
          fontWeight: 700,
          color: tokens.onSurface,
          flexShrink: 0,
        }}
      >
        {getInitials(member.name)}
      </Avatar>

      <Typography
        variant="body1"
        sx={{
          flex: 1,
          color: isCurrentUser ? tokens.primary : tokens.onSurface,
          fontWeight: isCurrentUser ? 600 : 400,
          fontSize: '0.82rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {member.name}
      </Typography>

      {/* Badges */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {member.isAdmin && (
          <Chip
            label={t('adminBadge')}
            size="small"
            sx={{
              bgcolor: `${tokens.secondary}22`,
              color: tokens.secondary,
              fontSize: '0.65rem',
              height: 20,
              fontWeight: 700,
            }}
          />
        )}
        {isCurrentUser && (
          <Chip
            label={t('youBadge')}
            size="small"
            sx={{
              bgcolor: `${tokens.primary}22`,
              color: tokens.primary,
              fontSize: '0.65rem',
              height: 20,
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      {/* Points */}
      {member.points !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: isCurrentUser ? tokens.primary : tokens.onSurface,
            fontWeight: 700,
            fontSize: '0.82rem',
            minWidth: 28,
            textAlign: 'right',
          }}
        >
          {member.points}
          <Typography
            component="span"
            sx={{ fontSize: '0.6rem', color: tokens.onSurfaceVariant, ml: 0.25 }}
          >
            {t('colPoints')}
          </Typography>
        </Typography>
      )}
    </Box>
  );
};

export default MemberListItem;
