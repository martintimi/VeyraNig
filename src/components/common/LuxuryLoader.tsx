'use client';

import React, { useEffect, useState } from 'react';
import IrisiIcon from './IrisiIcon';

interface LuxuryLoaderProps {
  fullScreen?: boolean;
  label?: string;
  sublabel?: string;
  autoHideMs?: number;
}

export default function LuxuryLoader({
  fullScreen = true,
  label = 'Ì R Í S Í',
  sublabel = 'Appearance & Presence · Nigerian Luxury',
  autoHideMs
}: LuxuryLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoHideMs) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  if (!visible) return null;

  const content = (
    <div className="relative flex flex-col items-center space-y-4 animate-pulse select-none">
      {/* ÌRÍSÍ Architectural Monogram with Gold Shimmer */}
      <div className="relative flex items-center justify-center h-20 w-20 rounded-3xl surface-card border border-[var(--gold-accent)]/40 shadow-2xl p-3 bg-[var(--bg-secondary)]">
        <IrisiIcon size={46} variant="gold" className="drop-shadow-md" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500" />
      </div>

      {/* Luxury Typography */}
      <div className="text-center space-y-1">
        <div className="font-editorial text-3xl font-bold tracking-[0.34em] text-[var(--text-primary)]">
          {label}
        </div>
        <div className="text-[9px] font-mono-luxury uppercase tracking-[0.35em] text-[var(--gold-accent)] font-bold">
          {sublabel}
        </div>
      </div>

      {/* Minimalist Progress Line */}
      <div className="w-36 h-[2px] bg-[var(--border-subtle)] rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-gradient-to-r from-[var(--gold-accent)] via-amber-200 to-emerald-400 animate-shimmer"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-8 transition-opacity duration-500">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-primary)] transition-opacity duration-700 pointer-events-none">
      {content}
    </div>
  );
}
