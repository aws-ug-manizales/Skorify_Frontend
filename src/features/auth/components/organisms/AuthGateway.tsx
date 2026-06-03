'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import AuthGatewayHeader from '../molecules/AuthGatewayHeader';
import AuthGatewayModeTabs from '../molecules/AuthGatewayModeTabs';
import AuthGatewayForm from './AuthGatewayForm';
import AuthConfirmSignUpForm from './AuthConfirmSignUpForm';
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
    pendingEmail,
    confirmationCode,
    setConfirmationCode,
    codeError,
    isConfirming,
    isResending,
    handleConfirmSubmit,
    handleResendCode,
  } = useAuthGateway();

  const isConfirmMode = mode === 'confirm';

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: tokens.background,
      }}
    >
      {/* Left panel: hero image + branding */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          width: { xs: '100%', md: '50%', lg: '58%' },
          flex: { xs: 1, md: 'none' },
          minHeight: { xs: 280, md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          overflow: 'hidden',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/podium-stadium.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.1)',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${tokens.background} 0%, ${tokens.background}66 45%, transparent 100%)`,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: `${tokens.primaryContainer}1A`,
            mixBlendMode: 'multiply',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 4, md: 8, lg: 12 },
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: 640,
          }}
        >
          <Typography
            component="span"
            sx={{
              display: 'inline-block',
              mb: { xs: 1.5, md: 3 },
              fontSize: { xs: '2rem', md: '3.25rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.05em',
              background: tokens.ctaGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Skorify
          </Typography>

          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: { md: '3rem', lg: '3.75rem' },
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: tokens.onSurface,
              mb: 3,
            }}
          >
            {t.rich('heroTitle', {
              hl: (chunks) => (
                <Box component="span" sx={{ color: tokens.primary }}>
                  {chunks}
                </Box>
              ),
            })}
          </Typography>

          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: { md: '1.0625rem', lg: '1.125rem' },
              fontWeight: 300,
              lineHeight: 1.6,
              color: tokens.onSurfaceVariant,
              maxWidth: 520,
            }}
          >
            {t('heroSubtitle')}
          </Typography>
        </Box>
      </Box>

      {/* Right panel: form (acts as a slide-up bottom sheet on mobile) */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          zIndex: 1,
          flex: { xs: 'none', md: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: tokens.surfaceContainerLow,
          px: { xs: 3, sm: 6, lg: 10 },
          pt: { xs: 1.5, md: 8 },
          pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 32px)', md: 8 },
          mt: { xs: -3, md: 0 },
          borderRadius: { xs: '24px 24px 0 0', md: 0 },
          boxShadow: { xs: `0 -8px 32px ${tokens.background}CC`, md: 'none' },
          animation: {
            xs: 'snackbarSlideUp 320ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            md: 'none',
          },
          '@keyframes snackbarSlideUp': {
            '0%': { transform: 'translateY(100%)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        }}
      >
        {/* Drag handle — mobile bottom-sheet affordance */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'block', md: 'none' },
            width: 36,
            height: 4,
            borderRadius: 2,
            bgcolor: tokens.outlineVariant,
            opacity: 0.5,
            mb: 2,
          }}
        />
        <Stack spacing={3.5} sx={{ width: '100%', maxWidth: 440 }}>
          <AuthGatewayHeader title={t('title')} subtitle={t('subtitle')} />

          {!isConfirmMode && (
            <AuthGatewayModeTabs
              mode={mode}
              loginLabel={t('loginTab')}
              registerLabel={t('registerTab')}
              onChange={handleModeChange}
            />
          )}

          {isConfirmMode ? (
            <AuthConfirmSignUpForm
              email={pendingEmail}
              code={confirmationCode}
              onCodeChange={setConfirmationCode}
              onSubmit={handleConfirmSubmit}
              onResend={handleResendCode}
              isSubmitting={isConfirming}
              isResending={isResending}
              codeError={codeError}
              title={t('confirm.title')}
              description={t('confirm.description', { email: pendingEmail })}
              codeLabel={t('confirm.codeLabel')}
              codePlaceholder={t('confirm.codePlaceholder')}
              submitLabel={t('confirm.submitCta')}
              resendLabel={t('confirm.resendCta')}
            />
          ) : (
            <>
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
            </>
          )}

          {notice && <Alert severity={notice.type}>{notice.text}</Alert>}
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthGateway;
