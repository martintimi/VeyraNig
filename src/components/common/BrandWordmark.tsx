import React from 'react';
import Link from 'next/link';
import IrisiIcon from './IrisiIcon';

interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withSubtitle?: boolean;
  withIcon?: boolean;
  iconPosition?: 'left' | 'top';
  isLink?: boolean;
  className?: string;
  themeInvert?: boolean;
}

export default function BrandWordmark({
  size = 'md',
  withSubtitle = true,
  withIcon = true,
  iconPosition = 'left',
  isLink = true,
  className = '',
  themeInvert = false,
}: BrandWordmarkProps) {
  // Dimension presets
  const sizeStyles = {
    sm: {
      text: 'text-lg tracking-[0.24em]',
      sub: 'text-[7px] tracking-[0.32em]',
      icon: 20,
    },
    md: {
      text: 'text-2xl sm:text-3xl tracking-[0.26em]',
      sub: 'text-[8px] sm:text-[9px] tracking-[0.38em]',
      icon: 28,
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-[0.3em]',
      sub: 'text-[9px] sm:text-[10px] tracking-[0.42em]',
      icon: 36,
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-[0.34em]',
      sub: 'text-[11px] tracking-[0.48em]',
      icon: 46,
    },
  };

  const current = sizeStyles[size];

  const content = (
    <div className={`flex ${iconPosition === 'top' ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 select-none group transition-transform duration-300 ${className}`}>
      {/* Unique ÌRÍSÍ Luxury Emblem */}
      {withIcon && (
        <IrisiIcon
          size={current.icon}
          variant="gold"
          className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
        />
      )}

      {/* Editorial Typographic Wordmark */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <span
            className={`font-editorial font-bold uppercase transition-colors duration-300 leading-tight ${current.text} ${
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
