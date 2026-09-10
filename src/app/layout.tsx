import 'reflect-metadata';
import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';

import './globals.css';
import { Providers } from './providers';
import { tenantConfigs } from '@/eai.config';

// Fonts
const bodyFont = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const displayFont = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EAI Case Assistant for Microsoft Copilot',
  description:
    'A governed EAI case experience for web, Teams and Microsoft 365 Copilot.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allHeaders = await headers();
  const nonce = allHeaders.get('x-nonce') ?? '';

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <Script id='init' nonce={nonce} strategy='afterInteractive'>
          {`console.log("Nonce is attached securely!")`}
        </Script>
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} antialiased`}
      >
        <Providers tenants={tenantConfigs}>{children}</Providers>
      </body>
    </html>
  );
}
