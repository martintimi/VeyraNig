'use client';

import React from 'react';
import OutfitCanvas from '@/components/studio/OutfitCanvas';
import WardrobeDrawer from '@/components/studio/WardrobeDrawer';
import LookBreakdown from '@/components/studio/LookBreakdown';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function StudioPage() {
  const { bodyProfile, setIsProfileWizardOpen, userAuth } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase tracking-widest ">
              Mix & Match Outfit Builder
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl  text-[var(--text-primary)] mt-1.5">
            Virtual Dressing Room
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-light">
            Select a Senator Top, Trouser, and Footwear below. See how the full outfit looks together on your model.
          </p>
        </div>

        {/* Digital Twin Indicator */}
        <button
          onClick={() => setIsProfileWizardOpen(true)}
          className="flex items-center gap-3 px-5 py-2.5 rounded-full surface-card hover:border-[var(--border-hover)] text-xs text-[var(--text-primary)] transition-all shadow-sm group"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <div className=" text-[11px] font-mono-luxury uppercase">
              {userAuth.isLoggedIn && userAuth.name ? `Model: ${userAuth.name}` : `Model: Standard ${bodyProfile.gender === 'male' ? 'Male' : 'Female'}`}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono-luxury">
              {bodyProfile.heightCm}cm · {bodyProfile.gender} {userAuth.isLoggedIn ? '' : '· Tap to Calibrate'}
            </div>
          </div>
          <SlidersHorizontal className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors ml-1" />
        </button>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[640px]">
        
        {/* Left: Step-by-Step Clothes Selector (4 cols) */}
        <div className="lg:col-span-4 h-[620px] lg:h-[720px]">
          <WardrobeDrawer />
        </div>

        {/* Center: Live Model Preview (5 cols) */}
        <div className="lg:col-span-5 h-[620px] lg:h-[720px]">
          <OutfitCanvas />
        </div>

        {/* Right: Outfit Summary & Buy (3 cols) */}
        <div className="lg:col-span-3 h-[620px] lg:h-[720px]">
          <LookBreakdown />
        </div>

      </div>

    </div>
  );
}
