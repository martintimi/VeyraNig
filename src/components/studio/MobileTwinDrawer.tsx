'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import Image from 'next/image';
import {
  Sparkles, X, Check, ShoppingBag, RotateCcw,
  ShieldCheck, Sliders, ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileTwinDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileTwinDrawer({ isOpen, onClose }: MobileTwinDrawerProps) {
  const {
    activeOutfit,
    bodyProfile,
    clearOutfit,
    randomizeOutfit,
    addEntireOutfitToCart,
    setIsProfileWizardOpen,
    userAuth
  } = useStore();

  if (!isOpen) return null;

  const totalOutfitPrice = Object.values(activeOutfit).reduce((sum, item) => sum + (item ? item.price : 0), 0);
  const totalItemsCount = Object.values(activeOutfit).filter(Boolean).length;

  const handleAddAll = () => {
    addEntireOutfitToCart();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end animate-fadeIn">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-Up Bottom Sheet */}
      <div className="relative w-full max-h-[88vh] bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slideUp">
        
        {/* Drag Handle & Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-base font-bold text-[var(--text-primary)] leading-none">
                3D Digital Body Twin
              </h3>
              <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold">
                {bodyProfile.heightCm}cm · {bodyProfile.weightKg}kg ({bodyProfile.bodyShape})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setIsProfileWizardOpen(true);
              }}
              className="px-2.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury text-[var(--text-secondary)] font-bold"
            >
              Adjust
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3D Model Body Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          
          {/* Visual Model Canvas */}
          <div className="relative h-80 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-center shadow-inner">
            
            {/* Mannequin Silhouette Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
              <svg viewBox="0 0 200 480" className="w-full h-full text-[var(--text-muted)]" fill="none">
                <circle cx="100" cy="45" r="22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M92 67 L108 67 L110 88 L90 88 Z" fill="currentColor" opacity="0.3" />
                <path d="M60 92 C75 88 125 88 140 92 C148 115 136 170 130 195 C118 198 82 198 70 195 C64 170 52 115 60 92 Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M68 196 C80 198 120 198 132 196 C142 225 138 255 135 270 C115 275 85 275 65 270 C62 255 58 225 68 196 Z" stroke="currentColor" />
                <path d="M66 272 C78 274 96 274 97 285 C95 340 90 410 88 450 C80 452 72 452 68 450 C70 410 65 340 66 272 Z" stroke="currentColor" />
                <path d="M134 272 C122 274 104 274 103 285 C105 340 110 410 112 450 C120 452 128 452 132 450 C130 410 135 340 134 272 Z" stroke="currentColor" />
              </svg>
            </div>

            {/* Model Stack */}
            <div className="relative w-[220px] h-[300px] flex items-center justify-center">
              
              {/* LAYER 1: BOTTOMS */}
              {activeOutfit.bottoms ? (
                <div className="absolute top-[110px] w-[110px] h-[160px] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10 animate-fadeIn">
                  <Image
                    src={activeOutfit.bottoms.imageUrl}
                    alt={activeOutfit.bottoms.name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="absolute top-[110px] w-[100px] h-[150px] rounded-xl border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[9px] font-mono-luxury uppercase text-[var(--text-muted)]">
                  Trouser
                </div>
              )}

              {/* LAYER 2: TOPS */}
              {activeOutfit.tops ? (
                <div className="absolute top-[30px] w-[120px] h-[125px] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20 animate-fadeIn">
                  <Image
                    src={activeOutfit.tops.imageUrl}
                    alt={activeOutfit.tops.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="absolute top-[30px] w-[115px] h-[115px] rounded-xl border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[9px] font-mono-luxury uppercase text-[var(--text-muted)] z-20">
                  Top
                </div>
              )}

              {/* LAYER 3: OUTERWEAR */}
              {activeOutfit.outerwear && (
                <div className="absolute top-[20px] w-[140px] h-[180px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--gold-accent)] z-30 pointer-events-none animate-fadeIn">
                  <Image
                    src={activeOutfit.outerwear.imageUrl}
                    alt={activeOutfit.outerwear.name}
                    fill
                    unoptimized
                    className="object-cover object-center mix-blend-screen opacity-95"
                  />
                </div>
              )}

              {/* LAYER 4: FOOTWEAR */}
              {activeOutfit.footwear && (
                <div className="absolute bottom-[2px] w-[95px] h-[35px] rounded-lg overflow-hidden shadow-xl border border-white/10 z-20 animate-fadeIn">
                  <Image
                    src={activeOutfit.footwear.imageUrl}
                    alt={activeOutfit.footwear.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
              )}

              {/* LAYER 5: ACCESSORIES */}
              {activeOutfit.accessories && (
                <div className="absolute top-[0px] w-[60px] h-[35px] rounded-lg overflow-hidden shadow-xl border border-[var(--gold-accent)]/50 z-40 animate-fadeIn">
                  <Image
                    src={activeOutfit.accessories.imageUrl}
                    alt={activeOutfit.accessories.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
              )}

            </div>

          </div>

          {/* Sizing & Outfit Summary */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono-luxury">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Active Look ({totalItemsCount} pieces):</span>
              <span className="font-editorial text-base font-bold text-[var(--gold-accent)]">
                ₦{totalOutfitPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={randomizeOutfit}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)]"
              >
                Shuffle
              </button>
              <button
                onClick={clearOutfit}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono-luxury uppercase font-bold text-rose-400"
              >
                Clear
              </button>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
          <button
            onClick={handleAddAll}
            disabled={totalItemsCount === 0}
            className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add Entire Look to Bag (₦{totalOutfitPrice.toLocaleString()})</span>
          </button>
        </div>

      </div>

    </div>
  );
}
