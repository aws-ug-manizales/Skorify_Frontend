'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { loginSchema, registerFormSchema } from '../lib/schemas';
import type { RegisterFormInput } from '../lib/schemas';
import { useAuthStore } from '../store/useAuthStore';

type Mode = 'login' | 'register';
type TransitionPhase = 'idle' | 'exiting' | 'entering';
type AuthFormData = RegisterFormInput;
type ErrorNode = Record<string, unknown>;

const EMPTY_FORM: AuthFormData = {
  email: '',
  password: '',
  nickname: '',
  confirmPassword: '',
};

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

export const useAuthGateway = () => {
  const router = useRouter();
  const t = useTranslations('auth');
  const tRoot = useTranslations();

  const [mode, setMode] = useState<Mode>('login');
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isTransitioning = phase !== 'idle';

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

  const registerWithEmail = useAuthStore((state) => state.registerWithEmail);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  useEffect(() => {
    clearErrors();
  }, [mode, clearErrors]);

  const handleModeChange = (_: React.SyntheticEvent, value: Mode) => {
    if (value === mode || isTransitioning) return;
    setDirection(value === 'register' ? 'forward' : 'backward');
    setPendingMode(value);
    setPhase('exiting');
  };

  const handlePanelAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === 'authPanelExit' && phase === 'exiting' && pendingMode) {
      setMode(pendingMode);
      setPhase('entering');
      return;
    }
    if (event.animationName === 'authPanelEnter' && phase === 'entering') {
      setPhase('idle');
      setPendingMode(null);
    }
  };

  const submit = useCallback(
    (values: AuthFormData) => {
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
    },
    [loginWithEmail, mode, registerWithEmail, reset, router, setError, t, translateKey],
  );

  const handleGoogleSubmit = useCallback(() => {
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
  }, [loginWithGoogle, router, t, translateKey]);

  const submitLabel = useMemo(
    () => (mode === 'login' ? t('loginCta') : t('registerCta')),
    [mode, t],
  );

  return {
    mode,
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
    phase,
  };
};
