'use client';

import Box from '@mui/material/Box';
import { tokens } from '@lib/theme/theme';

interface CountryFlagProps {
  src: string;
  alt: string;
  size?: number;
}

const CountryFlag = ({ src, alt, size = 24 }: CountryFlagProps) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    loading="lazy"
    sx={{
      width: size * 1.5,
      height: size,
      flexShrink: 0,
      borderRadius: '4px',
      objectFit: 'cover',
      border: `1px solid ${tokens.outlineVariant}33`,
      backgroundColor: tokens.surfaceContainerHigh,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      display: 'block',
    }}
  />
);

export default CountryFlag;
