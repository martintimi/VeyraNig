'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SplitCartDrawer from '@/components/cart/SplitCartDrawer';
import BodyTwinWizard from '@/components/profile/BodyTwinWizard';
import LuxuryLoader from '@/components/common/LuxuryLoader';
import SmoothScrollProvider from '@/components/common/SmoothScrollProvider';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MobileHeader from '@/components/layout/MobileHeader';
import WardrobeVaultDrawer from '@/components/vault/WardrobeVaultDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useStore();
  
  // Persist dark / light mode on reload & toggle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Standalone portals (Auth, Vendor Portal, and Super Admin have their own dedicated standalone workspace)
  const isStandalonePage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin');

  return (
    <SmoothScrollProvider>
      <LuxuryLoader />
      {!isStandalonePage && (
        <>
          <Navbar />
          <MobileHeader />
        </>
      )}
      <main className={!isStandalonePage ? "min-h-[calc(100vh-4rem)] pb-20 md:pb-0" : "min-h-screen"}>
        {children}
      </main>
      {!isStandalonePage && <Footer />}
      <SplitCartDrawer />
      <WardrobeVaultDrawer />
      <BodyTwinWizard />
      <MobileBottomNav />
    </SmoothScrollProvider>
  );
}
