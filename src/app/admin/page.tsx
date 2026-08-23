'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  ShieldCheck, LayoutDashboard, Users, PackageCheck, Scissors,
  DollarSign, TrendingUp, Search, Filter, CheckCircle2, XCircle,
  AlertTriangle, Eye, ArrowUpRight, Phone, Mail, MapPin, Building,
  Clock, Sun, Moon, ExternalLink, LogOut, Sparkles, Check, ChevronRight,
  Truck, ArrowRight, Star, RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface SuperAdminVendor {
  id: string;
  name: string;
  category: 'fashion_designer' | 'boutique_seller';
  leadDesigner: string;
  location: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  status: 'verified' | 'pending' | 'suspended';
  totalSalesNgn: number;
  productCount: number;
  joinedDate: string;
}

const initialVendorsList: SuperAdminVendor[] = [
  {
    id: 'sartorial-lagos',
    name: 'Sartorial Lagos',
    category: 'fashion_designer',
    leadDesigner: 'Kolawole Adeleke',
    location: 'Victoria Island, Lagos',
    phone: '+234 802 334 9910',
    email: 'atelier@sartoriallagos.ng',
    bankName: 'Guaranty Trust Bank (GTB)',
    accountNumber: '0129384910',
    status: 'verified',
    totalSalesNgn: 18450000,
    productCount: 12,
    joinedDate: '12 Jan 2026'
  },
  {
    id: 'street-souk',
    name: 'Street Souk Co.',
    category: 'boutique_seller',
    leadDesigner: 'Tobi Bakare',
    location: 'Lekki Phase 1, Lagos',
    phone: '+234 813 902 1144',
    email: 'drops@streetsouk.co',
    bankName: 'Access Bank',
    accountNumber: '0981234567',
    status: 'verified',
    totalSalesNgn: 12890000,
    productCount: 8,
    joinedDate: '02 Feb 2026'
  },
  {
    id: 'yaba-denim',
    name: 'Yaba Denim Works',
    category: 'boutique_seller',
    leadDesigner: 'Emeka Nwosu',
    location: 'Yaba, Lagos',
    phone: '+234 809 771 2288',
    email: 'denim@yabaworks.com',
    bankName: 'Zenith Bank',
    accountNumber: '2081928374',
    status: 'verified',
    totalSalesNgn: 8940000,
    productCount: 6,
    joinedDate: '18 Feb 2026'
  },
  {
    id: 'kano-leather',
    name: 'Kano Artisan Footwear',
    category: 'fashion_designer',
    leadDesigner: 'Musa Ibrahim',
    location: 'Kano City & Lagos Hub',
    phone: '+234 803 551 7766',
    email: 'craft@kanoleather.ng',
    bankName: 'First Bank of Nigeria',
    accountNumber: '3091827364',
    status: 'verified',
    totalSalesNgn: 6420000,
    productCount: 5,
    joinedDate: '01 Mar 2026'
  },
  {
    id: 'alara-contemporary',
    name: 'Alara Contemporary Atelier',
    category: 'fashion_designer',
    leadDesigner: 'Zainab Bello',
    location: 'Victoria Island, Lagos',
    phone: '+234 806 123 9988',
    email: 'concierge@alaranigeria.com',
    bankName: 'Stanbic IBTC',
    accountNumber: '0039281726',
    status: 'pending',
    totalSalesNgn: 0,
    productCount: 3,
    joinedDate: '21 Aug 2026'
  }
];

const mockHubOrders = [
  {
    orderId: 'VY-ORD-9201',
    customer: 'Chukwudi Eze',
    customerPhone: '+234 803 456 7890',
    destination: 'Plot 14B Adeola Odeku, Victoria Island, Lagos',
    totalNgn: 148000,
    hubStatus: 'Quality Inspected at Hub',
    vendorsInvolved: ['Sartorial Lagos', 'Yaba Denim Works', 'Kano Artisan Footwear'],
    date: '22 Aug 2026'
  },
  {
    orderId: 'VY-ORD-9195',
    customer: 'Amina Yusuf',
    customerPhone: '+234 802 991 4455',
    destination: 'Maitama District, Abuja FCT',
    totalNgn: 210000,
    hubStatus: 'Consolidated Box Dispatched via GIG Express',
    vendorsInvolved: ['Sartorial Lagos', 'Street Souk Co.'],
    date: '20 Aug 2026'
  },
  {
    orderId: 'VY-ORD-9188',
    customer: 'Femi Otedola Jr.',
    customerPhone: '+234 818 000 7711',
    destination: 'Banana Island, Ikoyi, Lagos',
    totalNgn: 345000,
    hubStatus: 'Awaiting Final Vendor Dropoff',
    vendorsInvolved: ['Sartorial Lagos', 'Kano Artisan Footwear'],
    date: '19 Aug 2026'
  }
];

export default function SuperAdminPage() {
  const { theme, toggleTheme, allProducts } = useStore();

  // Super Admin Security Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Management View
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'catalog' | 'logistics' | 'finance'>('overview');

  // Vendors state with interactive verification
  const [vendors, setVendors] = useState<SuperAdminVendor[]>(initialVendorsList);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorFilter, setVendorFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');

  // Commission & Settings State
  const [commissionRate, setCommissionRate] = useState(10);
  const [lagosDeliveryFee, setLagosDeliveryFee] = useState(3500);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026' || adminPin === 'admin' || adminPin === 'VEYRA-SUPER-2026') {
      setIsAdminAuthenticated(true);
      setAuthError('');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
    } else {
      setAuthError('Invalid Master Access Key. Enter 2026 for demo.');
    }
  };

  const handleVerifyVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'verified' } : v));
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#10b981', '#ffffff']
    });
  };

  const handleSuspendVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'suspended' } : v));
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
                          v.leadDesigner.toLowerCase().includes(vendorSearch.toLowerCase()) ||
                          v.location.toLowerCase().includes(vendorSearch.toLowerCase());
    const matchesFilter = vendorFilter === 'all' || v.status === vendorFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans">
      
      {!isAdminAuthenticated ? (
        
        /* 🔒 SUPER ADMIN GATEWAY AUTHENTICATION */
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-black">
          <div className="w-full max-w-md surface-card p-8 sm:p-10 rounded-3xl border border-[var(--border-subtle)] space-y-6 shadow-2xl animate-fadeIn text-center">
            
            <div className="h-16 w-16 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                Nigeria Executive Control
              </span>
              <h1 className="font-editorial text-3xl font-bold text-white mt-1">
                VEYRA Super Admin
              </h1>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Master management suite for Nigerian ateliers, catalog moderation, logistics, and Paystack escrow payouts.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-zinc-400 mb-1 font-bold">
                  Master Security PIN
                </label>
                <input
                  type="password"
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Master PIN (Default: 2026)"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 font-mono-luxury font-semibold">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Unlock Master Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="pt-2 text-[11px] font-mono-luxury text-zinc-500">
              Demo Access Code: <strong className="text-white">2026</strong>
            </div>

          </div>
        </div>

      ) : (

        /* 🎛️ SUPER ADMIN EXECUTIVE WORKSPACE */
        <div className="min-h-screen flex flex-col">
          
          {/* TOP ADMIN HEADER */}
          <header className="h-16 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
            
            {/* Left: Branding & Role */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-bold tracking-[0.25em] text-[var(--text-primary)]">
                  VEYRA
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30 text-[9px] font-mono-luxury uppercase font-bold tracking-wider">
                  ● SUPER ADMIN
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-2 text-xs font-mono-luxury text-[var(--text-muted)]">
                <span>/</span>
                <span className="text-[var(--text-primary)] font-bold capitalize">
                  {activeTab === 'overview' ? 'Financial Overview' : activeTab === 'vendors' ? 'Atelier & Vendor Management' : activeTab === 'catalog' ? 'Catalog Moderation' : activeTab === 'logistics' ? 'Lagos Central Hub Logistics' : 'Paystack Escrow Settings'}
                </span>
              </div>
            </div>

            {/* Right Controls: Theme Switcher + Live Store + Sign Out */}
            <div className="flex items-center gap-3">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-1.5 text-xs font-mono-luxury"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-[var(--gold-accent)]" />
                    <span className="hidden lg:inline text-[11px]">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span className="hidden lg:inline text-[11px]">Dark Mode</span>
                  </>
                )}
              </button>

              {/* View Live Store */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                <span>Live Storefront</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              {/* Lock / Log Out */}
              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Lock Admin Session"
              >
                <LogOut className="h-4 w-4" />
              </button>

            </div>

          </header>

          {/* MAIN SUPER ADMIN LAYOUT (SIDEBAR + MAIN CONTENT) */}
          <div className="flex-1 flex flex-col md:flex-row">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] p-4 shrink-0 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="px-3 py-2 text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--text-muted)] font-bold">
                  Platform Operations
                </div>

                <nav className="space-y-1.5 font-mono-luxury text-xs uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeTab === 'overview'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview & GMV</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('vendors')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold ${
                      activeTab === 'vendors'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4" />
                      <span>Ateliers & Vendors</span>
                    </div>
                    {vendors.filter(v => v.status === 'pending').length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                        {vendors.filter(v => v.status === 'pending').length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('catalog')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeTab === 'catalog'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Scissors className="h-4 w-4" />
                    <span>Catalog Moderation</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('logistics')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeTab === 'logistics'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Lagos Hub Logistics</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('finance')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeTab === 'finance'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Paystack & Escrow</span>
                  </button>
                </nav>
              </div>

              {/* Bottom System Status */}
              <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)] space-y-1">
                <div>Paystack Split Engine: <strong className="text-emerald-500">Live</strong></div>
                <div>Lagos Express Hub: <strong className="text-[var(--gold-accent)]">Active</strong></div>
                <div>App Version: <strong className="text-[var(--text-primary)]">v2.4 Production</strong></div>
              </div>

            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto space-y-8">
              
              {/* ======================================================== */}
              {/* VIEW 1: EXECUTIVE FINANCIAL OVERVIEW */}
              {/* ======================================================== */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Platform Executive Metrics
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Aggregated performance across all Nigerian bespoke ateliers, ready-to-wear boutiques, and Lagos hub dispatch.
                    </p>
                  </div>

                  {/* 4 Financial Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Gross Platform GMV</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦48,920,000</div>
                      <span className="text-[11px] text-emerald-500 font-mono-luxury font-bold">+24.5% vs last month</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Platform Take (10%)</span>
                        <DollarSign className="h-4 w-4 text-[var(--gold-accent)]" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦4,892,000</div>
                      <span className="text-[11px] text-emerald-500 font-mono-luxury font-bold">Net Platform Revenue</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Disbursed to Ateliers</span>
                        <PackageCheck className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦41,580,000</div>
                      <span className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">Paid via Paystack Subaccounts</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Escrow Reserve</span>
                        <ShieldCheck className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦2,448,000</div>
                      <span className="text-[11px] text-amber-500 font-mono-luxury">Pending Hub Inspection Release</span>
                    </div>
                  </div>

                  {/* Operational Summary Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Monthly GMV Growth Breakdown */}
                    <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                            Monthly GMV Trajectory (2026)
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                            Gross merchandise value traded through Veyra unified checkout.
                          </p>
                        </div>
                        <span className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">₦48.9M YTD</span>
                      </div>

                      {/* Bar Chart */}
                      <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[var(--border-subtle)]">
                        {[
                          { month: 'Jan', val: 3200000, height: '25%' },
                          { month: 'Feb', val: 4500000, height: '35%' },
                          { month: 'Mar', val: 5800000, height: '45%' },
                          { month: 'Apr', val: 6200000, height: '50%' },
                          { month: 'May', val: 7400000, height: '60%' },
                          { month: 'Jun', val: 8900000, height: '72%' },
                          { month: 'Jul', val: 10400000, height: '84%' },
                          { month: 'Aug', val: 12500000, height: '100%' },
                        ].map((bar, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <div
                              style={{ height: bar.height }}
                              className="w-full rounded-t-lg bg-[var(--gold-accent)] group-hover:opacity-80 transition-all shadow-md relative"
                            >
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[var(--gold-accent)] text-[9px] font-mono-luxury px-1.5 py-0.5 rounded whitespace-nowrap z-10 border border-white/10">
                                ₦{(bar.val / 1000000).toFixed(1)}M
                              </span>
                            </div>
                            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] font-bold uppercase">{bar.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Live Platform Activity Feed */}
                    <div className="lg:col-span-4 p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
                      <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                        Real-Time Activity
                      </h3>

                      <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono-luxury text-emerald-500 font-bold">
                            <span>● Order Paid (Paystack)</span>
                            <span className="text-[var(--text-muted)]">4m ago</span>
                          </div>
                          <p className="text-[var(--text-primary)] font-bold truncate">₦148,000 · Chukwudi Eze</p>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury block">3 items to Victoria Island</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold">
                            <span>● New Garment Published</span>
                            <span className="text-[var(--text-muted)]">22m ago</span>
                          </div>
                          <p className="text-[var(--text-primary)] font-bold truncate">Midnight Black Agbada Robe</p>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury block">Sartorial Lagos · ₦98,000</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono-luxury text-indigo-400 font-bold">
                            <span>● New Designer Application</span>
                            <span className="text-[var(--text-muted)]">1h ago</span>
                          </div>
                          <p className="text-[var(--text-primary)] font-bold truncate">Alara Contemporary Atelier</p>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury block">Awaiting Verification Review</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 2: ATELIER & VENDOR DIRECTORY & VERIFICATION */}
              {/* ======================================================== */}
              {activeTab === 'vendors' && (
                <div className="space-y-6 animate-fadeIn max-w-7xl">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                        Nigerian Ateliers & Vendors ({vendors.length})
                      </h1>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                        Review designer registrations, bank NUBAN accounts, and grant verified status badges.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
                      {(['all', 'verified', 'pending', 'suspended'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setVendorFilter(filter)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
                            vendorFilter === filter
                              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      placeholder="Search atelier name, designer, or location..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                  </div>

                  {/* Vendors Table */}
                  <div className="rounded-3xl surface-card border border-[var(--border-subtle)] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] font-mono-luxury uppercase text-[var(--text-muted)] text-[10px]">
                          <tr>
                            <th className="p-4 pl-6">Atelier & Brand</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Lead Designer</th>
                            <th className="p-4">Contact Phone</th>
                            <th className="p-4">Bank NUBAN</th>
                            <th className="p-4">Sales (₦)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] font-sans">
                          {filteredVendors.map((vendor) => (
                            <tr key={vendor.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                              
                              <td className="p-4 pl-6">
                                <div className="font-bold text-sm text-[var(--text-primary)]">{vendor.name}</div>
                                <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">{vendor.location}</div>
                              </td>

                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-luxury font-bold bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/20">
                                  {vendor.category === 'fashion_designer' ? 'Bespoke Atelier' : 'Boutique Seller'}
                                </span>
                              </td>

                              <td className="p-4 font-medium text-[var(--text-primary)]">
                                {vendor.leadDesigner}
                              </td>

                              <td className="p-4 font-mono-luxury text-[var(--text-primary)]">
                                <a href={`tel:${vendor.phone}`} className="hover:text-[var(--gold-accent)] hover:underline flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-[var(--gold-accent)]" />
                                  <span>{vendor.phone}</span>
                                </a>
                              </td>

                              <td className="p-4 font-mono-luxury text-[var(--text-secondary)]">
                                <div>{vendor.bankName}</div>
                                <div className="font-bold text-[var(--text-primary)]">{vendor.accountNumber}</div>
                              </td>

                              <td className="p-4 font-editorial font-bold text-sm text-[var(--text-primary)]">
                                ₦{vendor.totalSalesNgn.toLocaleString()}
                              </td>

                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-luxury font-bold capitalize ${
                                  vendor.status === 'verified'
                                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                    : vendor.status === 'pending'
                                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse'
                                    : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                                }`}>
                                  ● {vendor.status}
                                </span>
                              </td>

                              <td className="p-4 pr-6 text-right">
                                {vendor.status === 'pending' ? (
                                  <button
                                    onClick={() => handleVerifyVendor(vendor.id)}
                                    className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-mono-luxury uppercase text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-sm"
                                  >
                                    Approve & Verify
                                  </button>
                                ) : vendor.status === 'verified' ? (
                                  <button
                                    onClick={() => handleSuspendVendor(vendor.id)}
                                    className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-rose-500 hover:bg-rose-500/10 font-mono-luxury uppercase text-[10px] font-bold transition-all"
                                  >
                                    Suspend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleVerifyVendor(vendor.id)}
                                    className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-emerald-500 hover:bg-emerald-500/10 font-mono-luxury uppercase text-[10px] font-bold transition-all"
                                  >
                                    Reactivate
                                  </button>
                                )}
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 3: CATALOG MODERATION */}
              {/* ======================================================== */}
              {activeTab === 'catalog' && (
                <div className="space-y-6 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Catalog Moderation ({allProducts.length} Garments)
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Inspect uploaded garment imagery, pricing, and ensure authentic Nigerian representation standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-3xl surface-card border border-[var(--border-subtle)] overflow-hidden space-y-3 p-4 shadow-lg group hover:border-[var(--gold-accent)]/50 transition-all"
                      >
                        <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-[var(--bg-secondary)]">
                          <Image src={product.imageUrl} alt={product.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono-luxury text-[9px] uppercase border border-white/10">
                            {product.category}
                          </span>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-white font-mono-luxury text-[9px] font-bold">
                            ● Active Live
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold block truncate">
                            {product.vendorName}
                          </span>
                          <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                            {product.name}
                          </h4>
                          <div className="font-editorial text-lg font-bold text-[var(--text-primary)] mt-1">
                            ₦{product.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-luxury">
                          <span className="text-[var(--text-muted)]">Rating: ★ {product.rating}</span>
                          <span className="text-emerald-500 font-bold">Verified HD</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 4: LAGOS HUB LOGISTICS & CONSOLIDATION */}
              {/* ======================================================== */}
              {activeTab === 'logistics' && (
                <div className="space-y-6 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Lagos Central Hub Package Consolidation
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Monitor multi-vendor garments arriving at the Veyra Lagos central hub for inspection and single-box delivery.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {mockHubOrders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono-luxury text-sm font-bold text-[var(--gold-accent)]">
                                {ord.orderId}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono-luxury font-bold">
                                {ord.hubStatus}
                              </span>
                            </div>
                            <div className="text-xs text-[var(--text-muted)] font-mono-luxury mt-1">
                              Ordered by <strong className="text-[var(--text-primary)]">{ord.customer}</strong> ({ord.customerPhone}) · {ord.destination}
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase block">Total Amount</span>
                            <span className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                              ₦{ord.totalNgn.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-luxury">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[var(--text-muted)]">Consolidated From:</span>
                            {ord.vendorsInvolved.map((vName, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--gold-accent)] font-bold">
                                {vName}
                              </span>
                            ))}
                          </div>

                          <button className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[10px] font-bold hover:opacity-90 transition-all shadow-sm">
                            Update Dispatch Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 5: PAYSTACK & ESCROW SETTINGS */}
              {/* ======================================================== */}
              {activeTab === 'finance' && (
                <div className="space-y-6 animate-fadeIn max-w-4xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Paystack Escrow & Fee Controls
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Configure automated Paystack subaccount transaction splits and Lagos hub inspection logistics fees.
                    </p>
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                          Platform Commission Rate (% on Gross Sales)
                        </label>
                        <input
                          type="number"
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury font-bold"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury">
                          Current rate: {commissionRate}% platform fee retained in master Veyra Paystack account.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                          Lagos Hub Consolidation & Express Delivery Fee (₦)
                        </label>
                        <input
                          type="number"
                          value={lagosDeliveryFee}
                          onChange={(e) => setLagosDeliveryFee(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury font-bold"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury">
                          Flat rate charged per consolidated order to cover quality inspection and dispatch.
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-xs font-mono-luxury text-emerald-500 font-bold">
                        ● Paystack Webhook Status: Active & Listening
                      </span>
                      <button
                        onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })}
                        className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>

        </div>

      )}

    </div>
  );
}
