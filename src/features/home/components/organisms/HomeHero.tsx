'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';

const HomeHero = () => {
  const t = useTranslations('home.hero');

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 4,
        textAlign: 'center',
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

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 560,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: tokens.primary,
          }}
        >
          {t('eyebrow')}
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: tokens.onSurface,
            textTransform: 'uppercase',
          }}
        >
          {t('title')}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: tokens.onSurfaceVariant,
            fontWeight: 500,
            lineHeight: 1.6,
            maxWidth: 420,
          }}
        >
          {t('description')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
          <AppButton component={Link} href="/auth" variant="primary">
            {t('cta')}
          </AppButton>
          <AppButton component={Link} href="/matches" variant="secondary">
            {t('ctaSecondary')}
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeHero;
