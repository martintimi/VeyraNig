'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';

interface AtelierData {
  id: string;
  slug: string;
  name: string;
  location: string;
  focus: string;
  desc: string;
  images: string[];
  tag: string;
  heroPieces: string;
  rating: string;
}

const ateliers: AtelierData[] = [
  {
    id: 'sartorial-lagos',
    slug: 'sartorial-lagos',
    name: 'Sartorial Lagos',
    location: 'Victoria Island, Lagos',
    focus: 'Bespoke Senator Suits & Ceremonial Agbada',
    desc: 'Renowned for razor-sharp geometric chest embroidery, structured shoulder lines, and fine Italian merino wool native cuts.',
    images: [
      '/images/products/BlackSenator.jpg',
      '/images/products/BlueSenator.png',
      '/images/products/GreySenator.jpg',
      '/images/products/BlackAgbada.jpg'
    ],
    tag: 'Bespoke Tailoring',
    heroPieces: 'Senator Sets · Agbada Robes · Velvet Fila',
    rating: '4.9 ★ (156 Orders)'
  },
  {
    id: 'street-souk',
    slug: 'street-souk',
    name: 'Street Souk Co.',
    location: 'Lekki Phase 1, Lagos',
    focus: 'Afro-Streetwear & 450gsm Heavyweight Fleece',
    desc: 'Lagos youth culture engineered into oversized dropped-shoulder hoodies, boxy graphic tees, and cyber streetwear aesthetics.',
    images: [
      '/images/products/BlackTrapStarHoodie.jpg',
      '/images/products/LVhoodie.jpg',
      '/images/products/BlueAndWhiteLosAngelisHoddie.jpg',
      '/images/products/BrownHoodie.jpg'
    ],
    tag: 'Ready-to-Wear Street',
    heroPieces: 'Trapstar Hoodies · Boxy Tees · Aqua Slides',
    rating: '4.9 ★ (210 Drops)'
  },
  {
    id: 'yaba-denim',
    slug: 'yaba-denim',
    name: 'Yaba Denim Works',
    location: 'Yaba, Lagos',
    focus: 'Raw 14oz Selvedge Denim & Tactical Cargos',
    desc: 'Durable wide-leg denim, straight-cut vintage jeans, and articulated utility trousers tailored for the Nigerian urban rhythm.',
    images: [
      '/images/products/BaggyJean.jpg',
      '/images/products/MenVintageCasualJean.jpg',
      '/images/products/GreyCargoPantsHollister.jpg',
      '/images/products/TeryWidePant.jpg'
    ],
    tag: 'Ready-to-Wear Denim',
    heroPieces: 'Wide-Leg Baggy Denim · Multi-Pocket Cargos',
    rating: '4.8 ★ (145 Orders)'
  },
  {
    id: 'kano-leather',
    slug: 'kano-leather',
    name: 'Kano Artisan Footwear',
    location: 'Kano & Lagos',
    focus: 'Handcrafted Full-Grain Calf Leather Slides & Shoes',
    desc: 'Century-old Northern tannery heritage crafting anatomical leather slides, horsebit mules, and Goodyear welted Oxfords.',
    images: [
      '/images/products/UnisexSlides.jpg',
      '/images/products/AddidasShoeUnisex.jpg',
      '/images/products/AdiletteAquaSlides.jpg',
      '/images/products/BlackSmartShoes.jpg'
    ],
    tag: 'Handmade Leathercraft',
    heroPieces: 'Calf Leather Slides · Suede Mules · Oxfords',
    rating: '5.0 ★ (182 Pairs)'
  }
];

function AtelierCardSlider({ atelier }: { atelier: AtelierData }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide animation every 3 seconds (pauses on user hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % atelier.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [atelier.images.length, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? atelier.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % atelier.images.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl surface-card overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-[var(--gold-accent)]/50 transition-all duration-500 border border-[var(--border-subtle)]"
    >
      {/* Animated Sliding Image Container */}
      <Link href={`/brand/${atelier.slug}`} className="relative h-72 w-full bg-[var(--bg-secondary)] overflow-hidden block">
        {atelier.images.map((imgSrc, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              idx === currentIdx
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${atelier.name} piece ${idx + 1}`}
              fill
              unoptimized
              className="object-cover object-center brightness-95 group-hover:brightness-100 transition-all"
            />
          </div>
        ))}

        {/* Top Origin Tag */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-luxury uppercase tracking-wider text-white font-bold border border-white/10">
            {atelier.tag}
          </span>
        </div>

        {/* Location Pill */}
        <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-luxury text-[var(--gold-accent)] border border-white/10 font-semibold">
          <MapPin className="h-3 w-3" />
          <span>{atelier.location}</span>
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {atelier.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'w-4 bg-[var(--gold-accent)]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Interactive Hover Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </Link>

      {/* Atelier Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Link href={`/brand/${atelier.slug}`} className="hover:text-[var(--gold-accent)] transition-colors">
              <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {atelier.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed line-clamp-2">
            {atelier.desc}
          </p>

          <div className="pt-2">
            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider block">
              Signature Pieces:
            </span>
            <span className="text-xs font-mono-luxury text-[var(--text-primary)] font-bold">
              {atelier.heroPieces}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-[11px] font-mono-luxury text-emerald-500 font-bold">
            {atelier.rating}
          </span>

          <Link
            href={`/brand/${atelier.slug}`}
            className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Shop Atelier</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CuratedAteliers() {
  return (
    <section className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE DESIGN HOUSES</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
              Curated Nigerian Ateliers
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              Explore verified bespoke tailors and streetwear creators across Lagos and Nigeria.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all self-start md:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Atelier Cards Grid with Auto-Sliding Product Showcases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ateliers.map((atelier) => (
            <AtelierCardSlider key={atelier.id} atelier={atelier} />
          ))}
        </div>

      </div>
    </section>
  );
}
