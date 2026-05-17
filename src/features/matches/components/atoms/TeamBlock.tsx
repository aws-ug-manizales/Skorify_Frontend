'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import CountryFlag from '@shared/components/atoms/CountryFlag';
import { getCountryFlagUrl } from '@shared/utils/flag';

type Props = {
  name: string;
  code?: string;
  align?: 'left' | 'right';
};

const TeamBlock = ({ name, code, align = 'left' }: Props) => (
  <Box
    sx={{
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      gap: 0.75,
      textAlign: align === 'right' ? 'right' : 'left',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}
    >
      {code ? <CountryFlag src={getCountryFlagUrl(code)} alt={name} size={22} /> : null}
      <Typography sx={{ color: tokens.onSurface, fontWeight: 800, fontSize: '0.95rem' }} noWrap>
        {name}
      </Typography>
    </Box>
    {code ? (
      <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.7rem' }}>{code}</Typography>
    ) : null}
  </Box>
);

export default TeamBlock;
