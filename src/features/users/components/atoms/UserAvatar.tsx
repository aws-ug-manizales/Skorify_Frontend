'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import { getAvatarColor, getInitials } from '@shared/utils/string';

type Props = {
  name: string;
  size?: number;
};

const UserAvatar = ({ name, size = 44 }: Props) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: getAvatarColor(name),
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
        {getInitials(name)}
      </Typography>
    </Box>
  );
};

export default UserAvatar;
