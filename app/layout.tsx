import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hoor.vercel.app | Premium Resin Art Store',
  description: 'Elevate your space with HOOR. Discover premium handmade resin art, unique jewelry, and bespoke home decor crafted with precision and passion. Shop the collection now.',
  keywords: ['resin art', 'handmade gifts', 'premium resin jewelry', 'home decor', 'custom resin pieces', 'HOOR'],
  openGraph: {
    title: 'Hoor.vercel.app | Premium Resin Art Store',
    description: 'Bespoke resin art and handmade treasures. Unique pieces designed to tell your story.',
    url: 'https://hoor-resin.vercel.app',
    siteName: 'HOOR',
    images: [
      {
        url: 'https://hoor-resin.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HOOR - Premium Resin Art',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOOR | Premium Resin Art',
    description: 'Unique handmade resin art and jewelry.',
    images: ['https://hoor-resin.vercel.app/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
