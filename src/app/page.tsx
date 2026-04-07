import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <main>
      <h1>{t('appName')}</h1>
    </main>
  );
}
