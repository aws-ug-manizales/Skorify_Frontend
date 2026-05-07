'use client';

import { createTheme } from '@mui/material/styles';

const tokens = {
  // Primary — purple
  primary: '#ca98ff',
  primaryContainer: '#8A2BE2',
  primaryDim: '#9c42f4',
  onPrimary: '#46007d',

  // Secondary — orange
  secondary: '#ff8a00',
  secondaryContainer: '#914c00',
  onSecondary: '#442100',

  // Tertiary — golden
  tertiary: '#ffe792',

  // Surfaces
  background: '#0d0d15',
  surfaceBright: '#2b2b38',
  surfaceContainer: '#191922',
  surfaceContainerHigh: '#1f1f29',
  surfaceContainerHighest: '#252530',
  surfaceContainerLow: '#13131b',
  surfaceContainerLowest: '#000000',

  // Text
  onSurface: '#efecf8',
  onSurfaceVariant: '#acaab5',

  // Borders
  outlineVariant: '#484750',

  // Status
  success: '#00C853',
  error: '#ff6e84',

  // Gradient — purple → orange (kinetic brand)
  ctaGradient: 'linear-gradient(135deg, #8A2BE2 0%, #FF8A00 100%)',

  // Effects
  shadowSm: '0 4px 30px rgba(202, 152, 255, 0.08)',
  shadowMd: '0 8px 60px rgba(202, 152, 255, 0.08)',
  glowHover: '0 0 20px rgba(202, 152, 255, 0.25)',

  // External brands (kept here for single-source-of-truth)
  whatsapp: '#25D366',
} as const;

const avatarPalette = [
  tokens.primaryContainer,
  tokens.secondaryContainer,
  tokens.surfaceContainerHighest,
  '#1a4a2e',
  '#2a1f4a',
  '#2E7D32',
  '#1565C0',
  '#6A1B9A',
  '#C62828',
] as const;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.primary,
      dark: tokens.primaryContainer,
      contrastText: tokens.onPrimary,
    },
    secondary: {
      main: tokens.secondary,
      dark: tokens.secondaryContainer,
      contrastText: tokens.onSecondary,
    },
    warning: {
      main: tokens.tertiary,
    },
    error: {
      main: tokens.error,
    },
    success: {
      main: tokens.success,
    },
    background: {
      default: tokens.background,
      paper: tokens.surfaceContainer,
    },
    text: {
      primary: tokens.onSurface,
      secondary: tokens.onSurfaceVariant,
    },
    divider: `${tokens.outlineVariant}26`,
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
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 250ms ease-in-out',
          fontWeight: 700,
        },
        containedPrimary: {
          background: tokens.ctaGradient,
          color: tokens.onSurface,
          '&:hover': {
            background: tokens.ctaGradient,
            boxShadow: tokens.glowHover,
            filter: 'brightness(1.1)',
          },
          '&:active': { transform: 'scale(0.97)' },
        },
        containedSecondary: {
          background: tokens.secondary,
          color: tokens.onSecondary,
          '&:hover': {
            background: tokens.secondary,
            filter: 'brightness(1.1)',
          },
        },
        outlined: {
          borderColor: `${tokens.outlineVariant}33`,
          color: tokens.primary,
          '&:hover': {
            borderColor: tokens.primary,
            boxShadow: tokens.glowHover,
            backgroundColor: `${tokens.primary}0D`,
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
          borderRadius: 8,
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
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `${tokens.outlineVariant}26`,
            borderRadius: 12,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${tokens.outlineVariant}66`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.primaryContainer,
            boxShadow: tokens.glowHover,
          },
          '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
            {
              WebkitBoxShadow: `0 0 0 1000px ${tokens.surfaceContainerLowest} inset`,
              WebkitTextFillColor: tokens.onSurface,
              caretColor: tokens.onSurface,
              borderRadius: 'inherit',
              transition: 'background-color 9999s ease-in-out 0s',
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
        root: { borderColor: `${tokens.outlineVariant}26` },
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
          backgroundColor: `${tokens.background}D9`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: `${tokens.background}D9`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundImage: 'none',
          boxShadow: `0 1px 0 ${tokens.outlineVariant}26`,
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

export { tokens, avatarPalette };
export default theme;
