'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  ArrowLeft, Bookmark, Share2, Sparkles, ShieldCheck, MapPin,
  Clock, Truck, ShoppingBag, Zap, Star, Check, CheckCircle2,
  ChevronDown, ChevronUp, Store, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileProductDetailViewProps {
  product: any;
  reviewsData: {
    averageRating: number;
    fitAccuracyPercent: number;
    count: number;
    reviews: any[];
  };
}

export default function MobileProductDetailView({ product, reviewsData }: MobileProductDetailViewProps) {
  const router = useRouter();
  const {
    bodyProfile,
    addToCart,
    toggleVaultItem,
    isInVault,
    setOutfitItem,
    setIsCartOpen,
  } = useStore();

  const isSaved = isInVault(product.id);
  const pref = bodyProfile?.preferredSize || 'M';
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultSize = availableSizes.includes(pref) ? pref : (availableSizes[0] || 'M');

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'As Pictured', hex: '#111111' });
  const [isRatesOpen, setIsRatesOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Stock for chosen size
  const currentSizeStock = product.sizeStock && selectedSize && product.sizeStock[selectedSize] !== undefined
    ? product.sizeStock[selectedSize]
    : (product.stockQuantity ?? 15);

  const isOutOfStock = currentSizeStock === 0;

  const rates = product.shippingRates || {
    sameCity: 1000,
    closeHub: 2500,
    interstate: 4500,
    parkPickup: 1500,
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize);
    setAddedToast(true);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.8 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Veyra`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-36 select-none animate-fadeIn">
      
      {/* 1. TOP FLOATING APP BAR (Glassmorphic Controls) */}
      <div className="fixed top-3 inset-x-3 z-40 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => router.back()}
          className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => toggleVaultItem(product)}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
            aria-label={isSaved ? 'In Vault' : 'Save to Vault'}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[var(--gold-accent)] text-[var(--gold-accent)]' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* 2. PRODUCT HERO IMAGE */}
      <div className="relative w-full h-[55vh] max-h-[420px] bg-black overflow-hidden">
        <Image
          src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
          alt={product.name}
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Bottom Floating Badges */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono-luxury">
          <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[var(--gold-accent)]/40 text-[var(--gold-accent)] font-bold flex items-center gap-1.5 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" />
            <span>98% Twin Fit Match</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setOutfitItem(product);
            }}
            className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold uppercase text-[10px] active:scale-95 transition-transform flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-[var(--gold-accent)]" />
            <span>Try on 3D Twin</span>
          </button>
        </div>
      </div>

      {/* 3. PRODUCT ESSENTIAL DETAILS & VENDOR IDENTITY */}
      <div className="p-4 sm:p-6 space-y-5">
        
        {/* Vendor Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <Link
            href={`/brand/${encodeURIComponent(product.vendorName || product.vendorId)}`}
            className="flex items-center gap-2 group"
          >
            <div className="h-7 w-7 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/40 text-[var(--gold-accent)] flex items-center justify-center font-bold text-xs">
              <Store className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-bold text-xs font-mono-luxury text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors block">
                {product.vendorName}
              </span>
              <span className="text-[9px] text-[var(--gold-accent)] font-mono-luxury uppercase font-bold tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Atelier Drop</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[11px] font-mono-luxury">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[var(--text-primary)]">5.0</span>
            <span className="text-[var(--text-muted)]">({reviewsData.count || 12})</span>
          </div>
        </div>

        {/* Title & Price */}
        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline justify-between pt-1">
            <div className="font-editorial text-3xl font-bold text-amber-600 dark:text-[var(--gold-accent)]">
              ₦{Number(product.price || 0).toLocaleString()}
            </div>

            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono-luxury font-bold uppercase">
                Out of Stock
              </span>
            ) : currentSizeStock <= 5 ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono-luxury font-bold uppercase animate-pulse">
                Only {currentSizeStock} Left!
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold uppercase">
                In Stock · Ready to Wear
              </span>
            )}
          </div>

          {/* Location & Turnaround line */}
          <div className="flex items-center gap-2 text-xs font-mono-luxury text-[var(--text-secondary)] pt-1">
            <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
            <span>Ships from <strong className="text-[var(--text-primary)]">{product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState || 'Lagos'}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{product.dispatchDays || '1-2 days'}</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed border-t border-[var(--border-subtle)] pt-3">
            {product.description}
          </p>
        )}

        {/* 4. COLORWAY SELECTOR */}
        {product.colors && product.colors.length > 0 && (
          <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase font-bold">
                Colorway: <strong className="text-[var(--text-primary)]">{selectedColor?.name || 'Standard'}</strong>
              </span>
              <span className="text-[10px] text-[var(--gold-accent)] font-bold">
                {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {product.colors.map((c: any, index: number) => {
                const isChosen = selectedColor?.name === c.name || selectedColor?.hex === c.hex;
                return (
                  <button
                    key={`color-${c.name || index}`}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isChosen
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] ring-2 ring-[var(--gold-accent)] shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: c.hex || '#111111' }}
                    />
                    <span className="text-[11px] font-mono-luxury font-bold">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 1-TAP SIZE SELECTOR */}
        <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono-luxury">
            <span className="text-[var(--text-secondary)] uppercase font-bold">Select Size:</span>
            <span className="text-[var(--gold-accent)] font-bold">Size: {selectedSize}</span>
          </div>

          <div className="grid grid-cols-5 gap-2 font-mono-luxury text-xs">
            {availableSizes.map((size: string) => {
              const isChosen = size === selectedSize;
              const szStock = product.sizeStock?.[size];
              const szOutOfStock = szStock === 0;

              return (
                <button
                  key={`size-btn-${size}`}
                  type="button"
                  disabled={szOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-xl border transition-all text-center flex items-center justify-center font-bold cursor-pointer ${
                    szOutOfStock
                      ? 'opacity-30 line-through cursor-not-allowed bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                      : isChosen
                      ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)] shadow-md'
                      : 'surface-card border-[var(--border-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <span>{size}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. EXPANDABLE VENDOR DELIVERY RATES ACCORDION */}
        <div className="rounded-2xl surface-card border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setIsRatesOpen(!isRatesOpen)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono-luxury text-[var(--text-primary)] font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[var(--gold-accent)]" />
              <span className="uppercase">Vendor Delivery Rates</span>
            </div>
            {isRatesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {isRatesOpen && (
            <div className="p-4 pt-0 border-t border-[var(--border-subtle)] space-y-2.5 text-xs font-mono-luxury">
              <div className="grid grid-cols-3 gap-2 text-[10px] pt-3">
                <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                  <div className="text-[var(--text-muted)]">Same City:</div>
                  <div className="font-bold text-[var(--gold-accent)] text-xs">₦{Number(rates.sameCity || 1000).toLocaleString()}</div>
                  <div className="text-[8px] text-[var(--text-muted)]">Local courier</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                  <div className="text-[var(--text-muted)]">Intra-State:</div>
                  <div className="font-bold text-[var(--gold-accent)] text-xs">₦{Number(rates.closeHub || 2500).toLocaleString()}</div>
                  <div className="text-[8px] text-[var(--text-muted)]">Nearby hub</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                  <div className="text-[var(--text-muted)]">Interstate:</div>
                  <div className="font-bold text-[var(--gold-accent)] text-xs">₦{Number(rates.interstate || 4500).toLocaleString()}</div>
                  <div className="text-[8px] text-[var(--text-muted)]">Nationwide</div>
                </div>
              </div>

              <p className="text-[10px] text-[var(--text-secondary)] font-light leading-relaxed">
                Shipped directly from {product.vendorName} via verified dispatch riders and park waybills.
              </p>
            </div>
          )}
        </div>

        {/* 7. EXPANDABLE CUSTOMER REVIEWS ACCORDION */}
        <div className="rounded-2xl surface-card border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
            className="w-full p-4 flex items-center justify-between text-xs font-mono-luxury text-[var(--text-primary)] font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[var(--gold-accent)]" />
              <span className="uppercase">Customer Reviews ({reviewsData.count || 0})</span>
            </div>
            {isReviewsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {isReviewsOpen && (
            <div className="p-4 pt-0 border-t border-[var(--border-subtle)] space-y-3 text-xs font-mono-luxury">
              {reviewsData.reviews.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-2">No written reviews yet for this piece.</p>
              ) : (
                reviewsData.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-primary)] text-xs">{rev.customerName || 'Veyra Patron'}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Toast Alert */}
        {addedToast && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono-luxury font-bold flex items-center justify-center gap-2 animate-fadeIn text-center">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Piece added to your shopping bag!</span>
          </div>
        )}

      </div>

      {/* 8. FIXED FLOATING BOTTOM DOCK WITH ACTIONS */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0c]/90 dark:bg-[#0a0a0c]/90 bg-white/95 backdrop-blur-2xl border-t border-black/10 dark:border-white/10 p-3.5 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] uppercase block">Total Price:</span>
          <div className="font-editorial text-xl font-bold text-amber-600 dark:text-[var(--gold-accent)] leading-none mt-0.5">
            ₦{Number(product.price || 0).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-3 px-3 rounded-2xl surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] font-mono-luxury uppercase text-[10px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to Bag</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-3 px-3 rounded-2xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-[10px] font-bold hover:bg-[#d8b357] transition-all shadow-xl flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-black" />
            <span>Instant Buy</span>
          </button>
        </div>
      </div>

    </div>
  );
}
