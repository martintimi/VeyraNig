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
import AmbientScreenSaver from '@/components/common/AmbientScreenSaver';
import WhatsAppConciergeWidget from '@/components/common/WhatsAppConciergeWidget';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useStore();
  
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

  // Standalone portals (Auth, Vendor Portal, and Super Admin)
  const isStandalonePage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin');

  return (
    <SmoothScrollProvider>
      <LuxuryLoader />
      {!isStandalonePage && (
        <>
          {/* Desktop Top Navbar (Strictly Hidden on Mobile for pure native app feel) */}
          <div className="hidden md:block">
            <Navbar />
          </div>
        </>
      )}
      <main className={!isStandalonePage ? "min-h-screen pb-24 md:pb-0" : "min-h-screen"}>
        {children}
      </main>
      
      {/* Footer across both Mobile and Desktop */}
      {!isStandalonePage && (
        <Footer />
      )}

      <SplitCartDrawer />
      <WardrobeVaultDrawer />
      <BodyTwinWizard />
      {/* WhatsApp VIP Concierge & Style Advisor */}
      <WhatsAppConciergeWidget />
      {/* Floating Glassmorphic Mobile Bottom Dock (Strictly Mobile) */}
      <MobileBottomNav />

      {/* Ambient Netflix-Style Idle Lookbook Screensaver */}
      <AmbientScreenSaver />
    </SmoothScrollProvider>
  );
}
