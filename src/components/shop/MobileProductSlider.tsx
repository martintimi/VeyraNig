'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';

interface MediaSlide {
  type: 'image' | 'video';
  url: string;
  colorName?: string;
  colorHex?: string;
}

interface MobileProductSliderProps {
  product: any;
  priority?: boolean;
  aspectRatioClass?: string;
  idx?: number;
  children?: React.ReactNode;
}

export default function MobileProductSlider({
  product,
  priority = false,
  aspectRatioClass = 'aspect-[4/5]',
  idx = 0,
  children,
}: MobileProductSliderProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasNudged, setHasNudged] = useState(false);
  const [hasManualSwiped, setHasManualSwiped] = useState(false);

  // Touch tracking to distinguish horizontal swipe vs intentional click
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDragging = useRef(false);

  // Gather all unique images & video for this product
  const slides = useMemo<MediaSlide[]>(() => {
    const list: MediaSlide[] = [];
    const seenUrls = new Set<string>();

    const addImage = (url: string, colorName?: string, colorHex?: string) => {
      if (!url || seenUrls.has(url)) return;
      seenUrls.add(url);
      list.push({ type: 'image', url, colorName, colorHex });
    };

    // 1. Cover / Primary Image
    if (product.imageUrl) {
      const matchColor = Array.isArray(product.colors)
        ? product.colors.find((c: any) => c?.imageUrl === product.imageUrl)
        : undefined;
      addImage(product.imageUrl, matchColor?.name, matchColor?.hex);
    }

    // 2. Gallery images from product.images
    if (Array.isArray(product.images)) {
      product.images.forEach((item: any) => {
        const url = typeof item === 'string' ? item : item?.url;
        const colorName = typeof item === 'object' ? item?.colorName : undefined;
        const colorHex = typeof item === 'object' ? item?.colorHex : undefined;
        if (url) addImage(url, colorName, colorHex);
      });
    }

    // 3. Colorways with linked images
    if (Array.isArray(product.colors)) {
      product.colors.forEach((c: any) => {
        if (c && typeof c === 'object' && c.imageUrl) {
          addImage(c.imageUrl, c.name, c.hex);
        }
      });
    }

    // 4. Catwalk micro-video if present
    if (product.videoUrl) {
      list.push({ type: 'video', url: product.videoUrl });
    }

    return list.length > 0 ? list : [{ type: 'image', url: '/images/products/BlackTrapStarHoodie.jpg' }];
  }, [product.imageUrl, product.images, product.colors, product.videoUrl]);

  const hasMultiple = slides.length > 1;

  // Handle slide index update on horizontal scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const currentIdx = Math.round(el.scrollLeft / el.clientWidth);
    if (currentIdx !== activeIndex && currentIdx >= 0 && currentIdx < slides.length) {
      setActiveIndex(currentIdx);
    }
  }, [activeIndex, slides.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartPos.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touchStartPos.current.x);
    const dy = Math.abs(t.clientY - touchStartPos.current.y);

    if (dx > 8) {
      isDragging.current = true;
      hasInteracted.current = true;
      setHasManualSwiped(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const dt = Date.now() - touchStartPos.current.time;

    // If tap was quick and not dragging, treat as click to navigate
    if (!isDragging.current && dt < 400) {
      router.push(`/shop/${product.id}`);
    }

    touchStartPos.current = null;
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/shop/${product.id}`);
  };

  // ASOS Peek / Nudge Animation:
  // When card enters the viewport, after a slight delay, peek ~38px to the right and slide back
  // to visually demonstrate to the user that they can slide through multiple angles/colors!
  useEffect(() => {
    if (!hasMultiple || hasNudged) return;

    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          observer.disconnect();

          // Wait 450ms after entering view before showing the subtle peek
          timeoutId = setTimeout(() => {
            const scroller = scrollRef.current;
            if (!scroller || hasInteracted.current) return;

            // Peek 38px to reveal the next photo/colorway
            scroller.scrollTo({ left: 38, behavior: 'smooth' });

            // Settle back after 350ms
            timeoutId = setTimeout(() => {
              if (scroller && !hasInteracted.current) {
                scroller.scrollTo({ left: 0, behavior: 'smooth' });
              }
              setHasNudged(true);
            }, 350);
          }, 450 + (idx % 2) * 150);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [hasMultiple, hasNudged, idx]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[var(--bg-secondary)] overflow-hidden rounded-xl border border-[var(--border-subtle)] ${aspectRatioClass} select-none group`}
    >
      {/* Horizontal Snap Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x cursor-pointer"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {slides.map((media, sIdx) => {
          return (
            <div
              key={`${media.url}-${sIdx}`}
              className="relative w-full h-full flex-shrink-0 snap-start select-none overflow-hidden"
              style={{ minWidth: '100%', width: '100%' }}
            >
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={media.url}
                  alt={`${product.name} - view ${sIdx + 1}`}
                  fill
                  unoptimized
                  priority={priority && sIdx === 0}
                  loading={priority && sIdx === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Swipe Cue Nudge Pill (Fades once user manually swipes) */}
      {hasMultiple && !hasManualSwiped && activeIndex === 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[9px] font-mono-luxury text-white font-bold flex items-center gap-1.5 shadow-lg pointer-events-none animate-fadeIn transition-opacity">
          <span className="text-[var(--gold-accent)] font-bold tracking-tighter text-[10px] animate-pulse">‹ ›</span>
          <span>Slide to view ({slides.length})</span>
        </div>
      )}

      {/* Active Colorway Pill (Shows when slide belongs to a specific color) */}
      {slides[activeIndex]?.colorName && (
        <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono-luxury font-bold text-white flex items-center gap-1.5 shadow-md pointer-events-none animate-fadeIn">
          <span
            className="h-2 w-2 rounded-full border border-white/40 shrink-0"
            style={{ backgroundColor: slides[activeIndex]?.colorHex || '#111111' }}
          />
          <span className="truncate max-w-[80px]">{slides[activeIndex]?.colorName}</span>
        </div>
      )}

      {/* Catwalk Badge */}
      {slides[activeIndex]?.type === 'video' && (
        <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono-luxury font-bold text-emerald-400 flex items-center gap-1 shadow-md pointer-events-none">
          <Video className="h-2.5 w-2.5" />
          <span>Catwalk Video</span>
        </div>
      )}

      {/* ASOS Slide Dot Indicators */}
      {hasMultiple && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 pointer-events-none z-10">
          {slides.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`transition-all duration-300 rounded-full shadow-sm ${
                dotIdx === activeIndex
                  ? 'w-3.5 h-1 bg-white ring-1 ring-black/20'
                  : 'w-1 h-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Passed Overlays (Discount badge, wishlist heart, etc.) */}
      {children}
    </div>
  );
}
