'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

import Image from 'next/image';

export default function LuxuryLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-primary)] transition-opacity duration-700 pointer-events-none">
      
      {/* Monogram Brand Mark with Shimmer */}
      <div className="relative flex flex-col items-center space-y-4 animate-pulse">
        <div className="relative flex items-center justify-center h-20 w-20 rounded-3xl surface-card border border-[var(--gold-accent)]/30 shadow-2xl p-3">
          <Image
            src="/images/logo/veyra-emblem.png"
            alt="Veyra"
            width={64}
            height={64}
            className="h-14 w-auto object-contain"
          />
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="text-center space-y-1">
          <div className="font-editorial text-2xl font-bold tracking-[0.3em] text-[var(--text-primary)]">
            VEYRA
          </div>
          <div className="text-[9px] font-mono-luxury uppercase tracking-[0.35em] text-[var(--gold-accent)] font-bold">
            See It · Fit It · Own It
          </div>
        </div>

        {/* Minimalist Progress Line */}
        <div className="w-36 h-[2px] bg-[var(--border-subtle)] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[var(--gold-accent)] to-emerald-400 animate-shimmer" style={{ width: '100%' }} />
        </div>
      </div>

    </div>
  );
}
