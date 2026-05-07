'use client';

import { tokens } from '@/lib/theme/theme';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ReactNode } from 'react';

interface PublicJoinLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: string;
}

export const PublicJoinLayout = ({ children, title, subtitle, footer }: PublicJoinLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: tokens.background,
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${tokens.primaryContainer}26 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 2,
              color: tokens.onSurface,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: tokens.onSurfaceVariant,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Card
          sx={{
            bgcolor: tokens.surfaceContainerLow,
            borderRadius: '12px',
            border: `1px solid ${tokens.outlineVariant}26`,
            boxShadow: tokens.shadowMd,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>{children}</CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: tokens.onSurfaceVariant,
              fontSize: '0.875rem',
            }}
          >
            {footer}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
