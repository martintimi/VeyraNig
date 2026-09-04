'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers, ShieldCheck, Shirt } from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

const departments = [
  {
    id: 'native',
    title: 'Bespoke Native & Agbada',
    subtitle: 'Ceremonial Elegance & Tailored Stature',
    desc: 'Super 160s wool Senator kaftans, hand-embroidered geometric plackets, and 3-piece regal Agbadas crafted to your exact measurements.',
    pieces: 'Senator Kaftans · Ceremonial Agbadas · Silk Boubous',
    image: '/images/products/BlackAgbada.jpg',
    fallbackImage: '/images/products/BlackSenator.jpg',
    link: '/shop?category=native',
    badge: 'Bespoke Tailoring',
    gradient: 'from-amber-950/80 via-black/50 to-transparent'
  },
  {
    id: 'streetwear',
    title: 'Contemporary Streetwear',
    subtitle: 'Heavyweight Fleece & Drop Silhouettes',
    desc: '480 GSM custom-milled heavyweight hoodies, boxy drop-shoulder tees, and relaxed denim engineered for Nigerian youth culture.',
    pieces: 'Heavy Fleece · Boxy Graphic Tees · Baggy Denim',
    image: '/images/products/BlackTrapStarHoodie.jpg',
    fallbackImage: '/images/products/BrownHoodie.jpg',
    link: '/shop?category=streetwear',
    badge: 'Streetwear Drops',
    gradient: 'from-zinc-950/80 via-black/50 to-transparent'
  },
  {
    id: 'footwear',
    title: 'Handcrafted Footwear',
    subtitle: 'Artisanal Leather & Modern Slides',
    desc: 'Genuine calfskin leather mules, ergonomic dual-strap slides, and formal dress shoes handcrafted by master Nigerian leather artisans.',
    pieces: 'Artisanal Slides · Leather Mules · Velvet Slippers',
    image: '/images/products/UnisexSlides.jpg',
    fallbackImage: '/images/products/BlackSmartShoes.jpg',
    link: '/shop?category=footwear',
    badge: 'Artisanal Leather',
    gradient: 'from-stone-950/80 via-black/50 to-transparent'
  },
  {
    id: 'accessories',
    title: 'Headwear & Signature Accents',
    subtitle: 'Statement Caps & Cultural Accents',
    desc: 'Regal structured Filas, embroidered luxury caps, and statement accessories to complete your look with uncompromised presence.',
    pieces: 'Velvet Fila Caps · Signature Headwear · Accents',
    image: '/images/products/CarmoCap.jpg',
    fallbackImage: '/images/products/GucciCap.jpg',
    link: '/shop?category=accessories',
    badge: 'Headwear & Accents',
    gradient: 'from-neutral-950/80 via-black/50 to-transparent'
  }
];

export default function CuratedDepartments() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury tracking-widest uppercase">
              <IrisiIcon size={14} variant="gold" />
              <span>Curated Departments · Direct Designer Dispatch</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[var(--text-primary)] leading-[1.15]">
              Shop by Department.<br />
              <span className="italic font-normal shimmer-gold">Direct from Verified Fashion Houses.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              Explore bespoke ceremonial tailoring, heavyweight streetwear, artisanal leather footwear, and statement accents. Each designer dispatches directly from their workshop to your doorstep.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] text-xs font-mono-luxury font-bold tracking-wider uppercase transition-all group"
            >
              <span>View All Pieces</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--gold-accent)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4-Column Department Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={dept.link}
              className="group relative flex flex-col rounded-3xl overflow-hidden surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-zinc-900">
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${dept.gradient}`} />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono-luxury font-bold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {dept.badge}
                  </span>
                </div>

                {/* Bottom Highlight on Image */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[10px] font-mono-luxury tracking-widest uppercase text-[var(--gold-accent)] font-bold block mb-1">
                    {dept.subtitle}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-white leading-tight drop-shadow-sm">
                    {dept.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 flex flex-col justify-between flex-grow space-y-4 bg-[var(--bg-secondary)]/50">
                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed line-clamp-2">
                  {dept.desc}
                </p>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] truncate max-w-[170px]">
                    {dept.pieces}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--gold-accent)] group-hover:bg-[var(--gold-accent)] group-hover:text-black flex items-center justify-center shrink-0 transition-all">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Studio Spotlight Bridge Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--gold-accent)]/30 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)] shrink-0 shadow-md">
              <IrisiIcon size={28} variant="gold" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  Interactive 3D Dressing Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-luxury font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Live Try-On
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light max-w-xl">
                Mix and match tops, trousers, and footwear across different Nigerian brands on your 3D digital body twin. Zero fit guesswork before purchasing.
              </p>
            </div>
          </div>

          <Link
            href="/studio"
            className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 text-xs font-mono-luxury font-bold tracking-wider uppercase transition-all shadow-lg group"
          >
            <Shirt className="h-4 w-4" />
            <span>Launch Virtual Studio</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
