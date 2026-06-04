'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { loginSchema, registerFormSchema } from '../lib/schemas';
import type { RegisterFormInput } from '../lib/schemas';
import { useAuthStore } from '../store/useAuthStore';
<<<<<<< HEAD
=======
import { useNotification, NotificationType } from '@shared/notifications';
import { TOUR_LOGIN_FLAG } from '@features/dashboard/tourFlag';
import { JOIN_CODE_PARAM, PENDING_JOIN_CODE_KEY } from '@features/groups/joinFlag';
>>>>>>> origin/develop

type Mode = 'login' | 'register' | 'confirm';
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
<<<<<<< HEAD
=======
  const { show: notify } = useNotification();
>>>>>>> origin/develop

  const [mode, setMode] = useState<Mode>('login');
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
  const confirmSignUp = useAuthStore((state) => state.confirmSignUp);
  const resendConfirmationCode = useAuthStore((state) => state.resendConfirmationCode);

  useEffect(() => {
    clearErrors();
  }, [mode, clearErrors]);

<<<<<<< HEAD
=======
  // Persist an invite code arriving on the `/auth?joinCode=` URL so the join
  // flow survives the (possibly OAuth) login and the dashboard can resume it.
  // Read from window.location to avoid needing a Suspense boundary.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const code = new URLSearchParams(window.location.search).get(JOIN_CODE_PARAM);
    if (code) sessionStorage.setItem(PENDING_JOIN_CODE_KEY, code);
  }, []);

>>>>>>> origin/develop
  const transitionTo = useCallback(
    (next: Mode, dir: 'forward' | 'backward') => {
      if (next === mode || isTransitioning) return;
      setDirection(dir);
      setPendingMode(next);
      setPhase('exiting');
    },
    [mode, isTransitioning],
  );

  const handleModeChange = (_: React.SyntheticEvent, value: Mode) => {
    if (value !== 'login' && value !== 'register') return;
    transitionTo(value, value === 'register' ? 'forward' : 'backward');
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
    async (values: AuthFormData) => {
      setNotice(null);

      const result =
        mode === 'register'
          ? await registerWithEmail({
              email: values.email,
              password: values.password,
              nickname: values.nickname,
            })
          : await loginWithEmail({ email: values.email, password: values.password });

      if (!result.ok) {
        if (result.needsConfirmation && result.pendingEmail) {
          setPendingEmail(result.pendingEmail);
          setNotice({
            type: 'error',
            text: translateKey(result.messageKey, t('genericError')),
          });
          transitionTo('confirm', 'forward');
          return;
        }
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

      if (result.needsConfirmation && result.pendingEmail) {
        setPendingEmail(result.pendingEmail);
        setNotice({
          type: 'success',
          text: translateKey(result.messageKey, t('sessionCreated')),
        });
        transitionTo('confirm', 'forward');
        return;
      }

<<<<<<< HEAD
=======
      if (mode === 'register') {
        reset();
        notify({
          type: NotificationType.MODAL,
          titleKey: 'auth.registeredModal.title',
          messageKey: 'auth.registeredModal.message',
          actions: [
            {
              labelKey: 'auth.registeredModal.cta',
              onClick: () => {
                transitionTo('login', 'backward');
              },
            },
          ],
        });
        return;
      }

>>>>>>> origin/develop
      if (result.session) {
        setNotice({
          type: 'success',
          text: translateKey(result.messageKey, t('sessionCreated')),
        });
        reset();
<<<<<<< HEAD
=======
        sessionStorage.setItem(TOUR_LOGIN_FLAG, '1');
>>>>>>> origin/develop
        router.replace('/home');
      }
    },
    [
      loginWithEmail,
      mode,
<<<<<<< HEAD
=======
      notify,
>>>>>>> origin/develop
      registerWithEmail,
      reset,
      router,
      setError,
      t,
      translateKey,
      transitionTo,
    ],
  );

  const handleGoogleSubmit = useCallback(async () => {
    setNotice(null);
    const result = await loginWithGoogle();

    if (!result.ok) {
      setNotice({ type: 'error', text: translateKey(result.messageKey, t('genericError')) });
    }
  }, [loginWithGoogle, t, translateKey]);

  const handleConfirmSubmit = useCallback(async () => {
    setCodeError('');
    setNotice(null);

    if (!/^\d{4,8}$/.test(confirmationCode.trim())) {
      setCodeError(t('errors.codeFormat'));
      return;
    }

    setIsConfirming(true);
    const result = await confirmSignUp({
      email: pendingEmail,
      code: confirmationCode.trim(),
    });
    setIsConfirming(false);

    if (!result.ok) {
      if (result.fieldErrors?.code) {
        setCodeError(translateKey(result.fieldErrors.code));
      }
      setNotice({ type: 'error', text: translateKey(result.messageKey, t('genericError')) });
      return;
    }

    setNotice({ type: 'success', text: translateKey(result.messageKey, t('success.confirmed')) });
    setConfirmationCode('');
    transitionTo('login', 'backward');
  }, [confirmSignUp, confirmationCode, pendingEmail, t, translateKey, transitionTo]);

  const handleResendCode = useCallback(async () => {
    if (!pendingEmail) return;
    setIsResending(true);
    const result = await resendConfirmationCode(pendingEmail);
    setIsResending(false);
    setNotice({
      type: result.ok ? 'success' : 'error',
      text: translateKey(result.messageKey, t('genericError')),
    });
  }, [pendingEmail, resendConfirmationCode, t, translateKey]);

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
    pendingEmail,
    confirmationCode,
    setConfirmationCode,
    codeError,
    isConfirming,
    isResending,
    handleConfirmSubmit,
    handleResendCode,
  };
};
