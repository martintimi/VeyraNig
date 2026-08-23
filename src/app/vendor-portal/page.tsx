'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget, Product } from '@/types';
import {
  Store, Scissors, Plus, CheckCircle2, UploadCloud, ArrowRight, Sparkles,
  ShoppingBag, Building, User, Mail, DollarSign, PackageCheck, Layers,
  ExternalLink, LogOut, LayoutDashboard, Settings, ArrowLeft, ShieldCheck,
  Check, Phone, MapPin, Lock, Image as ImageIcon, Sun, Moon, Eye,
  CreditCard, TrendingUp, Clock, RefreshCw, AlertCircle, BarChart3,
  Download, FileText, PieChart, ArrowUpRight, Filter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const vendorEditorialSlides = [
  {
    image: '/images/products/BlackSenator.jpg',
    title: 'The Modern Nigerian Atelier',
    subtitle: 'Powering 3D Virtual Try-On and precision sizing for bespoke tailoring houses across Lagos & Nigeria.',
    tag: 'Bespoke Craftsmanship'
  },
  {
    image: '/images/products/BlackAgbada.jpg',
    title: 'Automated Multi-Vendor Payouts',
    subtitle: 'Receive instant escrow-protected settlements directly to your Nigerian bank account powered by Paystack.',
    tag: 'Paystack Settlement'
  },
  {
    image: '/images/products/BlackTrapStarHoodie.jpg',
    title: 'Lagos to Worldwide Logistics',
    subtitle: 'Consolidated pickup from your atelier with white-glove quality control and single luxury box packaging.',
    tag: 'Consolidated Delivery'
  }
];

// Mock monthly revenue data for Reports
const monthlySalesData = [
  { month: 'Jan', revenue: 280000, units: 4 },
  { month: 'Feb', revenue: 420000, units: 6 },
  { month: 'Mar', revenue: 390000, units: 5 },
  { month: 'Apr', revenue: 610000, units: 9 },
  { month: 'May', revenue: 580000, units: 8 },
  { month: 'Jun', revenue: 750000, units: 11 },
  { month: 'Jul', revenue: 890000, units: 13 },
  { month: 'Aug', revenue: 985000, units: 15 },
];

const topSellingPieces = [
  {
    name: 'Onyx Wool Senator Kaftan',
    image: '/images/products/BlackSenator.jpg',
    unitsSold: 22,
    revenue: 1430000,
    fitScore: '99.4%',
    origin: 'Handmade Bespoke'
  },
  {
    name: 'Midnight Black Embroidered Agbada',
    image: '/images/products/BlackAgbada.jpg',
    unitsSold: 12,
    revenue: 1176000,
    fitScore: '99.8%',
    origin: 'Royal Bespoke'
  },
  {
    name: 'Trapstar Cyber Heavyweight Hoodie',
    image: '/images/products/BlackTrapStarHoodie.jpg',
    unitsSold: 18,
    revenue: 864000,
    fitScore: '97.8%',
    origin: 'Ready to Wear'
  },
  {
    name: 'Kano Full-Grain Leather Slides',
    image: '/images/products/UnisexSlides.jpg',
    unitsSold: 26,
    revenue: 910000,
    fitScore: '99.1%',
    origin: 'Handmade Leather'
  },
];

export default function VendorPortalPage() {
  const { addCustomProduct, allProducts, theme, toggleTheme } = useStore();

  // Vendor Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Vendor Profile State
  const [vendorProfile, setVendorProfile] = useState({
    brandName: 'Klassic Wears',
    designerName: 'Adeola Klassic',
    contactPerson: 'Adeola Klassic',
    email: 'contact@klassicwears.ng',
    password: '',
    phone: '+234 802 345 6789',
    location: 'Ijebu Ode, Ogun / Lagos',
    vendorType: 'fashion_designer' as 'fashion_designer' | 'boutique_seller',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0123456789',
    accountName: 'KLASSIC WEARS ENTERPRISE',
    instagram: '@klassic_wears',
    bio: 'Bespoke Nigerian native wears, hand-cut Senators, and modern traditional sets tailored to perfection.',
  });

  // Active Workspace View
  const [activeView, setActiveView] = useState<'overview' | 'publish' | 'orders' | 'reports' | 'atelier' | 'payouts'>('overview');

  // Publish Form State
  const [formData, setFormData] = useState({
    name: 'Imperial Emerald Silk Senator Kaftan',
    category: 'tops' as GarmentCategory,
    genderTarget: 'male' as GenderTarget,
    price: 68000,
    imageUrl: '/images/products/BlackSenator.jpg',
    fabricComposition: '100% Fine Merino Wool & Silk Blend',
    fitNotes: 'Hand-tailored bespoke cut with reinforced shoulder lines.',
    tags: 'Senator, Bespoke Native, Occasion',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-rotate editorial lookbook
  useEffect(() => {
    if (isLoggedIn) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vendorEditorialSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  // Handle local image file upload from gallery / device
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData(prev => ({ ...prev, imageUrl: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsLoggedIn(true);
      setIsSubmitting(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
    }, 700);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      vendorId: `vendor-${vendorProfile.brandName.toLowerCase().replace(/\s+/g, '-')}`,
      vendorName: vendorProfile.brandName,
      name: formData.name,
      category: formData.category,
      genderTarget: formData.genderTarget,
      garmentOriginType: vendorProfile.vendorType === 'fashion_designer' ? 'handmade_designer' : 'ready_made_boutique',
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      description: `${formData.name} hand-crafted by ${vendorProfile.brandName} (${vendorProfile.location}). Available for 3D virtual try-on on Veyra.`,
      tags: formData.tags.split(',').map(t => t.trim()),
      colors: [{ name: 'Atelier Signature', hex: '#111111' }],
      sizes: ['S', 'M', 'L', 'XL'],
      sizeChart: {
        'S': { chest: [88, 94], waist: [70, 76] },
        'M': { chest: [95, 102], waist: [77, 84] },
        'L': { chest: [103, 110], waist: [85, 92] },
        'XL': { chest: [111, 120], waist: [93, 100] },
      },
      fabricComposition: formData.fabricComposition,
      fitNotes: formData.fitNotes,
      rating: 5.0,
      reviewCount: 1,
      badge: vendorProfile.vendorType === 'fashion_designer' ? 'Bespoke Handmade' : 'Ready-to-Wear',
      layerZIndex: formData.category === 'bottoms' ? 1 : formData.category === 'outerwear' ? 3 : formData.category === 'footwear' ? 4 : 2,
      isUserUploaded: true,
    };

    addCustomProduct(newProduct);
    setPublishedProduct(newProduct);
    setShowSuccessModal(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      
      {!isLoggedIn ? (
        
        /* SPLIT-SCREEN VENDOR ONBOARDING */
        <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
          
          {/* LEFT COLUMN: Sticky on Desktop */}
          <div className="relative w-full lg:w-1/2 h-[340px] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between p-6 lg:p-12 bg-black select-none z-10">
            
            {/* Background Carousel */}
            {vendorEditorialSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === idx ? 'opacity-70 scale-105 transition-transform duration-[6000ms]' : 'opacity-0'
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

            {/* Top Branding */}
            <div className="relative z-20 flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-2">
                <span className="font-editorial text-2xl lg:text-3xl font-bold tracking-[0.25em] text-white">
                  VEYRA
                </span>
                <span className="text-[9px] font-mono-luxury tracking-[0.3em] text-[var(--gold-accent)] uppercase font-bold">
                  PARTNER PORTAL
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                  title="Toggle Light / Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-[var(--gold-accent)]" /> : <Moon className="h-4 w-4" />}
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono-luxury uppercase text-white/90 hover:text-white border border-white/10 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Storefront</span>
                </Link>
              </div>
            </div>

            {/* Editorial Caption on Slide */}
            <div className="relative z-20 space-y-3 max-w-lg mt-auto pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase tracking-widest font-bold">
                <Sparkles className="h-3 w-3" />
                <span>{vendorEditorialSlides[currentSlide].tag}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {vendorEditorialSlides[currentSlide].title}
              </h2>

              <p className="text-xs text-zinc-300 font-light leading-relaxed hidden sm:block">
                {vendorEditorialSlides[currentSlide].subtitle}
              </p>

              {/* Indicator Dots */}
              <div className="flex items-center gap-2 pt-1">
                {vendorEditorialSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentSlide(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentSlide === dotIdx ? 'w-7 bg-[var(--gold-accent)]' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 100% Scrollable Area */}
          <div className="w-full lg:w-1/2 min-h-screen p-6 sm:p-10 lg:p-14 flex flex-col justify-start">
            <div className="w-full max-w-md mx-auto space-y-6 pt-4 pb-24">
              
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                    {authMode === 'register' ? 'Partner Onboarding' : 'Merchant Partner Login'}
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  {authMode === 'register' ? 'Register Your Store' : 'Partner Workspace Login'}
                </h1>

                <p className="text-xs text-[var(--text-secondary)] font-light">
                  {authMode === 'register'
                    ? 'Publish your bespoke Senator wear or ready-to-wear drops to thousands of verified Nigerian shoppers.'
                    : 'Access your atelier orders, measurement charts, and Paystack settlement balances.'}
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
                <button
                  onClick={() => setAuthMode('register')}
                  className={`py-2.5 rounded-xl font-semibold transition-all ${
                    authMode === 'register'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Create Store
                </button>
                <button
                  onClick={() => setAuthMode('login')}
                  className={`py-2.5 rounded-xl font-semibold transition-all ${
                    authMode === 'login'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Partner Sign In
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* 1. Category Selection First */}
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Business Category
                    </label>
                    <select
                      value={vendorProfile.vendorType}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, vendorType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                    >
                      <option value="fashion_designer">🧵 Fashion Designer (Handmade / Senator / Bespoke Native)</option>
                      <option value="boutique_seller">🛍️ Boutique / Online Vendor (Ready-to-Wear / Hoodies / Jeans)</option>
                    </select>
                  </div>
                )}

                {/* 2. Brand / Store Name */}
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      {vendorProfile.vendorType === 'fashion_designer' ? 'Atelier / Brand Name' : 'Boutique / Store Name'}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={vendorProfile.brandName}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, brandName: e.target.value })}
                        placeholder={vendorProfile.vendorType === 'fashion_designer' ? "e.g. Klassic Wears" : "e.g. Street Souk Boutique"}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Conditional Lead Designer */}
                {authMode === 'register' && vendorProfile.vendorType === 'fashion_designer' && (
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Lead Fashion Designer / Master Tailor
                    </label>
                    <div className="relative">
                      <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={vendorProfile.designerName}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, designerName: e.target.value })}
                        placeholder="e.g. Adeola Klassic"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Business Email */}
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      required
                      value={vendorProfile.email}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, email: e.target.value })}
                      placeholder="contact@brand.ng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Password */}
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="password"
                      required
                      value={vendorProfile.password}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. Studio Location */}
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Store / Studio Location (City / State)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={vendorProfile.location}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, location: e.target.value })}
                        placeholder="e.g. Ijebu Ode, Ogun State / Lagos"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 7. Paystack Settlement Box */}
                {authMode === 'register' && (
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono-luxury text-[var(--gold-accent)] font-bold uppercase">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Paystack Settlement Bank Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={vendorProfile.bankName}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, bankName: e.target.value })}
                        placeholder="Bank (e.g. GTBank)"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        required
                        value={vendorProfile.accountNumber}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, accountNumber: e.target.value })}
                        placeholder="10-Digit NUBAN"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury"
                      />
                    </div>
                  </div>
                )}

                {/* 8. CREATE ACCOUNT BUTTON */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>Verifying Store Details...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'register' ? 'Register Store & Enter Dashboard' : 'Sign In to Dashboard'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Footer Note */}
              <div className="pt-6 border-t border-[var(--border-subtle)] text-center">
                <p className="text-xs text-[var(--text-secondary)] font-light">
                  Looking to shop or try on outfits?{' '}
                  <Link href="/" className="text-[var(--gold-accent)] font-semibold hover:underline">
                    Back to Shopper Storefront
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>

      ) : (

        /* AUTHENTICATED DESIGNER & MERCHANT DASHBOARD WORKSPACE */
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
          
          {/* TOP NAVIGATION BAR FOR MERCHANT PORTAL */}
          <header className="h-16 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
            
            {/* Left: Branding & Breadcrumb */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.2em] text-[var(--text-primary)]">
                  VEYRA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[9px] font-mono-luxury uppercase font-bold tracking-widest border border-[var(--gold-accent)]/20">
                  PARTNER HUB
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-2 text-xs font-mono-luxury text-[var(--text-muted)]">
                <span>/</span>
                <span className="text-[var(--text-primary)] font-bold capitalize">
                  {activeView === 'overview' ? 'Overview' : activeView === 'publish' ? 'Garment Publisher' : activeView === 'orders' ? 'Orders Fulfillment' : activeView === 'reports' ? 'Sales & Revenue Reports' : activeView === 'atelier' ? 'Store Profile' : 'Paystack Banking'}
                </span>
              </div>
            </div>

            {/* Right: Verified Badge, Theme Switcher, Live Storefront, Sign Out */}
            <div className="flex items-center gap-3">
              
              {/* Verified Atelier Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-mono-luxury font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{vendorProfile.brandName} · Verified</span>
              </div>

              {/* Theme Toggle (Light / Dark Switcher) */}
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

              {/* View Live Storefront */}
              <Link
                href="/shop"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
              >
                <span>Live Store</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              {/* Logout */}
              <button
                onClick={() => setIsLoggedIn(false)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>

            </div>

          </header>

          {/* MAIN WORKSPACE WRAPPER (SIDEBAR + CONTENT) */}
          <div className="flex-1 flex flex-col md:flex-row">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col justify-between p-4 shrink-0">
              
              <div className="space-y-6">
                
                {/* Brand Profile Card in Sidebar */}
                <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-bold text-sm">
                      <Scissors className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-sm text-[var(--text-primary)] truncate">
                        {vendorProfile.brandName}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono-luxury truncate">
                        {vendorProfile.location}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono-luxury">
                    <span className="text-[var(--text-muted)]">Type:</span>
                    <span className="text-[var(--gold-accent)] font-bold">
                      {vendorProfile.vendorType === 'fashion_designer' ? 'Bespoke Atelier' : 'Boutique Seller'}
                    </span>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1.5 font-mono-luxury text-xs uppercase tracking-wider">
                  <button
                    onClick={() => setActiveView('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'overview'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveView('publish')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'publish'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Publish Garment</span>
                  </button>

                  <button
                    onClick={() => setActiveView('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'orders'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>Orders to Fulfill</span>
                  </button>

                  <button
                    onClick={() => setActiveView('reports')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'reports'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Reports & Sales</span>
                  </button>

                  <button
                    onClick={() => setActiveView('atelier')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'atelier'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    <span>Store Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveView('payouts')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                      activeView === 'payouts'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Paystack Banking</span>
                  </button>
                </nav>

              </div>

              {/* Bottom Info */}
              <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)] space-y-1">
                <div>Veyra Hub Settlement: <strong className="text-emerald-500">Active</strong></div>
                <div>Lagos Express Dispatch: <strong className="text-[var(--gold-accent)]">24-48h</strong></div>
              </div>

            </aside>

            {/* MAIN WORKSPACE CONTENT AREA */}
            <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto space-y-8">
              
              {/* ======================================================== */}
              {/* VIEW 1: OVERVIEW EXECUTIVE DASHBOARD */}
              {/* ======================================================== */}
              {activeView === 'overview' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  {/* Top Welcome Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                        Executive Overview
                      </h1>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                        {vendorProfile.brandName} · {vendorProfile.location} · {vendorProfile.vendorType === 'fashion_designer' ? 'Bespoke Atelier' : 'Boutique'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveView('reports')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono-luxury uppercase text-xs font-bold text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>View Sales Reports</span>
                      </button>

                      <button
                        onClick={() => setActiveView('publish')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Upload Garment</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Available Settlement</span>
                        <DollarSign className="h-4 w-4 text-[var(--gold-accent)]" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦485,000</div>
                      <span className="text-[11px] text-emerald-500 font-mono-luxury font-bold">● Paystack Auto-Settles Daily</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Total Revenue Earned</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦4,905,000</div>
                      <span className="text-[11px] text-emerald-500 font-mono-luxury font-bold">+18.4% this month</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Goods Sold</span>
                        <PackageCheck className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">78 Garments</div>
                      <span className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">Dispatched via Veyra Hub</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Virtual Try-Ons</span>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">1,820</div>
                      <span className="text-[11px] text-emerald-500 font-mono-luxury font-bold">14.8% Conversion Rate</span>
                    </div>
                  </div>

                  {/* Fast Action Banner */}
                  <div className="p-8 rounded-3xl surface-card border border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase font-bold">
                        <Sparkles className="h-3 w-3" />
                        <span>Instant 3D Try-On Integration</span>
                      </div>
                      <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                        Add Your Latest Design to the Nigerian Collection
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                        Upload your pieces directly from your photo gallery or catalog stock. Sizing is calibrated live for shoppers across Nigeria.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveView('publish')}
                      className="px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-xl shrink-0 flex items-center gap-2"
                    >
                      <span>Publish Garment Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 2: PUBLISH GARMENT (WITH REAL DEVICE GALLERY UPLOAD) */}
              {/* ======================================================== */}
              {activeView === 'publish' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Publish New Garment
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Upload cloth photos directly from your phone / computer gallery, set tailoring specs, and preview live.
                    </p>
                  </div>

                  {showSuccessModal && publishedProduct ? (
                    <div className="p-10 rounded-3xl surface-card border border-emerald-500/40 text-center space-y-4 max-w-2xl mx-auto">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                      </div>
                      <h3 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">Garment Published Live!</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        <strong>{publishedProduct.name}</strong> is now live on Veyra under <strong>{vendorProfile.brandName}</strong> and ready for 3D virtual sizing across Nigeria.
                      </p>
                      <div className="pt-4 flex items-center justify-center gap-4">
                        <Link
                          href="/shop"
                          target="_blank"
                          className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold shadow-lg"
                        >
                          Preview in Shop
                        </Link>
                        <button
                          onClick={() => setShowSuccessModal(false)}
                          className="px-6 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury uppercase font-bold"
                        >
                          Upload Another Piece
                        </button>
                      </div>
                    </div>
                  ) : (
                    
                    /* 2-COLUMN LUXURY STUDIO LAYOUT */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left 7 Cols: Structured Garment Form with Interactive File Upload */}
                      <form onSubmit={handlePublish} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card space-y-5 border border-[var(--border-subtle)]">
                        
                        <div>
                          <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                            Garment Title / Model Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Onyx Black Wool Senator Kaftan"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div>
                            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                              Category
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value as GarmentCategory })}
                              className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                            >
                              <option value="tops">Top / Senator / Shirt</option>
                              <option value="bottoms">Trouser / Denim / Pants</option>
                              <option value="outerwear">Agbada / Robe / Wrap</option>
                              <option value="footwear">Footwear / Slides</option>
                              <option value="accessories">Fila / Cap / Extra</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                              Department
                            </label>
                            <select
                              value={formData.genderTarget}
                              onChange={(e) => setFormData({ ...formData, genderTarget: e.target.value as GenderTarget })}
                              className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                            >
                              <option value="male">Men&apos;s Wear</option>
                              <option value="female">Women&apos;s Wear</option>
                              <option value="unisex">Unisex</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                              Price (₦)
                            </label>
                            <input
                              type="number"
                              required
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                              className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury font-bold"
                            />
                          </div>
                        </div>

                        {/* INTERACTIVE DEVICE GALLERY UPLOAD DROPZONE */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                            Garment Photo Upload (From Phone / PC Gallery)
                          </label>

                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />

                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              if (e.dataTransfer.files?.[0]) {
                                handleImageFile(e.dataTransfer.files[0]);
                              }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                              isDragging
                                ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                                : 'border-[var(--border-subtle)] hover:border-[var(--gold-accent)] bg-[var(--bg-primary)]'
                            }`}
                          >
                            <div className="h-12 w-12 rounded-2xl bg-[var(--badge-bg)] text-[var(--gold-accent)] flex items-center justify-center shadow-md">
                              <UploadCloud className="h-6 w-6" />
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm font-bold text-[var(--text-primary)]">
                                Click to Upload from Gallery or Drag Photo Here
                              </div>
                              <p className="text-xs text-[var(--text-muted)] font-mono-luxury">
                                Supports high-resolution JPG, PNG, WebP images of your designs
                              </p>
                            </div>

                            <button
                              type="button"
                              className="px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase text-[var(--text-primary)] font-bold hover:border-[var(--gold-accent)] transition-all shadow-sm"
                            >
                              Browse Photos on Device
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets Gallery Selector */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-mono-luxury uppercase text-[var(--text-muted)]">
                            Or Quick Pick from Catalog Stock:
                          </label>
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              { label: 'Black Senator', path: '/images/products/BlackSenator.jpg' },
                              { label: 'Blue Senator', path: '/images/products/BlueSenator.png' },
                              { label: 'Agbada Robe', path: '/images/products/BlackAgbada.jpg' },
                              { label: 'Trapstar Hoodie', path: '/images/products/BlackTrapStarHoodie.jpg' },
                              { label: 'Baggy Denim', path: '/images/products/BaggyJean.jpg' },
                              { label: 'Leather Slides', path: '/images/products/UnisexSlides.jpg' },
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFormData({ ...formData, imageUrl: preset.path })}
                                className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                                  formData.imageUrl === preset.path
                                    ? 'border-[var(--gold-accent)] ring-2 ring-[var(--gold-accent)]/50'
                                    : 'border-[var(--border-subtle)] opacity-70 hover:opacity-100'
                                }`}
                              >
                                <Image src={preset.path} alt={preset.label} fill unoptimized className="object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                              Fabric Specs & Composition
                            </label>
                            <input
                              type="text"
                              value={formData.fabricComposition}
                              onChange={(e) => setFormData({ ...formData, fabricComposition: e.target.value })}
                              placeholder="e.g. 100% Fine Merino Wool & Silk"
                              className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={formData.tags}
                              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                              placeholder="Senator, Bespoke Native, Occasion"
                              className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                            Tailoring & Fit Notes
                          </label>
                          <textarea
                            rows={2}
                            value={formData.fitNotes}
                            onChange={(e) => setFormData({ ...formData, fitNotes: e.target.value })}
                            placeholder="e.g. Structured shoulder line with comfortable chest drape."
                            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
                        >
                          <UploadCloud className="h-4 w-4" />
                          <span>Publish Garment to Live Store</span>
                        </button>

                      </form>

                      {/* Right 5 Cols: Live Storefront Card & Mannequin Preview */}
                      <div className="lg:col-span-5 p-6 rounded-3xl surface-card space-y-4 border border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                          <span className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--gold-accent)] flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Live Shopper Preview</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono-luxury font-bold">
                            99.4% Fit Ready
                          </span>
                        </div>

                        {/* Card Preview */}
                        <div className="rounded-2xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-lg space-y-3">
                          <div className="relative h-72 w-full bg-[var(--bg-secondary)] overflow-hidden">
                            <Image
                              src={formData.imageUrl || '/images/products/BlackSenator.jpg'}
                              alt="Preview"
                              fill
                              unoptimized
                              className="object-cover object-center"
                            />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-mono-luxury uppercase text-[var(--gold-accent)] font-bold border border-white/10">
                              {vendorProfile.vendorType === 'fashion_designer' ? 'Bespoke Handmade' : 'Ready-to-Wear'}
                            </div>
                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-mono-luxury text-white">
                              {vendorProfile.brandName}
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)]">
                                {formData.category.toUpperCase()} · {formData.genderTarget.toUpperCase()}
                              </span>
                              <span className="font-editorial text-lg font-bold text-[var(--gold-accent)]">
                                ₦{Number(formData.price || 0).toLocaleString()}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                              {formData.name || 'Garment Title'}
                            </h4>

                            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury line-clamp-2">
                              {formData.fabricComposition}
                            </p>

                            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-luxury text-zinc-400">
                              <span>3D Fitting Ready</span>
                              <span className="text-emerald-500 font-bold">Instant Dispatch</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                          💡 <strong>How Sizing Works:</strong> When shoppers with matching body dimensions view your garment, Veyra will automatically calculate drape fidelity and show your atelier&apos;s brand badge.
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 3: ORDERS TO FULFILL */}
              {/* ======================================================== */}
              {activeView === 'orders' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Orders to Fulfill
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Customer orders with precision digital body twin measurements for tailoring inspection.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        orderId: '#VY-ORD-9201',
                        customer: 'Chukwudi Eze',
                        item: 'Onyx Wool Senator Kaftan',
                        size: 'Size L (Custom Tailored)',
                        amount: 65000,
                        location: 'Victoria Island, Lagos',
                        measurements: 'Chest 104cm · Shoulder 49cm · Height 182cm · Inseam 84cm',
                        status: 'Paid & Awaiting Atelier Dispatch',
                        time: '2 hours ago'
                      },
                      {
                        orderId: '#VY-ORD-9195',
                        customer: 'Fatima Bello',
                        item: 'Midnight Black Embroidered Agbada Robe',
                        size: 'Size M',
                        amount: 98000,
                        location: 'Maitama, Abuja',
                        measurements: 'Chest 98cm · Shoulder 46cm · Height 175cm',
                        status: 'Inspected & Dispatched to Veyra Hub',
                        time: 'Yesterday'
                      }
                    ].map((order, idx) => (
                      <div
                        key={idx}
                        className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-mono-luxury font-bold text-[var(--gold-accent)]">{order.orderId}</span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-mono-luxury font-bold">
                              {order.status}
                            </span>
                            <span className="text-xs font-mono-luxury text-[var(--text-muted)]">{order.time}</span>
                          </div>

                          <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                            {order.item} ({order.size})
                          </h3>

                          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-primary)]">
                            📐 <strong>Customer Body Twin:</strong> {order.measurements}
                          </div>

                          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
                            Customer: <strong>{order.customer}</strong> · Destination: {order.location} · Payout: <strong className="text-[var(--gold-accent)]">₦{order.amount.toLocaleString()}</strong>
                          </div>
                        </div>

                        <button className="px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md shrink-0">
                          Request Veyra Hub Dispatch
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 4: ANALYTICS & SALES REPORTS */}
              {/* ======================================================== */}
              {activeView === 'reports' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  {/* Header & Export Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                        Sales & Revenue Reports
                      </h1>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                        Comprehensive financial statement, goods sold, and customer sizing analytics.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        alert('Your official Veyra Financial Statement (PDF/CSV) has been generated and queued for download.');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md self-start sm:self-auto"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Statement (CSV/PDF)</span>
                    </button>
                  </div>

                  {/* 4 Financial Key Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Gross Revenue</span>
                      <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦4,905,000</div>
                      <span className="text-xs text-emerald-500 font-mono-luxury font-bold">↑ +24.8% vs last month</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Total Goods Sold</span>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">78 Garments</div>
                      <span className="text-xs text-indigo-500 font-mono-luxury font-bold">4.9 ★ Tailoring Rating</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Avg. Order Value (AOV)</span>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦62,885</div>
                      <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">Per order package</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Disbursed via Paystack</span>
                      <div className="font-editorial text-3xl font-bold text-emerald-500">₦4,420,000</div>
                      <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">₦485,000 pending</span>
                    </div>
                  </div>

                  {/* Monthly Revenue Performance Bar Chart */}
                  <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                          Monthly Revenue Growth (₦)
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono-luxury">
                          Performance trajectory across all garment categories
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                        <span className="h-2 w-2 rounded-full bg-[var(--gold-accent)]" />
                        <span>2026 Season Total: ₦4.9M</span>
                      </div>
                    </div>

                    {/* Visual Bar Chart */}
                    <div className="grid grid-cols-8 gap-3 sm:gap-6 pt-6 pb-2 items-end h-56 border-b border-[var(--border-subtle)]">
                      {monthlySalesData.map((item, idx) => {
                        const maxRevenue = 1000000;
                        const heightPercent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));
                        return (
                          <div key={idx} className="flex flex-col items-center h-full justify-end group">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono-luxury text-[var(--gold-accent)] font-bold mb-1">
                              ₦{(item.revenue / 1000).toFixed(0)}k
                            </div>

                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[var(--gold-subtle)] to-[var(--gold-accent)] group-hover:brightness-110 transition-all shadow-md"
                            />

                            <span className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-2 font-bold">
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-luxury text-[var(--text-muted)]">
                      <span>Lowest: Jan (₦280k)</span>
                      <span>Peak: Aug (₦985k) · +251% Growth</span>
                    </div>
                  </div>

                  {/* Top Selling Products Performance Matrix */}
                  <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5">
                    <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                      Top Performing Garments
                    </h3>

                    <div className="space-y-3">
                      {topSellingPieces.map((piece, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--gold-accent)]/50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                              <Image src={piece.image} alt={piece.name} fill unoptimized className="object-cover" />
                            </div>

                            <div>
                              <h4 className="font-bold text-sm text-[var(--text-primary)]">{piece.name}</h4>
                              <div className="text-xs text-[var(--text-muted)] font-mono-luxury flex items-center gap-2 mt-0.5">
                                <span className="text-[var(--gold-accent)]">{piece.origin}</span>
                                <span>·</span>
                                <span>{piece.fitScore} Fit Satisfaction</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 sm:text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border-subtle)]">
                            <div>
                              <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase block">Units Sold</span>
                              <span className="text-sm font-bold text-[var(--text-primary)]">{piece.unitsSold} Pieces</span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase block">Revenue</span>
                              <span className="text-sm font-editorial font-bold text-[var(--gold-accent)]">
                                ₦{piece.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Geography Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
                      <span className="text-xs font-mono-luxury text-[var(--text-muted)] uppercase font-bold">Lagos Deliveries (Hub)</span>
                      <div className="font-editorial text-2xl font-bold text-[var(--text-primary)]">62% (48 Orders)</div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">VI, Lekki, Ikeja, Yaba Express</p>
                    </div>

                    <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
                      <span className="text-xs font-mono-luxury text-[var(--text-muted)] uppercase font-bold">Abuja (Federal Capital)</span>
                      <div className="font-editorial text-2xl font-bold text-[var(--text-primary)]">24% (19 Orders)</div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">Maitama, Wuse, Garki Nationwide</p>
                    </div>

                    <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
                      <span className="text-xs font-mono-luxury text-[var(--text-muted)] uppercase font-bold">Other States</span>
                      <div className="font-editorial text-2xl font-bold text-[var(--text-primary)]">14% (11 Orders)</div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">Port Harcourt, Kano, Ibadan</p>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 5: STORE PROFILE */}
              {/* ======================================================== */}
              {activeView === 'atelier' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Store & Atelier Profile
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Manage your public brand identity, studio credentials, and contact details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left 7 Cols: Profile Settings Form */}
                    <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card space-y-5 border border-[var(--border-subtle)]">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            Store / Brand Name
                          </label>
                          <input
                            type="text"
                            value={vendorProfile.brandName}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, brandName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            {vendorProfile.vendorType === 'fashion_designer' ? 'Lead Designer' : 'Store Manager'}
                          </label>
                          <input
                            type="text"
                            value={vendorProfile.designerName}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, designerName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                          Brand Bio & Atelier Story
                        </label>
                        <textarea
                          rows={3}
                          value={vendorProfile.bio}
                          onChange={(e) => setVendorProfile({ ...vendorProfile, bio: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            Studio Address / City
                          </label>
                          <input
                            type="text"
                            value={vendorProfile.location}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            Instagram Handle
                          </label>
                          <input
                            type="text"
                            value={vendorProfile.instagram}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, instagram: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={vendorProfile.phone}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                            Business Email
                          </label>
                          <input
                            type="email"
                            value={vendorProfile.email}
                            onChange={(e) => setVendorProfile({ ...vendorProfile, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                        }}
                        className="px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
                      >
                        Save Profile Changes
                      </button>

                    </div>

                    {/* Right 5 Cols: Live Public Atelier Card Preview */}
                    <div className="lg:col-span-5 p-6 rounded-3xl surface-card space-y-4 border border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                        <span className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--gold-accent)]">
                          Public Atelier Card
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono-luxury font-bold">
                          Verified
                        </span>
                      </div>

                      <div className="rounded-2xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-6 space-y-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-bold text-lg">
                            <Scissors className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                              {vendorProfile.brandName}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] font-mono-luxury flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{vendorProfile.location}</span>
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                          {vendorProfile.bio}
                        </p>

                        <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px] font-mono-luxury">
                          <div>
                            <span className="text-[var(--text-muted)] block">Lead Designer:</span>
                            <span className="text-[var(--text-primary)] font-bold">{vendorProfile.designerName}</span>
                          </div>
                          <div>
                            <span className="text-[var(--text-muted)] block">Instagram:</span>
                            <span className="text-[var(--gold-accent)] font-bold">{vendorProfile.instagram}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW 6: PAYSTACK BANKING & SETTLEMENT */}
              {/* ======================================================== */}
              {activeView === 'payouts' && (
                <div className="space-y-8 animate-fadeIn max-w-7xl">
                  
                  <div>
                    <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                      Paystack Escrow Banking
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                      Automated split settlements wired directly to your verified Nigerian commercial bank account.
                    </p>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Available Balance</span>
                      <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦485,000</div>
                      <span className="text-xs text-emerald-500 font-mono-luxury font-bold">Auto-Settles in 24h</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Lifetime Revenue</span>
                      <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦4,905,000</div>
                      <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">78 Garments Sold</span>
                    </div>

                    <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Platform Fee</span>
                      <div className="font-editorial text-3xl font-bold text-emerald-500">0% Active</div>
                      <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">Partner Promotion Rate</span>
                    </div>
                  </div>

                  {/* Bank Details Card */}
                  <div className="p-6 sm:p-8 rounded-3xl surface-card space-y-4 border border-[var(--border-subtle)] max-w-2xl">
                    <div className="flex items-center gap-2 text-sm font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
                      <CreditCard className="h-4 w-4" />
                      <span>Verified Nigerian Settlement Account</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
                        <span className="text-[var(--text-secondary)] uppercase">Settlement Bank:</span>
                        <span className="font-bold text-[var(--text-primary)]">{vendorProfile.bankName}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
                        <span className="text-[var(--text-secondary)] uppercase">NUBAN Account Number:</span>
                        <span className="font-bold text-[var(--text-primary)] tracking-widest">{vendorProfile.accountNumber}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
                        <span className="text-[var(--text-secondary)] uppercase">Account Name:</span>
                        <span className="font-bold text-[var(--text-primary)]">{vendorProfile.accountName}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono-luxury">
                        <span className="text-[var(--text-secondary)] uppercase">Settlement Speed:</span>
                        <span className="font-bold text-emerald-500">Daily Automated Split (T+1)</span>
                      </div>
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
