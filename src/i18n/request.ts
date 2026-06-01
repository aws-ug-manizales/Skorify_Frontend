import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const locale = routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    onError() {
      // Suppress full-screen error overlays for missing translations
    },
    getMessageFallback({ key }) {
      // Gracefully fall back to the last segment of the key
      return key.split('.').pop() || key;
    },
  };
});
