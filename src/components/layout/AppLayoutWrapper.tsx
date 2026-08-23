'use client';

import React from 'react';
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
  
  // Standalone portals (Auth and Vendor Portal have their own dedicated standalone workspace)
  const isStandalonePage = pathname.startsWith('/auth') || pathname.startsWith('/vendor');

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
