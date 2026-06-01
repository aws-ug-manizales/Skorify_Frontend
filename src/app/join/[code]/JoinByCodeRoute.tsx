'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';

const JoinByCodeRoute = () => {
  const t = useTranslations('groups.join');
  const params = useParams<{ code: string }>();
  const code = params?.code ?? '';
  const resolvedCode = code === '_' ? '' : code;

  return (
    <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
      <JoinGroupFlow initialCode={resolvedCode} />
    </PublicJoinLayout>
  );
};

export default JoinByCodeRoute;
