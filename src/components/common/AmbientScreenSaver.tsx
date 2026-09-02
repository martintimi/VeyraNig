'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Gem, Footprints, Shirt, ArrowRight,
  Eye, Clock, Layers, ChevronRight, ChevronLeft,
  ShoppingBag, Compass, Play, Pause, X
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

interface EditorialSlide {
  id: string;
  title: string;
  categoryName: string;
  categoryIcon: 'gem' | 'footwear' | 'apparel' | 'boutique';
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
    title: 'Imperial 18K Gold Cuban Chain & Diamond Watch Bezel',
    categoryName: 'Fine Jewelry & Timepieces',
    categoryIcon: 'gem',
    atelierName: 'Vee Collection Luxury',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=85',
    description: 'Solid brass core with double-micro gold plating, micro-pave zirconia accents and heavy curb link clasp.',
    location: 'Abeokuta & Lagos, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-agbada-1',
    title: 'Midnight Obsidian Heritage Agbada with Gold Filigree',
    categoryName: 'Men & Unisex Native Grandeur',
    categoryIcon: 'apparel',
    atelierName: 'Sartorial Lagos',
    price: 98000,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85',
    description: 'Precision hand-loomed wool blend structured for royal entrances and distinguished ceremonies.',
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
    imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1800&q=85',
    description: 'Ergonomic cork-cushion footbed wrapped in supple top-grain Nigerian hide for all-day comfort.',
    location: 'Kano Municipal, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-boubou-1',
    title: 'Silk Organza Boubou Gown with Hand-Painted Adire Accents',
    categoryName: "Women's Couture & Silks",
    categoryIcon: 'apparel',
    atelierName: 'Arike Brand Atelier',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1800&q=85',
    description: 'Bespoke drape crafted from luminous dyed silk organza with rich auntie fluid silhouette.',
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
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1800&q=85',
    description: 'Ultra-dense combed cotton with puff-printed gothic typography and brushed thermal fleece lining.',
    location: 'Yaba, Lagos',
    linkUrl: '/shop'
  },
  {
    id: 'slide-heels-1',
    title: 'Sculptural Strappy Square-Toe Champagne Mules',
    categoryName: "Women's Luxury Footwear",
    categoryIcon: 'footwear',
    atelierName: 'Veyra Runway Vault',
    price: 52000,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1800&q=85',
    description: 'Architectural fluted heel with padded memory-foam insole and metallic champagne sheen.',
    location: 'Lagos, Nigeria',
    linkUrl: '/shop'
  },
  {
    id: 'slide-senator-1',
    title: 'Super 160s Sapphire Wool Senator Kaftan with Geometric Chest',
    categoryName: 'Bespoke Senator & Kaftans',
    categoryIcon: 'apparel',
    atelierName: 'Sartorial Lagos',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=85',
    description: 'Engineered with non-crease tropical wool and concealed snap placket for clean Nigerian luxury.',
    location: 'Abuja (FCT), Nigeria',
    linkUrl: '/shop'
  }
];

const INACTIVITY_TIMEOUT_MS = 60000; // 60 seconds of complete idle
const SLIDE_DURATION_MS = 6000; // 6 seconds per slide

export default function AmbientScreenSaver() {
  const router = useRouter();
  const { allProducts } = useStore();
  const [isIdle, setIsIdle] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);

  // Combine curated high-res slides with live uploaded products if available
  const [slides, setSlides] = useState<EditorialSlide[]>(CURATED_EDITORIAL_SLIDES);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const dynamicSlides: EditorialSlide[] = allProducts.slice(0, 8).map((p, idx) => ({
        id: `prod-slide-${p.id || idx}`,
        title: p.name,
        categoryName: p.category === 'footwear' ? 'Footwear & Slides' : p.category === 'accessories' ? 'Jewelry & Accessories' : 'Ready-to-Wear Fashion',
        categoryIcon: p.category === 'footwear' ? 'footwear' : p.category === 'accessories' ? 'gem' : 'apparel',
        atelierName: p.vendorName || 'Veyra Atelier Partner',
        price: Number(p.price) || 45000,
        imageUrl: p.imageUrl || CURATED_EDITORIAL_SLIDES[idx % CURATED_EDITORIAL_SLIDES.length].imageUrl,
        description: p.description || p.fitNotes || 'Handcrafted contemporary Nigerian design available for immediate delivery.',
        location: p.vendorLocation || p.vendorCity ? `${p.vendorCity || ''}, ${p.vendorState || ''}` : 'Nigeria',
        linkUrl: `/shop/${p.id}`
      }));
      setSlides([...CURATED_EDITORIAL_SLIDES, ...dynamicSlides]);
    }
  }, [allProducts]);

  // Live Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      className={`fixed inset-0 z-[999999] bg-black text-white select-none transition-all duration-1000 ease-in-out ${
        isIdle
          ? 'opacity-100 pointer-events-auto backdrop-blur-3xl'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background Cinematic Slide Image with Slow Ken Burns Pan */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === currentSlideIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`relative w-full h-full transform transition-transform duration-7000 ease-out ${
              idx === currentSlideIndex ? 'scale-105' : 'scale-100'
            }`}>
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center filter brightness-[0.75]"
                sizes="100vw"
              />
            </div>
          </div>
        ))}

        {/* Ambient Luxury Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        
        {/* ======================================================== */}
        {/* 1. TOP BAR: Veyra Cinema Branding, Time & Multi-bar progress */}
        {/* ======================================================== */}
        <div className="space-y-4">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/veyra-emblem.png"
                alt="Veyra"
                width={36}
                height={36}
                className="h-9 w-9 object-contain drop-shadow-md animate-pulse"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-lg sm:text-xl font-bold tracking-widest text-[var(--gold-accent)] uppercase">
                    Veyra Lookbook Cinema
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/80 text-white text-[9px] font-mono-luxury font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <span className="text-[10px] font-mono-luxury text-white/60 tracking-wider block">
                  Ambient Fashion Showcase
                </span>
              </div>
            </div>

            {/* Live Time & Date */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-mono-luxury font-bold text-white tracking-widest">
                  {currentTime}
                </span>
                <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] uppercase">
                  {currentDate} • Lagos GMT+1
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWakeUp();
                }}
                className="p-2 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-xs font-mono-luxury uppercase font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
                title="Exit screensaver"
              >
                <span>Resume</span>
                <X className="h-4 w-4 text-[var(--gold-accent)]" />
              </button>
            </div>
          </div>

          {/* Netflix / Stories Style Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(idx);
                }}
              >
                <div
                  className={`h-full bg-[var(--gold-accent)] transition-all duration-300 ${
                    idx < currentSlideIndex
                      ? 'w-full'
                      : idx === currentSlideIndex
                      ? 'w-full animate-progress'
                      : 'w-0'
                  }`}
                  style={{
                    animationDuration: `${SLIDE_DURATION_MS}ms`,
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. BOTTOM HERO: Slide Details, Editorial Serif & CTA Buttons */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Main Editorial Text Details */}
          <div className="lg:col-span-8 space-y-4 max-w-3xl animate-fadeIn">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/20 border border-[var(--gold-accent)]/40 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold tracking-wider backdrop-blur-md">
              {activeSlide.categoryIcon === 'gem' ? (
                <Gem className="h-3.5 w-3.5" />
              ) : activeSlide.categoryIcon === 'footwear' ? (
                <Footprints className="h-3.5 w-3.5" />
              ) : (
                <Shirt className="h-3.5 w-3.5" />
              )}
              <span>{activeSlide.categoryName}</span>
              <span className="text-white/40">•</span>
              <span>{activeSlide.atelierName}</span>
            </div>

            {/* Slide Title */}
            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-none drop-shadow-lg tracking-tight">
              {activeSlide.title}
            </h1>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-white/80 max-w-2xl font-sans leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
              {activeSlide.description}
            </p>

            {/* Price & Atelier Origin */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-luxury pt-1">
              <span className="text-xl sm:text-2xl font-bold text-[var(--gold-accent)]">
                ₦{activeSlide.price.toLocaleString()} NGN
              </span>
              <span className="text-white/40">|</span>
              <span className="text-white/70">
                Atelier Location: <strong className="text-white">{activeSlide.location}</strong>
              </span>
              <span className="text-white/40">|</span>
              <span className="text-emerald-400 font-bold">
                ● Ready for Dispatch via Shipbubble
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWakeUp(activeSlide.linkUrl);
                }}
                className="px-6 py-3.5 rounded-2xl bg-[var(--gold-accent)] hover:bg-[#e5c158] text-black font-mono-luxury text-xs uppercase font-bold tracking-wider transition-all transform hover:scale-105 shadow-xl flex items-center gap-2.5 cursor-pointer"
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
                <span>Explore Full Lookbook</span>
              </button>
            </div>
          </div>

          {/* Right Controller & Ambient Notice */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between gap-4">
            
            {/* Interactive Carousel Controllers */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all cursor-pointer"
                title="Previous Drop"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={togglePause}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-[var(--gold-accent)] transition-all cursor-pointer"
                title={isPaused ? "Play" : "Pause"}
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all cursor-pointer"
                title="Next Drop"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Interaction Wakeup Prompt */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-lg text-left space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono-luxury text-[var(--gold-accent)] uppercase font-bold">
                <span className="h-2 w-2 rounded-full bg-[var(--gold-accent)] animate-ping" />
                <span>Ambient Theater Active</span>
              </div>
              <p className="text-[11px] font-mono-luxury text-white/70">
                Move mouse, scroll, or tap anywhere to return to your styling session.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
