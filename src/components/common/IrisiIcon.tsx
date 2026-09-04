'use client';

import React from 'react';

interface IrisiIconProps {
  className?: string;
  size?: number | string;
  variant?: 'gold' | 'monochrome' | 'dark';
}

/**
 * ÌRÍSÍ Bespoke Luxury Emblem
 * Concept: The Architectural Loom & Royal Crest of Presence (Ìrísí)
 * Combines the regal 'I' monolith pillar with the 4-point radiant diamond aura
 * and symmetrical architectural chevrons representing woven luxury craft.
 */
export default function IrisiIcon({
  className = '',
  size = 32,
  variant = 'gold'
}: IrisiIconProps) {
  const gradientId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label="Ìrísí Emblem"
    >
      <defs>
        {/* Rich Champagne Gold Gradient */}
        <linearGradient id={`goldGrad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D77F" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#AA7A1E" />
          <stop offset="100%" stopColor="#E6C367" />
        </linearGradient>

        {/* Soft Aura Glow */}
        <radialGradient id={`glowGrad-${gradientId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle Ambient Halo */}
      <circle cx="50" cy="50" r="46" fill={`url(#glowGrad-${gradientId})`} />

      {/* Outer Fine Geometric Diamond Ring */}
      <rect
        x="50"
        y="14"
        width="51"
        height="51"
        transform="rotate(45 50 14)"
        stroke={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
        strokeWidth="1.25"
        strokeOpacity={variant === 'gold' ? '0.5' : '0.4'}
        fill="none"
      />

      {/* Inner Precision Diamond Accent */}
      <rect
        x="50"
        y="24"
        width="37"
        height="37"
        transform="rotate(45 50 24)"
        stroke={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
        strokeWidth="0.75"
        strokeOpacity={variant === 'gold' ? '0.35' : '0.25'}
        strokeDasharray="2 2"
        fill="none"
      />

      {/* Apex 4-Point Stature Star (Aura / Ìrísí Light) */}
      <path
        d="M50 8 L52.2 15.5 L59 18 L52.2 20.5 L50 28 L47.8 20.5 L41 18 L47.8 15.5 Z"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
      />

      {/* Base Stature Diamond */}
      <path
        d="M50 72 L52.2 79.5 L59 82 L52.2 84.5 L50 92 L47.8 84.5 L41 82 L47.8 79.5 Z"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
      />

      {/* Central Architectural Monogram: The Symmetrical 'Ì-I-Í' Pillars */}
      {/* Top Crossbar */}
      <rect
        x="32"
        y="30"
        width="36"
        height="3"
        rx="1.5"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
      />

      {/* Left Slender Fluted Column */}
      <rect
        x="37"
        y="36"
        width="3"
        height="28"
        rx="1"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
        opacity="0.8"
      />

      {/* Center Imperial Column (The Core 'I' Pillar) */}
      <rect
        x="47"
        y="33"
        width="6"
        height="34"
        rx="2"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
      />

      {/* Right Slender Fluted Column */}
      <rect
        x="60"
        y="36"
        width="3"
        height="28"
        rx="1"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
        opacity="0.8"
      />

      {/* Bottom Crossbar */}
      <rect
        x="32"
        y="67"
        width="36"
        height="3"
        rx="1.5"
        fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'}
      />

      {/* Horizontal Presence Accent Pins */}
      <circle cx="24" cy="50" r="2" fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'} />
      <circle cx="76" cy="50" r="2" fill={variant === 'gold' ? `url(#goldGrad-${gradientId})` : 'currentColor'} />
    </svg>
  );
}
