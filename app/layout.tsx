import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "FarmLink — Africa's Agricultural Operating System",
  description: 'Connect farmers, buyers, and transporters across Nigeria. Buy fresh produce directly from the farm with transparent pricing, escrow payments, and real-time logistics.',
  keywords: ['agriculture Nigeria', 'buy farm produce', 'fresh vegetables', 'FarmLink', 'farm to table Nigeria'],
  authors: [{ name: 'FarmLink Technologies' }],
  openGraph: {
    title: "FarmLink — Africa's Agricultural Operating System",
    description: 'Fresh produce. Fair prices. Direct from farm to your door across Nigeria.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'FarmLink',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmLink',
    description: 'Fresh produce. Fair prices. Direct from farm to your door across Nigeria.',
  },
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
