import { getTranslations } from 'next-intl/server';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';

interface JoinByCodePageProps {
  params: Promise<{ code: string }>;
}

const JoinByCodePage = async ({ params }: JoinByCodePageProps) => {
  const { code } = await params;
  const t = await getTranslations('groups.join');

  return (
    <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
      <JoinGroupFlow initialCode={code} />
    </PublicJoinLayout>
  );
};

export default JoinByCodePage;
