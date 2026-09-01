'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, Layers, Scissors, Check } from 'lucide-react';

export default function ProblemSolution() {
  const standards = [
    {
      icon: Scissors,
      title: 'Bespoke Measurement Calibration',
      desc: 'Our sizing algorithm translates your height, weight, and shoulder specs into exact tailoring patterns across every partner atelier.',
      tag: 'Zero Sizing Error'
    },
    {
      icon: Layers,
      title: 'Cross-Brand Wardrobe Styling',
      desc: 'Assemble complete luxury looks combining Victoria Island Senator kaftans, Abeokuta silk Adire, and Kano handcrafted leather slides.',
      tag: 'Unified Try-On'
    },
    {
      icon: Truck,
      title: 'Consolidated White-Glove Logistics',
      desc: 'All garments from distinct designers are inspected for quality at our central Lagos hub and delivered together in a single Veyra luxury box.',
      tag: '24-48hr Lagos Delivery'
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Fit Protection',
      desc: 'Shop with absolute peace of mind. If any piece does not fit your body twin accurately, enjoy complimentary 7-day alterations or exchange.',
      tag: '100% Fit Guarantee'
    }
  ];

  return (
    <section className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE VEYRA ADVANTAGE</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)]">
            A New Standard for Nigerian Fashion
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
            Engineered to eliminate sizing uncertainty and bring Nigeria&apos;s finest fashion designers into one seamless virtual dressing room.
          </p>
        </div>

        {/* 4 Luxury Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl surface-card flex flex-col justify-between space-y-6 hover:border-[var(--gold-accent)]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono-luxury uppercase px-2.5 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-[11px] font-mono-luxury text-emerald-500 font-bold">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>{item.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
