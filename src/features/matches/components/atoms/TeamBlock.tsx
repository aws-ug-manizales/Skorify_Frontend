'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { tokens } from '@lib/theme/theme';
import CountryFlag from '@shared/components/atoms/CountryFlag';
import { getCountryFlagUrl } from '@shared/utils/flag';

type Props = {
  name: string;
  code?: string;
  image?: string;
  loading?: boolean;
  align?: 'left' | 'right';
};

const TeamBlock = ({ name, code, image, loading = false, align = 'left' }: Props) => {
  if (loading) {
    return (
      <Box
        sx={{
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexDirection: align === 'right' ? 'row-reverse' : 'row',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        <Skeleton variant="rounded" width={24} height={24} sx={{ flexShrink: 0 }} />
        <Skeleton variant="text" width={88} height={22} />
      </Box>
    );
  }

  return (
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
          minWidth: 0,
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexDirection: align === 'right' ? 'row-reverse' : 'row',
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={name}
            loading="lazy"
            sx={{
              width: 24,
              height: 24,
              flexShrink: 0,
              borderRadius: '4px',
              objectFit: 'contain',
              backgroundColor: tokens.surfaceContainerHigh,
            }}
          />
        ) : code ? (
          <CountryFlag src={getCountryFlagUrl(code)} alt={name} size={22} />
        ) : null}
        <Typography
          sx={{
            minWidth: 0,
            color: tokens.onSurface,
            fontWeight: 800,
            fontSize: '0.95rem',
            lineHeight: 1.15,
            // Long names (e.g. "Bosnia-Herzegovina") wrap instead of overflowing
            // and overlapping the VS column on narrow screens.
            overflowWrap: 'anywhere',
          }}
        >
          {name}
        </Typography>
      </Box>
      {code ? (
        <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.7rem' }}>{code}</Typography>
      ) : null}
    </Box>
  );
};

export default TeamBlock;
