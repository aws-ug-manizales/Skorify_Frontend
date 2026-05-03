import { getTranslations } from 'next-intl/server';
import { JoinGroupFlow } from '@features/groups/components/organisms/JoinGroupFlow';
import { PublicJoinLayout } from '@/shared/layouts/PublicJoinLayout';

const JoinPage = async () => {
  const t = await getTranslations('groups.join');

  return (
    <PublicJoinLayout title={t('title')} subtitle={t('subtitle')} footer={t('contactAdmin')}>
      <JoinGroupFlow />
    </PublicJoinLayout>
  );
};

export default JoinPage;
