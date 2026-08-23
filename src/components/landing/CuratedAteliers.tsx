'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles, Scissors, ShieldCheck } from 'lucide-react';

const ateliers = [
  {
    name: 'Sartorial Lagos',
    location: 'Victoria Island, Lagos',
    focus: 'Bespoke Senator Suits & Ceremonial Agbada',
    desc: 'Renowned for razor-sharp geometric chest embroidery, structured shoulder lines, and fine Italian merino wool native cuts.',
    image: '/images/products/BlackSenator.jpg',
    tag: 'Bespoke Tailoring',
    heroPieces: 'Senator Sets · Agbada Robes · Velvet Fila',
    rating: '4.9 ★ (156 Orders)'
  },
  {
    name: 'Street Souk Co.',
    location: 'Lekki Phase 1, Lagos',
    focus: 'Afro-Streetwear & 450gsm Heavyweight Fleece',
    desc: 'Lagos youth culture engineered into oversized dropped-shoulder hoodies, boxy graphic tees, and cyber streetwear aesthetics.',
    image: '/images/products/BlackTrapStarHoodie.jpg',
    tag: 'Ready-to-Wear Street',
    heroPieces: 'Trapstar Hoodies · Boxy Tees · Aqua Slides',
    rating: '4.9 ★ (210 Drops)'
  },
  {
    name: 'Yaba Denim Works',
    location: 'Yaba, Lagos',
    focus: 'Raw 14oz Selvedge Denim & Tactical Cargos',
    desc: 'Durable wide-leg denim, straight-cut vintage jeans, and articulated utility trousers tailored for the Nigerian urban rhythm.',
    image: '/images/products/BaggyJean.jpg',
    tag: 'Ready-to-Wear Denim',
    heroPieces: 'Wide-Leg Baggy Denim · Multi-Pocket Cargos',
    rating: '4.8 ★ (145 Orders)'
  },
  {
    name: 'Kano Artisan Footwear',
    location: 'Kano & Lagos',
    focus: 'Handcrafted Full-Grain Calf Leather Slides & Shoes',
    desc: 'Century-old Northern tannery heritage crafting anatomical leather slides, horsebit mules, and Goodyear welted Oxfords.',
    image: '/images/products/UnisexSlides.jpg',
    tag: 'Handmade Leathercraft',
    heroPieces: 'Calf Leather Slides · Suede Mules · Oxfords',
    rating: '5.0 ★ (182 Pairs)'
  }
];

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

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
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

        {/* 4 Atelier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ateliers.map((atelier, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl surface-card overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-[var(--gold-accent)]/50 transition-all duration-500"
            >
              {/* Crisp Bright Image Container */}
              <div className="relative h-64 w-full bg-[var(--bg-secondary)] overflow-hidden">
                <Image
                  src={atelier.image}
                  alt={atelier.name}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />

                {/* Top Origin Tag */}
                <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-luxury uppercase tracking-wider text-white font-bold border border-white/10">
                    {atelier.tag}
                  </span>
                </div>

                {/* Location Pill */}
                <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-luxury text-[var(--gold-accent)] border border-white/10 font-semibold">
                  <MapPin className="h-3 w-3" />
                  <span>{atelier.location}</span>
                </div>
              </div>

              {/* Atelier Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                      {atelier.name}
                    </h3>
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
                    href="/shop"
                    className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Shop Atelier</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
