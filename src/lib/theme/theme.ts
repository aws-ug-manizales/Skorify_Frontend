'use client';

import { createTheme } from '@mui/material/styles';

const tokens = {
  primary: '#DCB8FF',
  primaryContainer: '#8A2BE2',
  onSecondary: '#4B0080',
  tertiary: '#FFB873',
  onSurface: '#E5E2E1',
  onSurfaceVariant: '#CFC2D7',
  surfaceTint: '#DCB8FF',
  outlineVariant: '#4C4354',
  background: '#131313',
  surfaceContainer: '#201F1F',
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353534',
  surfaceContainerLow: '#1C1B1B',
  surfaceContainerLowest: '#0E0E0E',
  ctaGradient: 'linear-gradient(135deg, #8A2BE2 0%, #4B0080 100%)',
  shadowSm: '0 4px 30px rgba(220, 184, 255, 0.08)',
  shadowMd: '0 8px 60px rgba(220, 184, 255, 0.08)',
  glowHover: '0 0 15px rgba(220, 184, 255, 0.30)',
} as const;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.primary,
      dark: tokens.primaryContainer,
      contrastText: tokens.background,
    },
    secondary: {
      main: tokens.onSecondary,
      contrastText: tokens.onSurface,
    },
    warning: {
      main: tokens.tertiary,
    },
    background: {
      default: tokens.background,
      paper: tokens.surfaceContainer,
    },
    text: {
      primary: tokens.onSurface,
      secondary: tokens.onSurfaceVariant,
    },
    divider: 'rgba(76, 67, 84, 0.15)',
  },
  typography: {
    fontFamily: 'var(--font-lexend), "Lexend", sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.375rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    tokens.shadowSm,
    tokens.shadowSm,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 4, transition: 'all 250ms ease-in-out' },
        containedPrimary: {
          background: tokens.ctaGradient,
          color: tokens.onSurface,
          boxShadow: tokens.shadowSm,
          '&:hover': { background: tokens.ctaGradient, boxShadow: tokens.glowHover },
        },
        outlined: {
          borderColor: 'rgba(76, 67, 84, 0.20)',
          color: tokens.primary,
          '&:hover': {
            borderColor: tokens.primary,
            boxShadow: tokens.glowHover,
            backgroundColor: 'transparent',
          },
        },
        text: {
          color: tokens.primary,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: tokens.surfaceContainerLow,
          backgroundImage: 'none',
          borderRadius: 6,
          boxShadow: tokens.shadowSm,
          border: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { '&:last-child': { paddingBottom: 16 } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { background: tokens.surfaceContainer },
        elevation2: { background: tokens.surfaceContainerHigh },
        elevation3: { background: tokens.surfaceContainerHighest },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.surfaceContainerLowest,
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(76, 67, 84, 0.15)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(76, 67, 84, 0.40)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.primaryContainer,
            boxShadow: tokens.glowHover,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: tokens.onSurfaceVariant,
          '&.Mui-focused': { color: tokens.primary },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(76, 67, 84, 0.15)' },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: { backdropFilter: 'blur(4px)' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(53, 53, 52, 0.60)',
          backdropFilter: 'blur(20px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(53, 53, 52, 0.60)',
          backdropFilter: 'blur(20px)',
          backgroundImage: 'none',
          boxShadow: tokens.shadowSm,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.surfaceContainerHighest,
          color: tokens.onSurface,
          fontSize: '0.75rem',
          borderRadius: 4,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: { borderBottom: 'none' },
      },
    },
  },
});

export { tokens };
export default theme;
