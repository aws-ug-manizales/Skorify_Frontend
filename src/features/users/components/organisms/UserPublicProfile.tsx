'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';

interface UserPublicProfileProps {
  userId: string;
}

const UserPublicProfile = ({}: UserPublicProfileProps) => {
  const t = useTranslations('userProfile');

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <AppButton
          component={Link}
          href="/groups"
          variant="tertiary"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          sx={{ fontSize: '0.6875rem', minHeight: 'unset', px: 1, py: 0.5 }}
        >
          {t('backToGroups')}
        </AppButton>
      </Box>

      <AppCard>
        <Stack
          alignItems="center"
          spacing={1.5}
          sx={{ py: { xs: 6, md: 8 }, px: 3, textAlign: 'center' }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: tokens.surfaceContainerHigh,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonOffIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.125rem', color: tokens.onSurface }}>
            {t('unavailableTitle')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: tokens.onSurfaceVariant, maxWidth: 360, lineHeight: 1.5 }}
          >
            {t('unavailableSubtitle')}
          </Typography>
        </Stack>
      </AppCard>
    </Box>
  );
};

export default UserPublicProfile;
