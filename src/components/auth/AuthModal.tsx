'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { X, Sparkles, User, Store, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setUserAuth,
    userAuth,
    setSelectedGender,
    setBodyProfile
  } = useStore();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [accountType, setAccountType] = useState<'shopper' | 'vendor'>('shopper');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(74);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userName = name || (email.split('@')[0] || 'Fashion Lover');
    const twinId = `VY-NIG-${Math.floor(100 + Math.random() * 900)}`;

    setUserAuth({
      isLoggedIn: true,
      name: userName,
      email: email || 'user@veyra.ng',
      gender,
      userType: accountType,
    });

    setSelectedGender(gender);

    setBodyProfile({
      name: userName,
      email,
      gender,
      heightCm,
      weightKg,
      chestCm: gender === 'male' ? 102 : 88,
      waistCm: gender === 'male' ? 84 : 68,
      hipsCm: gender === 'male' ? 100 : 96,
      twinId,
      isInitialized: true,
    });

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });

    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                {mode === 'signup' ? 'Create Veyra Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">
                {mode === 'signup' ? 'Setup your Digital Body Twin' : 'Sign in to your saved fitting room'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
          <button
            onClick={() => setMode('signup')}
            className={`py-3 text-center transition-colors ${
              mode === 'signup' ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold border-b-2 border-[var(--gold-accent)]' : 'text-[var(--text-muted)]'
            }`}
          >
            New Account
          </button>
          <button
            onClick={() => setMode('login')}
            className={`py-3 text-center transition-colors ${
              mode === 'login' ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold border-b-2 border-[var(--gold-accent)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Account Type Selector (Shopper vs Vendor) */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setAccountType('shopper')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono-luxury transition-all ${
                accountType === 'shopper'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Shopper</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('vendor')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono-luxury transition-all ${
                accountType === 'vendor'
                  ? 'bg-[var(--gold-accent)] text-black font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Designer / Vendor</span>
            </button>
          </div>

          {/* Name & Email */}
          <div>
            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              {accountType === 'vendor' ? 'Brand / Designer Name' : 'Your Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={accountType === 'vendor' ? 'e.g. Kolawole Bespoke' : 'e.g. Chidinma Okafor'}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
            />
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Fashion Fitting Profile
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-mono-luxury font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)]'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Men&apos;s Wear (Senator/Suits)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-mono-luxury font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)]'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Women&apos;s Wear (Ankara/Boubou)
              </button>
            </div>
          </div>

          {/* Quick Height & Weight for Shoppers */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>{mode === 'signup' ? 'Create Account & Digital Twin' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
