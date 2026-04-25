import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hoor Resin Art | متجر الرزن اليدوي - قطع فنية فريدة',
  description: 'اكتشف عالم الرزن مع Hoor Resin Art. نقدم قطع فنية يدوية فريدة، هدايا مخصصة، وإكسسوارات منزلية مصنوعة بكل حب وإتقان في مصر.',
  keywords: ['رزن', 'resin art', 'هدايا يدوية', 'ديكور منزلي', 'فن الرزن', 'إكسسوارات رزن', 'handmade gifts egypt', 'resin accessories'],
  authors: [{ name: 'Ali Versel' }],
  openGraph: {
    title: 'Hoor Resin Art | متجر الرزن اليدوي',
    description: 'قطع فنية يدوية فريدة مصنوعة بحب. تسوق الآن أحدث أعمال الرزن اليدوية.',
    url: 'https://hoor-resin.vercel.app',
    siteName: 'Hoor Resin Art',
    images: [
      {
        url: 'https://hoor-resin.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hoor Resin Art - Handmade Beauty',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoor Resin Art | متجر الرزن اليدوي',
    description: 'قطع فنية يدوية فريدة مصنوعة بحب في مصر.',
    images: ['https://hoor-resin.vercel.app/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
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
