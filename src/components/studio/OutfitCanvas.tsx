'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Sparkles, Dices, RotateCcw, Flame, Layers, ShieldCheck, Check, SlidersHorizontal, Eye } from 'lucide-react';
import Image from 'next/image';

export default function OutfitCanvas() {
  const {
    bodyProfile,
    activeOutfit,
    randomizeOutfit,
    clearOutfit,
    selectedGender,
    setSelectedGender,
    userAuth,
    setIsProfileWizardOpen,
  } = useStore();

  const [viewAngle, setViewAngle] = useState<'front' | 'angle' | 'detail'>('front');

  const activeCount = Object.values(activeOutfit).filter(Boolean).length;

  return (
    <div className="relative w-full h-[640px] lg:h-[720px] rounded-3xl surface-card p-6 overflow-hidden flex flex-col items-center justify-between shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      
      {/* Top Floating Bar */}
      <div className="w-full flex items-center justify-between z-20 gap-2 flex-wrap">
        
        {/* Model Profile Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] backdrop-blur-md shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
            {userAuth.isLoggedIn ? `${userAuth.name.split(' ')[0]}'s Body Twin` : '3D Body Twin'}
          </span>
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-2">
            {bodyProfile.heightCm}cm · {bodyProfile.weightKg}kg · {selectedGender}
          </span>
        </div>

        {/* View Angle Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] backdrop-blur-md">
          {(['front', 'angle', 'detail'] as const).map((angle) => (
            <button
              key={angle}
              onClick={() => setViewAngle(angle)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono-luxury uppercase tracking-wider transition-all ${
                viewAngle === angle
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {angle}
            </button>
          ))}
        </div>
      </div>

      {/* Main Photorealistic Virtual Model Stage */}
      <div className="relative flex-1 w-full max-w-[380px] flex items-center justify-center my-2">
        
        {/* Stage Studio Pedestal & Ambient Shadows */}
        <div className="absolute bottom-6 w-48 h-8 bg-black/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-[var(--gold-subtle)]/20 via-transparent to-transparent opacity-40 pointer-events-none" />

        {/* Photorealistic Model Layer Stack */}
        <div
          className="relative w-[300px] h-[520px] flex items-center justify-center transition-transform duration-500"
          style={{
            transform: viewAngle === 'angle' ? 'rotateY(10deg) scale(0.98)' : 'rotateY(0deg)',
            transformOrigin: 'center center'
          }}
        >
          {/* BASE STUDIO MANNEQUIN SILHOUETTE */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <svg viewBox="0 0 200 480" className="w-full h-full text-[var(--text-muted)]" fill="none">
              <circle cx="100" cy="45" r="22" stroke="currentColor" strokeWidth="1.5" />
              <path d="M92 67 L108 67 L110 88 L90 88 Z" fill="currentColor" opacity="0.3" />
              <path d="M60 92 C75 88 125 88 140 92 C148 115 136 170 130 195 C118 198 82 198 70 195 C64 170 52 115 60 92 Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M68 196 C80 198 120 198 132 196 C142 225 138 255 135 270 C115 275 85 275 65 270 C62 255 58 225 68 196 Z" stroke="currentColor" />
              <path d="M66 272 C78 274 96 274 97 285 C95 340 90 410 88 450 C80 452 72 452 68 450 C70 410 65 340 66 272 Z" stroke="currentColor" />
              <path d="M134 272 C122 274 104 274 103 285 C105 340 110 410 112 450 C120 452 128 452 132 450 C130 410 135 340 134 272 Z" stroke="currentColor" />
            </svg>
          </div>

          {/* LAYER 1: BOTTOMS (TROUSERS / JEANS / PANTS) */}
          {activeOutfit.bottoms ? (
            <div className="absolute top-[200px] w-[170px] h-[260px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 z-10 animate-fadeIn group">
              <Image
                src={activeOutfit.bottoms.imageUrl}
                alt={activeOutfit.bottoms.name}
                fill
                unoptimized
                className="object-cover object-top drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[8px] font-mono-luxury text-white">
                <span className="truncate">{activeOutfit.bottoms.name}</span>
                <span className="text-[var(--gold-accent)] font-bold">₦{activeOutfit.bottoms.price.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="absolute top-[200px] w-[160px] h-[250px] rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] bg-[var(--bg-secondary)]/30">
              Select Trouser
            </div>
          )}

          {/* LAYER 2: TOPS (SENATOR / HOODIE / CASUAL TOP) */}
          {activeOutfit.tops ? (
            <div className="absolute top-[60px] w-[185px] h-[195px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 z-20 animate-fadeIn group">
              <Image
                src={activeOutfit.tops.imageUrl}
                alt={activeOutfit.tops.name}
                fill
                unoptimized
                className="object-cover object-center drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[8px] font-mono-luxury text-white">
                <span className="truncate">{activeOutfit.tops.name}</span>
                <span className="text-[var(--gold-accent)] font-bold">₦{activeOutfit.tops.price.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="absolute top-[60px] w-[180px] h-[180px] rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 z-20">
              Select Top
            </div>
          )}

          {/* LAYER 3: OUTERWEAR (CEREMONIAL AGBADA WRAP) */}
          {activeOutfit.outerwear && (
            <div className="absolute top-[40px] w-[220px] h-[280px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border-2 border-[var(--gold-accent)] z-30 pointer-events-none animate-fadeIn">
              <Image
                src={activeOutfit.outerwear.imageUrl}
                alt={activeOutfit.outerwear.name}
                fill
                unoptimized
                className="object-cover object-center drop-shadow-2xl mix-blend-screen opacity-95"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-[var(--gold-accent)]/30 text-[8px] font-mono-luxury text-[var(--gold-accent)] font-bold uppercase">
                Agbada: {activeOutfit.outerwear.vendorName}
              </div>
            </div>
          )}

          {/* LAYER 4: FOOTWEAR (KANO LEATHER SLIDES / SHOES) */}
          {activeOutfit.footwear && (
            <div className="absolute bottom-[-10px] w-[140px] h-[65px] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 z-20 animate-fadeIn">
              <Image
                src={activeOutfit.footwear.imageUrl}
                alt={activeOutfit.footwear.name}
                fill
                unoptimized
                className="object-cover object-bottom"
              />
            </div>
          )}

          {/* LAYER 5: ACCESSORIES (ROYAL VELVET FILA CAP) */}
          {activeOutfit.accessories && (
            <div className="absolute top-[20px] w-[60px] h-[60px] rounded-full overflow-hidden shadow-2xl transition-all duration-500 border-2 border-[var(--gold-accent)] z-40 animate-fadeIn">
              <Image
                src={activeOutfit.accessories.imageUrl}
                alt={activeOutfit.accessories.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

        </div>

      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full flex items-center justify-between z-20 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            onClick={randomizeOutfit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all"
            title="Randomize complete outfit"
          >
            <Dices className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
            <span>Randomize Look</span>
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearOutfit}
              className="p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
              title="Reset Outfit"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsProfileWizardOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Adjust Body Measurements</span>
        </button>
      </div>

    </div>
  );
}
