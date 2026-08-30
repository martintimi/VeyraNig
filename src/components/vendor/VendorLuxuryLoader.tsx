'use client';

import React from 'react';
import Image from 'next/image';

interface VendorLuxuryLoaderProps {
  label?: string;
}

export default function VendorLuxuryLoader({ label = 'Connecting Atelier Workspace...' }: VendorLuxuryLoaderProps) {
  return (
    <div className="min-h-[45vh] flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fadeIn select-none">
      
      {/* Glowing luxury emblem with pulsing gold halo */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing gold ring */}
        <div className="absolute h-20 w-20 rounded-full border border-[var(--gold-accent)]/30 animate-ping opacity-30 pointer-events-none" />
        
        {/* Inner spinning luxury ring */}
        <div className="h-16 w-16 rounded-full border-2 border-transparent border-t-[var(--gold-accent)] border-r-[var(--gold-accent)]/40 animate-spin" />
        
        {/* Center Veyra Monogram / Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-11 w-11 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shadow-lg">
            <span className="font-editorial font-bold text-xl text-[var(--gold-accent)] leading-none">
              V
            </span>
          </div>
        </div>
      </div>

      {/* Shimmering label */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono-luxury font-bold uppercase tracking-widest text-[var(--gold-accent)] block">
          VEYRA ATELIER
        </span>
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
          {label}
        </p>
      </div>

    </div>
  );
}
