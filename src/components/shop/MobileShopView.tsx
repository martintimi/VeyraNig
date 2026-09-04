'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory } from '@/types';
import { Heart, SlidersHorizontal, X, Search, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MobileQuickBuyDrawer from '@/components/mobile/MobileQuickBuyDrawer';
import MobileStoriesRow from '@/components/mobile/MobileStoriesRow';

const ITEMS_PER_PAGE = 8;

export default function MobileShopView() {
  const {
    allProducts,
    isProductsLoading,
    toggleVaultItem,
    isInVault,
    fetchProductsFromDb,
    addToCart,
  } = useStore();

  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<any>(null);
  // Track which product hearts are animating (Instagram-style burst)
  const [burstingHearts, setBurstingHearts] = useState<Set<string>>(new Set());

  const handleHeartClick = (product: any) => {
    toggleVaultItem(product);
    // Trigger burst animation
    setBurstingHearts((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setBurstingHearts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 700);
  };

  useEffect(() => {
    fetchProductsFromDb();
  }, [fetchProductsFromDb]);

  const categories: { id: GarmentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'tops', label: 'Tops & Kaftans' },
    { id: 'outerwear', label: 'Boubou & Robes' },
    { id: 'bottoms', label: 'Trousers' },
    { id: 'footwear', label: 'Slides & Shoes' },
    { id: 'accessories', label: 'Caps & Jewelry' },
  ];

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts : [];
    return list.filter((p) => {
      const pGender = (p.genderTarget || '').toLowerCase();
      const matchesGender = genderFilter === 'all' || pGender === genderFilter || pGender === 'unisex' || !pGender;
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => (t || '').toLowerCase().includes(q));
      return matchesGender && matchesCat && matchesQuery;
    });
  }, [allProducts, genderFilter, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleGenderChange = (g: 'all' | 'male' | 'female') => {
    setGenderFilter(g);
    setCurrentPage(1);
  };

  const handleCategoryChange = (catId: GarmentCategory | 'all') => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="md:hidden pb-28 bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">

      {/* STORIES ROW */}
      <div className="pt-4 pb-3 border-b border-[var(--border-subtle)]">
        <MobileStoriesRow />
      </div>

      {/* HEADER ROW: title + refine */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
          {genderFilter === 'male' ? "Men's" : genderFilter === 'female' ? "Women's" : 'All Drops'}
        </h1>
        <button
          type="button"
          onClick={() => setIsRefineOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-medium rounded-sm cursor-pointer hover:border-[var(--text-primary)] transition-colors"
        >
          <span>Refine</span>
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* GENDER TABS */}
      <div className="px-4 flex items-center gap-4 border-b border-[var(--border-subtle)] pb-0">
        {[
          { id: 'all', label: 'All' },
          { id: 'male', label: 'Men' },
          { id: 'female', label: 'Women' },
        ].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => handleGenderChange(g.id as 'all' | 'male' | 'female')}
            className={`pb-3 text-xs font-medium uppercase tracking-wide transition-all border-b-2 cursor-pointer ${
              genderFilter === g.id
                ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* CATEGORY PILLS */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs border rounded-full transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ITEM COUNT */}
      <div className="px-4 pb-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        {isProductsLoading ? (
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--gold-accent)] font-mono-luxury font-bold animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-accent)] animate-ping" />
            <span>Loading pieces...</span>
          </span>
        ) : (
          <span>{filteredProducts.length} items</span>
        )}
        {totalPages > 1 && !isProductsLoading && (
          <span className="font-mono-luxury text-[11px]">Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* PRODUCT GRID */}
      {isProductsLoading ? (
        <div className="grid grid-cols-2 px-2 gap-x-2.5 gap-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col justify-between h-full space-y-2 animate-pulse">
              <div className="relative aspect-[4/5] w-full bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
              <div className="space-y-1 px-0.5">
                <div className="h-3.5 w-4/5 bg-[var(--bg-secondary)] rounded-md" />
                <div className="h-3 w-1/3 bg-[var(--bg-secondary)] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="px-6 py-15 flex flex-col items-center text-center gap-4 animate-fadeIn">
          {/* Minimal icon */}
          <div className="h-16 w-16 rounded-full border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center">
            <span className="text-2xl opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">Nothing here yet</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[220px]">
              No pieces match your current selection. Try a different category or department.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setGenderFilter('all'); setSelectedCategory('all'); setSearchQuery(''); setCurrentPage(1); }}
            className="mt-1 px-6 py-2.5 border border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-medium rounded-sm hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 px-2 gap-x-2.5 gap-y-6">
            {paginatedProducts.map((product) => {
              const saved = isInVault(product.id);
              return (
                <div key={product.id} className="flex flex-col justify-between h-full group">
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/5] w-full bg-[var(--bg-secondary)] overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                      <Link href={`/shop/${product.id}`} className="block w-full h-full">
                        <Image
                          src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {/* Wishlist heart — Instagram burst animation */}
                      <button
                        type="button"
                        onClick={() => handleHeartClick(product)}
                        className="absolute top-2 right-2 p-1.5 cursor-pointer z-10"
                        aria-label="Save"
                      >
                        {/* Burst pop heart (appears briefly on save) */}
                        {burstingHearts.has(product.id) && (
                          <span
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{ animation: 'heartBurst 0.6s ease-out forwards' }}
                          >
                            <Heart className="h-8 w-8 fill-red-500 text-red-500 opacity-80" />
                          </span>
                        )}
                        <Heart
                          className={`h-5 w-5 transition-all duration-200 ${
                            saved ? 'fill-red-500 stroke-red-500' : 'stroke-white fill-black/30'
                          } ${burstingHearts.has(product.id) ? 'scale-125' : 'scale-100'}`}
                          strokeWidth={1.5}
                          style={{
                            filter: saved ? 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' : undefined,
                            transition: 'transform 0.2s cubic-bezier(0.36,0.07,0.19,0.97)',
                          }}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="pt-2 px-0.5 space-y-0.5">
                      {/* Vendor Name in Standard Subtle Typography */}
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide line-clamp-1">
                        {product.vendorName || 'Atelier'}
                      </p>
                      {/* Product Name */}
                      <Link href={`/shop/${product.id}`} className="block">
                        <h3 className="text-xs font-semibold text-[var(--text-primary)] leading-snug line-clamp-1 hover:underline">
                          {product.name}
                        </h3>
                      </Link>
                      {/* Prominent High-Legibility Gold Price */}
                      <div className="pt-1.5 flex items-baseline justify-between">
                        <span className="font-mono-luxury text-base sm:text-lg font-black text-[var(--gold-accent)] tracking-tight">
                          ₦{Number(product.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Single Clean Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => setQuickBuyProduct(product)}
                    className="w-full mt-2.5 py-2 px-2.5 rounded-xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] text-[11px] font-mono-luxury uppercase font-bold tracking-wider hover:bg-[var(--gold-subtle)] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* MOBILE PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-mono-luxury font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[var(--gold-accent)] text-black shadow-md'
                        : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* REFINE BOTTOM SHEET */}
      {isRefineOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            onClick={() => setIsRefineOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative bg-[var(--bg-primary)] rounded-t-2xl p-5 space-y-5 z-10 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">Refine</h3>
              <button type="button" onClick={() => setIsRefineOpen(false)} className="cursor-pointer">
                <X className="h-5 w-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drops..."
                className="w-full pl-9 pr-4 py-2.5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-secondary)]"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)]">Department</p>
              <div className="flex flex-col gap-1">
                {[{ id: 'all', label: 'All' }, { id: 'male', label: 'Men' }, { id: 'female', label: 'Women' }].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGenderFilter(g.id as 'all' | 'male' | 'female')}
                    className={`text-left px-3 py-2.5 text-sm border-b border-[var(--border-subtle)] flex items-center justify-between cursor-pointer ${
                      genderFilter === g.id ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{g.label}</span>
                    {genderFilter === g.id && <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)]">Category</p>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2.5 text-sm border-b border-[var(--border-subtle)] flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.id ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply */}
            <button
              type="button"
              onClick={() => setIsRefineOpen(false)}
              className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold cursor-pointer"
            >
              View {filteredProducts.length} Items
            </button>
          </div>
        </div>
      )}

      {/* QUICK BUY DRAWER */}
      {quickBuyProduct && (
        <MobileQuickBuyDrawer
          product={quickBuyProduct}
          onClose={() => setQuickBuyProduct(null)}
        />
      )}
    </div>
  );
}
