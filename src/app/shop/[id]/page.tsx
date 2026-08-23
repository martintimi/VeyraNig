'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import {
  Sparkles, Check, ShoppingBag, Layers, ShieldCheck, Truck, RotateCcw,
  Star, Heart, ArrowLeft, ArrowRight, Share2, Ruler, Scissors,
  Building, Phone, MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const {
    allProducts,
    bodyProfile,
    addToCart,
    setOutfitItem,
    setIsCartOpen,
  } = useStore();

  const product = allProducts.find((p) => p.id === productId) || allProducts[0];
  const fitResult = calculateFitMatch(bodyProfile, product);

  const [selectedSize, setSelectedSize] = useState(fitResult.recommendedSize || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'reviews'>('details');
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Cross-brand styling suggestions
  const complementaryItems = allProducts
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
  };

  const handleTryInStudio = () => {
    setOutfitItem(product);
    router.push('/studio');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between text-xs font-mono-luxury text-[var(--text-muted)]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--text-primary)] transition-colors">Shop Catalog</Link>
          <span>/</span>
          <span className="text-[var(--gold-accent)] uppercase font-bold">{product.category}</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <Link
          href="/shop"
          className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-bold uppercase"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: HD GALLERY & TRY-IN-STUDIO BADGE (6 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-5 sticky lg:top-24">
          
          <div className="relative h-[480px] sm:h-[580px] w-full rounded-3xl overflow-hidden surface-card border border-[var(--border-subtle)] shadow-2xl group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Badges Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-[10px] font-mono-luxury uppercase font-bold tracking-widest">
                {product.garmentOriginType === 'handmade_designer' ? '● Bespoke Tailoring' : '● Ready-to-Wear'}
              </span>
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

          {/* Guarantee Badges Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl surface-card border border-[var(--border-subtle)] text-center space-y-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 mx-auto" />
              <span className="text-[9px] font-mono-luxury uppercase block text-[var(--text-muted)] font-bold">Paystack Escrow</span>
              <span className="text-[10px] text-[var(--text-primary)] font-bold block">100% Protected</span>
            </div>

            <div className="p-3 rounded-2xl surface-card border border-[var(--border-subtle)] text-center space-y-1">
              <Truck className="h-4 w-4 text-[var(--gold-accent)] mx-auto" />
              <span className="text-[9px] font-mono-luxury uppercase block text-[var(--text-muted)] font-bold">Lagos Hub</span>
              <span className="text-[10px] text-[var(--text-primary)] font-bold block">24-48hr Delivery</span>
            </div>

            <div className="p-3 rounded-2xl surface-card border border-[var(--border-subtle)] text-center space-y-1">
              <RotateCcw className="h-4 w-4 text-cyan-400 mx-auto" />
              <span className="text-[9px] font-mono-luxury uppercase block text-[var(--text-muted)] font-bold">Fit Guarantee</span>
              <span className="text-[10px] text-[var(--text-primary)] font-bold block">Free Alterations</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: PRODUCT META, SIZING & CHECKOUT (6 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Atelier Attribution & Product Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                {product.vendorName}
              </span>
              <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                · Victoria Island, Lagos
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[var(--text-muted)] line-through font-mono-luxury">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[var(--text-primary)]">{product.rating}</span>
                <span className="text-[var(--text-muted)]">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* 3D Body Twin Sizing Match Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[var(--gold-subtle)]/40 border border-[var(--gold-accent)]/30 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
                <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--gold-accent)]">
                  3D Body Twin Size Match
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold">
                {fitResult.matchScore}% Match
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Recommended Size: <strong className="text-[var(--text-primary)]">{fitResult.recommendedSize}</strong> tailored for your {bodyProfile.chestCm}cm chest and {bodyProfile.shoulderWidthCm}cm shoulder span with zero pull.
            </p>

            {/* Size Selector Pills */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono-luxury">
                <span className="text-[var(--text-muted)] uppercase font-bold">Select Size:</span>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="text-[var(--gold-accent)] hover:underline flex items-center gap-1 uppercase font-bold"
                >
                  <Ruler className="h-3 w-3" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 font-mono-luxury text-xs">
                {product.sizes.map((size) => {
                  const isRec = size === fitResult.recommendedSize;
                  const isChosen = size === selectedSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-2xl border transition-all text-center relative ${
                        isChosen
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-md border-transparent'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <span>{size}</span>
                      {isRec && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-[var(--gold-accent)] text-black text-[8px] font-bold rounded-full uppercase">
                          Fit
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                Color Palette: <strong className="text-[var(--text-primary)]">{selectedColor?.name}</strong>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`h-10 w-10 rounded-full border-2 transition-transform ${
                      selectedColor?.name === c.name
                        ? 'border-[var(--gold-accent)] scale-110 shadow-lg'
                        : 'border-[var(--border-subtle)] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to Bag & Try in Studio Action Row */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Shopping Bag · ₦{product.price.toLocaleString()}</span>
            </button>

            <button
              onClick={handleTryInStudio}
              className="w-full py-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] font-mono-luxury uppercase tracking-wider font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Layers className="h-4 w-4 text-[var(--gold-accent)]" />
              <span>Layer & Mix in Virtual Dressing Room</span>
            </button>
          </div>

          {/* Description & Tailoring Notes Tabs */}
          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-2 text-xs font-mono-luxury uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`font-bold transition-colors pb-2 relative ${
                  activeTab === 'details'
                    ? 'text-[var(--text-primary)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--gold-accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Fabric & Cut Notes
              </button>
              <button
                onClick={() => setActiveTab('sizing')}
                className={`font-bold transition-colors pb-2 relative ${
                  activeTab === 'sizing'
                    ? 'text-[var(--text-primary)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--gold-accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Atelier Measurements
              </button>
            </div>

            {activeTab === 'details' && (
              <div className="space-y-3 text-xs text-[var(--text-secondary)] font-light leading-relaxed animate-fadeIn">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-3 pt-2 font-mono-luxury text-[11px]">
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] uppercase block text-[9px]">Fabric Composition</span>
                    <strong className="text-[var(--text-primary)]">{product.fabricComposition}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] uppercase block text-[9px]">Tailor Cut Type</span>
                    <strong className="text-[var(--text-primary)]">{product.fitNotes}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="space-y-2 text-xs font-mono-luxury text-[var(--text-secondary)] animate-fadeIn">
                <p>Every piece is individually cut and pressed in Lagos ateliers.</p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-[11px] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                    <thead className="bg-[var(--bg-secondary)] text-[var(--text-muted)] uppercase text-[9px]">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Chest (cm)</th>
                        <th className="p-2.5">Shoulder (cm)</th>
                        <th className="p-2.5">Waist (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                      <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">92 - 96</td><td className="p-2.5">44 - 46</td><td className="p-2.5">76 - 80</td></tr>
                      <tr className="bg-[var(--gold-subtle)]/20 font-bold text-[var(--gold-accent)]"><td className="p-2.5">M (Your Fit)</td><td className="p-2.5">98 - 104</td><td className="p-2.5">47 - 49</td><td className="p-2.5">82 - 86</td></tr>
                      <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">106 - 112</td><td className="p-2.5">50 - 52</td><td className="p-2.5">88 - 94</td></tr>
                      <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">114 - 120</td><td className="p-2.5">53 - 55</td><td className="p-2.5">96 - 102</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* COMPLETE THE LOOK / COMPLEMENTARY PIECES */}
      {/* ======================================================== */}
      <div className="pt-12 border-t border-[var(--border-subtle)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Complete the Look
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-0.5">
              Styled together with complementary pieces from other Nigerian fashion houses.
            </p>
          </div>

          <Link
            href="/studio"
            className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Open Studio</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complementaryItems.map((comp) => (
            <div
              key={comp.id}
              className="rounded-3xl surface-card border border-[var(--border-subtle)] p-4 flex items-center gap-4 group hover:border-[var(--gold-accent)]/50 transition-all shadow-md"
            >
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                <Image src={comp.imageUrl} alt={comp.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="truncate flex-1">
                <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold uppercase block truncate">
                  {comp.vendorName}
                </span>
                <h4 className="font-bold text-xs text-[var(--text-primary)] truncate mt-0.5">
                  {comp.name}
                </h4>
                <div className="font-editorial text-base font-bold text-[var(--text-primary)] mt-1">
                  ₦{comp.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/shop/${comp.id}`}
                    className="text-[10px] font-mono-luxury text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase font-bold"
                  >
                    View Piece →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
