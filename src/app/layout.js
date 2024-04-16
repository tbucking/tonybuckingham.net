import Script from "next/script";
import { Providers } from './providers';

export const metadata = {
  title: "Tony Buckingham",
  description: "About Tony Buckingham",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NVP1LXWH8X" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NVP1LXWH8X');
          `}
        </Script>
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
