import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: "FarmLink — Africa's Agricultural Marketplace",
  description: "Buy fresh produce directly from verified African farmers. Escrow-protected payments, integrated logistics, farm investment and more.",
  keywords: ['agriculture Africa', 'buy farm produce', 'fresh vegetables', 'FarmLink', 'farm to table Africa', 'farm investment', 'agribusiness'],
  authors: [{ name: 'FarmLink Technologies' }],
  manifest: '/manifest.json',
  openGraph: {
    title: "FarmLink — Africa's Agricultural Marketplace",
    description: "Fresh produce. Fair prices. Direct from farm to your door across Africa.",
    type: 'website',
    locale: 'en',
    siteName: 'FarmLink',
  },
  twitter: { card: 'summary_large_image', title: 'FarmLink' },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FarmLink',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FarmLink" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
