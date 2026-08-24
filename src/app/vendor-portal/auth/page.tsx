'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  Building, Scissors, Mail, Phone, Lock, MapPin,
  ShieldCheck, ArrowRight, ArrowLeft, Sparkles, User, Sun, Moon, Loader2,
  Eye, EyeOff, CheckCircle2, RotateCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { signUpVendor, signInVendor, verifyOtpCode, resendOtpCode } from '@/lib/services/auth';

const vendorEditorialSlides = [
  {
    image: '/images/products/BlackSenator.jpg',
    title: 'The Modern Nigerian Atelier',
    subtitle: 'Powering ready-to-wear and bespoke native wear for fashion designers across Lagos and Nigeria.',
    tag: 'Atelier Growth'
  },
  {
    image: '/images/products/BlackAgbada.jpg',
    title: 'Zero-Return High Fashion',
    subtitle: 'Sell your native pieces directly to verified Nigerian shoppers with secured escrow settlements.',
    tag: 'Escrow Protected'
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
    setVendorProfile,
    theme,
    toggleTheme
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'verify_otp'>('login');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regForm, setRegForm] = useState({
    brandName: '',
    designerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: 'Victoria Island, Lagos',
    vendorType: 'fashion_designer' as 'fashion_designer' | 'boutique_merchant',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '',
    accountName: '',
  });

  // OTP Verification State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  // Auto-rotate editorial lookbook every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vendorEditorialSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss error message after 10 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer > 0 && authMode === 'verify_otp') {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, authMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await signInVendor(loginIdentifier, loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid business email or password.');
        setIsSubmitting(false);
        return;
      }

      if (res.vendor) {
        setVendorProfile({
          brandName: res.vendor.brand_name || 'My Atelier',
          designerName: res.vendor.designer_name || 'Lead Designer',
          contactPerson: res.vendor.contact_person || res.vendor.designer_name,
          email: res.vendor.email || loginIdentifier,
          phone: res.vendor.phone || '',
          location: res.vendor.location || 'Lagos, Nigeria',
          vendorType: res.vendor.vendor_type || 'fashion_designer',
          bankName: res.vendor.bank_name || 'Guaranty Trust Bank (GTBank)',
          accountNumber: res.vendor.account_number || '',
          accountName: res.vendor.account_name || '',
        });
      }

      setIsVendorLoggedIn(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
      router.push('/vendor-portal');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await signUpVendor({
        email: regForm.email,
        password: regForm.password,
        brandName: regForm.brandName,
        designerName: regForm.designerName,
        phone: regForm.phone,
        location: regForm.location,
        vendorType: regForm.vendorType as any,
        bankName: regForm.bankName,
        accountNumber: regForm.accountNumber,
        accountName: regForm.accountName,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Vendor registration failed. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      // Registration successful! Switch to 6-digit OTP verification screen
      setPendingEmail(regForm.email);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
      setAuthMode('verify_otp');
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Vendor registration failed.');
      setIsSubmitting(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      const el = document.getElementById(`vendor-otp-input-${nextIdx}`);
      if (el) el.focus();
      return;
    }

    const digit = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      const el = document.getElementById(`vendor-otp-input-${index + 1}`);
      if (el) el.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const el = document.getElementById(`vendor-otp-input-${index - 1}`);
      if (el) el.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('').trim();
    if (token.length < 6) {
      setErrorMessage('Please enter all 6 digits of the confirmation code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await verifyOtpCode(pendingEmail || regForm.email, token, 'signup');
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid or expired 6-digit code. Please check your email.');
        setIsSubmitting(false);
        return;
      }

      const activeVendor = res.vendor || {
        brandName: regForm.brandName,
        designerName: regForm.designerName,
        contactPerson: regForm.designerName,
        email: pendingEmail || regForm.email,
        phone: regForm.phone,
        location: regForm.location,
        vendorType: regForm.vendorType,
        bankName: regForm.bankName,
        accountNumber: regForm.accountNumber,
        accountName: regForm.accountName,
      };

      setVendorProfile({
        brandName: activeVendor.brand_name || activeVendor.brandName || regForm.brandName,
        designerName: activeVendor.designer_name || activeVendor.designerName || regForm.designerName,
        contactPerson: activeVendor.contact_person || activeVendor.contactPerson || regForm.designerName,
        email: activeVendor.email || pendingEmail || regForm.email,
        phone: activeVendor.phone || regForm.phone,
        location: activeVendor.location || regForm.location,
        vendorType: activeVendor.vendor_type || activeVendor.vendorType || regForm.vendorType,
        bankName: activeVendor.bank_name || activeVendor.bankName || regForm.bankName,
        accountNumber: activeVendor.account_number || activeVendor.accountNumber || regForm.accountNumber,
        accountName: activeVendor.account_name || activeVendor.accountName || regForm.accountName,
      });

      setIsVendorLoggedIn(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
      router.push('/vendor-portal');
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage('');
    try {
      const activeEmail = pendingEmail || regForm.email;
      const res = await resendOtpCode(activeEmail);
      if (res.success) {
        setResendTimer(30);
      } else {
        setErrorMessage(res.error || 'Failed to resend confirmation code.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while resending code.');
    } finally {
      setIsResending(false);
    }
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
            <Image
              src="/images/logo/veyra-logo.png"
              alt="Veyra Atelier"
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
              {vendorEditorialSlides[currentSlide].tag}
            </span>
          </div>
        </div>

        {/* Bottom Section: Caption & Micro Footer anchored to bottom */}
        <div className="relative z-20 space-y-6 mt-auto">
          {/* Editorial Story Caption */}
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-2">
              {vendorEditorialSlides.map((_, idx) => (
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
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {vendorEditorialSlides[currentSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {vendorEditorialSlides[currentSlide].subtitle}
              </p>
            </div>
          </div>

          {/* Bottom Micro Footer */}
          <div className="flex items-center justify-between text-[11px] font-mono-luxury text-zinc-400 border-t border-white/10 pt-4">
            <span>ATELIER COMMERCE PORTAL</span>
            <span>LAGOS · NIGERIA</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (50% WIDTH) */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto min-h-screen">
        <div className="w-full max-w-xl space-y-6 animate-fadeIn py-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                {authMode === 'verify_otp'
                  ? 'Atelier Verification'
                  : authMode === 'register'
                  ? 'Partner Onboarding'
                  : 'Merchant Partner Portal'}
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {authMode === 'verify_otp'
                ? 'Confirm Atelier Email'
                : authMode === 'register'
                ? 'Register Your Store'
                : 'Partner Workspace Login'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light">
              {authMode === 'verify_otp'
                ? `Enter the 6-digit confirmation code sent to ${pendingEmail || regForm.email}.`
                : authMode === 'register'
                ? 'Publish your ready-to-wear drops and receive orders from verified shoppers.'
                : 'Access your atelier orders, inventory management, and settlement banking.'}
            </p>
          </div>

          {/* Mode Tabs: Login on Left, Register on Right (Hidden in OTP mode) */}
          {authMode !== 'verify_otp' && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                }}
                className={`py-2.5 rounded-xl transition-all font-semibold ${
                  authMode === 'login'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                }}
                className={`py-2.5 rounded-xl transition-all font-semibold ${
                  authMode === 'register'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Register Atelier
              </button>
            </div>
          )}

          {/* Error Message Alert with Auto-Dismiss */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center justify-between gap-2.5 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-[10px] text-rose-400/60 hover:text-rose-300 transition-colors uppercase font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. OTP VERIFICATION VIEW */}
          {/* ======================================================== */}
          {authMode === 'verify_otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-3 text-center">
                  6-Digit Atelier Confirmation Code
                </label>
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`vendor-otp-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono-luxury rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/20 focus:outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length < 6}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Atelier...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Activate & Enter Merchant Portal</span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-3 pt-2 text-center text-xs font-mono-luxury">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isResending}
                  className={`inline-flex items-center gap-1.5 ${
                    resendTimer > 0
                      ? 'text-[var(--text-muted)] cursor-not-allowed'
                      : 'text-[var(--gold-accent)] font-semibold hover:underline'
                  }`}
                >
                  <RotateCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>
                    {resendTimer > 0
                      ? `Resend code in ${resendTimer}s`
                      : 'Didn’t receive code? Resend OTP'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Edit Registration Details</span>
                </button>
              </div>
            </form>
          ) : authMode === 'login' ? (

            /* ======================================================== */
            /* 2. SIGN IN VIEW */
            /* ======================================================== */
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
                    placeholder="contact@brand.ng or 08023456789"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer z-20 select-none flex items-center justify-center"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating Atelier...' : 'Sign In to Merchant Portal'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center pt-4">
                <Link href="/" className="text-[11px] font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  ← Return to Shopper Storefront
                </Link>
              </div>
            </form>
          ) : (

            /* ======================================================== */
            /* 3. REGISTER VIEW */
            /* ======================================================== */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                  Business Category
                </label>
                <select
                  value={regForm.vendorType}
                  onChange={(e) => setRegForm({ ...regForm, vendorType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                >
                  <option value="fashion_designer">🧵 Fashion Designer (Ready-to-Wear / Kaftans / Native Wear)</option>
                  <option value="boutique_merchant">🛍️ Boutique Seller (Ready-to-Wear / Streetwear / Footwear)</option>
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
                      placeholder="e.g. Deji & Kola"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                    Lead Designer / Contact Person
                  </label>
                  <div className="relative">
                    <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={regForm.designerName}
                      onChange={(e) => setRegForm({ ...regForm, designerName: e.target.value })}
                      placeholder="e.g. Kolapo Babatunde"
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
                      placeholder="08023456789"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                  Atelier / Store Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={regForm.location}
                    onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                    placeholder="e.g. 14B Adeola Odeku, Victoria Island, Lagos"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer z-20 select-none flex items-center justify-center"
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer z-20 select-none flex items-center justify-center"
                      aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Settlement Banking Details (Optional at Registration) */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-[var(--gold-accent)] font-mono-luxury font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Settlement Bank Payout (Direct Escrow Payouts)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Bank Name
                    </label>
                    <select
                      value={regForm.bankName}
                      onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                    >
                      <option>Guaranty Trust Bank (GTBank)</option>
                      <option>Zenith Bank</option>
                      <option>Access Bank</option>
                      <option>United Bank for Africa (UBA)</option>
                      <option>First Bank of Nigeria</option>
                      <option>Kuda Microfinance Bank</option>
                      <option>OPay Digital Services</option>
                      <option>Moniepoint MFB</option>
                      <option>Stanbic IBTC Bank</option>
                      <option>Sterling Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      10-Digit NUBAN Account Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={regForm.accountNumber}
                      onChange={(e) => setRegForm({ ...regForm, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="0123456789"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Settlement Account Name
                  </label>
                  <input
                    type="text"
                    value={regForm.accountName}
                    onChange={(e) => setRegForm({ ...regForm, accountName: e.target.value.toUpperCase() })}
                    placeholder="e.g. DEJI & KOLA ENTERPRISE"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none uppercase font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting Application...' : 'Register Atelier & Receive Code'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center pt-3">
                <Link href="/" className="text-[11px] font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  ← Return to Shopper Storefront
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
