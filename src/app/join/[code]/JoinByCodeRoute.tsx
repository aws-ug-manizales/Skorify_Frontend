'use client';

<<<<<<< HEAD
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';
=======
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { JOIN_CODE_PARAM, PENDING_JOIN_CODE_KEY } from '@features/groups/joinFlag';
>>>>>>> origin/develop

const JoinByCodeRoute = () => {
  const t = useTranslations('groups.join');
  const params = useParams<{ code: string }>();
<<<<<<< HEAD
  const code = params?.code ?? '';
  const resolvedCode = code === '_' ? '' : code;

=======
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuthSession();
  const code = params?.code ?? '';
  const resolvedCode = code === '_' ? '' : code;

  // A guest who opens an invite link is sent to login carrying the code; once
  // authenticated the dashboard auto-opens the join dialog prefilled with it.
  const shouldRedirectGuest = hydrated && !isAuthenticated && !!resolvedCode;
  useEffect(() => {
    if (!shouldRedirectGuest) return;
    sessionStorage.setItem(PENDING_JOIN_CODE_KEY, resolvedCode);
    router.replace(`/auth?${JOIN_CODE_PARAM}=${encodeURIComponent(resolvedCode)}`);
  }, [shouldRedirectGuest, resolvedCode, router]);

  // While the session resolves (or we're redirecting a guest) show a spinner so
  // the public join form doesn't flash before the redirect.
  if (!hydrated || shouldRedirectGuest) {
    return (
      <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </PublicJoinLayout>
    );
  }

>>>>>>> origin/develop
  return (
    <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
      <JoinGroupFlow initialCode={resolvedCode} />
    </PublicJoinLayout>
  );
};

export default JoinByCodeRoute;
