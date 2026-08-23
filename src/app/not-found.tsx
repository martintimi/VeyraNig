'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scissors, Sparkles, Compass, Layers, ShoppingBag, ArrowRight,
  Home, RotateCcw, Store, ShieldAlert
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden text-center select-none animate-fadeIn">
      
      {/* Ambient Luxury Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--gold-subtle)]/30 rounded-full blur-3xl pointer-events-none" />
      
      {/* Main 404 Visual Content */}
      <div className="relative z-10 max-w-2xl space-y-6">
        
        {/* Floating Atelier Icon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold shadow-lg">
          <Scissors className="h-4 w-4 animate-pulse" />
          <span>SARTORIAL PATTERN NOT FOUND · ERROR 404</span>
        </div>

        {/* Big Editorial 404 */}
        <div className="space-y-2">
          <h1 className="font-editorial text-7xl sm:text-9xl font-bold tracking-tight text-[var(--text-primary)]">
            404
          </h1>
          <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
            This Garment Was Never Tailored
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
            The collection, lookbook, or runway piece you are searching for has been archived or does not exist in our Lagos catalog.
          </p>
        </div>

        {/* Floating Garment Origin Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['Bespoke Senator Kaftans', '3-Piece Agbada Robes', 'Street Souk Hoodies', 'Handmade Kano Leather'].map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase"
            >
              ● {tag}
            </span>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/studio"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:border-[var(--gold-accent)] transition-all flex items-center justify-center gap-2"
          >
            <Layers className="h-4 w-4 text-[var(--gold-accent)]" />
            <span>3D Dressing Room</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
