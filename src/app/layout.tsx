import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { Lexend } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import ThemeRegistry from '@/lib/theme/ThemeRegistry';
import { NotificationProvider } from '@shared/notifications';
<<<<<<< HEAD
=======
import { GA_MEASUREMENT_ID } from '@lib/analytics/gtag';
import AnalyticsTracker from '@shared/components/analytics/AnalyticsTracker';
>>>>>>> origin/develop
import './globals.scss';
// Trigger translation reload

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
    <html lang={locale} className={lexend.variable} suppressHydrationWarning>
      <body>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
          </>
        )}
        <ThemeRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <NotificationProvider>{children}</NotificationProvider>
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
