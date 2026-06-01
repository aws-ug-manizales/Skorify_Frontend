'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { exchangeAuthorizationCode } from '@features/auth/lib/oauth';

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tRoot = useTranslations();
  const t = useTranslations('auth');
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const hasExchangedRef = useRef(false);

  useEffect(() => {
    if (hasExchangedRef.current) return;
    hasExchangedRef.current = true;

    const run = async () => {
      const errorParam = searchParams.get('error');
      if (errorParam) {
        setError(searchParams.get('error_description') ?? t('genericError'));
        return;
      }

      const code = searchParams.get('code');
      if (!code) {
        setError(t('genericError'));
        return;
      }

      try {
        const session = await exchangeAuthorizationCode(code);
        setSession(session);
        router.replace('/home');
      } catch (err) {
        const message =
          err instanceof Error && err.message.startsWith('auth.')
            ? tRoot(err.message)
            : t('genericError');
        setError(message);
      }
    };

    void run();
  }, [router, searchParams, setSession, t, tRoot]);

  if (error) {
    return (
      <Stack spacing={2} alignItems="center" maxWidth={420}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => router.replace('/auth')}
        >
          {t('callback.backToLogin')}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} alignItems="center">
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {t('callback.loading')}
      </Typography>
    </Stack>
  );
};

const AuthCallbackPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
    <Suspense
      fallback={
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
        </Stack>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  </Box>
);

export default AuthCallbackPage;
