'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors">
      
      {/* 3 Pillars for Nigerian Shoppers */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-b border-[var(--border-subtle)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
                100% Fit Guarantee
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-light leading-relaxed">
                If your Senator set or native fit does not drape accurately, return it free within 7 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
                24-48hr Lagos Delivery
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-light leading-relaxed">
                Combined express delivery from all Nigerian brands in one single package.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
                Authentic Nigerian Craft
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-light leading-relaxed">
                Direct partnerships with verified tailoring houses across Lagos, Abeokuta, and Kano.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-28 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/veyra-logo-horizontal.png"
                alt="Veyra Nigeria"
                width={200}
                height={55}
                className="h-12 w-auto object-contain drop-shadow-sm"
              />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-xs">
              Nigeria&apos;s premier multi-brand virtual fitting room and fashion marketplace.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold mb-3">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li><Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Senator & Native Sets</Link></li>
              <li><Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Lagos Streetwear & Tees</Link></li>
              <li><Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Hand-Dyed Adire Silk</Link></li>
              <li><Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Kano Handcrafted Leather</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold mb-3">
              Studio & Sizing
            </h5>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li><Link href="/studio" className="hover:text-[var(--text-primary)] transition-colors">Outfit Mix & Match</Link></li>
              <li><Link href="/profile" className="hover:text-[var(--text-primary)] transition-colors">Your Body Fit Profile</Link></li>
              <li><Link href="/cart" className="hover:text-[var(--text-primary)] transition-colors">Shopping Bag</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold mb-3">
              Sell & Support
            </h5>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/vendor-portal/auth" className="hover:text-[var(--text-primary)] transition-colors font-bold text-[var(--gold-accent)]">
                  Sell on Veyra →
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[var(--text-primary)] transition-colors">
                  Track Your Delivery
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-[var(--text-muted)]">Lagos · Abuja · Nationwide</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-10 mt-10 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-luxury text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} VEYRA Technologies Ltd. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0">
            Crafted for Nigerian Fashion
          </div>
        </div>
      </div>

    </footer>
  );
}
