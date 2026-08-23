import type { Metadata } from 'next';
import './globals.css';
import AppLayoutWrapper from '@/components/layout/AppLayoutWrapper';

export const metadata: Metadata = {
  title: 'VEYRA Nigeria | Multi-Brand Virtual Dressing Room',
  description: 'Style Senator sets, handmade Ankara gowns, streetwear hoodies, and Kano leather slides from top Nigerian fashion designers on your digital body twin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased transition-colors duration-300">
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
