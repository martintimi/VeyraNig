'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GarmentOriginType } from '@/types';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';
import { Sparkles, Check, ShoppingBag, Search, Scissors, ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: GarmentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Garments' },
    { id: 'tops', label: selectedGender === 'female' ? 'Ankara & Silk Tops' : 'Senator & Tops' },
    { id: 'bottoms', label: 'Trousers & Denim' },
    { id: 'outerwear', label: 'Agbada & Robes' },
    { id: 'footwear', label: 'Shoes & Slides' },
    { id: 'accessories', label: 'Fila Caps' },
  ];

  const filteredProducts = allProducts.filter((p) => {
    const matchesGender = p.genderTarget === selectedGender || p.genderTarget === 'unisex';
    const matchesOrigin = selectedOriginType === 'all' || p.garmentOriginType === selectedOriginType;
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGender && matchesOrigin && matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      
      {/* Search & Global Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl surface-card">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Senator, Ankara, Hoodies, Denim..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
          />
        </div>

        {/* Gender Switcher & Handmade vs ReadyMade Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Gender Buttons */}
          <div className="flex items-center p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-luxury uppercase transition-all ${
                selectedGender === 'male'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Men&apos;s
            </button>
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-luxury uppercase transition-all ${
                selectedGender === 'female'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Women&apos;s
            </button>
          </div>

          {/* Origin Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] font-mono-luxury uppercase">
            <button
              onClick={() => setSelectedOriginType('all')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                selectedOriginType === 'all'
                  ? 'bg-[var(--badge-bg)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedOriginType('handmade_designer')}
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
              onClick={() => setSelectedOriginType('ready_made_boutique')}
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

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-mono-luxury tracking-wider uppercase font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                : 'surface-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
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

    </div>
  );
}
