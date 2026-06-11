'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import { JOIN_CODE_PARAM, PENDING_JOIN_CODE_KEY } from '@features/groups/joinFlag';

const JoinByCodeRoute = () => {
  const t = useTranslations('groups.join');
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuthSession();
  const code = params?.code ?? '';
  const resolvedCode = code === '_' ? '' : code;

  const shouldRedirect = hydrated && !!resolvedCode;
  useEffect(() => {
    if (!shouldRedirect) return;
    sessionStorage.setItem(PENDING_JOIN_CODE_KEY, resolvedCode);
    router.replace(
      isAuthenticated ? '/home' : `/auth?${JOIN_CODE_PARAM}=${encodeURIComponent(resolvedCode)}`,
    );
  }, [shouldRedirect, isAuthenticated, resolvedCode, router]);

  if (!hydrated || shouldRedirect) {
    return (
      <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </PublicJoinLayout>
    );
  }

  return (
    <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
      <JoinGroupFlow initialCode={resolvedCode} />
    </PublicJoinLayout>
  );
};

export default JoinByCodeRoute;
