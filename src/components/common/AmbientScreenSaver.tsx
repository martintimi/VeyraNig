'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Gem, Footprints, Shirt, ArrowRight,
  Eye, ChevronRight, ChevronLeft,
  Compass, Play, Pause, X
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

interface EditorialSlide {
  id: string;
  title: string;
  categoryName: string;
  categoryIcon: 'gem' | 'footwear' | 'apparel';
  atelierName: string;
  price: number;
  imageUrl: string;
  description: string;
  location: string;
  linkUrl: string;
}

const CURATED_EDITORIAL_SLIDES: EditorialSlide[] = [
  {
    id: 'slide-jewelry-1',
    title: '18K Heavy Cuban Link & Iced Chronograph Watch',
    categoryName: 'Fine Jewelry & Timepieces',
    categoryIcon: 'gem',
    atelierName: 'Vee Collection Luxury',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=95',
    description: 'Double-micro gold plating, micro-pave zirconia crystals with hand-polished luxury weight.',
    location: 'Abeokuta, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-agbada-1',
    title: 'Midnight Obsidian Grand Agbada with Gold Placket',
    categoryName: 'Men & Unisex Native Grandeur',
    categoryIcon: 'apparel',
    atelierName: 'Sartorial Lagos',
    price: 98000,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
    description: 'Bespoke hand-tailored wool drape structured for royal weddings and high-profile ceremonies.',
    location: 'Victoria Island, Lagos',
    linkUrl: '/shop'
  },
  {
    id: 'slide-footwear-1',
    title: 'Handcrafted Kano Cowhide Dual-Strap Leather Slides',
    categoryName: 'Artisanal Footwear Atelier',
    categoryIcon: 'footwear',
    atelierName: 'Kano Artisan Footwear',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1600&q=95',
    description: 'Full-grain Nigerian cowhide with shock-absorbing cork footbed and weather-sealed edge coats.',
    location: 'Kano Municipal, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-boubou-1',
    title: 'Emerald Silk Organza Boubou with Adire Motifs',
    categoryName: "Women's Couture & Silks",
    categoryIcon: 'apparel',
    atelierName: 'Arike Brand Atelier',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=95',
    description: 'Fluid rich-auntie silhouette in premium lustrous silk organza with metallic accents.',
    location: 'Ikoyi, Lagos',
    linkUrl: '/shop'
  },
  {
    id: 'slide-streetwear-1',
    title: 'Heavyweight 480GSM TrapStar Graphic Drop Hoodie',
    categoryName: 'Urban Streetwear Drops',
    categoryIcon: 'apparel',
    atelierName: 'Moji Wears',
    price: 33000,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=95',
    description: 'Dense double-faced combed cotton fleece with puff screen-printed street typography.',
    location: 'Yaba, Lagos',
    linkUrl: '/shop'
  },
  {
    id: 'slide-heels-1',
    title: 'Champagne Metallic Fluted Mules & Square-Toe Heels',
    categoryName: "Women's Luxury Footwear",
    categoryIcon: 'footwear',
    atelierName: 'Veyra Runway Vault',
    price: 52000,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=95',
    description: 'Architectural fluted heel with padded memory-foam footbed and metallic champagne sheen.',
    location: 'Lagos, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-senator-1',
    title: 'Super 160s Sapphire Wool Senator Kaftan Set',
    categoryName: 'Bespoke Senator & Kaftans',
    categoryIcon: 'apparel',
    atelierName: 'Sartorial Lagos',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=95',
    description: 'Non-crease tropical Italian wool tailored with sleek geometric chest embroidery.',
    location: 'Abuja (FCT), Nigeria',
    linkUrl: '/shop'
  }
];

const INACTIVITY_TIMEOUT_MS = 60000; // 60s idle
const SLIDE_DURATION_MS = 6500; // 6.5s per slide

export default function AmbientScreenSaver() {
  const router = useRouter();
  const { allProducts } = useStore();
  const [isIdle, setIsIdle] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Combine curated high-res slides with live uploaded products from database
  const [slides, setSlides] = useState<EditorialSlide[]>(CURATED_EDITORIAL_SLIDES);

  // Helper to map product object to EditorialSlide
  const mapProductToSlide = useCallback((p: any, idx: number): EditorialSlide => {
    const rawCat = (p.category || 'tops').toLowerCase();
    let catIcon: 'gem' | 'footwear' | 'apparel' = 'apparel';
    let catName = 'Ready-to-Wear Fashion';

    if (rawCat === 'footwear' || rawCat.includes('shoe') || rawCat.includes('slide')) {
      catIcon = 'footwear';
      catName = 'Artisanal Footwear Atelier';
    } else if (rawCat === 'accessories' || rawCat.includes('jewel') || rawCat.includes('watch') || rawCat.includes('cap') || rawCat.includes('bag')) {
      catIcon = 'gem';
      catName = 'Fine Jewelry & Luxury Accessories';
    } else if (rawCat === 'outerwear' || rawCat.includes('agbada')) {
      catName = 'Men & Unisex Native Grandeur';
    } else if (rawCat === 'dresses' || rawCat.includes('boubou') || rawCat.includes('gown')) {
      catName = "Women's Couture & Silks";
    }

    const fallbackImg = CURATED_EDITORIAL_SLIDES[idx % CURATED_EDITORIAL_SLIDES.length].imageUrl;
    const finalImg = p.imageUrl || p.image_url || fallbackImg;
    const location = p.vendorLocation || (p.vendorCity && p.vendorState ? `${p.vendorCity}, ${p.vendorState}` : p.vendorCity || p.vendorState || 'Nigeria');

    return {
      id: `live-prod-${p.id || idx}`,
      title: p.name || 'Artisanal Drop Piece',
      categoryName: catName,
      categoryIcon: catIcon,
      atelierName: p.vendorName || p.vendor_name || 'Veyra Atelier Partner',
      price: Number(p.price) || 35000,
      imageUrl: finalImg,
      description: p.description || p.fitNotes || 'Handcrafted contemporary Nigerian luxury piece ready for immediate delivery.',
      location,
      linkUrl: `/shop/${p.id}`
    };
  }, []);

  // Fetch live products directly on mount to guarantee 100% real products
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products?limit=20');
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const liveSlides: EditorialSlide[] = data.products.map((p: any, idx: number) => mapProductToSlide(p, idx));
          // Put real live products first, followed by curated editorial drops as backdrops
          setSlides([...liveSlides, ...CURATED_EDITORIAL_SLIDES]);
        }
      } catch (err) {
        console.error('Failed to load live products for screensaver:', err);
      }
    }
    loadLiveProducts();
  }, [mapProductToSlide]);

  // Sync if allProducts in store updates
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const dynamicSlides: EditorialSlide[] = allProducts.slice(0, 15).map((p, idx) => mapProductToSlide(p, idx));
      setSlides([...dynamicSlides, ...CURATED_EDITORIAL_SLIDES]);
    }
  }, [allProducts, mapProductToSlide]);

  // Inactivity Detection Engine
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (isIdle) {
      setIsIdle(false);
    }

    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [isIdle]);

  useEffect(() => {
    const events = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart', 'touchmove', 'wheel'
    ];

    const handleUserActivity = () => {
      resetIdleTimer();
    };

    events.forEach(evt => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, INACTIVITY_TIMEOUT_MS);

    return () => {
      events.forEach(evt => {
        window.removeEventListener(evt, handleUserActivity);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Auto-advance slides when idle
  useEffect(() => {
    if (!isIdle || isPaused) return;

    const slideTimer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(slideTimer);
  }, [isIdle, isPaused, slides.length]);

  // Dismiss screensaver and optionally navigate to product
  const handleWakeUp = (url?: string) => {
    setIsIdle(false);
    resetIdleTimer();
    if (url) {
      router.push(url);
    }
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(prev => !prev);
  };

  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div
      role="dialog"
      aria-label="Veyra Ambient Fashion Screensaver"
      onClick={() => handleWakeUp()}
      className={`fixed inset-0 z-[999999] bg-[#070709] text-white select-none transition-all duration-700 ease-in-out ${
        isIdle
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 1. Ambient Background Layer: Soft ambient glow to avoid extreme crop */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={`bg-${slide.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt=""
              fill
              priority={idx === 0}
              className="object-cover object-center filter blur-3xl scale-110"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-transparent to-[#070709]/70" />
      </div>

      {/* 2. Main High-Definition Center Showcase */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 lg:p-16 gap-8">
        
        {/* Left: Fashion Editorial Information */}
        <div className="w-full md:max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 animate-fadeIn self-end md:self-center">
          
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/15 border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold tracking-wider backdrop-blur-md">
            {activeSlide.categoryIcon === 'gem' ? (
              <Gem className="h-3.5 w-3.5" />
            ) : activeSlide.categoryIcon === 'footwear' ? (
              <Footprints className="h-3.5 w-3.5" />
            ) : (
              <Shirt className="h-3.5 w-3.5" />
            )}
            <span>{activeSlide.categoryName}</span>
            <span className="text-white/30">•</span>
            <span className="text-white/80">{activeSlide.atelierName}</span>
          </div>

          {/* Slide Title */}
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-xl tracking-tight">
            {activeSlide.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/75 font-sans leading-relaxed line-clamp-3 drop-shadow">
            {activeSlide.description}
          </p>

          {/* Price & Location Details */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono-luxury pt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--gold-accent)]">
              ₦{activeSlide.price.toLocaleString()}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/70">
              {activeSlide.location}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-emerald-400 font-bold">
              ● Shipbubble Live Courier
            </span>
          </div>

          {/* Action & Controller Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleWakeUp(activeSlide.linkUrl);
              }}
              className="px-6 py-3.5 rounded-2xl bg-[var(--gold-accent)] hover:bg-[#e5c158] text-black font-mono-luxury text-xs uppercase font-bold tracking-wider transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>Shop This Piece</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleWakeUp('/shop');
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-mono-luxury text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="h-4 w-4 text-[var(--gold-accent)]" />
              <span>Explore All Drops</span>
            </button>

            {/* Slide Arrows */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                title="Previous Drop"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={togglePause}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-[var(--gold-accent)] transition-all cursor-pointer"
                title={isPaused ? "Play" : "Pause"}
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                title="Next Drop"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right: Crisp, Full Uncropped Fashion Showcase Frame */}
        <div className="w-full md:w-1/2 h-[45vh] sm:h-[60vh] md:h-[75vh] relative flex items-center justify-center pointer-events-none">
          {slides.map((slide, idx) => (
            <div
              key={`fg-${slide.id}`}
              className={`absolute inset-0 flex items-center justify-center md:justify-end transition-all duration-1000 ease-out ${
                idx === currentSlideIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="relative w-full h-full max-h-[72vh] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black/40 backdrop-blur-sm">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-contain md:object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
