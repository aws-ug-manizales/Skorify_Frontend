import { getTranslations } from 'next-intl/server';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';

const ProfilePage = async () => {
  const t = await getTranslations('nav');
  return <ComingSoonPage title={t('profile')} />;
};

export default ProfilePage;
