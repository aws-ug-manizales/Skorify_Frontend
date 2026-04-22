'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import AppButton from '@shared/components/atoms/AppButton';
import FormField from '@shared/components/atoms/FormField';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FloatingParticles from './FloatingParticles';

type Mode = 'login' | 'register';

type AuthFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthGateway = () => {
  const router = useRouter();
  const t = useTranslations('auth');
  const [mode, setMode] = useState<Mode>('login');
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [exiting, setExiting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleModeChange = (_: React.SyntheticEvent, value: Mode) => {
    if (value === mode) return;
    setPendingMode(value);
    setExiting(true);
  };

  const handleAnimationEnd = () => {
    if (exiting && pendingMode) {
      setMode(pendingMode);
      setPendingMode(null);
      setExiting(false);
    }
  };

  const registerWithEmail = useAuthStore((state) => state.registerWithEmail);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
    reset,
  } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const submitLabel = useMemo(
    () => (mode === 'login' ? t('loginCta') : t('registerCta')),
    [mode, t],
  );

  const onSubmit = (values: AuthFormData) => {
    setNotice(null);

    if (mode === 'register' && values.confirmPassword !== values.password) {
      setError('confirmPassword', { message: t('passwordMismatch') });
      return;
    }

    const result = mode === 'register' ? registerWithEmail(values) : loginWithEmail(values);

    if (!result.ok) {
      if (result.fieldErrors?.email) {
        setError('email', { message: result.fieldErrors.email });
      }
      if (result.fieldErrors?.password) {
        setError('password', { message: result.fieldErrors.password });
      }
      if (result.message) {
        setNotice({ type: 'error', text: result.message });
      }
      return;
    }

    setNotice({ type: 'success', text: result.message ?? t('sessionCreated') });
    reset();
    router.replace('/home');
  };

  const handleGoogleLogin = () => {
    const result = loginWithGoogle();

    if (!result.ok) {
      setNotice({ type: 'error', text: result.message ?? t('genericError') });
      return;
    }

    setNotice({ type: 'success', text: result.message ?? t('sessionCreated') });
    router.replace('/home');
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 5,
        background: `radial-gradient(circle at 25% 20%, ${tokens.primaryContainer}3D 0%, transparent 55%), linear-gradient(180deg, ${tokens.background}, ${tokens.surfaceContainerLow})`,
      }}
    >
      <FloatingParticles />
      <AppCard
        variant="elevated"
        sx={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Stack spacing={3.5} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={1}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: tokens.primary,
                textTransform: 'uppercase',
              }}
            >
              {t('title')}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                top: 0,
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
            <Typography align="center" sx={{ color: tokens.onSurfaceVariant }}>
              {t('subtitle')}
            </Typography>
          </Stack>

          <Tabs centered value={mode} onChange={handleModeChange}>
            <Tab label={t('loginTab')} value="login" />
            <Tab label={t('registerTab')} value="register" />
          </Tabs>

          <Box key={mode}>
            <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
              <FormField<AuthFormData>
                name="email"
                control={control}
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                fullWidth
              />

              <FormField<AuthFormData>
                name="password"
                control={control}
                type="password"
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                fullWidth
              />
              {mode === 'register' && (
                <FormField<AuthFormData>
                  name="confirmPassword"
                  control={control}
                  type="password"
                  label={t('confirmPasswordLabel')}
                  placeholder={t('confirmPasswordPlaceholder')}
                  autoComplete="new-password"
                  fullWidth
                />
              )}
              <AppButton
                key={mode}
                type="submit"
                loading={isSubmitting}
                fullWidth
                onAnimationEnd={handleAnimationEnd}
                sx={{
                  animation: exiting
                    ? `fadeOutDown 0.3s ease-in forwards`
                    : `fadeInLeft 0.4s ease-out`,
                  '@keyframes fadeOutDown': {
                    '0%': { opacity: 1, transform: 'translateY(0)' },
                    '100%': { opacity: 0, transform: 'translateY(20px)' },
                  },
                  '@keyframes fadeInLeft': {
                    '0%': { opacity: 0, transform: 'translateX(-20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                {submitLabel}
              </AppButton>
            </Stack>
          </Box>

          <Divider>{t('or')}</Divider>

          <AppButton
            variant="secondary"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            fullWidth
          >
            {t('googleCta')}
          </AppButton>

          {notice && <Alert severity={notice.type}>{notice.text}</Alert>}

          {/* <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
            {t('registrationConfirmationOptional')}
          </Typography> */}
        </Stack>
      </AppCard>
    </Box>
  );
};

export default AuthGateway;
