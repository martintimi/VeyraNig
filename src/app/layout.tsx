import type { Metadata } from 'next';
import './globals.css';
import AppLayoutWrapper from '@/components/layout/AppLayoutWrapper';
import NextTopLoader from 'nextjs-toploader';



export const metadata: Metadata = {
  title: 'VEYRA Nigeria | Multi-Brand Virtual Dressing Room',
  description: 'Style Senator sets, handmade Ankara gowns, streetwear hoodies, and Kano leather slides from top Nigerian fashion designers on your digital body twin.',
  icons: {
    icon: '/images/logo/veyra-icon.png',
    apple: '/images/logo/veyra-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased transition-colors duration-300">
        <NextTopLoader
          color="#d4af37"
          initialPosition={0.12}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #d4af37, 0 0 6px #f3e5ab"
          zIndex={99999}
        />
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
