import { getTranslations } from 'next-intl/server';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';

const MatchesPage = async () => {
  const t = await getTranslations('nav');
  return <ComingSoonPage title={t('matches')} />;
};

export default MatchesPage;
