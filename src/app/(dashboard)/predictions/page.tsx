import { getTranslations } from 'next-intl/server';
import ComingSoonPage from '@shared/components/organisms/ComingSoonPage';

const PredictionsPage = async () => {
  const t = await getTranslations('nav');
  return <ComingSoonPage title={t('predictions')} />;
};

export default PredictionsPage;
