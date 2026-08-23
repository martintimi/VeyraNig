'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GarmentOriginType } from '@/types';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import {
  Sparkles, Check, ShoppingBag, Search, Scissors, ArrowRight, ArrowLeft,
  Building, ExternalLink, Filter, Layers, ChevronLeft, ChevronRight,
  RotateCcw, PackageSearch
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

export default function MarketplaceGrid() {
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
  } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories: { id: GarmentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Garments' },
    { id: 'tops', label: selectedGender === 'female' ? 'Ankara & Silk Tops' : 'Senator & Tops' },
    { id: 'bottoms', label: 'Trousers & Denim' },
    { id: 'outerwear', label: 'Agbada & Robes' },
    { id: 'footwear', label: 'Shoes & Slides' },
    { id: 'accessories', label: 'Fila Caps' },
  ];

  const brandOptions = [
    { id: 'all', name: 'All Ateliers', count: allProducts.length },
    { id: 'sartorial-lagos', name: 'Sartorial Lagos', count: allProducts.filter(p => p.vendorId === 'sartorial-lagos').length },
    { id: 'street-souk', name: 'Street Souk Co.', count: allProducts.filter(p => p.vendorId === 'street-souk').length },
    { id: 'yaba-denim', name: 'Yaba Denim Works', count: allProducts.filter(p => p.vendorId === 'yaba-denim').length },
    { id: 'kano-leather', name: 'Kano Artisan Footwear', count: allProducts.filter(p => p.vendorId === 'kano-leather').length },
  ];

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

  // Reset page when filters change
  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (catId: GarmentCategory | 'all') => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedOriginType('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Pagination math
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ======================================================== */}
      {/* 1. UNIFIED WELCOME CARD WITH EMBEDDED BRAND FILTERS */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl surface-card p-6 sm:p-10 overflow-hidden shadow-xl border border-[var(--border-subtle)]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-subtle)]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>NIGERIAN APPAREL CATALOG</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              Shop Senator, Native & Streetwear
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
              Every piece auto-calculates your exact size. Click &quot;Try on Twin&quot; to test clothes directly on your live model before ordering.
            </p>
          </div>

          {/* Action Row: Virtual Dressing Room + Integrated Brand Filter Pills */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left Button */}
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-md shrink-0"
            >
              <Layers className="h-4 w-4" />
              <span>Open Virtual Dressing Room</span>
            </Link>

            {/* Right: Integrated Brand Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono-luxury uppercase font-bold text-[var(--text-muted)] shrink-0 hidden sm:inline-block">
                Atelier:
              </span>

              {brandOptions.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandChange(brand.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono-luxury uppercase whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedBrand === brand.id
                      ? 'bg-[var(--gold-accent)] text-black font-bold shadow-sm'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{brand.name}</span>
                  {brand.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      selectedBrand === brand.id ? 'bg-black text-white' : 'bg-[var(--badge-bg)] text-[var(--text-muted)]'
                    }`}>
                      {brand.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SEARCH & GLOBAL FILTERS BAR */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl surface-card border border-[var(--border-subtle)]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Senator, Ankara, Hoodies, Denim..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
          />
        </div>

        {/* Gender Switcher & Handmade vs ReadyMade Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Gender Switcher */}
          <div className="flex items-center p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => {
                setSelectedGender('male');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-luxury uppercase transition-all ${
                selectedGender === 'male'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Men&apos;s
            </button>
            <button
              onClick={() => {
                setSelectedGender('female');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-luxury uppercase transition-all ${
                selectedGender === 'female'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Women&apos;s
            </button>
          </div>

          {/* Origin Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] font-mono-luxury uppercase">
            <button
              onClick={() => {
                setSelectedOriginType('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full transition-all ${
                selectedOriginType === 'all'
                  ? 'bg-[var(--badge-bg)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => {
                setSelectedOriginType('handmade_designer');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                selectedOriginType === 'handmade_designer'
                  ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold border border-[var(--gold-accent)]/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Scissors className="h-3 w-3" />
              <span>Handmade</span>
            </button>
            <button
              onClick={() => {
                setSelectedOriginType('ready_made_boutique');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full transition-all ${
                selectedOriginType === 'ready_made_boutique'
                  ? 'bg-[var(--badge-bg)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Ready-Made
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CATEGORY PILLS BAR */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono-luxury tracking-wider uppercase font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                  : 'surface-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] border border-[var(--border-subtle)]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <span className="text-xs font-mono-luxury text-[var(--text-muted)] uppercase">
          Showing {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} pieces
        </span>
      </div>

      {/* ======================================================== */}
      {/* 4. GARMENTS GRID OR ANIMATED EMPTY STATE */}
      {/* ======================================================== */}
      {filteredProducts.length === 0 ? (
        
        /* ANIMATED NO RESULTS EMPTY STATE */
        <div className="p-12 sm:p-16 rounded-3xl surface-card border border-[var(--border-subtle)] text-center space-y-6 animate-fadeIn max-w-xl mx-auto shadow-xl">
          
          <div className="relative h-20 w-20 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center mx-auto shadow-inner">
            <PackageSearch className="h-10 w-10 animate-bounce" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 animate-ping" />
          </div>

          <div className="space-y-2">
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              No Nigerian Garments Found
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any designs matching &ldquo;{searchQuery || selectedCategory || selectedBrand}&rdquo;. Try adjusting your search query or reset your filters.
            </p>
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>

        </div>

      ) : (

        /* PRODUCT GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => {
            const isWorn = activeOutfit[product.category]?.id === product.id;
            const fitResult = calculateFitMatch(bodyProfile, product);

            return (
              <div
                key={product.id}
                className={`group relative rounded-3xl surface-card overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border border-[var(--border-subtle)] ${
                  isWorn ? 'border-[var(--gold-accent)] shadow-md ring-1 ring-[var(--gold-accent)]/30' : ''
                }`}
              >
                {/* Image Container with Link */}
                <Link href={`/shop/${product.id}`} className="relative h-80 w-full bg-[var(--bg-secondary)] overflow-hidden block">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-luxury uppercase tracking-wider text-white border border-white/10 font-semibold">
                      {product.vendorName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono-luxury font-bold uppercase tracking-wider ${
                      product.garmentOriginType === 'handmade_designer'
                        ? 'bg-[var(--gold-accent)] text-black'
                        : 'bg-white text-black'
                    }`}>
                      {product.garmentOriginType === 'handmade_designer' ? 'Handmade' : 'Ready-Made'}
                    </span>
                  </div>

                  {/* Sizing Match Pill */}
                  <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono-luxury text-emerald-400 font-semibold uppercase">
                        {fitResult.matchScore}% Fit Match
                      </span>
                    </div>

                    <span className="text-[11px] font-mono-luxury text-white font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                      Size {fitResult.recommendedSize}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <Link href={`/shop/${product.id}`} className="hover:text-[var(--gold-accent)] transition-colors">
                        <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="font-editorial text-xl font-bold text-[var(--text-primary)] shrink-0">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1 font-mono-luxury text-[9px] text-[var(--text-muted)] uppercase">
                        {product.tags.slice(0, 2).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--badge-bg)] border border-[var(--border-subtle)]">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/shop/${product.id}`}
                        className="text-[10px] font-mono-luxury uppercase text-[var(--gold-accent)] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        if (isWorn) {
                          removeOutfitItem(product.category);
                        } else {
                          setOutfitItem(product);
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-full text-xs font-mono-luxury uppercase tracking-wider font-semibold transition-all ${
                        isWorn
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      {isWorn ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>On Model</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                          <span>Try on Twin</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => addToCart(product, fitResult.recommendedSize)}
                      className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full text-xs font-mono-luxury uppercase tracking-wider font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INTERACTIVE PAGINATION CONTROLS */}
      {/* ======================================================== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-9 w-9 rounded-full text-xs font-mono-luxury font-bold transition-all flex items-center justify-center ${
                  currentPage === pageNum
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md scale-105'
                    : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
