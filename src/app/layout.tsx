import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import ThemeRegistry from '@/lib/theme/ThemeRegistry';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Skorify',
  description: 'Plataforma de predicciones deportivas',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ThemeRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
