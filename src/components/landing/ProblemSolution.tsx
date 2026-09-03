'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Sparkles, Flame, Layers, Check, ArrowUpRight, Crown } from 'lucide-react';

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);

  // Smooth hardware-accelerated scroll parallax using Framer Motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Dynamic parallax transformations for the flanking models
  const leftY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rightY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const leftScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.95]);
  const rightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.92]);
  const modelOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 0.85, 0.85, 0.35]);

  // 4 Culturally authentic, unisex Nigerian luxury pillars
  const pillars = [
    {
      icon: Crown,
      title: 'Men & Women Native Couture',
      desc: 'Bespoke Senator suits, ceremonial Agbada robes, and draped contemporary womenswear tailored to your exact twin measurements by master Nigerian designers.',
      tag: 'Bespoke Unisex Tailoring',
      sub: 'Senator · Agbada · Kaftans',
      num: '01'
    },
    {
      icon: Flame,
      title: 'Lagos Streetwear Drops',
      desc: 'Limited-edition 450gsm heavyweight hoodies, boxy luxury graphic tees, and wide-leg selvedge denim straight from Nigeria’s hottest independent street houses.',
      tag: 'Ready-To-Wear Drops',
      sub: 'Street Souk Editions',
      num: '02'
    },
    {
      icon: Layers,
      title: 'One Cart, Any Nigerian Brand',
      desc: 'Combine custom native tailoring from Sartorial Lagos with street drops from Street Souk in one seamless checkout. Dispatched together in one luxury box.',
      tag: 'Consolidated Logistics',
      sub: 'Lagos to 36 States',
      num: '03'
    },
    {
      icon: ShieldCheck,
      title: 'Secured Escrow Guarantee',
      desc: 'Zero risk. Your payment stays locked in Veyra Escrow and is only released to the designer after your clothes arrive and you confirm the fit.',
      tag: '100% Escrow Protected',
      sub: 'Buyer Protection',
      num: '04'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-28 lg:py-36 border-b border-[var(--border-subtle)] bg-[#FAF9F5] dark:bg-[var(--bg-primary)] overflow-hidden transition-colors"
    >
      {/* ======================================================== */}
      {/* 1. LEFT FLANK: BLACK MALE EDITORIAL MODEL (PARALLAX)    */}
      {/* ======================================================== */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[28%] lg:w-[32%] xl:w-[35%] pointer-events-none overflow-hidden select-none z-0 hidden md:block"
        style={{
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
        }}
      >
        <motion.div 
          style={{
            y: leftY,
            scale: leftScale,
            opacity: modelOpacity
          }}
          className="relative w-full h-[140%] -top-[20%] will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
            alt="Nigerian High-Fashion Menswear Editorial"
            fill
            unoptimized
            priority
            className="object-cover object-top filter grayscale contrast-[1.12] brightness-[0.98] dark:brightness-[0.8] transition-all"
          />
          {/* Subtle atmospheric vignette tailored for light & dark mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF9F5]/30 dark:via-[var(--bg-primary)]/40 to-[#FAF9F5] dark:to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5] dark:from-[var(--bg-primary)] via-transparent to-[#FAF9F5]/80 dark:to-[var(--bg-primary)]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5] dark:from-[var(--bg-primary)] via-transparent to-[#FAF9F5]/90 dark:to-[var(--bg-primary)]/90" />
        </motion.div>

        {/* Editorial Subtitle Label */}
        <div className="absolute bottom-10 left-6 z-10 hidden xl:flex items-center gap-3 rotate-[-90deg] origin-left text-[9px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
          <span>NIGERIAN MENSWEAR</span>
          <span className="h-px w-8 bg-[var(--gold-accent)]" />
          <span>FIG. 01 BESPOKE</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT FLANK: BLACK FEMALE EDITORIAL MODEL (PARALLAX) */}
      {/* ======================================================== */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[28%] lg:w-[32%] xl:w-[35%] pointer-events-none overflow-hidden select-none z-0 hidden md:block"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
        }}
      >
        <motion.div 
          style={{
            y: rightY,
            scale: rightScale,
            opacity: modelOpacity
          }}
          className="relative w-full h-[140%] -top-[20%] will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
            alt="Nigerian High-Fashion Womenswear Editorial"
            fill
            unoptimized
            priority
            className="object-cover object-top filter grayscale contrast-[1.12] brightness-[0.98] dark:brightness-[0.8] transition-all"
          />
          {/* Subtle atmospheric vignette tailored for light & dark mode */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FAF9F5]/30 dark:via-[var(--bg-primary)]/40 to-[#FAF9F5] dark:to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5] dark:from-[var(--bg-primary)] via-transparent to-[#FAF9F5]/80 dark:to-[var(--bg-primary)]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5] dark:from-[var(--bg-primary)] via-transparent to-[#FAF9F5]/90 dark:to-[var(--bg-primary)]/90" />
        </motion.div>

        {/* Editorial Subtitle Label */}
        <div className="absolute top-28 right-6 z-10 hidden xl:flex items-center gap-3 rotate-[90deg] origin-right text-[9px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
          <span>NIGERIAN WOMENSWEAR</span>
          <span className="h-px w-8 bg-[var(--gold-accent)]" />
          <span>FIG. 02 COUTURE</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CENTER AMBIENT LUXURY GLOW                            */}
      {/* ======================================================== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--gold-accent)]/8 dark:bg-[var(--gold-accent)]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ======================================================== */}
      {/* 4. MAIN CONTENT CONTAINER                                */}
      {/* ======================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-[0.2em] font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE VEYRA ADVANTAGE · UNISEX FASHION</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)] tracking-tight leading-[1.15]">
            A New Standard for <span className="italic font-light text-[var(--gold-accent)]">Nigerian</span> Fashion
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto">
            Discover authentic Nigerian native couture, bespoke tailoring, and Lagos afro-streetwear drops with unified checkout and guaranteed fit protection.
          </p>
        </div>

        {/* 4 Solid High-Contrast Luxury Cards (Crisp on Light & Dark) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#101013]/90 backdrop-blur-xl border border-black/8 dark:border-white/10 hover:border-[var(--gold-accent)]/70 flex flex-col justify-between space-y-7 shadow-[0_12px_35px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(216,179,87,0.18)] hover:-translate-y-2 transition-all duration-500 group cursor-default"
              >
                {/* Top Subtle Hover Accent Bar */}
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)]/0 group-hover:via-[var(--gold-accent)]/90 to-transparent transition-all duration-500" />

                <div className="space-y-4">
                  {/* Top Bar: Icon Monogram + Pill Number */}
                  <div className="flex items-center justify-between">
                    <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-[var(--gold-subtle)] to-[var(--gold-accent)]/20 border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                      <Icon className="h-6 w-6 stroke-[1.8]" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] group-hover:border-[var(--gold-accent)]/40 transition-colors">
                      <span className="text-[10px] font-mono-luxury font-bold tracking-widest text-[var(--gold-accent)]">
                        {item.num}
                      </span>
                    </div>
                  </div>

                  {/* Title & Micro Divider */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold block">
                      {item.sub}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors duration-300 leading-snug">
                      {item.title}
                    </h3>
                    <div className="h-0.5 w-8 bg-[var(--gold-accent)]/30 group-hover:w-14 group-hover:bg-[var(--gold-accent)] transition-all duration-500 rounded-full" />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Meta Badge */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-luxury">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
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

        {/* Bottom Luxury Guarantee Banner */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 dark:bg-[var(--bg-surface)]/70 border border-black/8 dark:border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-secondary)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Escrow Guarantee: 100% money-back security across all 36 Nigerian states</span>
          </div>
        </div>

      </div>
    </section>
  );
}
