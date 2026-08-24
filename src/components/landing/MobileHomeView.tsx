'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store/useStore';
import {
  Sparkles, ArrowRight, ShoppingBag, Check, Flame,
  Scissors, ShieldCheck, ChevronRight, Star
} from 'lucide-react';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';

export default function MobileHomeView() {
  const { allProducts, activeOutfit, setOutfitItem, removeOutfitItem, addToCart, bodyProfile } = useStore();

  const ateliers = [
    { id: 'sartorial-lagos', name: 'Sartorial', tag: 'Native', image: '/images/products/BlackSenator.jpg', color: 'from-amber-600 to-amber-400' },
    { id: 'street-souk', name: 'Street Souk', tag: 'Street', image: '/images/products/BlackTrapStarHoodie.jpg', color: 'from-purple-600 to-indigo-400' },
    { id: 'yaba-denim', name: 'Yaba Denim', tag: 'Denim', image: '/images/products/BaggyJean.jpg', color: 'from-blue-600 to-cyan-400' },
    { id: 'kano-leather', name: 'Kano Artisan', tag: 'Leather', image: '/images/products/UnisexSlides.jpg', color: 'from-amber-700 to-yellow-500' },
  ];

  const featuredDrops = allProducts.slice(0, 6);

  return (
    <div className="space-y-6 md:hidden pb-12 animate-fadeIn">
      
      {/* 1. VISUAL EDITORIAL HERO CARD */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-xl bg-black">
        <Image
          src="/images/products/BlackAgbada.jpg"
          alt="Veyra Nigerian Luxury"
          fill
          unoptimized
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono-luxury uppercase tracking-widest font-bold self-start">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>Lagos Cross-Brand Fitting</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-editorial text-2xl font-bold text-white leading-tight">
              Mix Nigerian Brands.<br />
              <span className="italic font-light text-amber-300">Try On Your Twin.</span>
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/studio"
                className="flex-1 py-3 rounded-full bg-white text-black font-mono-luxury uppercase text-xs font-bold text-center shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Try On 3D</span>
              </Link>
              <Link
                href="/shop"
                className="flex-1 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-mono-luxury uppercase text-xs font-bold text-center active:scale-95 transition-transform"
              >
                Shop Drops
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATELIER STORY CIRCLES */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)]">
          <span>Curated Nigerian Ateliers</span>
          <Link href="/shop" className="text-[10px] text-[var(--gold-accent)] flex items-center gap-0.5">
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {ateliers.map((atelier) => (
            <Link
              key={atelier.id}
              href={`/shop`}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className={`h-16 w-16 rounded-full p-0.5 bg-gradient-to-tr ${atelier.color} shadow-md group-active:scale-95 transition-transform`}>
                <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-[var(--bg-primary)]">
                  <Image
                    src={atelier.image}
                    alt={atelier.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-[10px] font-mono-luxury font-bold text-[var(--text-primary)] tracking-tight">
                {atelier.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. TRENDING DROPS REEL (HORIZONTAL SNAP CAROUSEL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)]">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Trending Drops</span>
          </div>
          <Link href="/shop" className="text-[10px] text-[var(--gold-accent)]">
            See All →
          </Link>
        </div>

        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x">
          {featuredDrops.map((product) => {
            const isWorn = activeOutfit[product.category]?.id === product.id;
            const fitResult = calculateFitMatch(bodyProfile, product);

            return (
              <div
                key={product.id}
                className="w-44 shrink-0 snap-start rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between shadow-sm"
              >
                <Link href={`/shop/${product.id}`} className="relative h-44 w-full bg-[var(--bg-secondary)] block">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-[8px] font-mono-luxury font-bold text-[var(--gold-accent)]">
                    {fitResult.matchScore}% Match
                  </span>
                </Link>

                <div className="p-2.5 space-y-1.5">
                  <span className="text-[8px] font-mono-luxury uppercase text-[var(--gold-accent)] block truncate font-bold">
                    {product.vendorName}
                  </span>
                  <h4 className="font-editorial text-xs font-bold text-[var(--text-primary)] truncate">
                    {product.name}
                  </h4>
                  <span className="font-editorial text-xs font-bold text-[var(--text-primary)] block">
                    ₦{product.price.toLocaleString()}
                  </span>

                  <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        if (isWorn) {
                          removeOutfitItem(product.category);
                        } else {
                          setOutfitItem(product);
                        }
                      }}
                      className={`py-1 rounded-full text-[8px] font-mono-luxury uppercase font-bold transition-all ${
                        isWorn
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                      }`}
                    >
                      {isWorn ? 'Worn' : 'Fit'}
                    </button>
                    <button
                      onClick={() => addToCart(product, fitResult.recommendedSize)}
                      className="py-1 rounded-full text-[8px] font-mono-luxury uppercase font-bold bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    >
                      + Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 2-TILE COLLECTION SHORTCUTS */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          href="/shop"
          className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 group active:scale-98 transition-all"
        >
          <div className="h-8 w-8 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center">
            <Scissors className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)]">
              Bespoke Native
            </h4>
            <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">
              Senator & Agbada →
            </span>
          </div>
        </Link>

        <Link
          href="/shop"
          className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 group active:scale-98 transition-all"
        >
          <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)]">
              Streetwear Drops
            </h4>
            <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">
              Hoodies & Jeans →
            </span>
          </div>
        </Link>
      </div>

    </div>
  );
}
