import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tony Buckingham',
  description: 'About Tony Buckingham'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    // next-themes writes the color mode class to <html> on the client, which
    // the server render does not include.
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NVP1LXWH8X"
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NVP1LXWH8X');
          `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
