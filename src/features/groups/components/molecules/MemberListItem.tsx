'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import type { GroupMember } from '../../types';

const AVATAR_PALETTE = [
  tokens.primaryContainer,
  tokens.secondaryContainer,
  tokens.surfaceContainerHighest,
  '#1a4a2e',
  '#2a1f4a',
];

const getAvatarBg = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

interface MemberListItemProps {
  member: GroupMember;
  isCurrentUser: boolean;
}

const MemberListItem = ({ member, isCurrentUser }: MemberListItemProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      py: 0.75,
      px: 1.5,
      borderRadius: '8px',
      bgcolor: isCurrentUser ? `${tokens.primaryContainer}18` : 'transparent',
      transition: 'background-color 150ms ease',
      '&:hover': { bgcolor: `${tokens.primary}0D` },
    }}
  >
    <Avatar
      sx={{
        width: 36,
        height: 36,
        bgcolor: getAvatarBg(member.name),
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
      }}
    >
      {member.name}
    </Typography>

    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {member.isAdmin && (
        <Chip
          label="Admin"
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
          label="Tú"
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
  </Box>
);

export default MemberListItem;
