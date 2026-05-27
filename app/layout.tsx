import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: "FarmLink — Africa's Agricultural Marketplace",
  description: 'Buy fresh produce directly from verified Nigerian farmers. Escrow-protected payments, integrated logistics, AI crop tools.',
  keywords: ['agriculture Nigeria', 'buy farm produce', 'fresh vegetables', 'FarmLink', 'farm to table Nigeria'],
  authors: [{ name: 'FarmLink Technologies' }],
  openGraph: {
    title: "FarmLink — Africa's Agricultural Marketplace",
    description: 'Fresh produce. Fair prices. Direct from farm to your door across Nigeria.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'FarmLink',
  },
  twitter: { card: 'summary_large_image', title: 'FarmLink' },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0D5122',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
