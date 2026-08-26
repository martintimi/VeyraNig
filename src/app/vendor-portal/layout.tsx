'use client';

import { vendorFetch } from '@/lib/services/apiClient';


import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store/useStore';
import {
  LayoutDashboard, UploadCloud, PackageCheck, BarChart3,
  Building, MessageSquare, DollarSign, LogOut, Sun, Moon,
  ExternalLink, Sparkles, ShieldCheck, ShoppingBag, Scissors, Clock, AlertTriangle
} from 'lucide-react';

import Image from 'next/image';

export default function VendorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    vendorLogout,
    vendorProfile,
    theme,
    toggleTheme
  } = useStore();

  const [liveStatus, setLiveStatus] = useState<{
    isVerified: boolean;
    approvalStatus: string;
  }>({
    isVerified: false,
    approvalStatus: 'pending'
  });

  useEffect(() => {
    async function checkVendorStatus() {
      try {
        const res = await vendorFetch('/api/vendor/profile');
        const data = await res.json();
        if (res.ok && data.success && data.vendor) {
          const verified = !!data.vendor.is_verified || !!data.vendor.isVerified;
          setLiveStatus({
            isVerified: verified,
            approvalStatus: verified ? 'approved' : (data.vendor.approvalStatus || 'pending')
          });
        }
      } catch (e) {}
    }
    checkVendorStatus();
  }, [pathname]);

  // If on the auth page, render without the dashboard shell
  if (pathname === '/vendor-portal/auth') {
    return <>{children}</>;
  }

  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';

  const navItems = [
    {
      label: 'Overview',
      href: '/vendor-portal',
      icon: LayoutDashboard,
      active: pathname === '/vendor-portal'
    },
    {
      label: isBoutique ? 'Add RTW Product' : 'Publish Bespoke Garment',
      href: '/vendor-portal/publish',
      icon: UploadCloud,
      active: pathname === '/vendor-portal/publish'
    },
    {
      label: isBoutique ? 'Orders to Pack & Dispatch' : 'Tailoring Orders to Cut',
      href: '/vendor-portal/orders',
      icon: PackageCheck,
      active: pathname === '/vendor-portal/orders'
    },
    {
      label: 'Reports & Sales',
      href: '/vendor-portal/reports',
      icon: BarChart3,
      active: pathname === '/vendor-portal/reports'
    },
    {
      label: isBoutique ? 'Boutique Store Profile' : 'Atelier Store Profile',
      href: '/vendor-portal/atelier',
      icon: Building,
      active: pathname === '/vendor-portal/atelier'
    },
    {
      label: 'Direct Sales Assistant',
      href: '/vendor-portal/direct-sales',
      icon: MessageSquare,
      active: pathname === '/vendor-portal/direct-sales'
    },
    {
      label: 'Settlements & Banking',
      href: '/vendor-portal/settlements',
      icon: DollarSign,
      active: pathname === '/vendor-portal/settlements'
    },
  ];

  const handleLogout = () => {
    vendorLogout();
    router.push('/vendor-portal/auth');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors flex flex-col">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER (FULL-WIDTH LUXURY BAR) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <Link href="/vendor-portal" className="flex items-center gap-3 group">
            <Image
              src="/images/logo/veyra-logo-horizontal.png"
              alt="Veyra"
              width={160}
              height={45}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase font-bold border border-[var(--gold-accent)]/20">
              {isBoutique ? 'Boutique Merchant' : 'Bespoke Atelier'}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
            <span className={`h-2 w-2 rounded-full ${liveStatus.isVerified ? 'bg-emerald-500 animate-pulse' : liveStatus.approvalStatus === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="font-bold text-[var(--text-primary)]">{vendorProfile.brandName}</span>
            <span className="text-[var(--text-muted)]">({vendorProfile.location})</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          <Link
            href={`/brand/${encodeURIComponent(vendorProfile.brandName)}`}
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] transition-all"
          >
            <span>{isBoutique ? 'View Boutique Link' : 'View Atelier Link'}</span>
            <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-500 transition-all"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>

        </div>

      </header>

      {/* ======================================================== */}
      {/* 2. BODY LAYOUT (SIDEBAR + ACTIVE PAGE CONTENT) */}
      {/* ======================================================== */}
      <div className="flex-1 flex">
        
        {/* Left Fixed Sticky Sidebar */}
        <aside className="w-64 lg:w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 flex flex-col justify-between p-4 sm:p-6 shrink-0 hidden md:flex sticky top-[65px] h-[calc(100vh-65px)] self-start overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Store / Atelier Card */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--gold-accent)]/15 text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-lg shrink-0">
                  {isBoutique ? <ShoppingBag className="h-5 w-5" /> : <Scissors className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[var(--text-primary)] truncate font-editorial">
                    {vendorProfile.brandName}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono-luxury truncate">
                    {vendorProfile.location}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono-luxury">
                <span className="text-[var(--text-muted)]">Category:</span>
                <span className="text-[var(--gold-accent)] font-bold">
                  {isBoutique ? 'Ready-Made Boutique' : 'Bespoke Tailoring Atelier'}
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 font-mono-luxury text-xs uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      item.active
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.active ? '' : 'text-[var(--gold-accent)]'}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

          </div>

          {/* Bottom Info */}
          <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)] space-y-1">
            <div className="flex items-center justify-between">
              <span>Settlement Escrow:</span>
              <strong className="text-emerald-500">Active</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Storefront Status:</span>
              <strong className={liveStatus.isVerified ? 'text-emerald-500' : liveStatus.approvalStatus === 'rejected' ? 'text-rose-400' : 'text-amber-400'}>
                {liveStatus.isVerified ? 'Verified' : liveStatus.approvalStatus === 'rejected' ? 'Action Needed' : 'Pending Review'}
              </strong>
            </div>
          </div>

        </aside>

        {/* Mobile Horizontal Navigation */}
        <div className="md:hidden w-full overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 flex gap-2 scrollbar-none">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-xl text-xs font-mono-luxury font-bold uppercase whitespace-nowrap ${
                item.active
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
