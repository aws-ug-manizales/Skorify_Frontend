'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';

const GroupsHome = () => {
  const t = useTranslations('groups');
  const router = useRouter();

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 6,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.04em',
              color: tokens.onSurface,
              textTransform: 'uppercase',
              lineHeight: 1,
              mb: 1.5,
            }}
          >
            {t('title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsSoccerIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: tokens.onSurfaceVariant,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('subtitle')}
            </Typography>
          </Box>
        </Box>

        <AppButton
          variant="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/groups/create')}
          sx={{
            borderRadius: '999px',
            px: 3,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {t('create')}
        </AppButton>
      </Box>

      {/* Empty state */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 12,
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: tokens.surfaceContainerHigh,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SportsSoccerIcon sx={{ fontSize: '2.5rem', color: `${tokens.onSurfaceVariant}66` }} />
        </Box>
        <Typography
          sx={{ color: tokens.onSurfaceVariant, fontSize: '0.875rem', textAlign: 'center' }}
        >
          {t('emptyState')}
        </Typography>
        <AppButton
          variant="secondary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/groups/create')}
        >
          {t('create')}
        </AppButton>
      </Box>
    </Box>
  );
};

export default GroupsHome;
