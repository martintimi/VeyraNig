'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import { ArrowLeft, Heart, ShoppingBag, Grid2X2, Square, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MobileQuickBuyDrawer from '@/components/mobile/MobileQuickBuyDrawer';
import { products as fallbackProducts } from '@/lib/data/products';

// Category metadata mapping for title and filtering
interface CategoryConfig {
  title: string;
  subtitle: string;
  filterFn: (p: any) => boolean;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  shirts: {
    title: 'SHIRTS',
    subtitle: 'Button-downs, polo shirts & casual tees',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];
      // Exclude Agbadas, Senators and Heavy Hoodies from pure Shirts
      if (n.includes('agbada') || n.includes('senator') || n.includes('hoodie')) return false;
      return (
        n.includes('shirt') ||
        n.includes('tee') ||
        n.includes('top') ||
        n.includes('lace') ||
        tags.some((t: string) => t.includes('shirt') || t.includes('tee') || t.includes('top') || t.includes('lace'))
      );
    }
  },
  streetwear: {
    title: 'STREETWEAR',
    subtitle: 'Heavyweight hoodies, graphic drops & urban sets',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];
      return (
        n.includes('hoodie') ||
        n.includes('sweatshirt') ||
        n.includes('trapstar') ||
        n.includes('street') ||
        n.includes('kokolee') ||
        tags.some((t: string) => t.includes('hoodie') || t.includes('streetwear') || t.includes('street'))
      );
    }
  },
  native: {
    title: 'NATIVE & AGBADA',
    subtitle: 'Senator kaftans, royal Agbadas & bespoke tailoring',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];
      return (
        n.includes('agbada') ||
        n.includes('senator') ||
        n.includes('kaftan') ||
        n.includes('native') ||
        tags.some((t: string) => t.includes('native') || t.includes('agbada') || t.includes('senator'))
      );
    }
  },
  footwear: {
    title: 'FOOTWEAR & SLIDES',
    subtitle: 'Handcrafted cowhide slides, mules & sneakers',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      return (
        c === 'footwear' ||
        n.includes('slide') ||
        n.includes('shoe') ||
        n.includes('adilette') ||
        n.includes('sneaker') ||
        n.includes('loafer') ||
        n.includes('palm')
      );
    }
  },
  trousers: {
    title: 'TROUSERS & DENIM',
    subtitle: 'Baggy selvedge denim, cargo pants & tailored trousers',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      return (
        c === 'bottoms' ||
        n.includes('jean') ||
        n.includes('pant') ||
        n.includes('cargo') ||
        n.includes('trouser') ||
        n.includes('jogger') ||
        n.includes('adiddas')
      );
    }
  },
  accessories: {
    title: 'CAPS & ACCESSORIES',
    subtitle: 'Monogram caps, Cuban links & luxury accessories',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      return (
        c === 'accessories' ||
        n.includes('cap') ||
        n.includes('watch') ||
        n.includes('chain') ||
        n.includes('neckless') ||
        n.includes('necklace') ||
        n.includes('ring') ||
        n.includes('hat')
      );
    }
  },
  jewelry: {
    title: 'JEWELRY & WATCHES',
    subtitle: 'Cuban links, signet rings & luxury timepieces',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      return (
        n.includes('watch') ||
        n.includes('chain') ||
        n.includes('neckless') ||
        n.includes('necklace') ||
        n.includes('ring') ||
        n.includes('bracelet') ||
        n.includes('rolex')
      );
    }
  },
  dresses: {
    title: 'DRESSES & GOWNS',
    subtitle: 'Silk boubous, two-piece sets & evening gowns',
    filterFn: (p: any) => {
      const n = (p.name || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];
      return (
        n.includes('dress') ||
        n.includes('gown') ||
        n.includes('boubou') ||
        n.includes('bubu') ||
        tags.some((t: string) => t.includes('dress') || t.includes('boubou') || t.includes('maxidress'))
      );
    }
  }
};

export default function DedicatedCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '').toLowerCase();

  const {
    allProducts,
    toggleVaultItem,
    isInVault,
    fetchProductsFromDb,
  } = useStore();

  const [quickBuyProduct, setQuickBuyProduct] = useState<any>(null);
  const [burstingHearts, setBurstingHearts] = useState<Set<string>>(new Set());
  const [gridCols, setGridCols] = useState<1 | 2>(2);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('irisi-mobile-grid-cols');
      if (saved === '1' || saved === '2') setGridCols(Number(saved) as 1 | 2);
    }
  }, []);

  const toggleGridCols = () => {
    const next = gridCols === 2 ? 1 : 2;
    setGridCols(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('irisi-mobile-grid-cols', String(next));
    }
  };

  useEffect(() => {
    fetchProductsFromDb();
  }, [fetchProductsFromDb]);

  // Find configuration or fallback dynamically
  const config = useMemo(() => {
    if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug];
    // Dynamic fallback based on slug name
    const formattedTitle = slug.replace(/-/g, ' ').toUpperCase();
    return {
      title: formattedTitle,
      subtitle: `Curated ${slug.replace(/-/g, ' ')} collections`,
      filterFn: (p: any) => {
        const q = slug.toLowerCase();
        return (
          p.category === q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      }
    };
  }, [slug]);

  // Filter products strictly for this category
  const categoryProducts = useMemo(() => {
    let list = Array.isArray(allProducts) && allProducts.length > 0 ? allProducts : [];
    if (list.length === 0 && Array.isArray(fallbackProducts)) {
      list = fallbackProducts;
    }
    return list.filter(config.filterFn);
  }, [allProducts, config]);

  const handleHeartClick = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVaultItem(product);
    setBurstingHearts((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setBurstingHearts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 700);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-28 select-none">
      
      {/* ── 1. ASOS-STYLE STICKY TOP APP BAR ────────────────────── */}
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
        
        {/* Left Circular Back Button (Returns directly to feed where tapped) */}
        <button
          type="button"
          onClick={handleBack}
          className="h-10 w-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
        </button>

        {/* Center Category Title (Uppercase ASOS Styling e.g. SHIRTS) */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-sm sm:text-base font-mono-luxury font-black tracking-widest text-[var(--text-primary)] uppercase truncate">
            {config.title}
          </h1>
        </div>

        {/* Right Circular 1-Col vs 2-Col Grid Toggle Button (Feature B) */}
        <button
          type="button"
          onClick={toggleGridCols}
          className="h-10 w-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm shrink-0"
          aria-label={gridCols === 2 ? 'Switch to 1-column view' : 'Switch to 2-column view'}
        >
          {gridCols === 2 ? (
            <Square className="h-4 w-4 text-[var(--gold-accent)]" />
          ) : (
            <Grid2X2 className="h-4 w-4 text-[var(--gold-accent)]" />
          )}
        </button>
      </header>

      {/* ── 2. MAIN CATEGORY FEED (1-Column Editorial or 2-Column Clean Grid) ───── */}
      <main className="max-w-7xl mx-auto px-2 sm:px-3 pt-2.5 pb-8">
        
        {categoryProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3 px-4">
            <p className="text-base font-editorial font-bold text-[var(--text-primary)]">
              No pieces found in {config.title}
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              Our ateliers and boutique partners are curating new drops for this department.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-md cursor-pointer"
            >
              Return to Feed
            </button>
          </div>
        ) : (
          <div className={gridCols === 1 ? "grid grid-cols-1 gap-y-8" : "grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8"}>
            {categoryProducts.map((product, idx) => {
              const saved = isInVault(product.id);
              const isSellingFast = idx % 3 === 1;
              const origPrice = product.originalPrice;
              const hasDiscount = typeof origPrice === 'number' && origPrice > product.price;
              const discountPercent = (hasDiscount && origPrice)
                ? Math.round((1 - (product.price / origPrice)) * 100)
                : 0;

              return (
                <div key={product.id} className={`flex flex-col justify-between h-full group ${gridCols === 1 ? 'pb-3 border-b border-[var(--border-subtle)]/50' : ''}`}>
                  <div>
                    {/* ASOS Media Container */}
                    <div className={`relative w-full bg-[var(--bg-secondary)] overflow-hidden rounded-xl border border-[var(--border-subtle)] ${gridCols === 1 ? 'aspect-[4/5] sm:aspect-[16/10]' : 'aspect-[3/4] sm:aspect-[4/5]'}`}>
                      <Link href={`/shop/${product.id}`} className="block w-full h-full">
                        <Image
                          src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Top-Left: Discount Badge */}
                      {hasDiscount && discountPercent > 0 && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-1.5 py-0.5 rounded bg-white text-rose-600 text-[10px] font-mono-luxury font-bold tracking-tight shadow-sm">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}

                      {/* ASOS Bottom-Left Micro Badge (SELLING FAST) */}
                      {isSellingFast && (
                        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[9px] font-mono-luxury uppercase font-bold tracking-wider shadow-sm">
                            Selling Fast
                          </span>
                        </div>
                      )}

                      {/* ASOS-Style Wishlist Heart on Image (White Circle + Heart Icon) */}
                      <button
                        type="button"
                        onClick={(e) => handleHeartClick(product, e)}
                        className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-full bg-white text-black shadow-md flex items-center justify-center transition-transform active:scale-75 cursor-pointer z-10"
                        aria-label="Wishlist"
                      >
                        {burstingHearts.has(product.id) && (
                          <span
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{ animation: 'heartBurst 0.6s ease-out forwards' }}
                          >
                            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 opacity-90" />
                          </span>
                        )}
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            saved ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-black fill-transparent text-black'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Typography (ASOS Hierarchy) */}
                    <div className="pt-2 px-0.5 space-y-0.5">
                      {/* Price First (Gold Accent as requested) */}
                      <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
                        <span className={`font-mono-luxury ${gridCols === 1 ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-black text-[var(--gold-accent)] tracking-tight`}>
                          ₦{Number(product.price || 0).toLocaleString()}
                        </span>
                        {hasDiscount && origPrice && (
                          <span className="text-[11px] text-[var(--text-secondary)] line-through font-mono-luxury">
                            ₦{Number(origPrice).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Brand in Uppercase */}
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-mono-luxury font-bold tracking-wider truncate pt-0.5">
                        {product.vendorName || 'Atelier'}
                      </p>

                      {/* Product Name */}
                      <Link href={`/shop/${product.id}`} className="block">
                        <h3 className={`${gridCols === 1 ? 'text-sm' : 'text-xs'} font-normal text-[var(--text-primary)] leading-snug line-clamp-1 hover:underline`}>
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Clean Quick Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => setQuickBuyProduct(product)}
                    className={`w-full mt-2.5 py-2 px-2.5 rounded-xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] ${gridCols === 1 ? 'text-xs py-2.5' : 'text-[10px]'} font-mono-luxury uppercase font-bold tracking-wider hover:bg-[var(--gold-subtle)] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ── 3. QUICK BUY DRAWER (Slide-up size picker & 1-tap cart) ─ */}
      {quickBuyProduct && (
        <MobileQuickBuyDrawer
          product={quickBuyProduct}
          onClose={() => setQuickBuyProduct(null)}
        />
      )}

    </div>
  );
}
