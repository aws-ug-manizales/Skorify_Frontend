import { getTranslations } from 'next-intl/server';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';

const GroupsPage = async () => {
  const t = await getTranslations('nav');
  return <ComingSoonPage title={t('groups')} />;
};

export default GroupsPage;
