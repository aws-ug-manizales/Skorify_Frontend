'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { loginSchema, registerFormSchema } from '@features/auth/lib/schemas';
import type { RegisterFormInput } from '@features/auth/lib/schemas';
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
import FloatingParticles from '@shared/components/organisms/FloatingParticles';

type Mode = 'login' | 'register';

type AuthFormData = RegisterFormInput;

type ErrorNode = Record<string, unknown>;

const translateErrorTree = (
  errors: ErrorNode | undefined,
  translate: (key: string) => string,
): ErrorNode => {
  if (!errors) return {};
  const out: ErrorNode = {};
  for (const [key, value] of Object.entries(errors)) {
    if (value && typeof value === 'object') {
      const node = value as ErrorNode;
      if (typeof node.message === 'string' && node.message) {
        out[key] = { ...node, message: translate(node.message) };
      } else {
        out[key] = translateErrorTree(node, translate);
      }
    } else {
      out[key] = value;
    }
  }
  return out;
};

const EMPTY_FORM: AuthFormData = {
  email: '',
  password: '',
  nickname: '',
  confirmPassword: '',
};

const AuthGateway = () => {
  const router = useRouter();
  const t = useTranslations('auth');
  const [mode, setMode] = useState<Mode>('login');
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isTransitioning = exiting || entering;

  const handleModeChange = (_: React.SyntheticEvent, value: Mode) => {
    if (value === mode || isTransitioning) return;
    setDirection(value === 'register' ? 'forward' : 'backward');
    setPendingMode(value);
    setExiting(true);
  };

  const handlePanelAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === 'authPanelExit' && exiting && pendingMode) {
      setMode(pendingMode);
      setExiting(false);
      setEntering(true);
      return;
    }
    if (event.animationName === 'authPanelEnter' && entering) {
      setEntering(false);
      setPendingMode(null);
    }
  };

  const registerWithEmail = useAuthStore((state) => state.registerWithEmail);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const tRoot = useTranslations();
  const translateKey = useCallback(
    (key?: string, fallback?: string) => (key ? tRoot(key) : (fallback ?? '')),
    [tRoot],
  );

  const resolver = useMemo<Resolver<AuthFormData>>(() => {
    const base = zodResolver(
      mode === 'register' ? registerFormSchema : loginSchema,
    ) as unknown as Resolver<AuthFormData>;

    const wrapped: Resolver<AuthFormData> = async (values, context, options) => {
      const result = await base(values, context, options);
      return {
        ...result,
        errors: translateErrorTree(result.errors as ErrorNode, translateKey),
      } as Awaited<ReturnType<Resolver<AuthFormData>>>;
    };
    return wrapped;
  }, [mode, translateKey]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
    reset,
    clearErrors,
  } = useForm<AuthFormData>({
    defaultValues: EMPTY_FORM,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver,
  });

  useEffect(() => {
    clearErrors();
  }, [mode, clearErrors]);

  const submitLabel = useMemo(
    () => (mode === 'login' ? t('loginCta') : t('registerCta')),
    [mode, t],
  );

  const onSubmit = (values: AuthFormData) => {
    setNotice(null);

    const result =
      mode === 'register'
        ? registerWithEmail({
            email: values.email,
            password: values.password,
            nickname: values.nickname,
          })
        : loginWithEmail({ email: values.email, password: values.password });

    if (!result.ok) {
      if (result.fieldErrors?.email) {
        setError('email', { message: translateKey(result.fieldErrors.email) });
      }
      if (result.fieldErrors?.password) {
        setError('password', { message: translateKey(result.fieldErrors.password) });
      }
      if (result.fieldErrors?.nickname) {
        setError('nickname', { message: translateKey(result.fieldErrors.nickname) });
      }
      if (result.messageKey) {
        setNotice({ type: 'error', text: translateKey(result.messageKey, t('genericError')) });
      }
      return;
    }

    setNotice({
      type: 'success',
      text: translateKey(result.messageKey, t('sessionCreated')),
    });
    reset();
    router.replace('/home');
  };

  const handleGoogleLogin = () => {
    const result = loginWithGoogle();

    if (!result.ok) {
      setNotice({ type: 'error', text: translateKey(result.messageKey, t('genericError')) });
      return;
    }

    setNotice({
      type: 'success',
      text: translateKey(result.messageKey, t('sessionCreated')),
    });
    router.replace('/home');
  };

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

          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {isTransitioning && (
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  pointerEvents: 'none',
                  zIndex: 5,
                  transform: 'translateY(-50%)',
                  filter: `drop-shadow(0 6px 12px ${tokens.primary}66)`,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    animation: `authBallRoll${direction === 'forward' ? 'Right' : 'Left'} 600ms linear forwards`,
                    '@keyframes authBallRollRight': {
                      '0%': { transform: 'translateX(-72px) rotate(0deg)', opacity: 0 },
                      '12%': { opacity: 1 },
                      '88%': { opacity: 1 },
                      '100%': {
                        transform: 'translateX(calc(100% + 72px)) rotate(900deg)',
                        opacity: 0,
                      },
                    },
                    '@keyframes authBallRollLeft': {
                      '0%': {
                        transform: 'translateX(calc(100% + 72px)) rotate(0deg)',
                        opacity: 0,
                      },
                      '12%': { opacity: 1 },
                      '88%': { opacity: 1 },
                      '100%': {
                        transform: 'translateX(-72px) rotate(-900deg)',
                        opacity: 0,
                      },
                    },
                  }}
                >
                  <SportsSoccerIcon
                    sx={{
                      fontSize: 56,
                      color: tokens.primary,
                      animation: 'authBallSpin 200ms linear infinite',
                      '@keyframes authBallSpin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            <Box
              key={exiting ? `${mode}-exit` : mode}
              onAnimationEnd={handlePanelAnimationEnd}
              sx={{
                willChange: 'transform, opacity, filter',
                animation: exiting
                  ? `authPanelExit 240ms cubic-bezier(0.4, 0, 1, 1) forwards`
                  : `authPanelEnter 360ms cubic-bezier(0.2, 0.9, 0.3, 1)`,
                '@keyframes authPanelExit': {
                  '0%': { opacity: 1, transform: 'translateX(0)', filter: 'blur(0)' },
                  '100%': {
                    opacity: 0,
                    transform: `translateX(${direction === 'forward' ? '-16px' : '16px'})`,
                    filter: 'blur(2px)',
                  },
                },
                '@keyframes authPanelEnter': {
                  '0%': {
                    opacity: 0,
                    transform: `translateX(${direction === 'forward' ? '16px' : '-16px'})`,
                    filter: 'blur(2px)',
                  },
                  '60%': { opacity: 1, filter: 'blur(0)' },
                  '100%': { opacity: 1, transform: 'translateX(0)', filter: 'blur(0)' },
                },
              }}
            >
              <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1 }}>
                {mode === 'register' && (
                  <FormField<AuthFormData>
                    name="nickname"
                    control={control}
                    label={t('nicknameLabel')}
                    placeholder={t('nicknamePlaceholder')}
                    autoComplete="username"
                    fullWidth
                    sx={{
                      animation: !exiting ? `authFieldStagger 420ms ease-out 40ms both` : 'none',
                      '@keyframes authFieldStagger': {
                        '0%': { opacity: 0, transform: 'translateY(8px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  />
                )}

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
                    sx={{
                      animation: !exiting ? `authFieldStagger 420ms ease-out 80ms both` : 'none',
                    }}
                  />
                )}
                <AppButton type="submit" loading={isSubmitting} fullWidth>
                  {submitLabel}
                </AppButton>
              </Stack>
            </Box>
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
        </Stack>
      </AppCard>
    </Box>
  );
};

export default AuthGateway;
