'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppButton from '@shared/components/atoms/AppButton';
import Link from 'next/link';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';

type Props = {
  title: string;
};

const ComingSoonPage = ({ title }: Props) => {
  const t = useTranslations('common');

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: `${tokens.primaryContainer}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SportsSoccerIcon sx={{ color: tokens.primary, fontSize: '2rem' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: tokens.onSurface,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem' }}>
          {t('comingSoon')}
        </Typography>
      </Box>

      <AppButton component={Link} href="/home" variant="secondary">
        {t('backToHome')}
      </AppButton>
    </Box>
  );
};

export default ComingSoonPage;
