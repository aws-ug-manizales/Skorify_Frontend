'use client';

import { use } from 'react';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';
import { useTranslations } from 'next-intl';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function JoinPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations('groups.join');

  const code = slug?.[0];

  return (
    <PublicJoinLayout
      title={t('title')}
      subtitle={t('subtitle')}
      footer={t('contactAdmin')}
    >
      <JoinGroupFlow initialCode={code} />
    </PublicJoinLayout>
  );
}
