'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  Sparkles, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw,
  Star, Heart, ArrowLeft, ArrowRight, Share2, Ruler,
  Building, Phone, MapPin, CheckCircle2, ChevronRight, Loader2, Store, Clock, Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const {
    addToCart,
    fetchProductsFromDb,
    toggleVaultItem,
    isInVault,
  } = useStore();

  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [addedToast, setAddedToast] = useState(false);
  const [reviewsData, setReviewsData] = useState<{ averageRating: number; fitAccuracyPercent: number; count: number; reviews: any[] }>({
    averageRating: 5.0,
    fitAccuracyPercent: 100,
    count: 0,
    reviews: []
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Fetch exact single product from API by ID
  useEffect(() => {
    async function loadSingleProduct() {
      if (!productId) return;
      setIsLoading(true);
      setErrorMsg('');

      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (res.ok && data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setSelectedSize(p.sizes?.[0] || 'M');
          setSelectedColor(p.colors?.[0] || { name: 'As Pictured', hex: '#111111' });

          // Fetch reviews for this product
          try {
            const revRes = await fetch(`/api/reviews?productId=${encodeURIComponent(p.id)}`);
            const revJson = await revRes.json();
            if (revJson.success) {
              setReviewsData(revJson);
            }
          } catch (e) {}
        } else {
          setErrorMsg(data.error || 'Product not found');
        }
      } catch (err: any) {
        setErrorMsg('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSingleProduct();
    fetchProductsFromDb();
  }, [productId, fetchProductsFromDb]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fadeIn">
        <div className="relative flex flex-col items-center space-y-4 animate-pulse">
          <div className="relative flex items-center justify-center h-20 w-20 rounded-3xl surface-card border border-[var(--gold-accent)]/30 shadow-2xl p-3">
            <Image
              src="/images/logo/veyra-emblem.png"
              alt="Veyra"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <div className="font-editorial text-2xl font-bold tracking-[0.25em] text-[var(--text-primary)]">
              VEYRA
            </div>
            <div className="text-[10px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--gold-accent)] font-bold">
              Loading Product Details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || errorMsg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <RotateCcw className="h-8 w-8" />
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Garment Not Found
        </h2>
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-md mx-auto">
          {errorMsg || 'The requested product is no longer active in the storefront catalog.'}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all shadow-md inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    );
  }

  const isSaved = isInVault(product.id);

  // Stock for chosen size
  const currentSizeStock = product.sizeStock && selectedSize && product.sizeStock[selectedSize] !== undefined
    ? product.sizeStock[selectedSize]
    : (product.stockQuantity ?? 15);

  const isOutOfStock = currentSizeStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize);
    setAddedToast(true);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
    setTimeout(() => setAddedToast(false), 3500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize);
    router.push('/checkout');
  };

  const rates = product.shippingRates || {
    sameCity: 1000,
    closeHub: 2500,
    interstate: 4500,
    parkPickup: 1500
  };

  const locationLabel = product.vendorCity || product.vendorState ? (
    <>Ships from <strong className="text-[var(--gold-accent)]">{product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState}</strong></>
  ) : (
    'Ships direct from boutique'
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn pb-20">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between text-xs font-mono-luxury text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[var(--gold-accent)] uppercase font-bold">{product.category}</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold uppercase text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: HD GALLERY + VENDOR DELIVERY RATES UNDER IMAGE (6 COLS) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Product Image Container */}
          <div className="relative h-[480px] sm:h-[540px] w-full rounded-3xl overflow-hidden surface-card border border-[var(--border-subtle)] shadow-xl group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Vendor Badge Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-mono-luxury uppercase font-bold border border-white/10 shadow-md">
                {product.vendorName}
              </span>
            </div>

            {/* Store Origin Location Badge on Photo */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono-luxury text-white">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
                <span>{locationLabel}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>{product.dispatchDays || '1-2 business days'}</span>
              </div>
            </div>
          </div>

          {/* REAL VENDOR DELIVERY RATES BREAKDOWN CARD (PLACED DIRECTLY UNDER PRODUCT IMAGE) */}
          <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 text-xs font-mono-luxury shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                <Truck className="h-4 w-4 text-[var(--gold-accent)]" />
                <span className="uppercase tracking-wider">Vendor Delivery Rates</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                Dispatches in {product.dispatchDays || '1-2 business days'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)]">Same City Delivery:</div>
                <div className="font-bold text-[var(--gold-accent)] text-sm">₦{Number(rates.sameCity || 1000).toLocaleString()}</div>
                <div className="text-[9px] text-[var(--text-muted)]">Local town courier</div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)]">Intra-State / Nearby:</div>
                <div className="font-bold text-[var(--gold-accent)] text-sm">₦{Number(rates.closeHub || 2500).toLocaleString()}</div>
                <div className="text-[9px] text-[var(--text-muted)]">Within state / nearby hub</div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)]">Interstate (Nationwide):</div>
                <div className="font-bold text-[var(--gold-accent)] text-sm">₦{Number(rates.interstate || 4500).toLocaleString()}</div>
                <div className="text-[9px] text-[var(--text-muted)]">Rest of Nigeria</div>
              </div>
            </div>

            <p className="text-[10px] text-[var(--text-secondary)] pt-1">
              Dispatched directly from <strong className="text-[var(--text-primary)]">{product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState}</strong> by {product.vendorName} via verified dispatch riders and park waybills.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: SPECS, COLORS, SIZES, STOCK & ADD TO BAG (6 COLS) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Vendor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/brand/${encodeURIComponent(product.vendorName)}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold hover:underline"
              >
                <Store className="h-3.5 w-3.5" />
                <span>{product.vendorName}</span>
              </Link>

              <button
                onClick={() => toggleVaultItem(product)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)]'
                    : 'surface-card border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-rose-400'
                }`}
                title={isSaved ? 'In Vault' : 'Save to Vault'}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              {product.name}
            </h1>

            {/* Origin & Turnaround Line */}
            <div className="flex items-center gap-2 text-xs font-mono-luxury text-[var(--text-secondary)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
              <span>Ships from <strong className="text-[var(--text-primary)]">{product.vendorCity ? `${product.vendorCity}, ` : ''}{product.vendorState}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Dispatches in {product.dispatchDays || '1-2 business days'}</span>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-amber-600 dark:text-[var(--gold-accent)] drop-shadow-sm">
                  ₦{Number(product.price).toLocaleString()}
                </span>
                <span className="text-xs font-mono-luxury text-emerald-500 font-bold">
                  In Stock
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[var(--text-primary)]">5.0</span>
                <span className="text-[var(--text-muted)]">(18 verified orders)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
              {product.description}
            </p>
          )}

          {/* 1. Color Palette Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono-luxury">
                <span className="text-[var(--text-secondary)] uppercase font-bold">
                  Select Colorway: <strong className="text-[var(--text-primary)]">{selectedColor?.name || 'Standard'}</strong>
                </span>
                <span className="text-[11px] text-[var(--gold-accent)] font-bold">
                  {product.colors.length} {product.colors.length === 1 ? 'Option' : 'Options'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                {product.colors.map((c: any, index: number) => {
                  const isSelected = selectedColor?.name === c.name || selectedColor?.hex === c.hex;
                  return (
                    <button
                      key={`color-${c.name || index}`}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md border-transparent ring-2 ring-[var(--gold-accent)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/30 shadow-sm shrink-0"
                        style={{ backgroundColor: c.hex || '#111111' }}
                      />
                      <span className="text-xs font-mono-luxury font-bold">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Size Selector */}
          <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase font-bold">Select Size:</span>
              {isOutOfStock ? (
                <span className="text-rose-400 font-bold">Out of Stock</span>
              ) : currentSizeStock <= 5 ? (
                <span className="text-amber-500 font-bold animate-pulse">Only {currentSizeStock} left!</span>
              ) : (
                <span className="text-emerald-500 font-bold">{currentSizeStock} available</span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2.5 font-mono-luxury text-xs pt-1">
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size: string) => {
                const isChosen = size === selectedSize;
                const szStock = product.sizeStock?.[size];
                const szOutOfStock = szStock === 0;

                return (
                  <button
                    key={`size-btn-${size}`}
                    type="button"
                    disabled={szOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3.5 rounded-2xl border transition-all text-center flex items-center justify-center font-bold cursor-pointer ${
                      szOutOfStock
                        ? 'opacity-40 line-through cursor-not-allowed bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                        : isChosen
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md border-transparent ring-2 ring-[var(--gold-accent)]'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Add to Bag & Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="py-4 px-6 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] font-mono-luxury uppercase text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-4 px-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 font-mono-luxury uppercase text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {addedToast && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono-luxury font-bold flex items-center justify-center gap-2 animate-fadeIn text-center">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Item added to your shopping bag!</span>
              </div>
            )}
          </div>

          {/* Buyer Protection Guarantee */}
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3 text-xs font-mono-luxury text-[var(--text-secondary)]">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-[var(--text-primary)]">Veyra Escrow Protection:</span> Your payment is held safely until the item is delivered and inspected.
            </div>
          </div>

        </div>

      </div>

      {/* Verified Customer Reviews & Sizing Feedback Section */}
      <div className="pt-12 border-t border-[var(--border-subtle)] space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--gold-accent)]" />
              <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                Verified Client Feedback
              </span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
              Customer Reviews & Sizing Ratings
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-xs font-mono-luxury font-bold text-[var(--gold-accent)]">
              <Star className="h-4 w-4 fill-current text-[var(--gold-accent)]" />
              <span>{reviewsData.averageRating} / 5.0 Rating ({reviewsData.count} Reviews)</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{reviewsData.fitAccuracyPercent}% True to Size</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviewsData.reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-sm hover:border-[var(--gold-accent)]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center font-bold text-xs text-[var(--gold-accent)] font-mono-luxury">
                    {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'V'}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                      <span>{rev.customerName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono-luxury font-bold">
                        Verified Purchase
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">{rev.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[var(--gold-accent)]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                &quot;{rev.comment}&quot;
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)]">
                <span className="text-[var(--gold-accent)] font-bold">Fit Note:</span>
                <span className="capitalize">{rev.fitRating === 'true_to_size' ? 'True to Size & Perfect Drape' : rev.fitRating?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
