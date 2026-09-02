'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  ArrowLeft, Bookmark, Share2, Sparkles, ShieldCheck, MapPin,
  Clock, Truck, ShoppingBag, Zap, Star, Check, CheckCircle2,
  ChevronDown, ChevronUp, Store, RotateCcw, X, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const isAccessory = product.category === 'accessories';
  const pref = bodyProfile?.preferredSize || 'M';

  const availableSizes: string[] = isAccessory
    ? ['One Size']
    : Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : product.sizeStock && typeof product.sizeStock === 'object' && Object.keys(product.sizeStock).length > 0
    ? Object.keys(product.sizeStock).filter(sz => {
        const v = product.sizeStock[sz];
        return typeof v === 'object' ? v?.enabled !== false : Number(v) > 0;
      })
    : ['M', 'L', 'XL'];

  const defaultSize = availableSizes.includes(pref) ? pref : (availableSizes[0] || 'M');

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Standard', hex: '#111111' });
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Stock for chosen color and size
  const currentVariantStock = (() => {
    if (product.sizeStock && typeof product.sizeStock === 'object') {
      const anyStock: any = product.sizeStock;
      const variantKey = selectedColor?.name && selectedSize ? `${selectedColor.name.trim()}_${selectedSize.trim()}` : null;
      if (variantKey && anyStock.variants && anyStock.variants[variantKey] !== undefined) {
        return anyStock.variants[variantKey];
      }
      if (selectedSize && anyStock[selectedSize] !== undefined) {
        return typeof anyStock[selectedSize] === 'number' ? anyStock[selectedSize] : (anyStock[selectedSize]?.quantity ?? 15);
      }
    }
    return product.stockQuantity ?? 15;
  })();

  const currentSizeStock = currentVariantStock;
  const isOutOfStock = currentVariantStock === 0;

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

      {/* 2. PRODUCT HERO IMAGE (High-fashion editorial mobile height, tap to open lightbox) */}
      <div
        onClick={() => setIsImageModalOpen(true)}
        className="relative w-full h-[54vh] sm:h-[60vh] max-h-[500px] bg-black overflow-hidden cursor-pointer group"
      >
        <Image
          src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
          alt={product.name}
          fill
          unoptimized
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Bottom Floating Controls */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs font-mono-luxury">
          <div className="px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
            <ZoomIn className="h-3 w-3 text-[var(--gold-accent)]" />
            <span>Tap to View</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOutfitItem(product);
            }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[var(--gold-accent)] to-amber-600 text-black font-bold uppercase text-[10px] active:scale-95 transition-transform flex items-center gap-1 shadow-xl cursor-pointer"
          >
            <Sparkles className="h-3 w-3 fill-black" />
            <span>Try on 3D Twin</span>
          </button>
        </div>
      </div>

      {/* 3. PRODUCT ESSENTIAL DETAILS & VENDOR IDENTITY */}
      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Vendor Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
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

          {reviewsData && reviewsData.count > 0 && reviewsData.averageRating > 0 ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[11px] font-mono-luxury">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[var(--text-primary)]">{reviewsData.averageRating.toFixed(1)}</span>
              <span className="text-[var(--text-muted)]">({reviewsData.count})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury">
              <span className="text-[var(--gold-accent)] font-bold">Verified Drop</span>
            </div>
          )}
        </div>

        {/* Title & Price */}
        <div className="space-y-1.5">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline justify-between pt-0.5">
            <div className="font-editorial text-2xl sm:text-3xl font-bold text-amber-600 dark:text-[var(--gold-accent)]">
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
            ) : null}
          </div>

          {/* Location line */}
          <div className="flex items-center gap-2 text-xs font-mono-luxury text-[var(--text-secondary)] pt-0.5">
            <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
            <span>Ships from <strong className="text-[var(--text-primary)]">{product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState || 'Lagos'}</strong></span>
          </div>
        </div>

        {/* Description (Only show when genuine description exists) */}
        {product.description && product.description.trim().length > 0 && product.description.trim().toLowerCase() !== (product.name || '').trim().toLowerCase() && (
          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed border-t border-[var(--border-subtle)] pt-2.5">
            {product.description}
          </p>
        )}

        {/* 4. COLOR SELECTOR (Only for apparel and footwear - hidden for accessories) */}
        {product.category !== 'accessories' && product.colors && product.colors.length > 0 && (
          <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase font-bold">
                Color: <strong className="text-[var(--text-primary)]">{selectedColor?.name || 'Standard'}</strong>
              </span>
              <span className="text-[10px] text-[var(--gold-accent)] font-bold">
                {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {product.colors.map((c: any, index: number) => {
                const colorName = typeof c === 'string' ? c : (c.name || 'Standard');
                const colorHex = typeof c === 'object' && c?.hex ? c.hex : '#111111';
                const isChosen = selectedColor?.name === colorName || selectedColor?.hex === colorHex;
                return (
                  <button
                    key={`color-${colorName}-${index}`}
                    type="button"
                    onClick={() => setSelectedColor(typeof c === 'object' ? c : { name: colorName, hex: colorHex })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isChosen
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] ring-2 ring-[var(--gold-accent)] shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/30 shrink-0"
                      style={{
                        background: colorName.toLowerCase().includes('multi')
                          ? 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ec4899)'
                          : colorHex
                      }}
                    />
                    <span className="text-[11px] font-mono-luxury font-bold">{colorName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 1-TAP SIZE SELECTOR */}
        {product.category === 'accessories' ? (
          <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase font-bold">Size & Fit:</span>
              <span className="text-emerald-400 font-bold">{product.stockQuantity || 1} available</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-xs font-mono-luxury font-bold">
              <span>One Size · Universal Fit</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase font-bold">
                {product.category === 'footwear' ? 'Shoe Size (EU):' : 'Select Size:'}
              </span>
              <span className="text-[var(--gold-accent)] font-bold">{selectedSize}</span>
            </div>

            <div className="flex flex-wrap gap-2 font-mono-luxury text-xs">
              {availableSizes.map((size: string) => {
                const isChosen = size === selectedSize;
                const szOutOfStock = (() => {
                  if (product.sizeStock && typeof product.sizeStock === 'object') {
                    const anyStock: any = product.sizeStock;
                    const variantKey = selectedColor?.name ? `${selectedColor.name.trim()}_${size.trim()}` : null;
                    if (variantKey && anyStock.variants && anyStock.variants[variantKey] !== undefined) {
                      return anyStock.variants[variantKey] === 0;
                    }
                    const szStock = anyStock[size];
                    if (szStock !== undefined) {
                      return typeof szStock === 'object' ? szStock?.enabled === false || Number(szStock?.quantity) === 0 : szStock === 0;
                    }
                  }
                  return false;
                })();

                return (
                  <button
                    key={`size-btn-${size}`}
                    type="button"
                    disabled={szOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] px-3.5 py-2.5 rounded-xl border transition-all text-center flex items-center justify-center font-bold cursor-pointer ${
                      szOutOfStock
                        ? 'opacity-30 line-through cursor-not-allowed bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                        : isChosen
                        ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)] shadow-md font-extrabold'
                        : 'surface-card border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. NATIONWIDE COURIER & MOTOR PARK DELIVERY INFO */}
        <div className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2.5 text-xs font-mono-luxury shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <Truck className="h-4 w-4 text-[var(--gold-accent)]" />
              <span className="uppercase tracking-wider">Nationwide Delivery</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              Dispatches in {product.dispatchDays || '1-2 business days'}
            </span>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
            Live courier rates calculated at checkout based on your destination. Doorstep delivery (GIG, Fez, Red Star) &amp; Motor Park Waybills supported across Nigeria.
          </p>

          <div className="pt-1 flex items-center gap-1.5 text-[10px] text-[var(--gold-accent)] font-medium">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>Ships directly from {product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState || 'Nigeria'}</span>
          </div>
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

      {/* 8. FIXED FLOATING BOTTOM DOCK */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
        {/* Add to Bag + Instant Buy */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer hover:border-[var(--text-primary)]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-[0.98]"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* 9. FULL-SCREEN INTERACTIVE IMAGE LIGHTBOX WITH TRANSITION */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 pt-12 pb-8 select-none"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Top Bar: Title & Close */}
            <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                  {product.vendorName || 'Veyra Atelier'}
                </span>
                <h3 className="font-editorial text-lg font-bold text-white truncate max-w-[240px]">
                  {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
                aria-label="Close image view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Centered Image with smooth scale transition */}
            <motion.div
              initial={{ scale: 0.86, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.86, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[62vh] my-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
                alt={product.name}
                fill
                unoptimized
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Bottom Actions inside Lightbox */}
            <div className="flex items-center justify-between gap-3 z-10 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="font-editorial text-2xl font-bold text-[var(--gold-accent)]">
                ₦{Number(product.price || 0).toLocaleString()}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsImageModalOpen(false);
                  handleAddToCart();
                }}
                disabled={isOutOfStock}
                className="py-3 px-6 rounded-full bg-white text-black font-mono-luxury uppercase text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
