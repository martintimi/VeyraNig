import React from 'react';
import MarketplaceGrid from '@/components/shop/MarketplaceGrid';
import { Sparkles, Layers } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl surface-card p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NIGERIAN APPAREL CATALOG</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Shop Senator, Native & Streetwear
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
            Every piece auto-calculates your exact size. Click &quot;Try on Twin&quot; to test clothes directly on your live model before ordering.
          </p>

          <div className="pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-md"
            >
              <Layers className="h-4 w-4" />
              <span>Open Virtual Dressing Room</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <MarketplaceGrid />

    </div>
  );
}
