import React from 'react';
import MarketplaceGrid from '@/components/shop/MarketplaceGrid';
import MobileShopView from '@/components/shop/MobileShopView';



export default function ShopPage() {
  return (
    <>
      {/* 1. DEDICATED MOBILE SHOP VIEW (Instant 2-column feed, clean filters) */}
      <div className="block md:hidden px-4 py-4">
        <MobileShopView />
      </div>

      {/* 2. DESKTOP SHOP CATALOG (Full width grid with desktop filters) */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <MarketplaceGrid />
      </div>
    </>
  );
}
