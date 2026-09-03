'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShieldCheck, Truck, Sparkles, Layers, Scissors, Check, ArrowUpRight } from 'lucide-react';

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position for dynamic parallax reveal of flanking models
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Progress: 0 when top enters viewport, 1 when bottom leaves viewport
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const standards = [
    {
      icon: Scissors,
      title: 'Bespoke Measurement Calibration',
      desc: 'Our sizing algorithm translates your height, weight, and shoulder specs into exact tailoring patterns across every partner designer brand.',
      tag: 'Zero Sizing Error',
      num: '01',
      accent: 'merino wool tailoring'
    },
    {
      icon: Layers,
      title: 'Cross-Brand Wardrobe Styling',
      desc: 'Assemble complete luxury looks combining tailored Senator kaftans, urban streetwear drops, handcrafted leather slides, and fine jewelry.',
      tag: 'Unified Try-On',
      num: '02',
      accent: 'pan-african curation'
    },
    {
      icon: Truck,
      title: 'Consolidated White-Glove Logistics',
      desc: 'All pieces from distinct designers are quality-checked and dispatched directly to your doorstep in a single luxury box.',
      tag: 'Doorstep Delivery',
      num: '03',
      accent: 'nationwide tracking'
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Fit Protection',
      desc: 'Shop with absolute peace of mind. If any piece does not fit your body twin accurately, enjoy complimentary 7-day alterations or exchange.',
      tag: '100% Fit Guarantee',
      num: '04',
      accent: 'escrow protected'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden transition-colors"
    >
      {/* ======================================================== */}
      {/* 1. LEFT FLANKING EDITORIAL MODEL (SCROLL-REVEAL PARALLAX) */}
      {/* ======================================================== */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[26%] lg:w-[32%] xl:w-[35%] pointer-events-none overflow-hidden select-none z-0 hidden md:block"
        style={{
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div 
          className="relative w-full h-[135%] -top-[15%] will-change-transform transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 90 - 20}px) scale(${0.96 + scrollProgress * 0.08})`,
            opacity: Math.min(0.9, 0.35 + scrollProgress * 0.55),
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400&auto=format&fit=crop"
            alt="Veyra Nigerian Luxury Editorial Left"
            fill
            unoptimized
            priority
            className="object-cover object-top filter contrast-[1.08] saturate-[1.1] brightness-[0.92] dark:brightness-[0.85]"
          />
          {/* Subtle gradient vignette to blend softly into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/90" />
        </div>

        {/* Vertical Editorial Caption Line */}
        <div className="absolute bottom-12 left-6 z-10 hidden xl:flex items-center gap-3 rotate-[-90deg] origin-left text-[9px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
          <span>HAUTE COUTURE SPECIFICATION</span>
          <span className="h-px w-10 bg-[var(--gold-accent)]" />
          <span>EDITORIAL FIG. 01</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT FLANKING EDITORIAL MODEL (SCROLL-REVEAL PARALLAX) */}
      {/* ======================================================== */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[26%] lg:w-[32%] xl:w-[35%] pointer-events-none overflow-hidden select-none z-0 hidden md:block"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div 
          className="relative w-full h-[135%] -top-[15%] will-change-transform transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -80}px) scale(${0.96 + scrollProgress * 0.08})`,
            opacity: Math.min(0.9, 0.35 + scrollProgress * 0.55),
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop"
            alt="Veyra Nigerian Luxury Editorial Right"
            fill
            unoptimized
            priority
            className="object-cover object-top filter contrast-[1.08] saturate-[1.1] brightness-[0.92] dark:brightness-[0.85]"
          />
          {/* Subtle gradient vignette to blend softly into background */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/90" />
        </div>

        {/* Vertical Editorial Caption Line */}
        <div className="absolute top-28 right-6 z-10 hidden xl:flex items-center gap-3 rotate-[90deg] origin-right text-[9px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
          <span>MASTER CRAFTSMANSHIP</span>
          <span className="h-px w-10 bg-[var(--gold-accent)]" />
          <span>EDITORIAL FIG. 02</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. AMBIENT LUXURY GLOW SPOTLIGHT (CENTER STAGE) */}
      {/* ======================================================== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--gold-accent)]/8 dark:bg-[var(--gold-accent)]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ======================================================== */}
      {/* 4. MAIN CONTENT CONTAINER */}
      {/* ======================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-[0.2em] font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE VEYRA ADVANTAGE</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)] tracking-tight leading-[1.15]">
            A New Standard for <span className="italic font-light text-[var(--gold-accent)]">Nigerian</span> Fashion
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto">
            Engineered to eliminate sizing uncertainty and unite Nigeria&apos;s finest independent fashion houses into one seamless virtual dressing room.
          </p>
        </div>

        {/* 4 Ultra-Luxury Frosted Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {standards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl backdrop-blur-2xl bg-[var(--bg-surface)]/85 dark:bg-[#0c0c0e]/85 border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/60 flex flex-col justify-between space-y-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(216,179,87,0.18)] hover:-translate-y-2.5 transition-all duration-500 group cursor-default"
              >
                {/* Top Subtle Hover Accent Light */}
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)]/0 group-hover:via-[var(--gold-accent)]/80 to-transparent transition-all duration-500" />

                <div className="space-y-5">
                  {/* Top Bar: Icon Monogram + Pill Number */}
                  <div className="flex items-center justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--gold-subtle)] to-[var(--gold-accent)]/20 border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                      <Icon className="h-6 w-6 stroke-[1.8]" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] group-hover:border-[var(--gold-accent)]/40 transition-colors">
                      <span className="text-[10px] font-mono-luxury font-bold tracking-widest text-[var(--gold-accent)]">
                        {item.num}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2 pt-1">
                    <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors duration-300 leading-snug">
                      {item.title}
                    </h3>
                    <div className="h-0.5 w-8 bg-[var(--gold-accent)]/30 group-hover:w-16 group-hover:bg-[var(--gold-accent)] transition-all duration-500 rounded-full" />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Meta Badge */}
                <div className="pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-luxury">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    <span>{item.tag}</span>
                  </span>

                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-0.5">
                    <span>Protocol</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Luxury Guarantee Bar */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-secondary)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Escrow Settlement Guarantee: Funds locked until you try on & confirm perfection</span>
          </div>
        </div>

      </div>
    </section>
  );
}
