'use client';

import React from 'react';
import { vendors } from '@/lib/data/vendors';
import { Store, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BrandShowcase() {
  return (
    <section className="py-20 border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[var(--border-subtle)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
              <Store className="h-3.5 w-3.5" />
              <span>VERIFIED NIGERIAN ATELIERS</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
              Partner Designers & Houses
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl">
              From Victoria Island bespoke tailors to Kano artisan leather workshops.
            </p>
          </div>

          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] hover:underline font-bold"
          >
            <span>Are you a Nigerian brand? Join Us</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-6 rounded-3xl surface-card flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-[var(--badge-bg)] border border-[var(--border-subtle)] font-mono-luxury font-bold text-xs flex items-center justify-center text-[var(--text-primary)]">
                      {vendor.code}
                    </span>
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                        {vendor.name}
                      </h3>
                      <div className="text-[11px] font-mono-luxury text-[var(--gold-accent)] uppercase">
                        {vendor.origin}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono-luxury text-[var(--text-primary)]">
                    <Star className="h-3.5 w-3.5 fill-current text-[var(--gold-accent)]" />
                    <span>{vendor.satisfactionRate}%</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed mt-4">
                  {vendor.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-mono-luxury text-[var(--text-muted)]">
                  {vendor.productCount} Designs in Studio
                </span>

                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors font-bold"
                >
                  <span>Try Outfits</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
