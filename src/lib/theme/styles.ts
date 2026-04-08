import { SxProps, Theme } from '@mui/material';
import { tokens } from './theme';

export const surface: SxProps<Theme> = {
  bgcolor: tokens.surfaceContainerLow,
  borderRadius: '6px',
  boxShadow: tokens.shadowSm,
};

export const surfaceHigh: SxProps<Theme> = {
  bgcolor: tokens.surfaceContainerHigh,
  borderRadius: '6px',
  boxShadow: tokens.shadowSm,
};

export const glass: SxProps<Theme> = {
  bgcolor: `${tokens.surfaceContainerHighest}99`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
};

export const ghostBorder: SxProps<Theme> = {
  border: `1px solid ${tokens.outlineVariant}26`,
  '&:hover': {
    borderColor: `${tokens.outlineVariant}66`,
  },
};

export const glow: SxProps<Theme> = {
  boxShadow: tokens.glowHover,
};

export const inset: SxProps<Theme> = {
  bgcolor: tokens.surfaceContainerLowest,
  borderRadius: '4px',
  border: `1px solid ${tokens.outlineVariant}26`,
};
