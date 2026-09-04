'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Sparkles, Ruler, ShieldCheck, ArrowRight, Check, Eye } from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

interface LookPreset {
  id: string;
  name: string;
  category: string;
  image: string;
  fitScore: number;
  pieces: { name: string; brand: string; price: number }[];
  description: string;
}

const curatedLooks: LookPreset[] = [
  {
    id: 'ceremonial',
    name: 'Ceremonial Royalty',
    category: 'Native & Agbada',
    image: '/images/products/BlackAgbada.jpg',
    fitScore: 99,
    description: '3-Piece architectural royal Agbada paired with handcrafted velvet accents.',
    pieces: [
      { name: 'Ceremonial Agbada Ensemble', brand: 'Atafo Bespoke', price: 185000 },
      { name: 'Handcrafted Velvet Fila', brand: 'Kano Royal Crafters', price: 25000 }
    ]
  },
  {
    id: 'streetwear',
    name: 'Cyber Streetwear Drip',
    category: 'Contemporary Streetwear',
    image: '/images/products/BlackTrapStarHoodie.jpg',
    fitScore: 97,
    description: '480 GSM heavyweight oversized fleece hoodie styled with dual-strap slides.',
    pieces: [
      { name: 'Heavyweight Fleece Hoodie', brand: 'Ashluxe Archive', price: 65000 },
      { name: 'Artisanal Comfort Slides', brand: 'Severus Leather', price: 38000 }
    ]
  },
  {
    id: 'senator',
    name: 'Modern Executive Senator',
    category: 'Bespoke Kaftan',
    image: '/images/products/BlackSenator.jpg',
    fitScore: 98,
    description: 'Tailored obsidian black kaftan with gold hardware and geometric placket cut.',
    pieces: [
      { name: 'Obsidian Senator Kaftan', brand: 'Deji & Kola', price: 95000 },
      { name: 'Handcrafted Calfskin Mules', brand: 'Kano Artisans', price: 42000 }
    ]
  }
];

export default function VirtualStudioSpotlight() {
  const [activeLookId, setActiveLookId] = useState<string>('ceremonial');
  const activeLook = curatedLooks.find((l) => l.id === activeLookId) || curatedLooks[0];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-[0.2em] font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FLAGSHIP TECHNOLOGY · VIRTUAL TRY-ON</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--text-primary)] tracking-tight leading-[1.15]">
            Try It On Before You Buy.<br />
            <span className="italic font-light text-[var(--gold-accent)]">The 3D Virtual Dressing Room.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl mx-auto">
            Eliminate sizing guesswork. Calibrate your 3D digital body twin, style cross-brand Nigerian looks in real-time, and order with 100% escrow protection.
          </p>
        </div>

        {/* Interactive Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Mannequin / Studio Canvas Preview */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl surface-card border border-[var(--border-subtle)] p-5 sm:p-6 shadow-2xl overflow-hidden">
              
              {/* Studio Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)]">
                    <IrisiIcon size={18} variant="gold" />
                  </div>
                  <div>
                    <span className="font-editorial text-sm font-bold text-[var(--text-primary)] block">
                      Ìrísí Virtual Studio Canvas
                    </span>
                    <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">
                      Digital Twin Simulation · Live Draping
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono-luxury font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeLook.fitScore}% Fit Match</span>
                </div>
              </div>

              {/* Interactive Preset Buttons */}
              <div className="grid grid-cols-3 gap-2 py-4">
                {curatedLooks.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => setActiveLookId(look.id)}
                    className={`px-3 py-2 rounded-xl text-left transition-all ${
                      activeLookId === look.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <span className="text-[9px] font-mono-luxury uppercase tracking-wider block opacity-75 truncate">
                      {look.category}
                    </span>
                    <span className="font-editorial text-xs font-bold block truncate">
                      {look.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Live Garment Visualizer */}
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-[var(--border-subtle)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLook.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={activeLook.image}
                      alt={activeLook.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Overlay Badges */}
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {activeLook.pieces.map((piece, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono-luxury"
                          >
                            <span className="font-bold text-[var(--gold-accent)]">{piece.brand}</span>
                            <span className="opacity-40">·</span>
                            <span>{piece.name}</span>
                            <span className="opacity-40">·</span>
                            <span className="font-bold">₦{piece.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Direct Studio Launch Bar */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--text-secondary)] font-light">
                  {activeLook.description}
                </p>
                <Link
                  href="/studio"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury font-bold text-xs uppercase hover:opacity-90 transition-all shadow-md"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Try In Studio</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Right Column: The 3 Revolutionary Pillars of Irisi */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)] shrink-0">
                  <Ruler className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                    Step 01 · Calibration
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    Calibrate Your 3D Digital Twin
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed pl-13">
                Enter your height, chest, waist, and shoulder measurements once. Our sizing engine computes exact sizing across bespoke Senator cuts, heavyweight hoodies, and tailored trousers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)] shrink-0">
                  <Shirt className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                    Step 02 · Realtime Styling
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    Mix & Match Independent Brands
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed pl-13">
                Drape native tops with artisanal leather slides or streetwear fleece with tailored trousers. See the complete look harmonized in photorealistic layers before purchasing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all space-y-2 group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-emerald-400 font-bold block">
                    Step 03 · Escrow Protection
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    Direct Dispatch with Escrow Lock
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed pl-13">
                Each verified designer dispatches directly from their workshop to your doorstep. Funds remain 100% secured in escrow until you receive and inspect your clothes.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl group"
              >
                <Shirt className="h-4 w-4" />
                <span>Launch 3D Virtual Studio</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:border-[var(--gold-accent)] transition-all"
              >
                <span>Browse Marketplace</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
