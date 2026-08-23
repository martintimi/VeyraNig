'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SplitCartDrawer from '@/components/cart/SplitCartDrawer';
import BodyTwinWizard from '@/components/profile/BodyTwinWizard';
import AuthModal from '@/components/auth/AuthModal';
import LuxuryLoader from '@/components/common/LuxuryLoader';
import SmoothScrollProvider from '@/components/common/SmoothScrollProvider';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Enforce dark mode on vendor-portal routes, light mode on all shopper pages
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (pathname.startsWith('/vendor-portal')) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [pathname]);

  // Standalone portals (Auth, Vendor Portal, and Super Admin have their own dedicated standalone workspace)
  const isStandalonePage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin');

  return (
    <SmoothScrollProvider>
      <LuxuryLoader />
      {!isStandalonePage && <Navbar />}
      <main className={!isStandalonePage ? "min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
        {children}
      </main>
      {!isStandalonePage && <Footer />}
      <SplitCartDrawer />
      <BodyTwinWizard />
      <AuthModal />
    </SmoothScrollProvider>
  );
}
