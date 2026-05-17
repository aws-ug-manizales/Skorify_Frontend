'use client';

import type { AnimationEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormField from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
} from 'react-hook-form';

type Mode = 'login' | 'register';

interface AuthGatewayFormProps<T extends FieldValues> {
  mode: Mode;
  phase: 'idle' | 'exiting' | 'entering';
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  submitLabel: string;
  isSubmitting: boolean;
  isTransitioning: boolean;
  direction: 'forward' | 'backward';
  onAnimationEnd: (event: AnimationEvent<HTMLDivElement>) => void;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
}

const AuthGatewayForm = <T extends FieldValues>({
  mode,
  phase,
  control,
  handleSubmit,
  onSubmit,
  submitLabel,
  isSubmitting,
  isTransitioning,
  direction,
  onAnimationEnd,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  nicknameLabel,
  nicknamePlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
}: AuthGatewayFormProps<T>) => (
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
        />
      </Box>
    )}

    <Box
      key={`${mode}-${phase}`}
      onAnimationEnd={onAnimationEnd}
      sx={{
        willChange: 'transform, opacity, filter',
        animation:
          phase === 'exiting'
            ? `authPanelExit 240ms cubic-bezier(0.4, 0, 1, 1) forwards`
            : phase === 'entering'
              ? `authPanelEnter 360ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards`
              : 'none',
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
          <FormField<T>
            name={'nickname' as Path<T>}
            control={control}
            label={nicknameLabel}
            placeholder={nicknamePlaceholder}
            autoComplete="username"
            fullWidth
          />
        )}

        <FormField<T>
          name={'email' as Path<T>}
          control={control}
          label={emailLabel}
          placeholder={emailPlaceholder}
          autoComplete="email"
          fullWidth
        />

        <FormField<T>
          name={'password' as Path<T>}
          control={control}
          type="password"
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          fullWidth
        />

        {mode === 'register' && (
          <FormField<T>
            name={'confirmPassword' as Path<T>}
            control={control}
            type="password"
            label={confirmPasswordLabel}
            placeholder={confirmPasswordPlaceholder}
            autoComplete="new-password"
            fullWidth
          />
        )}

        <AppButton type="submit" loading={isSubmitting} fullWidth>
          {submitLabel}
        </AppButton>
      </Stack>
    </Box>
  </Box>
);

export default AuthGatewayForm;
