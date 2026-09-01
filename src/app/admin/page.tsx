'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  ShieldCheck, LayoutDashboard, Users, PackageCheck, Scissors,
  DollarSign, TrendingUp, Search, Filter, CheckCircle2, XCircle,
  AlertTriangle, Eye, ArrowUpRight, Phone, Mail, MapPin, Building,
  Clock, Sun, Moon, ExternalLink, LogOut, Sparkles, Check, ChevronRight,
  ShoppingBag, ArrowRight, Star, RefreshCw, Loader2, Store, AlertCircle,
  Lock, KeyRound, Layers, BarChart3, Settings, ShieldAlert,
  EyeOff, Zap, ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const adminEditorialSlides = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    title: 'Executive Platform Governance',
    subtitle: 'Master control for Nigerian brand verifications, catalog curation, and marketplace operations.',
    tag: 'Platform Control'
  },
  {
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
    title: 'Authentic Brand Assurance',
    subtitle: 'Verify genuine fashion houses and maintain top-tier craftsmanship standards across the platform.',
    tag: 'Brand Verification'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    title: 'Catalog Curation & Moderation',
    subtitle: 'Oversee ready-to-wear drops, boutique collections, and designer releases in real time.',
    tag: 'Catalog Moderation'
  }
];

// Vector App Logos
const InstagramLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-pink-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-cyan-400 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.48 6.27 6.27 0 0 0 1.9-4.47V8.62a8.27 8.27 0 0 0 4.88 1.58V6.75c-.34-.01-.67-.03-1-.06z"/>
  </svg>
);

const SnapchatLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-amber-300 fill-current" viewBox="0 0 24 24">
    <path d="M12.002 2c-3.528 0-6.136 2.548-6.136 5.86 0 .894.227 1.83.67 2.66-.25.13-.538.258-.871.393-1.077.441-1.637.95-1.665 1.512-.03.585.503 1.135 1.583 1.635.035.016.07.032.106.048-.052.288-.13.722-.387 1.253-.332.684-.816 1.183-1.438 1.482-.676.326-.777.685-.758.895.03.328.375.568.995.692.658.132 1.458.118 2.327-.04.423-.077.873-.193 1.341-.334.422.56.985.939 1.688 1.132.846.232 1.745.244 2.545.035.801.21 1.7.198 2.546-.035.703-.193 1.266-.572 1.688-1.132.468.141.918.257 1.341.334.869.158 1.669.172 2.327.04.62-.124.965-.364.995-.692.019-.21-.082-.569-.758-.895-.622-.299-1.106-.798-1.438-1.482-.257-.531-.335-.965-.387-1.253.036-.016.071-.032.106-.048 1.08-.5 1.613-1.05 1.583-1.635-.028-.562-.588-1.071-1.665-1.512-.333-.135-.621-.263-.871-.393.443-.83.67-1.766.67-2.66 0-3.312-2.608-5.86-6.136-5.86z"/>
  </svg>
);

export default function SuperAdminPage() {
  const { theme, toggleTheme, allProducts } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active Navigation Tab: Default is 'overview' (Dashboard)
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'catalog' | 'orders' | 'finance'>('overview');

  // Live Vendors Data from DB
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const [vendorSearch, setVendorSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [rejectionModalVendor, setRejectionModalVendor] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adminEditorialSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('veyra_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch all vendors from DB
  const fetchVendorsList = useCallback(async () => {
    try {
      setIsLoadingVendors(true);
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (res.ok && data.success) {
        setVendors(data.vendors || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendors for admin:', err);
    } finally {
      setIsLoadingVendors(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVendorsList();
    }
  }, [isAuthenticated, fetchVendorsList]);

  // Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('veyra_admin_auth', 'true');
        }
        confetti({
          particleCount: 60,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#e6c367', '#10b981', '#ffffff']
        });
      } else {
        setAuthError(data.error || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('veyra_admin_auth');
    }
  };

  // Approve a brand
  const handleApproveBrand = async (vendorId: string) => {
    try {
      setActionLoadingId(vendorId);
      const res = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action: 'approve' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Brand "${vendorId}" approved and verified live!`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffffff', '#e6c367']
        });
        await fetchVendorsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error approving brand:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject / Return brand
  const handleRejectBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalVendor) return;

    try {
      setActionLoadingId(rejectionModalVendor.id);
      const res = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: rejectionModalVendor.id,
          action: 'reject',
          rejectionReason: rejectionReasonInput || 'Store profile information requires revision.'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Brand "${rejectionModalVendor.name}" returned for correction.`);
        setRejectionModalVendor(null);
        setRejectionReasonInput('');
        await fetchVendorsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error rejecting brand:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = (v.name || '').toLowerCase().includes(vendorSearch.toLowerCase()) ||
                          (v.designerName || '').toLowerCase().includes(vendorSearch.toLowerCase()) ||
                          (v.location || '').toLowerCase().includes(vendorSearch.toLowerCase());
    
    let matchesFilter = true;
    if (approvalFilter === 'pending') matchesFilter = v.approvalStatus === 'pending' || !v.isVerified;
    if (approvalFilter === 'approved') matchesFilter = v.approvalStatus === 'approved' || v.isVerified;
    if (approvalFilter === 'rejected') matchesFilter = v.approvalStatus === 'rejected';

    return matchesSearch && matchesFilter;
  });

  const pendingVendorsList = vendors.filter(v => v.approvalStatus === 'pending' || !v.isVerified);
  const pendingCount = pendingVendorsList.length;
  const approvedCount = vendors.filter(v => v.approvalStatus === 'approved' || v.isVerified).length;

  // ========================================================
  // 1. SIGNATURE 50/50 SPLIT SCREEN EXECUTIVE LOGIN GATEWAY
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
        
        {/* LEFT COLUMN: STICKY EDITORIAL SLIDESHOW (50% WIDTH) */}
        <div className="relative w-full lg:w-1/2 h-[340px] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between p-6 lg:p-12 bg-black select-none z-10">
          
          {/* Background Images Carousel */}
          {adminEditorialSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-70 scale-105 transition-transform duration-[6000ms]' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized
                priority={idx === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
            </div>
          ))}

          {/* Top Left Branding */}
          <div className="relative z-20 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/images/logo/veyra-logo.png"
                alt="Veyra"
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-300" />}
              </button>
              <span className="px-3 py-1 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase tracking-widest font-bold backdrop-blur-md">
                {adminEditorialSlides[currentSlide].tag}
              </span>
            </div>
          </div>

          {/* Bottom Section: Caption & Micro Footer */}
          <div className="relative z-20 space-y-6 mt-auto">
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center gap-2">
                {adminEditorialSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentSlide === idx ? 'w-8 bg-[var(--gold-accent)]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight">
                  {adminEditorialSlides[currentSlide].title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {adminEditorialSlides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-luxury text-zinc-400 border-t border-white/10 pt-4">
              <span>EXECUTIVE GOVERNANCE SUITE</span>
              <span>ADMINISTRATION PORTAL</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EXECUTIVE AUTHENTICATION FORM (50% WIDTH) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto min-h-screen">
          <div className="w-full max-w-md space-y-6 animate-fadeIn py-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                  Executive Security Gateway
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                Super Admin Login
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                Enter your authorized executive credentials to access brand approvals, catalog moderation, and platform operations.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Executive Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="name@veyra.ng"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Master Security Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isAuthenticating ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
                    <span>Verifying Executive Session...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Admin Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

            <div className="text-center text-[11px] font-mono-luxury text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
              Veyra Multi-Factor Executive Security Protocol
            </div>

          </div>
        </div>

      </div>
    );
  }

  // ========================================================
  // 2. AUTHENTICATED SUPER ADMIN WORKSPACE WITH FIXED SIDEBAR
  // ========================================================
  const navItems = [
    {
      id: 'overview',
      label: 'Platform Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'approvals',
      label: 'Brand Approvals',
      icon: ShieldCheck,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-amber-500 text-black'
    },
    {
      id: 'catalog',
      label: 'Catalog Moderation',
      icon: ShoppingBag,
      badge: `${allProducts.length} Items`
    },
    {
      id: 'orders',
      label: 'Customer Orders',
      icon: ShoppingCart,
    },
    {
      id: 'finance',
      label: 'Escrow & Settlements',
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors flex flex-col">
      
      {/* 1. TOP LUXURY HEADER (STICKY) */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/veyra-logo-horizontal.png"
              alt="Veyra"
              width={150}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono-luxury uppercase font-bold tracking-widest">
              SUPER ADMIN
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[var(--text-primary)]">Platform Operations</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] transition-all"
          >
            <span>Live Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-500 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Lock Session"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-mono-luxury font-bold">Lock Session</span>
          </button>
        </div>
      </header>

      {/* 2. BODY SHELL */}
      <div className="flex-1 flex">
        
        {/* Left Fixed Sticky Sidebar */}
        <aside className="w-64 lg:w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 flex flex-col justify-between p-4 sm:p-6 shrink-0 hidden md:flex sticky top-[65px] h-[calc(100vh-65px)] self-start overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Executive Badge Card */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--gold-accent)]/15 text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-lg shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[var(--text-primary)] truncate font-editorial">
                    Executive Control
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono-luxury truncate">
                    Platform Governance
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono-luxury">
                <span className="text-[var(--text-muted)]">Status:</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Active
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 font-mono-luxury text-xs uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-left cursor-pointer ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? '' : 'text-[var(--gold-accent)]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                        isActive ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]' : item.badgeColor || 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Bottom Info */}
          <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)] space-y-1">
            <div className="flex items-center justify-between">
              <span>Brand Gating:</span>
              <strong className="text-emerald-500">Enforced</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Escrow Protection:</span>
              <strong className="text-[var(--gold-accent)]">Active</strong>
            </div>
          </div>

        </aside>

        {/* Mobile Horizontal Navigation Bar */}
        <div className="md:hidden w-full overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 flex gap-2 scrollbar-none shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-mono-luxury font-bold uppercase whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 space-y-8">
          
          {/* Toast Notification */}
          {actionSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury font-bold flex items-center justify-between animate-fadeIn shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
              <button onClick={() => setActionSuccessMsg('')} className="text-[10px] uppercase font-bold hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: EXECUTIVE PLATFORM DASHBOARD (DEFAULT VIEW) */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Dashboard Hero Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase font-bold mb-2">
                    <Zap className="h-3 w-3" />
                    <span>Real-time Platform Intelligence</span>
                  </div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    Platform Master Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono-luxury mt-1">
                    Live operational metrics across verified fashion brands, customer drops, and marketplace transactions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchVendorsList}
                    disabled={isLoadingVendors}
                    className="px-4 py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:border-[var(--gold-accent)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingVendors ? 'animate-spin text-[var(--gold-accent)]' : ''}`} />
                    <span>Sync Platform</span>
                  </button>
                </div>
              </div>

              {/* Top KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2 hover:border-[var(--gold-accent)]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold">
                      Platform GMV
                    </span>
                    <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      +18.4% MoM
                    </span>
                  </div>
                  <strong className="font-editorial text-3xl font-bold text-[var(--text-primary)] block">
                    ₦148,650,000
                  </strong>
                  <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                    Escrow secured transaction volume
                  </p>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2 hover:border-[var(--gold-accent)]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold">
                      Registered Brands
                    </span>
                    <span className="text-[10px] font-mono-luxury text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      {approvedCount} Active
                    </span>
                  </div>
                  <strong className="font-editorial text-3xl font-bold text-[var(--text-primary)] block">
                    {vendors.length}
                  </strong>
                  <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                    Boutiques & fashion designers
                  </p>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2 hover:border-[var(--gold-accent)]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold">
                      Live Catalog Garments
                    </span>
                    <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold bg-[var(--gold-subtle)] px-2 py-0.5 rounded-full">
                      Ready to Order
                    </span>
                  </div>
                  <strong className="font-editorial text-3xl font-bold text-[var(--gold-accent)] block">
                    {allProducts.length}
                  </strong>
                  <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                    Direct boutique inventory drops
                  </p>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2 hover:border-[var(--gold-accent)]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold">
                      Platform Verification
                    </span>
                    <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Active Gate
                    </span>
                  </div>
                  <strong className="font-editorial text-3xl font-bold text-emerald-400 block">
                    100%
                  </strong>
                  <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                    Vetted brand store profiles
                  </p>
                </div>

              </div>

              {/* Pending Brand Approvals Action Widget */}
              {pendingCount > 0 && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-luxury font-bold uppercase text-amber-400">
                          Action Required ({pendingCount} Pending)
                        </span>
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                        {pendingCount === 1
                          ? `Brand "${pendingVendorsList[0]?.name}" submitted profile for review`
                          : `${pendingCount} brands awaiting platform verification`}
                      </h3>
                      <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                        Verify brand profile details, contact numbers, and social channels to enable their live drops.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('approvals');
                      setApprovalFilter('pending');
                    }}
                    className="px-6 py-3 rounded-full bg-amber-500 text-black text-xs font-mono-luxury uppercase font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                  >
                    <span>Review Brand Submissions</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Registered Brands Overview Table */}
              <div className="surface-card rounded-3xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                      Fashion Brands & Designers Directory
                    </h3>
                    <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                      All registered fashion partners on the marketplace.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="text-xs font-mono-luxury uppercase font-bold text-[var(--gold-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Approvals Suite</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-luxury">
                    <thead className="border-b border-[var(--border-subtle)] text-[10px] uppercase text-[var(--text-muted)]">
                      <tr>
                        <th className="py-3 px-3">Brand Name</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Manager / Designer</th>
                        <th className="py-3 px-3">Location</th>
                        <th className="py-3 px-3">Live Items</th>
                        <th className="py-3 px-3">Verification</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {vendors.map((v) => {
                        const isApp = v.isVerified || v.approvalStatus === 'approved';
                        const isRej = v.approvalStatus === 'rejected';

                        return (
                          <tr key={v.id} className="hover:bg-[var(--bg-surface)]/50 transition-colors">
                            <td className="py-3.5 px-3 font-bold text-[var(--text-primary)] flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-sm shrink-0">
                                {v.name.charAt(0)}
                              </div>
                              <span className="font-editorial text-sm">{v.name}</span>
                            </td>
                            <td className="py-3.5 px-3 uppercase text-[10px]">
                              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                                {v.vendorType === 'fashion_designer' ? 'Bespoke Designer' : 'Boutique Merchant'}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-[var(--text-secondary)]">{v.designerName}</td>
                            <td className="py-3.5 px-3 text-[var(--text-muted)]">{v.location}</td>
                            <td className="py-3.5 px-3 font-bold text-[var(--text-primary)]">{v.productCount}</td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                isApp
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : isRej
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                              }`}>
                                {isApp ? 'Verified' : isRej ? 'Returned' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <Link
                                href={`/brand/${encodeURIComponent(v.name)}`}
                                target="_blank"
                                className="px-3 py-1 rounded-full surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[10px] uppercase font-bold inline-flex items-center gap-1 transition-all"
                              >
                                <span>Preview</span>
                                <ExternalLink className="h-3 w-3 text-[var(--gold-accent)]" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: BRAND APPROVALS MODULE */}
          {/* ======================================================== */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    Brand & Boutique Approval Command
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                    Review submitted store profiles, verify authentic fashion brands, and activate public storefronts.
                  </p>
                </div>

                <button
                  onClick={fetchVendorsList}
                  disabled={isLoadingVendors}
                  className="px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:border-[var(--gold-accent)] transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingVendors ? 'animate-spin text-[var(--gold-accent)]' : ''}`} />
                  <span>Refresh Brands</span>
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
                    Total Registered Brands
                  </span>
                  <strong className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
                    {vendors.length}
                  </strong>
                </div>

                <div className="p-5 rounded-3xl surface-card border border-amber-500/30 space-y-1 bg-amber-500/5">
                  <span className="text-[10px] font-mono-luxury uppercase text-amber-400 font-bold block flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Pending Verification</span>
                  </span>
                  <strong className="font-editorial text-3xl font-bold text-amber-400">
                    {pendingCount}
                  </strong>
                </div>

                <div className="p-5 rounded-3xl surface-card border border-emerald-500/30 space-y-1 bg-emerald-500/5">
                  <span className="text-[10px] font-mono-luxury uppercase text-emerald-400 font-bold block flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Approved & Verified Active</span>
                  </span>
                  <strong className="font-editorial text-3xl font-bold text-emerald-400">
                    {approvedCount}
                  </strong>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl surface-card border border-[var(--border-subtle)]">
                
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setApprovalFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                      approvalFilter === 'all'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                        : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    All Brands ({vendors.length})
                  </button>

                  <button
                    onClick={() => setApprovalFilter('pending')}
                    className={`px-4 py-2 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      approvalFilter === 'pending'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'surface-card border border-amber-500/30 text-amber-400 hover:border-amber-500'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Pending Review ({pendingCount})</span>
                  </button>

                  <button
                    onClick={() => setApprovalFilter('approved')}
                    className={`px-4 py-2 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      approvalFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'surface-card border border-emerald-500/30 text-emerald-400 hover:border-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approved ({approvedCount})</span>
                  </button>

                  <button
                    onClick={() => setApprovalFilter('rejected')}
                    className={`px-4 py-2 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                      approvalFilter === 'rejected'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'surface-card border border-rose-500/30 text-rose-400 hover:border-rose-500'
                    }`}
                  >
                    Returned / Rejected
                  </button>
                </div>

                <div className="relative min-w-[260px]">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search by brand, manager, city..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>

              </div>

              {/* Vendors List Cards */}
              {isLoadingVendors ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin mx-auto" />
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading brand submissions from database...</p>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="p-12 text-center surface-card rounded-3xl border border-[var(--border-subtle)] space-y-3">
                  <Store className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    No brands matching your filter
                  </h3>
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                    Try switching your search keywords or filter status above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVendors.map((vendor) => {
                    const isApproved = vendor.isVerified || vendor.approvalStatus === 'approved';
                    const isPending = vendor.approvalStatus === 'pending' || !vendor.isVerified;
                    const isRejected = vendor.approvalStatus === 'rejected';
                    const isActioning = actionLoadingId === vendor.id;

                    return (
                      <div
                        key={vendor.id}
                        className="p-6 sm:p-7 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/40 transition-all space-y-5 shadow-lg"
                      >
                        {/* Top Line */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="flex items-center gap-3.5">
                            <div className="h-14 w-14 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] font-editorial font-bold text-2xl flex items-center justify-center shrink-0">
                              {vendor.name ? vendor.name.charAt(0).toUpperCase() : 'V'}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                  {vendor.name}
                                </h3>

                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-luxury font-bold uppercase ${
                                  isApproved
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : isRejected
                                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                                }`}>
                                  ● {isApproved ? 'Verified & Active' : isRejected ? 'Returned / Rejected' : 'Pending Admin Review'}
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury text-[var(--text-muted)] font-semibold uppercase">
                                  {vendor.vendorType === 'fashion_designer' ? 'Bespoke Designer' : 'Boutique Merchant'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-mono-luxury text-[var(--text-secondary)] mt-1 flex-wrap">
                                <span>Manager: <strong className="text-[var(--text-primary)]">{vendor.designerName}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[var(--gold-accent)]" />{vendor.location}</span>
                                <span>•</span>
                                <span>Email: <strong className="text-[var(--text-primary)]">{vendor.email}</strong></span>
                                <span>•</span>
                                <span>Phone: <strong className="text-[var(--text-primary)]">{vendor.phone}</strong></span>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/brand/${encodeURIComponent(vendor.name)}`}
                            target="_blank"
                            className="px-3.5 py-1.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 w-fit shrink-0"
                          >
                            <span>Preview Storefront</span>
                            <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                          </Link>

                        </div>

                        {/* Middle Line */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-[var(--border-subtle)] items-center">
                          
                          <div className="md:col-span-8 space-y-2">
                            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                              <strong className="text-[var(--text-muted)] font-mono-luxury text-[10px] uppercase block mb-0.5">Brand Bio:</strong>
                              {vendor.bio || 'No brand bio provided yet.'}
                            </p>

                            {/* Connected Social Media Channels with Vector Logos */}
                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              {vendor.instagram && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold">
                                  <InstagramLogo />
                                  <span>{vendor.instagram}</span>
                                </span>
                              )}
                              {vendor.tiktok && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold">
                                  <TikTokLogo />
                                  <span>{vendor.tiktok}</span>
                                </span>
                              )}
                              {vendor.snapchat && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold">
                                  <SnapchatLogo />
                                  <span>{vendor.snapchat}</span>
                                </span>
                              )}
                              {vendor.whatsapp && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold">
                                  <Phone className="h-3 w-3 text-emerald-400" />
                                  <span>{vendor.whatsapp}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-4 flex items-center justify-end gap-3 flex-wrap">
                            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center min-w-[90px]">
                              <span className="text-[9px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Live Items</span>
                              <strong className="font-editorial text-xl font-bold text-[var(--text-primary)]">{vendor.productCount}</strong>
                            </div>

                            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-left text-[10px] font-mono-luxury">
                              <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold block">Bank Payout</span>
                              <div className="font-bold text-[var(--text-primary)] truncate max-w-[130px]">{vendor.bankName}</div>
                              <div className="text-[var(--gold-accent)]">{vendor.accountNumber}</div>
                            </div>
                          </div>

                        </div>

                        {/* Bottom Action Controls */}
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] flex-wrap gap-3">
                          
                          <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                            Registered: {new Date(vendor.createdAt).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-2.5">
                            {!isApproved && (
                              <>
                                <button
                                  onClick={() => handleApproveBrand(vendor.id)}
                                  disabled={isActioning}
                                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                                >
                                  {isActioning ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                  <span>Approve Brand</span>
                                </button>

                                <button
                                  onClick={() => setRejectionModalVendor(vendor)}
                                  disabled={isActioning}
                                  className="px-4 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Reject / Return</span>
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => setRejectionModalVendor(vendor)}
                                disabled={isActioning}
                                className="px-4 py-2 rounded-full surface-card border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Revoke / Return</span>
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CATALOG MODERATION */}
          {/* ======================================================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Catalog Moderation Suite
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Inspect and moderate garment drops published by all verified vendors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((p) => (
                  <div key={p.id} className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black">
                      <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono-luxury">
                        <span className="text-[var(--gold-accent)] uppercase font-bold">{p.category}</span>
                        <strong className="text-[var(--text-primary)]">₦{Number(p.price).toLocaleString()}</strong>
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)] line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">Vendor: {p.vendorName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CUSTOMER ORDERS */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Customer Orders & Marketplace Transactions
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Overview of all orders placed across verified boutiques and designer ateliers.
                </p>
              </div>

              <div className="p-8 rounded-3xl surface-card border border-[var(--border-subtle)] text-center space-y-4">
                <ShoppingCart className="h-12 w-12 text-[var(--gold-accent)] mx-auto opacity-70" />
                <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  Active Marketplace Orders
                </h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-md mx-auto">
                  Orders placed by shoppers are routed directly to vendors for packaging and dispatch under escrow protection.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ESCROW SETTLEMENTS & FINANCE */}
          {/* ======================================================== */}
          {activeTab === 'finance' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Escrow Settlements & Finance
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Automated merchant payouts, platform commission, and settled funds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Escrow Vault Balance</span>
                  <strong className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦48,200,000</strong>
                </div>
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Platform Fee (10%)</span>
                  <strong className="font-editorial text-3xl font-bold text-emerald-400">₦14,865,000</strong>
                </div>
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Settled to Vendors</span>
                  <strong className="font-editorial text-3xl font-bold text-cyan-400">₦133,785,000</strong>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Reject / Return Feedback Modal */}
      {rejectionModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg surface-card p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-5 shadow-2xl">
            
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  Return Submission for Correction
                </h3>
                <span className="text-xs font-mono-luxury text-[var(--text-muted)]">
                  Brand: {rejectionModalVendor.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury leading-relaxed">
              When returned, the vendor's profile fields will unlock so they can correct their store details, bio, or contact information and resubmit for approval.
            </p>

            <form onSubmit={handleRejectBrandSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Correction Feedback Note (Sent to Vendor)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Please update your store contact phone number and provide an active Instagram handle."
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalVendor(null)}
                  className="px-5 py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoadingId === rejectionModalVendor.id}
                  className="px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-mono-luxury uppercase font-bold hover:bg-rose-600 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoadingId === rejectionModalVendor.id ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>Return to Vendor</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
