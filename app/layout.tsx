import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hoor Resin Art | متجر الرزن',
  description: 'متجر رزن يدوي متخصص في قطع فريدة مصنوعة بحب واهتمام.',
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
