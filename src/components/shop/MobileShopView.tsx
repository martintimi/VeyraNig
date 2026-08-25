'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GarmentOriginType } from '@/types';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import {
  Sparkles, Check, ShoppingBag, Search, SlidersHorizontal,
  X, RotateCcw, ChevronRight, Scissors, ArrowRight, Bookmark, Eye
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductQuickLookModal from '@/components/shop/ProductQuickLookModal';

export default function MobileShopView() {
  const {
    bodyProfile,
    activeOutfit,
    setOutfitItem,
    removeOutfitItem,
    addToCart,
    allProducts,
    selectedGender,
    setSelectedGender,
    selectedOriginType,
    setSelectedOriginType,
    toggleVaultItem,
    isInVault,
    fetchProductsFromDb,
  } = useStore();

  useEffect(() => {
    fetchProductsFromDb();
  }, [fetchProductsFromDb]);

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [quickLookProduct, setQuickLookProduct] = useState<any>(null);

  const categories: { id: GarmentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'tops', label: selectedGender === 'female' ? 'Tops & Silk' : 'Senator & Tops' },
    { id: 'bottoms', label: 'Trousers & Denim' },
    { id: 'outerwear', label: 'Agbada & Robes' },
    { id: 'footwear', label: 'Shoes & Slides' },
    { id: 'accessories', label: 'Caps & Filas' },
  ];

  const brandOptions = useMemo(() => {
    const brandsMap = new Map<string, { id: string; name: string }>();
    brandsMap.set('all', { id: 'all', name: 'All Brands' });
    
    allProducts.forEach(p => {
      const vId = p.vendorId || 'boutique';
      const vName = p.vendorName || (vId.charAt(0).toUpperCase() + vId.slice(1).replace(/-/g, ' '));
      if (!brandsMap.has(vId)) {
        brandsMap.set(vId, { id: vId, name: vName });
      }
    });

    return Array.from(brandsMap.values());
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesGender = p.genderTarget === selectedGender || p.genderTarget === 'unisex';
      const matchesOrigin = selectedOriginType === 'all' || p.garmentOriginType === selectedOriginType;
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.vendorId === selectedBrand || p.vendorName.toLowerCase().includes(selectedBrand);
      const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGender && matchesOrigin && matchesCat && matchesBrand && matchesQuery;
    });
  }, [allProducts, selectedGender, selectedOriginType, selectedCategory, selectedBrand, searchQuery]);

  const activeFilterCount = (selectedBrand !== 'all' ? 1 : 0) + (selectedOriginType !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedOriginType('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 md:hidden pb-12 animate-fadeIn">
      
      {/* 1. TOP MINIMAL SEARCH & FILTER BAR */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Nigerian native & street drops..."
            className="w-full pl-10 pr-3 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Drawer Trigger */}
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-xs font-mono-luxury uppercase font-bold shrink-0 transition-all ${
            activeFilterCount > 0
              ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)]'
              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="h-4 w-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. HORIZONTAL CATEGORY CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono-luxury uppercase whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. PRODUCT COUNT HEADER */}
      <div className="flex items-center justify-between text-[11px] font-mono-luxury text-[var(--text-muted)] px-1">
        <span>Showing {filteredProducts.length} Nigerian Designs</span>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-[var(--gold-accent)] font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 4. CLEAN 2-COLUMN MOBILE PRODUCT FEED */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center space-y-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <p className="font-editorial text-lg font-bold text-[var(--text-primary)]">
            {allProducts.length === 0 ? 'New Season Drops Coming Soon' : 'No Designs Match Filter'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] font-light max-w-xs mx-auto">
            {allProducts.length === 0
              ? 'Our partner boutiques and ateliers are currently preparing their upcoming collections. Check back shortly!'
              : 'Try adjusting your search query or reset your filters.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const isWorn = activeOutfit[product.category]?.id === product.id;
            const fitResult = calculateFitMatch(bodyProfile, product);

            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between border border-[var(--border-subtle)] ${
                  isWorn ? 'border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/40' : ''
                }`}
              >
                {/* Image Container with Quick Look Tap */}
                <div
                  onClick={() => setQuickLookProduct(product)}
                  className="relative h-48 w-full bg-[var(--bg-secondary)] overflow-hidden block cursor-pointer"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  
                  {/* Top Left: Atelier Attribution */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[8px] font-mono-luxury uppercase tracking-wider text-white border border-white/10 font-bold">
                    {product.vendorName}
                  </span>

                  {/* Top Right: Curated Vault Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVaultItem(product);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md border transition-all z-20 ${
                      isInVault(product.id)
                        ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)] shadow-md'
                        : 'bg-black/60 text-white/80 border-white/10'
                    }`}
                    title={isInVault(product.id) ? 'In Vault' : 'Save to Vault'}
                  >
                    <Bookmark className={`h-3 w-3 ${isInVault(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Fit Match Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-xl bg-black/85 backdrop-blur-md flex items-center justify-between text-[9px] font-mono-luxury text-white">
                    <span className="text-emerald-400 font-semibold">{fitResult.matchScore}% Fit</span>
                    <span className="font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30 text-emerald-300">
                      {fitResult.recommendedSize}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[9px] font-mono-luxury text-[var(--gold-accent)] uppercase block truncate font-bold">
                      {product.vendorName}
                    </span>
                    <Link href={`/shop/${product.id}`}>
                      <h4 className="font-editorial text-xs font-bold text-[var(--text-primary)] truncate mt-0.5">
                        {product.name}
                      </h4>
                    </Link>
                    <span className="font-editorial text-xs font-bold text-amber-600 dark:text-[var(--gold-accent)] block mt-0.5">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Symmetrical Single-Line Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        if (isWorn) {
                          removeOutfitItem(product.category);
                        } else {
                          setOutfitItem(product);
                        }
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-full text-[9px] font-mono-luxury uppercase font-semibold whitespace-nowrap transition-all ${
                        isWorn
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                      }`}
                    >
                      {isWorn ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3] shrink-0" />
                          <span>Worn</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 text-[var(--gold-accent)] shrink-0" />
                          <span>Try On</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => addToCart(product, fitResult.recommendedSize)}
                      className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-full text-[9px] font-mono-luxury uppercase font-semibold whitespace-nowrap bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    >
                      <ShoppingBag className="h-3 w-3 shrink-0" />
                      <span>Bag</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. SLIDE-UP FILTER DRAWER */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fadeIn">
          <div
            onClick={() => setIsFilterSheetOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative w-full max-h-[80vh] bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slideUp">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
              <h3 className="font-editorial text-base font-bold text-[var(--text-primary)]">
                Filter Catalog
              </h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Options Content */}
            <div className="p-4 overflow-y-auto space-y-5 text-xs font-mono-luxury">
              
              {/* Garment Origin Type */}
              <div className="space-y-2">
                <span className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Production Style</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'handmade_designer', label: 'Handmade' },
                    { id: 'ready_made_boutique', label: 'Ready-Made' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedOriginType(t.id as GarmentOriginType | 'all')}
                      className={`py-2 px-2 rounded-xl text-center font-bold transition-all ${
                        selectedOriginType === t.id
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                          : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nigerian Ateliers */}
              <div className="space-y-2">
                <span className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Nigerian Atelier</span>
                <div className="space-y-1.5">
                  {brandOptions.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full p-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-all ${
                        selectedBrand === brand.id
                          ? 'bg-[var(--gold-accent)] text-black'
                          : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{brand.name}</span>
                      {selectedBrand === brand.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] font-mono-luxury uppercase text-xs font-bold text-[var(--text-secondary)]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-lg"
              >
                Show ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Garment Quick Look Modal */}
      <ProductQuickLookModal
        product={quickLookProduct}
        onClose={() => setQuickLookProduct(null)}
      />

    </div>
  );
}
