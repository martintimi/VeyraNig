'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  Home, Grid, Sparkles, ShoppingBag, User
} from 'lucide-react';
import MobileTwinDrawer from '@/components/studio/MobileTwinDrawer';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, setIsCartOpen, userAuth, activeOutfit } = useStore();
  const [isTwinDrawerOpen, setIsTwinDrawerOpen] = useState(false);

  // Hide mobile bottom nav on standalone portals (Vendor Portal, Super Admin, Auth page)
  const isStandalonePage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin');

  if (isStandalonePage) return null;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOutfitItemsCount = Object.values(activeOutfit).filter(Boolean).length;

  return (
    <>
      {/* 3D Mobile Twin Bottom Sheet Drawer */}
      <MobileTwinDrawer
        isOpen={isTwinDrawerOpen}
        onClose={() => setIsTwinDrawerOpen(false)}
      />

      {/* Clean Luxury Floating Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#121216]/95 backdrop-blur-xl border-t border-black/10 dark:border-white/10 transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none">
        <div className="h-16 flex items-center justify-around px-2 max-w-md mx-auto">
          
          {/* 1. Explore / Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
              pathname === '/'
                ? 'text-amber-700 dark:text-[var(--gold-accent)] font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-mono-luxury uppercase tracking-wider">Home</span>
          </Link>

          {/* 2. Shop Catalog */}
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
              pathname === '/shop'
                ? 'text-amber-700 dark:text-[var(--gold-accent)] font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Grid className="h-5 w-5" />
            <span className="text-[10px] font-mono-luxury uppercase tracking-wider">Shop</span>
          </Link>

          {/* 3. Center Elevated 3D Twin Fit Action */}
          <button
            onClick={() => setIsTwinDrawerOpen(true)}
            className="relative -top-3 flex flex-col items-center justify-center group"
            aria-label="Open 3D Virtual Fitting Room"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 dark:from-[var(--gold-accent)] dark:to-amber-200 text-white dark:text-black flex items-center justify-center shadow-lg group-active:scale-95 transition-transform ring-4 ring-white dark:ring-[#121216]">
              <Sparkles className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-mono-luxury uppercase font-bold text-amber-700 dark:text-[var(--gold-accent)] tracking-wider mt-0.5">
              3D Fit {activeOutfitItemsCount > 0 && `(${activeOutfitItemsCount})`}
            </span>
          </button>

          {/* 4. Bag / Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 w-14 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Open Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 dark:bg-[var(--gold-accent)] text-[9px] font-bold text-white dark:text-black shadow-md">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono-luxury uppercase tracking-wider">Bag</span>
          </button>

          {/* 5. Profile / Twin */}
          <Link
            href={userAuth.isLoggedIn ? '/profile' : '/auth'}
            className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
              pathname === '/profile'
                ? 'text-amber-700 dark:text-[var(--gold-accent)] font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-mono-luxury uppercase tracking-wider">
              {userAuth.isLoggedIn ? 'Twin' : 'Account'}
            </span>
          </Link>

        </div>
      </nav>
    </>
  );
}
