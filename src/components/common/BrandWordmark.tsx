'use client';

import React from 'react';
import Link from 'next/link';

interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withSubtitle?: boolean;
  isLink?: boolean;
  className?: string;
  themeInvert?: boolean;
}

export default function BrandWordmark({
  size = 'md',
  withSubtitle = true,
  isLink = true,
  className = '',
  themeInvert = false,
}: BrandWordmarkProps) {
  // Dimension presets
  const sizeStyles = {
    sm: {
      text: 'text-lg tracking-[0.26em]',
      sub: 'text-[7px] tracking-[0.35em]',
      emblem: 'h-4 w-4',
    },
    md: {
      text: 'text-2xl sm:text-3xl tracking-[0.28em]',
      sub: 'text-[8px] sm:text-[9px] tracking-[0.4em]',
      emblem: 'h-5 w-5',
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-[0.32em]',
      sub: 'text-[9px] sm:text-[10px] tracking-[0.45em]',
      emblem: 'h-6 w-6',
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-[0.36em]',
      sub: 'text-[11px] tracking-[0.5em]',
      emblem: 'h-8 w-8',
    },
  };

  const current = sizeStyles[size];

  const content = (
    <div className={`flex flex-col items-center justify-center select-none group transition-transform duration-300 ${className}`}>
      {/* Editorial Typographic Wordmark */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-editorial font-bold uppercase transition-colors duration-300 ${current.text} ${
            themeInvert
              ? 'text-white'
              : 'text-zinc-950 dark:text-white group-hover:text-[var(--gold-accent)]'
          }`}
          style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
        >
          Ì R Í S Í
        </span>
      </div>

      {/* Cultural Nigerian Luxury Subtitle */}
      {withSubtitle && (
        <span
          className={`font-mono-luxury font-bold uppercase text-[var(--gold-accent)] mt-0.5 ${current.sub}`}
        >
          Nigeria · Drip & Native Craft
        </span>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex items-center justify-center focus:outline-none" aria-label="Ìrísí Home">
        {content}
      </Link>
    );
  }

  return content;
}
