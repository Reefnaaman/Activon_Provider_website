import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Activon Provider Template',
  description: 'Professional business profiles powered by Activon',
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#2E6FF2',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default to Hebrew/RTL for this template
  const locale = 'he';
  const direction = 'rtl';

  return (
    <html lang={locale} dir={direction}>
      <body 
        className={`${inter.className} flex flex-col min-h-screen safe-area-inset touch-action-manipulation`}
        suppressHydrationWarning={true}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'manipulation'
        }}
      >
        <main className="flex-1">
          {children}
        </main>
        <Footer locale={locale as 'he' | 'en'} />
      </body>
    </html>
  );
}