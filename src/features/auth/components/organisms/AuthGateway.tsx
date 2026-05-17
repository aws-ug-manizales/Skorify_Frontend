'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import GoogleIcon from '@mui/icons-material/Google';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import FloatingParticles from '@shared/components/organisms/FloatingParticles';
import AuthGatewayHeader from '../molecules/AuthGatewayHeader';
import AuthGatewayModeTabs from '../molecules/AuthGatewayModeTabs';
import AuthGatewayForm from './AuthGatewayForm';
import { useAuthGateway } from '../../hooks/useAuthGateway';

const AuthGateway = () => {
  const {
    mode,
    phase,
    notice,
    control,
    isSubmitting,
    isTransitioning,
    direction,
    submitLabel,
    handleSubmit,
    handleModeChange,
    handlePanelAnimationEnd,
    handleGoogleSubmit,
    submit,
    t,
  } = useAuthGateway();

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: { xs: 'flex-end', sm: 'center' },
        justifyContent: 'center',
        px: { xs: 0, sm: 2 },
        py: { xs: 0, sm: 5 },
        background: `radial-gradient(circle at 25% 20%, ${tokens.primaryContainer}3D 0%, transparent 55%), linear-gradient(180deg, ${tokens.background}, ${tokens.surfaceContainerLow})`,
      }}
    >
      <FloatingParticles />
      <AppCard
        variant="elevated"
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 520 },
          borderRadius: { xs: '24px 24px 0 0', sm: 4 },
          overflow: 'hidden',
          boxShadow: { xs: `0 -8px 32px ${tokens.background}CC`, sm: tokens.shadowMd },
          animation: {
            xs: 'snackbarSlideUp 320ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            sm: 'none',
          },
          '@keyframes snackbarSlideUp': {
            '0%': { transform: 'translateY(100%)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            pt: 1.25,
            pb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: tokens.outlineVariant,
              opacity: 0.5,
            }}
          />
        </Box>
        <Stack
          spacing={3.5}
          sx={{
            p: { xs: 2.5, sm: 4 },
            pt: { xs: 1, sm: 4 },
            pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 24px)', sm: 4 },
          }}
        >
          <AuthGatewayHeader title={t('title')} subtitle={t('subtitle')} />

          <AuthGatewayModeTabs
            mode={mode}
            loginLabel={t('loginTab')}
            registerLabel={t('registerTab')}
            onChange={handleModeChange}
          />

          <AuthGatewayForm
            mode={mode}
            phase={phase}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={submit}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
            isTransitioning={isTransitioning}
            direction={direction}
            onAnimationEnd={handlePanelAnimationEnd}
            emailLabel={t('emailLabel')}
            emailPlaceholder={t('emailPlaceholder')}
            passwordLabel={t('passwordLabel')}
            passwordPlaceholder={t('passwordPlaceholder')}
            nicknameLabel={t('nicknameLabel')}
            nicknamePlaceholder={t('nicknamePlaceholder')}
            confirmPasswordLabel={t('confirmPasswordLabel')}
            confirmPasswordPlaceholder={t('confirmPasswordPlaceholder')}
          />

          <Divider>{t('or')}</Divider>

          <AppButton
            variant="secondary"
            onClick={handleGoogleSubmit}
            startIcon={<GoogleIcon />}
            fullWidth
          >
            {t('googleCta')}
          </AppButton>

          {notice && <Alert severity={notice.type}>{notice.text}</Alert>}
        </Stack>
      </AppCard>
    </Box>
  );
};

export default AuthGateway;
