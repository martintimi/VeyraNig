'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp, PackageCheck, DollarSign, Sparkles,
  ArrowUpRight, Plus, ExternalLink, ShieldCheck, CheckCircle2,
  ShoppingBag, Scissors, Layers
} from 'lucide-react';

export default function VendorOverviewPage() {
  const { vendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';

  const bespokePieces = [
    {
      name: 'Onyx Wool Senator Kaftan',
      image: '/images/products/BlackSenator.jpg',
      unitsSold: 22,
      revenue: 1430000,
      spec: '99.4% Fit Match',
      origin: 'Bespoke Handmade'
    },
    {
      name: 'Midnight Black Embroidered Agbada',
      image: '/images/products/BlackAgbada.jpg',
      unitsSold: 12,
      revenue: 1176000,
      spec: '99.8% Fit Match',
      origin: 'Royal Bespoke'
    },
    {
      name: 'Royal Sapphire Silk Senator Kaftan',
      image: '/images/products/BlueSenator.png',
      unitsSold: 16,
      revenue: 1040000,
      spec: '98.9% Fit Match',
      origin: 'Bespoke Native'
    },
    {
      name: 'Kano Full-Grain Leather Slides',
      image: '/images/products/UnisexSlides.jpg',
      unitsSold: 26,
      revenue: 910000,
      spec: '99.1% Fit Match',
      origin: 'Handmade Leather'
    },
  ];

  const boutiquePieces = [
    {
      name: 'Trapstar Cyber Heavyweight Hoodie',
      image: '/images/products/BlackTrapStarHoodie.jpg',
      unitsSold: 34,
      revenue: 1632000,
      spec: '4 Colorways In Stock',
      origin: 'Ready to Wear'
    },
    {
      name: 'Lagos Wide-Leg Baggy Denim Jeans',
      image: '/images/products/BaggyJean.jpg',
      unitsSold: 28,
      revenue: 1176000,
      spec: '3 Wash Washes In Stock',
      origin: 'Denim Drop'
    },
    {
      name: 'Oversized Boxy Heavyweight Hoodie',
      image: '/images/products/WhiteNdBrownHoodie.jpg',
      unitsSold: 42,
      revenue: 1050000,
      spec: '5 Colorways In Stock',
      origin: 'Streetwear Drop'
    },
    {
      name: 'Urban Streetwear NY Cap',
      image: '/images/products/NYCap.jpg',
      unitsSold: 50,
      revenue: 600000,
      spec: '6 Colorways In Stock',
      origin: 'Headwear Drop'
    },
  ];

  const activePieces = isBoutique ? boutiquePieces : bespokePieces;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold">
            {isBoutique ? <ShoppingBag className="h-3.5 w-3.5" /> : <Scissors className="h-3.5 w-3.5" />}
            <span>{isBoutique ? 'Ready-to-Wear Retail Dashboard' : '3D Virtual Tailoring Hub'}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Welcome back, {vendorProfile.designerName}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {isBoutique
              ? `Your boutique has 6 drops live across multiple colorways and ₦485,000 in available settlement funds.`
              : `Your atelier has 4 bespoke orders ready for cutting and ₦485,000 in available settlement funds.`}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/vendor-portal/publish"
            className="px-5 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{isBoutique ? 'Add New Product Drop' : 'Publish Bespoke Piece'}</span>
          </Link>
          <Link
            href="/vendor-portal/direct-sales"
            className="px-5 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury uppercase font-bold tracking-wider hover:border-[var(--gold-accent)] transition-all flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
            <span>Direct Sales Assistant</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Gross Sales</span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦4,905,000</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono-luxury font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18.4% this month</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">
            {isBoutique ? 'Orders to Pack' : 'Pending Orders'}
          </span>
          <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">
            {isBoutique ? '5 Orders' : '4 Orders'}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            24h Dispatch to Lagos Hub
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">
            {isBoutique ? 'Total Colorway Inventory' : 'Virtual Fit Accuracy'}
          </span>
          <div className="font-editorial text-3xl font-bold text-emerald-500">
            {isBoutique ? '142 Units' : '99.4%'}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            {isBoutique ? 'Across 6 Live Product Drops' : 'Zero Size Returns on Veyra'}
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Escrow Settlement</span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦485,000</div>
          <div className="text-xs text-emerald-500 font-mono-luxury font-bold">
            Settles Daily to {vendorProfile.bankName.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* 2-Column: Live Storefront Link + Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Top Performing Drops / Pieces */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
              {isBoutique ? 'Top Performing Boutique Drops' : 'Signature Bespoke Collection'}
            </h3>
            <Link href="/vendor-portal/reports" className="text-xs font-mono-luxury text-[var(--gold-accent)] hover:underline">
              View Analytics →
            </Link>
          </div>

          <div className="space-y-3">
            {activePieces.map((piece, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                    <Image src={piece.image} alt={piece.name} fill unoptimized className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{piece.name}</h4>
                    <div className="text-[10px] font-mono-luxury text-[var(--text-muted)] mt-0.5">
                      {piece.unitsSold} Sold · <span className="text-emerald-500 font-bold">{piece.spec}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-editorial text-sm font-bold text-[var(--gold-accent)]">
                    ₦{piece.revenue.toLocaleString()}
                  </div>
                  <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] uppercase">
                    {piece.origin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Dedicated Storefront Link Box */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>{isBoutique ? 'Dedicated Boutique Storefront' : 'Dedicated Atelier Storefront'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold">
              0% Fee
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Share your verified {isBoutique ? 'boutique link' : 'atelier boutique'} on your Instagram bio, WhatsApp status, and direct messages:
            </p>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--gold-accent)] break-all font-bold select-all">
              {typeof window !== 'undefined'
                ? `${window.location.origin}/brand/${encodeURIComponent(vendorProfile.brandName)}`
                : `https://veyra.ng/brand/${encodeURIComponent(vendorProfile.brandName)}`}
            </div>

            <Link
              href={`/brand/${encodeURIComponent(vendorProfile.brandName)}`}
              target="_blank"
              className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
