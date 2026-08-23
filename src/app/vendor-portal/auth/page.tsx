'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  Building, Scissors, Mail, Phone, Lock, MapPin,
  ShieldCheck, ArrowRight, Sparkles, User, Sun, Moon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
    title: 'Zero-Return Bespoke Orders',
    subtitle: 'Customers fit your native pieces on their exact 3D twin before ordering with secured escrow settlements.',
    tag: 'Next-Gen Native'
  },
  {
    image: '/images/products/BlackTrapStarHoodie.jpg',
    title: 'Ready-to-Wear Drops',
    subtitle: 'Boutiques and streetwear labels sell directly to verified Nigerian shoppers with nationwide delivery.',
    tag: 'Streetwear & Denim'
  },
  {
    image: '/images/products/UnisexSlides.jpg',
    title: 'Lagos to Worldwide Logistics',
    subtitle: 'Consolidated pickup from your atelier with white-glove quality control and single luxury box packaging.',
    tag: 'Consolidated Delivery'
  }
];

export default function VendorAuthPage() {
  const router = useRouter();
  const {
    setIsVendorLoggedIn,
    vendorProfile,
    setVendorProfile,
    theme,
    toggleTheme
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('contact@klassicwears.ng');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regForm, setRegForm] = useState({
    brandName: vendorProfile.brandName || 'Klassic Wears',
    designerName: vendorProfile.designerName || 'Adeola Klassic',
    email: vendorProfile.email || 'contact@klassicwears.ng',
    phone: vendorProfile.phone || '+234 802 345 6789',
    password: '',
    location: vendorProfile.location || 'Victoria Island, Lagos',
    vendorType: vendorProfile.vendorType || ('fashion_designer' as 'fashion_designer' | 'boutique_seller'),
    bankName: vendorProfile.bankName || 'Guaranty Trust Bank (GTBank)',
    accountNumber: vendorProfile.accountNumber || '0123456789',
    accountName: vendorProfile.accountName || 'KLASSIC WEARS ENTERPRISE',
  });

  // Auto-rotate editorial lookbook every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vendorEditorialSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsVendorLoggedIn(true);
      setIsSubmitting(false);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
      router.push('/vendor-portal');
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setVendorProfile({
      brandName: regForm.brandName,
      designerName: regForm.designerName,
      contactPerson: regForm.designerName,
      email: regForm.email,
      phone: regForm.phone,
      location: regForm.location,
      vendorType: regForm.vendorType,
      bankName: regForm.bankName,
      accountNumber: regForm.accountNumber,
      accountName: regForm.accountName,
    });

    setTimeout(() => {
      setIsVendorLoggedIn(true);
      setIsSubmitting(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
      router.push('/vendor-portal');
    }, 700);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: STICKY EDITORIAL SLIDESHOW (50% WIDTH) */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-1/2 h-[340px] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between p-6 lg:p-12 bg-black select-none z-10">
        
        {/* Background Images Carousel */}
        {vendorEditorialSlides.map((slide, idx) => (
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
            <span className="font-editorial text-2xl lg:text-3xl font-bold tracking-[0.25em] text-white">
              VEYRA
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-accent)]" />
            <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Atelier
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-black/50 border border-white/20 text-white/80 hover:text-white transition-all backdrop-blur-md"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Editorial Quote & Tag */}
        <div className="relative z-20 space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono-luxury uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{vendorEditorialSlides[currentSlide].tag}</span>
          </div>

          <h2 className="font-editorial text-2xl lg:text-4xl font-bold leading-tight text-white">
            {vendorEditorialSlides[currentSlide].title}
          </h2>

          <p className="text-xs lg:text-sm text-zinc-300 font-light leading-relaxed">
            {vendorEditorialSlides[currentSlide].subtitle}
          </p>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2 pt-4">
            {vendorEditorialSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === idx ? 'w-8 bg-[var(--gold-accent)]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (50% WIDTH) */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8 animate-fadeIn py-6">
          
          {/* ======================================================== */}
          {/* 1. DEFAULT VIEW: SIGN IN */}
          {/* ======================================================== */}
          {authMode === 'login' ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                    Merchant Partner Sign In
                  </span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Partner Workspace Login
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-light">
                  Access your atelier orders, 3D measurement charts, and settlement banking.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Business Email or Phone Number
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. contact@klassicwears.ng or 08023456789"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating Atelier...' : 'Sign In to Merchant Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Direct Link to Register (No Switch Tabs!) */}
              <div className="pt-6 border-t border-[var(--border-subtle)] text-center space-y-2">
                <p className="text-xs text-[var(--text-secondary)] font-light">
                  New designer or boutique on Veyra?
                </p>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] hover:underline font-bold"
                >
                  Register Your Atelier / Store →
                </button>
              </div>

              <div className="text-center pt-2">
                <Link href="/" className="text-[11px] font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  ← Back to Shopper Storefront
                </Link>
              </div>
            </div>
          ) : (

            /* ======================================================== */
            /* 2. ONBOARDING VIEW: REGISTER NEW ATELIER STORE */
            /* ======================================================== */
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--gold-accent)] animate-pulse" />
                  <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                    Partner Onboarding
                  </span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Register Your Store
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-light">
                  Publish your bespoke Senator wear or ready-to-wear drops to thousands of verified Nigerian shoppers.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                    Business Category
                  </label>
                  <select
                    value={regForm.vendorType}
                    onChange={(e) => setRegForm({ ...regForm, vendorType: e.target.value as any })}
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  >
                    <option value="fashion_designer">🧵 Fashion Designer (Handmade / Senator / Bespoke Native)</option>
                    <option value="boutique_seller">🛍️ Boutique Seller (Ready-Made / Urban Streetwear / Footwear)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      Atelier / Brand Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={regForm.brandName}
                        onChange={(e) => setRegForm({ ...regForm, brandName: e.target.value })}
                        placeholder="e.g. Klassic Wears"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      Lead Designer / Tailor
                    </label>
                    <div className="relative">
                      <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={regForm.designerName}
                        onChange={(e) => setRegForm({ ...regForm, designerName: e.target.value })}
                        placeholder="e.g. Adeola Klassic"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="contact@brand.ng"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      WhatsApp / Phone Line
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="+234 802 345 6789"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                      Studio Location (City / State)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={regForm.location}
                        onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                        placeholder="e.g. Victoria Island, Lagos"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Verified Bank Details */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verified Settlement Bank Account</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regForm.bankName}
                        onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })}
                        placeholder="e.g. GTBank, Zenith, Access"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                        10-Digit NUBAN Account
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={regForm.accountNumber}
                        onChange={(e) => setRegForm({ ...regForm, accountNumber: e.target.value })}
                        placeholder="0123456789"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury tracking-widest text-[var(--text-primary)] font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering Atelier...' : 'Register Store & Enter Dashboard →'}</span>
                </button>
              </form>

              {/* Direct Link to Login */}
              <div className="pt-4 border-t border-[var(--border-subtle)] text-center space-y-2">
                <p className="text-xs text-[var(--text-secondary)] font-light">
                  Already registered with Veyra?
                </p>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] hover:underline font-bold"
                >
                  ← Sign In to Your Store
                </button>
              </div>

              <div className="text-center pt-2">
                <Link href="/" className="text-[11px] font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  ← Back to Shopper Storefront
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
