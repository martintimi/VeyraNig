'use client';

import React from 'react';
import { Plus, Minus, Sparkles, Check, ChevronDown, ChevronUp, AlertCircle, Layers } from 'lucide-react';

interface VariantStockMatrixProps {
  colors: { name: string; hex: string }[];
  sizes: string[];
  stockMatrix: { [variantKey: string]: number };
  onChange: (newMatrix: { [variantKey: string]: number }) => void;
  defaultQty?: number;
  isAccessory?: boolean;
}

export function getVariantKey(colorName: string, size: string): string {
  return `${colorName.trim()}_${size.trim()}`;
}

export default function VariantStockMatrix({
  colors,
  sizes,
  stockMatrix,
  onChange,
  defaultQty = 10,
  isAccessory = false,
}: VariantStockMatrixProps) {
  const activeColors = colors.length > 0 ? colors : [{ name: 'Standard', hex: '#111111' }];
  const activeSizes = isAccessory ? ['One Size'] : (sizes.length > 0 ? sizes : ['M', 'L']);

  // Get current quantity for a specific color + size
  const getQty = (colorName: string, size: string): number => {
    const key = getVariantKey(colorName, size);
    if (stockMatrix[key] !== undefined) {
      return stockMatrix[key];
    }
    return defaultQty;
  };

  // Update a single variant quantity
  const setQty = (colorName: string, size: string, val: number) => {
    const key = getVariantKey(colorName, size);
    const newQty = Math.max(0, Math.floor(val));
    onChange({
      ...stockMatrix,
      [key]: newQty,
    });
  };

  // Quick fill all variants with a preset number
  const fillAll = (amount: number) => {
    const updated: { [key: string]: number } = {};
    activeColors.forEach(c => {
      activeSizes.forEach(s => {
        updated[getVariantKey(c.name, s)] = amount;
      });
    });
    onChange(updated);
  };

  // Calculate totals
  let totalPieces = 0;
  const colorTotals: { [color: string]: number } = {};
  const sizeTotals: { [size: string]: number } = {};

  activeColors.forEach(c => {
    colorTotals[c.name] = 0;
    activeSizes.forEach(s => {
      const q = getQty(c.name, s);
      totalPieces += q;
      colorTotals[c.name] = (colorTotals[c.name] || 0) + q;
      sizeTotals[s] = (sizeTotals[s] || 0) + q;
    });
  });

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
      
      {/* Header & Quick Preset Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)]">
              Color &amp; Size Inventory Breakdown
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono-luxury font-bold">
              {totalPieces} Total Pieces
            </span>
          </div>
          <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] mt-0.5">
            Set exact stock per color &amp; size. Pieces with 0 will show as Sold Out in that specific variation.
          </p>
        </div>

        {/* Quick Fill Shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] font-bold mr-1">
            Quick Fill All:
          </span>
          {[5, 10, 15, 25].map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => fillAll(amt)}
              className="px-2.5 py-1 rounded-lg surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[10px] font-mono-luxury font-bold text-[var(--text-primary)] hover:text-[var(--gold-accent)] transition-all cursor-pointer"
            >
              {amt} Each
            </button>
          ))}
        </div>
      </div>

      {/* Variant Grid by Color */}
      <div className="space-y-3">
        {activeColors.map(color => {
          const colorTotal = colorTotals[color.name] || 0;

          return (
            <div
              key={color.name}
              className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm"
            >
              {/* Color Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-mono-luxury font-bold text-[var(--text-primary)]">
                    {color.name}
                  </span>
                </div>
                
                <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)] font-bold">
                  {colorTotal} {colorTotal === 1 ? 'piece' : 'pieces'} available
                </span>
              </div>

              {/* Sizes Row for this Color */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {activeSizes.map(size => {
                  const qty = getQty(color.name, size);

                  return (
                    <div
                      key={size}
                      className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-1.5 ${
                        qty === 0
                          ? 'bg-rose-500/5 border-rose-500/20'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      <div className="min-w-[24px]">
                        <span className="text-[11px] font-mono-luxury font-bold text-[var(--text-primary)] block">
                          {size}
                        </span>
                        {qty === 0 && (
                          <span className="text-[8px] font-mono-luxury font-bold text-rose-400 uppercase leading-none block">
                            Out
                          </span>
                        )}
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setQty(color.name, size, qty - 1)}
                          className="h-6 w-6 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => setQty(color.name, size, Number(e.target.value) || 0)}
                          className="w-10 text-center py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)]"
                        />

                        <button
                          type="button"
                          onClick={() => setQty(color.name, size, qty + 1)}
                          className="h-6 w-6 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Summary Row */}
      <div className="flex items-center justify-between text-[11px] font-mono-luxury text-[var(--text-secondary)] pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          {activeSizes.map(sz => (
            <span key={sz} className="font-bold">
              Size {sz}: <strong className="text-[var(--text-primary)]">{sizeTotals[sz] || 0}</strong>
            </span>
          ))}
        </div>
        <span className="font-bold text-[var(--gold-accent)]">
          Total Inventory: {totalPieces}
        </span>
      </div>

    </div>
  );
}
