'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Product } from '@/types';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight, Layers, Check } from 'lucide-react';
import Image from 'next/image';

export default function LookBreakdown() {
  const {
    bodyProfile,
    activeOutfit,
    removeOutfitItem,
    addEntireOutfitToCart,
  } = useStore();

  const outfitItems = Object.entries(activeOutfit)
    .filter(([_, product]) => Boolean(product))
    .map(([category, product]) => ({
      category,
      product: product as Product,
      fit: calculateFitMatch(bodyProfile, product as Product),
    }));

  const subtotal = outfitItems.reduce((acc, item) => acc + item.product.price, 0);
  const bundleDiscount = outfitItems.length >= 2 ? (outfitItems.length >= 3 ? 10000 : 5000) : 0;
  const finalTotal = Math.max(0, subtotal - bundleDiscount);
  const vendorCount = new Set(outfitItems.map(i => i.product.vendorId)).size;

  if (outfitItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-3xl surface-card p-6 text-center">
        <div className="h-12 w-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          <Layers className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-[var(--text-primary)] font-mono-luxury uppercase tracking-wider">
          No Clothes Selected
        </h4>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-[220px] font-light leading-relaxed">
          Select a Senator Top, Trousers, and Shoes from the left to build your complete look.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-3xl surface-card p-5 overflow-hidden justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Your Outfit Look
            </h3>
            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase">
              {outfitItems.length} Selected · {vendorCount} Nigerian Brands
            </span>
          </div>

          <span className="text-[11px] font-mono-luxury px-2.5 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            Fit: {bodyProfile.name.split(' ')[0]}
          </span>
        </div>

        {/* Selected Pieces List */}
        <div className="space-y-2.5 my-4 max-h-[330px] overflow-y-auto pr-1">
          {outfitItems.map(({ category, product, fit }) => (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 group"
            >
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-semibold uppercase">
                    {product.vendorName}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury capitalize">
                    · {category}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {product.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono-luxury text-emerald-500">
                  <span>Size {fit.recommendedSize}</span>
                  <span className="text-[var(--text-muted)]">({fit.matchScore}% Fit)</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs font-editorial font-bold text-[var(--text-primary)]">
                  ₦{product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => removeOutfitItem(category as any)}
                  className="text-[var(--text-muted)] hover:text-rose-500 p-0.5 transition-colors"
                  title="Remove from outfit"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & 1-Click Buy */}
      <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
        
        {/* Fast Lagos Delivery Badge */}
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5 text-[11px] text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Delivered together in 1 package across Nigeria.</span>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-1.5 text-xs font-mono-luxury">
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>Items Subtotal ({outfitItems.length} pcs)</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          {bundleDiscount > 0 && (
            <div className="flex justify-between text-emerald-500 font-bold">
              <span>Multi-Brand Outfit Discount</span>
              <span>-₦{bundleDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-[var(--text-primary)] pt-1.5 border-t border-[var(--border-subtle)]">
            <span>Total Outfit Price</span>
            <span className="font-editorial text-xl font-bold">₦{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          onClick={addEntireOutfitToCart}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-xs font-mono-luxury uppercase tracking-widest hover:opacity-90 transition-all shadow-lg group"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Buy Complete Outfit (₦{finalTotal.toLocaleString()})</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
