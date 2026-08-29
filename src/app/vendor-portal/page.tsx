'use client';

import { vendorFetch, getActiveVendorId } from '@/lib/services/apiClient';


import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp, PackageCheck, DollarSign, Sparkles,
  ArrowUpRight, Plus, ExternalLink, ShieldCheck, CheckCircle2,
  ShoppingBag, Scissors, Layers, Loader2, Clock, AlertTriangle, AlertCircle, ArrowRight, Store
} from 'lucide-react';

export default function VendorOverviewPage() {
  const { vendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_seller';

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Live Profile Verification Status
  const [profileStatus, setProfileStatus] = useState<{
    isProfileSaved: boolean;
    isVerified: boolean;
    approvalStatus: string;
    rejectionReason: string;
  } | null>(null);

  useEffect(() => {
    async function loadVendorData() {
      try {
        setLoadingData(true);
        const currentVendorId = vendorProfile.email || 'moji-wears';
        const currentBrandName = (vendorProfile.brandName || '').toLowerCase().trim();

        // 1. Fetch live vendor profile status from DB for THIS specific vendor
        const resProf = await fetch(`/api/vendor/profile?id=${encodeURIComponent(currentVendorId)}`);
        const profData = await resProf.json();

        if (resProf.ok && profData.success && profData.vendor) {
          setProfileStatus({
            isProfileSaved: !!profData.vendor.isProfileSaved,
            isVerified: !!profData.vendor.isVerified,
            approvalStatus: profData.vendor.approvalStatus || (profData.vendor.isVerified ? 'approved' : 'pending'),
            rejectionReason: profData.vendor.rejectionReason || ''
          });
        }

        // 2. Fetch only THIS vendor's own products from live DB
        const resProd = await fetch(`/api/products?vendorId=${encodeURIComponent(currentVendorId)}`);
        const prodData = await resProd.json();
        if (prodData.success && Array.isArray(prodData.products)) {
          // Strict safety filter: ensure product belongs to this vendor
          const strictlyMyProducts = prodData.products.filter((p: any) => {
            const pVendorId = (p.vendor_id || '').toLowerCase().trim();
            const pVendorName = (p.vendor_name || '').toLowerCase().trim();
            return (
              pVendorId === currentVendorId.toLowerCase() ||
              (currentBrandName && pVendorName.includes(currentBrandName)) ||
              (currentBrandName && currentBrandName.includes(pVendorName))
            );
          });
          setDbProducts(strictlyMyProducts);
        } else {
          setDbProducts([]);
        }
      } catch (err) {
        console.error('Error fetching vendor dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadVendorData();
  }, [vendorProfile.email]);

  const isVerified = profileStatus?.isVerified || profileStatus?.approvalStatus === 'approved';
  const isRejected = profileStatus?.approvalStatus === 'rejected';
  const isPendingReview = !isVerified && !isRejected && profileStatus?.isProfileSaved;
  const isProfileIncomplete = !isVerified && !isRejected && profileStatus && !profileStatus.isProfileSaved;

  // Calculate live inventory units from real products
  const totalLiveInventory = dbProducts.reduce((acc, p) => {
    if (p.sizes && typeof p.sizes === 'object') {
      const sum = Object.values(p.sizes).reduce((s: number, item: any) => s + (Number(item?.quantity) || 0), 0);
      return acc + (sum || 10);
    }
    return acc + 10;
  }, 0);

  // If data is still loading from the API, render clean skeleton to prevent flashing fake mock data
  if (loadingData) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-7xl pb-16">
        <div className="p-8 rounded-3xl surface-card border border-[var(--border-subtle)] flex items-center justify-center min-h-[220px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin" />
            <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading boutique dashboard intelligence...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 animate-pulse">
              <div className="h-3 w-20 bg-[var(--bg-secondary)] rounded" />
              <div className="h-8 w-32 bg-[var(--bg-secondary)] rounded" />
              <div className="h-3 w-24 bg-[var(--bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl pb-16">
      
      {/* ======================================================== */}
      {/* STATUS NOTIFICATION BANNER (ONLY SHOWN IF UNVERIFIED / PENDING / REJECTED) */}
      {/* ======================================================== */}
      
      {/* 1. Returned / Rejected Banner */}
      {isRejected && (
        <div className="p-5 sm:p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-lg">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-rose-400">
                  Action Required · Profile Returned
                </span>
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Store Profile Returned for Correction
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                {profileStatus.rejectionReason || 'Please review your store information, contact numbers, or social handles and resubmit.'}
              </p>
            </div>
          </div>

          <Link
            href="/vendor-portal/atelier"
            className="px-5 py-2.5 rounded-full bg-rose-500 text-white font-mono-luxury uppercase text-xs font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shrink-0 shadow-md w-fit"
          >
            <span>Update Store Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Incomplete Profile Banner */}
      {isProfileIncomplete && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-lg">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-amber-400">
                  Account Status · Not Verified
                </span>
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Complete Your Store Profile to Activate Drops
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                Set up your brand bio, contact details, and social channels so Super Admin can review and verify your store.
              </p>
            </div>
          </div>

          <Link
            href="/vendor-portal/atelier"
            className="px-5 py-2.5 rounded-full bg-amber-500 text-black font-mono-luxury uppercase text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shrink-0 shadow-md w-fit"
          >
            <span>Complete Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Submitted & Pending Super Admin Review Banner */}
      {isPendingReview && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-lg">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-amber-400">
                  Account Status · Pending Review
                </span>
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Store Profile Under Executive Review
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                Your store details have been submitted. Super Admin is reviewing your profile for verification.
              </p>
            </div>
          </div>

          <Link
            href="/vendor-portal/atelier"
            className="px-5 py-2.5 rounded-full surface-card border border-amber-500/30 text-amber-400 font-mono-luxury uppercase text-xs font-bold hover:bg-amber-500/10 transition-all flex items-center gap-2 shrink-0 w-fit"
          >
            <span>View Store Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold">
            {isBoutique ? <ShoppingBag className="h-3.5 w-3.5" /> : <Scissors className="h-3.5 w-3.5" />}
            <span>{isBoutique ? 'Ready-to-Wear Retail Dashboard' : '3D Virtual Tailoring Hub'}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Welcome back, {vendorProfile.designerName || vendorProfile.brandName}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isBoutique
              ? `Your boutique has ${dbProducts.length} live drops in database and direct storefront link generation.`
              : `Your atelier dashboard is connected and ready for customer tailoring orders.`}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/vendor-portal/publish"
            className="px-5 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{isBoutique ? 'Add New Product Drop' : 'Publish Bespoke Piece'}</span>
          </Link>
          <Link
            href="/vendor-portal/orders"
            className="px-5 py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-2"
          >
            <PackageCheck className="h-4 w-4 text-[var(--gold-accent)]" />
            <span>{isBoutique ? 'Pack Orders' : 'Fulfill Orders'}</span>
          </Link>
        </div>

        {/* Subtle background luxury glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--gold-accent)]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Live Catalog Drops</span>
          <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">{dbProducts.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono-luxury">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active database inventory</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">
            {isBoutique ? 'Orders to Pack' : 'Cutting Queue'}
          </span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
            0 Orders
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            Awaiting customer checkout
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">
            {isBoutique ? 'Total Colorway Inventory' : 'Fabric Inventory Yardage'}
          </span>
          <div className="font-editorial text-3xl font-bold text-emerald-500">
            {totalLiveInventory} Units
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            Across {dbProducts.length} live product drop{dbProducts.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Escrow Settlement</span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦0.00</div>
          <div className="text-xs text-[var(--gold-accent)] font-mono-luxury">
            Direct Bank Payout Active
          </div>
        </div>
      </div>

      {/* 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Pieces */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              {isBoutique ? 'Live Boutique Catalog & Drops' : 'Active Atelier Garments'}
            </h2>
            <Link
              href="/vendor-portal/publish"
              className="text-xs font-mono-luxury text-[var(--gold-accent)] uppercase tracking-wider hover:underline"
            >
              + Add Drop
            </Link>
          </div>

          {dbProducts.length === 0 ? (
            <div className="p-10 rounded-3xl surface-card border border-[var(--border-subtle)] text-center space-y-4">
              <Store className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                No product drops published yet
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-sm mx-auto">
                Upload your first ready-to-wear piece or custom collection to start selling on Veyra.
              </p>
              <Link
                href="/vendor-portal/publish"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Product Drop</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dbProducts.map((piece, i) => (
                <div
                  key={piece.id || i}
                  className="p-4 rounded-2xl surface-card border border-[var(--border-subtle)] flex items-center justify-between gap-4 hover:border-[var(--gold-accent)] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-14 rounded-xl overflow-hidden bg-black shrink-0">
                      <Image
                        src={piece.image_url || '/images/products/BlackTrapStarHoodie.jpg'}
                        alt={piece.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-editorial font-bold text-[var(--text-primary)] text-sm sm:text-base">
                        {piece.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-mono-luxury text-[var(--text-secondary)]">
                        <span className="text-[var(--gold-accent)] uppercase font-bold">{piece.category || 'Ready-to-Wear'}</span>
                        <span>•</span>
                        <span>{Array.isArray(piece.colors) ? `${piece.colors.length} Colors` : '1 Colorway'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-editorial font-bold text-sm text-[var(--text-primary)]">
                      ₦{Number(piece.price || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)]">
                      {piece.garment_origin_type === 'bespoke_atelier' ? 'Bespoke' : 'Ready-to-Wear'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Storefront Link Sharing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Dedicated Boutique Storefront</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono-luxury font-bold">
                  0% Fee
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono-luxury">
                Share your verified boutique link on your Instagram bio, WhatsApp status, and direct messages:
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-muted)] truncate select-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/brand/${encodeURIComponent(vendorProfile.brandName)}` : `https://veyra.ng/brand/${encodeURIComponent(vendorProfile.brandName)}`}
            </div>

            <Link
              href={`/brand/${encodeURIComponent(vendorProfile.brandName)}`}
              target="_blank"
              className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
