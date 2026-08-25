'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import {
  Sparkles, Check, ShoppingBag, Layers, ShieldCheck, Truck, RotateCcw,
  Star, Heart, ArrowLeft, ArrowRight, Share2, Ruler, Scissors,
  Building, Phone, MapPin, CheckCircle2, ChevronRight, Loader2, Store
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const {
    bodyProfile,
    addToCart,
    setOutfitItem,
    allProducts,
    fetchProductsFromDb,
    toggleVaultItem,
    isInVault,
  } = useStore();

  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'reviews'>('details');
  const [showSizeModal, setShowSizeModal] = useState(false);

  // 1. Fetch exact single product from API by ID
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
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="text-center space-y-1">
            <div className="font-editorial text-2xl font-bold tracking-[0.25em] text-[var(--text-primary)]">
              VEYRA
            </div>
            <div className="text-[10px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--gold-accent)] font-bold">
              Loading Product Specifications...
            </div>
          </div>

          <div className="w-36 h-[2px] bg-[var(--border-subtle)] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-[var(--gold-accent)] to-emerald-400 animate-shimmer" style={{ width: '100%' }} />
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

  const fitResult = calculateFitMatch(bodyProfile, product);
  const isSaved = isInVault(product.id);

  // Stock for chosen size
  const currentSizeStock = product.sizeStock && selectedSize && product.sizeStock[selectedSize] !== undefined
    ? product.sizeStock[selectedSize]
    : (product.stockQuantity ?? 15);

  const isOutOfStock = currentSizeStock === 0;

  // Cross-brand styling suggestions from other products in DB
  const complementaryItems = allProducts
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
  };

  const handleTryInStudio = () => {
    setOutfitItem(product);
    router.push('/studio');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20">
      
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
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: HD GALLERY & TRY-IN-STUDIO BADGE (6 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-5 sticky lg:top-24">
          
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
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono-luxury uppercase font-bold">
                {product.vendorName}
              </span>
            </div>

            {/* Floating 1-Click Try in Studio Button on Image */}
            <button
              onClick={handleTryInStudio}
              className="absolute bottom-5 right-5 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-md border border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)] hover:text-black font-mono-luxury uppercase text-xs font-bold transition-all shadow-xl flex items-center gap-2 z-10 group/btn"
            >
              <Layers className="h-4 w-4" />
              <span>Try on 3D Body Twin</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: SPECS, SIZES, STOCK & ADD TO BAG (6 COLS) */}
        {/* ======================================================== */}
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
                className={`p-2 rounded-full border transition-all ${
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

            {/* Price & Rating */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-amber-600 dark:text-[var(--gold-accent)] drop-shadow-sm">
                  ₦{Number(product.price).toLocaleString()}
                </span>
                <span className="text-xs font-mono-luxury text-emerald-500 font-bold">
                  ● In Stock (Express Dispatch)
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[var(--text-primary)]">5.0</span>
                <span className="text-[var(--text-muted)]">(18 reviews)</span>
              </div>
            </div>
          </div>

          {/* 3D Body Twin Sizing Match Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--gold-subtle)]/40 border border-[var(--gold-accent)]/30 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
                <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--gold-accent)]">
                  3D Body Twin Size Analysis
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold">
                {fitResult.matchScore}% Fit Match
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Recommended Size: <strong className="text-[var(--text-primary)]">{fitResult.recommendedSize}</strong> tailored for Nigerian silhouette proportions.
            </p>

            {/* Size Selector Pills with Key Props */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono-luxury">
                <span className="text-[var(--text-muted)] uppercase font-bold">Choose Size:</span>
                {isOutOfStock ? (
                  <span className="text-rose-400 font-bold">❌ Out of Stock in Size {selectedSize}</span>
                ) : currentSizeStock <= 5 ? (
                  <span className="text-amber-500 font-bold animate-pulse">🔥 Only {currentSizeStock} left in Size {selectedSize}!</span>
                ) : (
                  <span className="text-emerald-500 font-bold">● In Stock ({currentSizeStock} available)</span>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2.5 font-mono-luxury text-xs pt-1">
                {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size: string) => {
                  const isRec = size === fitResult.recommendedSize;
                  const isChosen = size === selectedSize;
                  const szStock = product.sizeStock?.[size];
                  const szOutOfStock = szStock === 0;

                  return (
                    <button
                      key={`size-btn-${size}`}
                      type="button"
                      disabled={szOutOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3.5 rounded-2xl border transition-all text-center relative flex items-center justify-center font-bold ${
                        szOutOfStock
                          ? 'opacity-40 line-through cursor-not-allowed bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                          : isChosen
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md border-transparent ring-2 ring-emerald-500'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <span>{size}</span>
                      {isRec && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black tracking-widest rounded-full uppercase shadow-sm border border-emerald-400/40">
                          FIT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Selection with Unique Key Props */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                Color Palette: <strong className="text-[var(--text-primary)]">{selectedColor?.name || 'Standard'}</strong>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((c: any, index: number) => {
                  const colorKey = `color-swatch-${c.name || c.hex || index}`;
                  const isSelected = selectedColor?.name === c.name || selectedColor?.hex === c.hex;
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`h-10 w-10 rounded-full border-2 transition-transform ${
                        isSelected
                          ? 'border-[var(--gold-accent)] scale-110 shadow-lg ring-2 ring-[var(--gold-accent)]/40'
                          : 'border-[var(--border-subtle)] hover:scale-105'
                      }`}
                      style={{ background: c.hex }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Bag & Try in Studio Action Row */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
              <span className="opacity-60">|</span>
              <span>₦{Number(product.price).toLocaleString()}</span>
            </button>
          </div>

          {/* Tags with Unique Key Props */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.tags.map((tag: string, index: number) => (
                <span
                  key={`product-tag-${tag}-${index}`}
                  className="text-[10px] font-mono-luxury uppercase px-2.5 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold">
              Product Description
            </span>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
