'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import { vendors } from '@/lib/data/vendors';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import {
  Sparkles, Check, ShoppingBag, Layers, ShieldCheck, Truck, RotateCcw,
  Star, Heart, ArrowLeft, ArrowRight, Share2, Ruler, Scissors,
  Building, Phone, MapPin, CheckCircle2, ChevronRight, MessageCircle,
  Copy, ExternalLink, SlidersHorizontal, Bookmark, Eye
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import ProductQuickLookModal from '@/components/shop/ProductQuickLookModal';

export default function BrandStorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string;

  const {
    allProducts,
    bodyProfile,
    addToCart,
    activeOutfit,
    setOutfitItem,
    removeOutfitItem,
    toggleVaultItem,
    isInVault,
  } = useStore();

  const [quickLookProduct, setQuickLookProduct] = useState<any>(null);

  // Clean and decode slug (handles %20, dashes, etc.)
  const decodedSlug = rawSlug ? decodeURIComponent(rawSlug).toLowerCase() : 'sartorial-lagos';
  const cleanBrandTitle = rawSlug
    ? decodeURIComponent(rawSlug).replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Sartorial Lagos';

  // Find vendor by ID or name
  const vendor = vendors.find(
    (v) => v.id.toLowerCase() === decodedSlug ||
           v.name.toLowerCase() === decodedSlug ||
           v.name.toLowerCase().replace(/\s+/g, '-') === decodedSlug
  ) || {
    id: decodedSlug,
    name: cleanBrandTitle,
    tagline: 'Master Tailors of Contemporary Nigerian Luxury Kaftans & Native Sets',
    origin: 'Victoria Island, Lagos',
    aesthetic: 'Bespoke Sartorial Elegance',
    code: cleanBrandTitle.split(' ').map(w => w.charAt(0)).join('').toUpperCase() || 'VY',
    heroImage: '/images/products/BlackSenator.jpg',
    productCount: 12,
    satisfactionRate: 99.4,
    deliveryDays: '24 - 48 Hours (Lagos Hub Dispatch)',
    shippingFee: 3500,
    description: 'Specializing in Super 140s wool Senator kaftans, three-piece ceremonial Agbada robes, and hand-embroidered native wear cut to your bespoke body twin dimensions.',
    vendorType: 'fashion_designer',
    phone: '+234 802 334 9910',
  };

  // Filter products strictly for this brand!
  const brandProducts = allProducts.filter(
    (p) => p.vendorId.toLowerCase() === vendor.id.toLowerCase() ||
           p.vendorName.toLowerCase() === vendor.name.toLowerCase() ||
           p.vendorName.toLowerCase().includes(decodedSlug)
  );

  const displayProducts = brandProducts.length > 0 ? brandProducts : allProducts.slice(0, 6);

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? displayProducts
    : displayProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pb-16 space-y-8 animate-fadeIn">
      
      {/* ======================================================== */}
      {/* 1. COMPACT BRAND HERO BANNER & EXCLUSIVE ATELIER IDENTITY */}
      {/* ======================================================== */}
      <div className="relative w-full bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-subtle)]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-6">
          
          {/* Top Breadcrumb & Share Actions */}
          <div className="flex items-center justify-between text-xs font-mono-luxury text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--text-primary)]">Home</Link>
              <span>/</span>
              <span className="text-[var(--text-muted)]">Ateliers</span>
              <span>/</span>
              <span className="text-[var(--gold-accent)] font-bold uppercase">{vendor.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-xs font-mono-luxury font-bold uppercase hover:bg-[var(--gold-accent)] hover:text-black transition-all shadow-sm"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Try in 3D Dressing Room</span>
              </Link>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all text-xs font-mono-luxury"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                    <span>Copy Store Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/2348023349910?text=Hello%20${encodeURIComponent(vendor.name)},%20I%20am%20shopping%20on%20your%20Veyra%20Storefront`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-xs font-mono-luxury font-bold"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp Atelier</span>
              </a>
            </div>
          </div>

          {/* Main Brand Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Atelier Crest */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[var(--gold-subtle)] border-2 border-[var(--gold-accent)]/40 text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-2xl sm:text-3xl shadow-xl shrink-0">
                {vendor.code || vendor.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                    {vendor.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-mono-luxury font-bold">
                    ● Verified Nigerian Atelier
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-light max-w-2xl leading-relaxed">
                  {vendor.tagline || vendor.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono-luxury text-[var(--text-muted)] pt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[var(--gold-accent)]" />
                    <span>{vendor.origin}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Scissors className="h-3 w-3 text-[var(--gold-accent)]" />
                    <span>{vendor.vendorType === 'fashion_designer' ? 'Bespoke Tailoring House' : 'Contemporary Boutique'}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{vendor.satisfactionRate}% Rating</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 self-stretch md:self-auto overflow-x-auto pb-2 md:pb-0">
              <div className="px-4 py-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center shrink-0">
                <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] uppercase block font-bold">Catalog</span>
                <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">{displayProducts.length} Pieces</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center shrink-0">
                <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] uppercase block font-bold">Lagos Hub</span>
                <span className="font-mono-luxury text-xs text-emerald-500 font-bold">24-48h Dispatch</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. EXCLUSIVE BRAND CATALOG GRID (IMMEDIATELY VISIBLE!) */}
      {/* ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        
        {/* Category Filter Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] flex-wrap">
          <div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {vendor.name} Collection
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-0.5">
              Pieces crafted exclusively by {vendor.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'tops', 'bottoms', 'outerwear', 'footwear', 'accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (2-COLUMNS ON MOBILE, 4-COLUMNS ON DESKTOP) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => {
            const isWorn = activeOutfit[product.category]?.id === product.id;
            const fitResult = calculateFitMatch(bodyProfile, product);

            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl sm:rounded-3xl surface-card overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border border-[var(--border-subtle)] ${
                  isWorn ? 'border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30' : ''
                }`}
              >
                {/* Image Container with Quick Look Click */}
                <div
                  onClick={() => setQuickLookProduct(product)}
                  className="relative h-48 sm:h-80 w-full bg-[var(--bg-secondary)] overflow-hidden block cursor-pointer group/img"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                  />
                  
                  {/* Top Left: Atelier Attribution */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-mono-luxury uppercase tracking-wider text-white border border-white/10 font-bold shadow-md">
                      {product.vendorName}
                    </span>
                  </div>

                  {/* Top Right: Curated Vault Bookmark Button */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVaultItem(product);
                      }}
                      className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md border transition-all ${
                        isInVault(product.id)
                          ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)] shadow-md scale-105'
                          : 'bg-black/60 text-white/80 border-white/10 hover:text-white hover:bg-black/85'
                      }`}
                      title={isInVault(product.id) ? 'In Curated Vault' : 'Curate to Wardrobe Vault'}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isInVault(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Quick View Center Overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-[10px] font-mono-luxury uppercase tracking-wider font-bold border border-white/20 shadow-lg flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                      <span>Quick View</span>
                    </span>
                  </div>

                  {/* Sizing Match Pill */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between z-10 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] sm:text-[11px] font-mono-luxury text-emerald-400 font-semibold uppercase">
                        {fitResult.matchScore}% Match
                      </span>
                    </div>

                    <span className="text-[9px] sm:text-[11px] font-mono-luxury text-white font-bold bg-emerald-500/20 px-1.5 sm:px-2.5 py-0.5 rounded-md sm:rounded-lg border border-emerald-500/30">
                      Size {fitResult.recommendedSize}
                    </span>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-1">
                      <span className="text-[10px] sm:text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold tracking-wider truncate">
                        {product.vendorName}
                      </span>
                      <Link
                        href={`/shop/${product.id}`}
                        className="text-[10px] sm:text-xs font-mono-luxury uppercase text-[var(--text-muted)] hover:text-[var(--gold-accent)] font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <Link href={`/shop/${product.id}`} className="hover:text-[var(--gold-accent)] transition-colors block">
                      <h4 className="font-editorial text-sm sm:text-2xl font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>

                    <div className="flex items-baseline gap-2 pt-1.5">
                      <span className="font-editorial text-lg sm:text-2xl font-bold text-amber-600 dark:text-[var(--gold-accent)] drop-shadow-sm">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-mono-luxury text-emerald-500 font-bold">
                        ● In Stock
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        if (isWorn) {
                          removeOutfitItem(product.category);
                        } else {
                          setOutfitItem(product);
                        }
                      }}
                      className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 rounded-full text-[9px] sm:text-[11px] font-mono-luxury uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                        isWorn
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      {isWorn ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3] shrink-0" />
                          <span className="truncate">On Model</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 text-[var(--gold-accent)] shrink-0" />
                          <span className="truncate">Try on Model</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => addToCart(product, fitResult.recommendedSize)}
                      className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 rounded-full text-[9px] sm:text-[11px] font-mono-luxury uppercase tracking-wider font-semibold whitespace-nowrap bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
                    >
                      <ShoppingBag className="h-3 w-3 shrink-0" />
                      <span className="truncate">Add to Bag</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. ATELIER BESPOKE CONSULTATION & GUARANTEE */}
      {/* ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-10 rounded-3xl surface-card border border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h4 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Direct Atelier Sizing
              </h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
              When you order from {vendor.name}, your calibrated 3D body measurements are routed directly to their master cutter.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[var(--gold-accent)]" />
              <h4 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Veyra Lagos Central Hub
              </h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
              Finished garments are inspected for stitch precision in Victoria Island before dispatch.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-400" />
              <h4 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Direct WhatsApp Concierge
              </h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
              Need custom native embroidery modifications? Message the atelier directly via their verified WhatsApp line.
            </p>
          </div>

        </div>
      </div>

      {/* Garment Quick Look Editorial Modal */}
      <ProductQuickLookModal
        product={quickLookProduct}
        onClose={() => setQuickLookProduct(null)}
      />

    </div>
  );
}
