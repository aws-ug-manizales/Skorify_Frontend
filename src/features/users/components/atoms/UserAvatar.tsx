'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

const AVATAR_COLORS = [
  tokens.primaryContainer,
  tokens.secondaryContainer,
  '#2E7D32',
  '#1565C0',
  '#6A1B9A',
  '#C62828',
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarColor = (name: string): string => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

type Props = {
  name: string;
  size?: number;
};

const UserAvatar = ({ name, size = 44 }: Props) => {
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: avatarColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          color: tokens.onSurface,
          fontSize: size <= 36 ? '0.8125rem' : '1rem',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {initials}
      </Typography>
    </Box>
  );
};

export default UserAvatar;
