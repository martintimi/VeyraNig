'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Sparkles, ArrowRight, ArrowLeft, User, Lock, Mail, Phone, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

const editorialSlides = [
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    title: 'Bespoke Nigerian Tailoring',
    subtitle: 'Custom-fitted Senator Kaftans & Ceremonial Native Wear crafted in Victoria Island ateliers.',
    tag: 'Handmade Tailoring'
  },
  {
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
    title: 'Artisanal Silk & Adire Heritage',
    subtitle: 'Flowing hand-dyed silk Bubu and Boubou gowns tailored to your silhouette.',
    tag: 'Contemporary Luxury'
  },
  {
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    title: 'Urban Streetwear & Baggy Denim',
    subtitle: 'Heavyweight oversized fleece hoodies and raw selvedge denim from top Lagos boutique creators.',
    tag: 'Ready-to-Wear Street'
  }
];

export default function AuthPage() {
  const router = useRouter();
  const { setUserAuth, setSelectedGender, setBodyProfile } = useStore();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(180);
  const [weightKg, setWeightKg] = useState(78);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-rotate editorial slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % editorialSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userName = name || (email ? email.split('@')[0] : 'Fashion Patron');
    const twinId = `VY-NIG-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      setUserAuth({
        isLoggedIn: true,
        name: userName,
        email: email || 'shopper@veyra.ng',
        phone: phone || '+234 803 456 7890',
        gender,
        userType: 'shopper',
      });

      setSelectedGender(gender);

      setBodyProfile({
        name: userName,
        email: email || 'shopper@veyra.ng',
        phone: phone || '+234 803 456 7890',
        gender,
        heightCm,
        weightKg,
        chestCm: gender === 'male' ? 104 : 88,
        waistCm: gender === 'male' ? 84 : 68,
        hipsCm: gender === 'male' ? 100 : 96,
        twinId,
        isInitialized: true,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });

      setIsSubmitting(false);
      router.push('/studio');
    }, 900);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
      
      {/* LEFT COLUMN: Fixed full-height non-scrollable slideshow */}
      <div className="relative w-full lg:w-1/2 h-[340px] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between p-6 lg:p-12 bg-black select-none z-10">
        
        {/* Background Image Carousel with Fade */}
        {editorialSlides.map((slide, idx) => (
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
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          </div>
        ))}

        {/* Top Branding */}
        <div className="relative z-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-editorial text-2xl lg:text-3xl font-bold tracking-[0.25em] text-white">
              VEYRA
            </span>
            <span className="text-[9px] font-mono-luxury tracking-[0.3em] text-[var(--gold-accent)] uppercase">
              Nigeria
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono-luxury uppercase text-white/90 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </Link>
        </div>

        {/* Dynamic Editorial Content on Slide */}
        <div className="relative z-20 space-y-3 max-w-lg mt-auto pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase tracking-widest font-bold">
            <Sparkles className="h-3 w-3" />
            <span>{editorialSlides[currentSlide].tag}</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {editorialSlides[currentSlide].title}
          </h2>

          <p className="text-xs text-zinc-300 font-light leading-relaxed hidden sm:block">
            {editorialSlides[currentSlide].subtitle}
          </p>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 pt-1">
            {editorialSlides.map((_, dotIdx) => (
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

      {/* RIGHT COLUMN: Independently scrollable form */}
      <div className="w-full lg:w-1/2 min-h-screen p-6 sm:p-10 lg:p-14 flex flex-col justify-start">
        <div className="w-full max-w-md mx-auto space-y-6 pt-4 pb-24">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                {mode === 'signup' ? 'Personalized Fitting Suite' : 'Welcome Back'}
              </span>
            </div>
            
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {mode === 'signup' ? 'Create Your Body Profile' : 'Sign in to Veyra'}
            </h1>
            
            <p className="text-xs text-[var(--text-secondary)] font-light">
              {mode === 'signup'
                ? 'Configure your 3D digital body twin once to unlock automatic size matching across all Nigerian fashion houses.'
                : 'Access your saved virtual outfits and digital body model.'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
            <button
              onClick={() => setMode('signup')}
              className={`py-2.5 rounded-xl transition-all font-semibold ${
                mode === 'signup'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setMode('login')}
              className={`py-2.5 rounded-xl transition-all font-semibold ${
                mode === 'login'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chukwudi Eze or Fatima Bello"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Phone Number (Required for Nigerian Delivery & Tailoring) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Mobile Phone Number (Required for Dispatch)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold-accent)]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* Gender Preference & Body Stats for Sign-Up */}
            {mode === 'signup' && (
              <div className="space-y-3 pt-1">
                
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Primary Department
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-mono-luxury font-bold transition-all text-center ${
                        gender === 'male'
                          ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      Men&apos;s Fashion
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-mono-luxury font-bold transition-all text-center ${
                        gender === 'female'
                          ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      Women&apos;s Fashion
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury">e.g. 178cm (5ft 10in)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury">e.g. 74 - 82kg</span>
                  </div>
                </div>

              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 mt-3"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Calibrating Digital Model...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Activate Account & Enter Studio' : 'Sign In to Fitting Room'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Designer / Vendor Note */}
          <div className="pt-3 border-t border-[var(--border-subtle)] text-center">
            <p className="text-xs text-[var(--text-secondary)] font-light">
              Are you a Nigerian fashion designer or boutique seller?{' '}
              <a
                href="/vendor-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold-accent)] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Open Vendor Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
