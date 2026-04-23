'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';

type Props = {
  name: string;
  code?: string;
  align?: 'left' | 'right';
};

const TeamBlock = ({ name, code, align = 'left' }: Props) => (
  <Box sx={{ minWidth: 0, textAlign: align === 'right' ? 'right' : 'left' }}>
    <Typography sx={{ color: tokens.onSurface, fontWeight: 800, fontSize: '0.95rem' }} noWrap>
      {name}
    </Typography>
    {code ? (
      <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.7rem' }}>{code}</Typography>
    ) : null}
  </Box>
);

export default TeamBlock;

