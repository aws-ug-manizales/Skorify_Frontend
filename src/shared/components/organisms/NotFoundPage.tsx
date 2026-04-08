'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';

const NotFoundPage = () => {
  const t = useTranslations('notFound');

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: tokens.background,
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
          background: `radial-gradient(circle at 50% 50%, ${tokens.primaryContainer}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 256,
          height: 256,
          borderRadius: '50%',
          bgcolor: `${tokens.primaryContainer}1A`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: `${tokens.onSecondary}1A`,
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '75%',
          height: '1px',
          bgcolor: `${tokens.outlineVariant}33`,
          transform: 'rotate(-3deg)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '76%',
          height: '1px',
          bgcolor: `${tokens.outlineVariant}1A`,
          transform: 'rotate(-2deg)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 6,
            height: '5rem',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: tokens.primary,
              textTransform: 'uppercase',
            }}
          >
            {t('branding')}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 'calc(50% - 16px)',
              '@keyframes ballRoll': {
                '0%': { transform: 'translateX(0)', opacity: 0 },
                '5%': { transform: 'translateX(0)', opacity: 1 },
                '62%': { transform: 'translateX(0)', opacity: 1 },
                '80%': { transform: 'translateX(260px)', opacity: 0 },
                '100%': { transform: 'translateX(0)', opacity: 0 },
              },
              animation: 'ballRoll 5s ease-in infinite',
            }}
          >
            <SportsSoccerIcon
              sx={{
                color: tokens.primary,
                fontSize: '2rem',
                display: 'block',
                '@keyframes ballBounce': {
                  '0%': {
                    transform: 'translateY(-260px) rotate(0deg)',
                    animationTimingFunction: 'ease-in',
                  },
                  '18%': {
                    transform: 'translateY(2px) rotate(0deg) scaleY(0.72)',
                    animationTimingFunction: 'ease-out',
                  },
                  '22%': {
                    transform: 'translateY(0) rotate(0deg) scaleY(1)',
                    animationTimingFunction: 'ease-in',
                  },
                  '30%': {
                    transform: 'translateY(-70px) rotate(35deg)',
                    animationTimingFunction: 'ease-in',
                  },
                  '38%': {
                    transform: 'translateY(2px) rotate(62deg) scaleY(0.83)',
                    animationTimingFunction: 'ease-out',
                  },
                  '41%': {
                    transform: 'translateY(0) rotate(62deg) scaleY(1)',
                    animationTimingFunction: 'ease-in',
                  },
                  '47%': {
                    transform: 'translateY(-32px) rotate(88deg)',
                    animationTimingFunction: 'ease-in',
                  },
                  '53%': {
                    transform: 'translateY(2px) rotate(112deg) scaleY(0.90)',
                    animationTimingFunction: 'ease-out',
                  },
                  '55%': {
                    transform: 'translateY(0) rotate(112deg) scaleY(1)',
                    animationTimingFunction: 'ease-in',
                  },
                  '58%': {
                    transform: 'translateY(-10px) rotate(122deg)',
                    animationTimingFunction: 'ease-in',
                  },
                  '62%': {
                    transform: 'translateY(0) rotate(130deg)',
                    animationTimingFunction: 'linear',
                  },
                  '80%': { transform: 'translateY(0) rotate(580deg)' },
                  '100%': { transform: 'translateY(-260px) rotate(0deg)' },
                },
                animation: 'ballBounce 5s ease-out infinite',
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Typography
            aria-hidden
            sx={{
              fontSize: '8rem',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: tokens.surfaceContainerHighest,
              opacity: 0.2,
              userSelect: 'none',
            }}
          >
            {t('code')}
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              fontSize: '4rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: tokens.primary,
              textShadow: `0 0 15px ${tokens.primary}66`,
              lineHeight: 1,
            }}
          >
            {t('code')}
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: tokens.onSurface,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          {t('title')}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: tokens.onSurfaceVariant, fontWeight: 500, lineHeight: 1.6, mb: 5 }}
        >
          {t('description')}
        </Typography>

        <AppButton
          component={Link}
          href="/"
          variant="primary"
          endIcon={<ArrowForwardIcon />}
          fullWidth
          sx={{
            py: 1.75,
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 900,
            boxShadow: `0 0 30px ${tokens.primaryContainer}4D`,
          }}
        >
          {t('cta')}
        </AppButton>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
