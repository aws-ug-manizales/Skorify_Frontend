import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import ThemeRegistry from '@/lib/theme/ThemeRegistry';
import './globals.scss';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('meta');
  return {
    title: t('title'),
    description: t('description'),
  };
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={lexend.variable}>
      <body>
        <ThemeRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
