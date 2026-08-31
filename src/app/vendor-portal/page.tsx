'use client';

import { vendorFetch, getActiveVendorId } from '@/lib/services/apiClient';
import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/lib/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp, PackageCheck, DollarSign, Sparkles,
  ArrowUpRight, Plus, ExternalLink, ShieldCheck, CheckCircle2,
  ShoppingBag, Scissors, Layers, Loader2, Clock, AlertTriangle, AlertCircle, ArrowRight, Store, RefreshCw, Star, Lock
} from 'lucide-react';
import MobileVendorOverview from '@/components/vendor/MobileVendorOverview';
import VendorLuxuryLoader from '@/components/vendor/VendorLuxuryLoader';
import { isBoutiqueVendor } from '@/types';

export default function VendorOverviewPage() {
  const { vendorProfile, setVendorProfile } = useStore();
  const isBoutique = isBoutiqueVendor(vendorProfile);

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<{ averageRating: number; count: number }>({ averageRating: 5.0, count: 0 });
  const [loadingData, setLoadingData] = useState(true);

  // Live Profile Verification Status
  const [profileStatus, setProfileStatus] = useState<{
    isProfileSaved: boolean;
    isVerified: boolean;
    approvalStatus: string;
    rejectionReason: string;
  } | null>(null);

  const loadVendorData = useCallback(async () => {
    try {
      setLoadingData(true);
      const currentVendorId = vendorProfile.email || getActiveVendorId();
      const currentBrandName = (vendorProfile.brandName || '').toLowerCase().trim();

      // Parallel fetch from all real endpoints
      const [resProf, resProd, resOrders, resReviews] = await Promise.all([
        vendorFetch('/api/vendor/profile'),
        vendorFetch(`/api/products?vendorId=${encodeURIComponent(currentVendorId)}`),
        vendorFetch('/api/orders'),
        fetch(`/api/reviews?vendorId=${encodeURIComponent(currentVendorId)}`, { headers: { 'Cache-Control': 'no-cache' } })
      ]);

      // 1. Process vendor profile
      const profData = await resProf.json();
      if (resProf.ok && profData.success && profData.vendor) {
        const v = profData.vendor;
        const verified = !!v.is_verified || !!v.isVerified;
        setProfileStatus({
          isProfileSaved: !!v.isProfileSaved,
          isVerified: verified,
          approvalStatus: verified ? 'approved' : (v.approvalStatus || 'pending'),
          rejectionReason: v.rejectionReason || ''
        });

        const normalizedType = isBoutiqueVendor(v) ? 'boutique_seller' : 'fashion_designer';
        setVendorProfile({
          brandName: v.brandName || v.brand_name || vendorProfile.brandName || 'My Brand',
          designerName: v.designerName || v.designer_name || v.contact_person || vendorProfile.designerName || 'Manager',
          contactPerson: v.contactPerson || v.contact_person || v.designerName || v.designer_name || vendorProfile.contactPerson,
          email: v.email || vendorProfile.email,
          phone: v.phone || vendorProfile.phone,
          location: v.location || (v.city && v.state ? `${v.city}, ${v.state}` : vendorProfile.location) || 'Lagos, Nigeria',
          vendorType: normalizedType,
          bankName: v.bankName || v.bank_name || vendorProfile.bankName,
          accountNumber: v.accountNumber || v.account_number || vendorProfile.accountNumber,
          accountName: v.accountName || v.account_name || vendorProfile.accountName,
          bio: v.bio || vendorProfile.bio
        });
      }

      // 2. Process products
      const prodData = await resProd.json();
      if (prodData.success && Array.isArray(prodData.products)) {
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

      // 3. Process orders
      const ordersData = await resOrders.json();
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      } else {
        setOrders([]);
      }

      // 4. Process reviews
      const revData = await resReviews.json();
      if (resReviews.ok && revData.success) {
        setReviewsData({
          averageRating: revData.averageRating || 0,
          count: revData.count || (revData.reviews ? revData.reviews.length : 0)
        });
      }
    } catch (err) {
      console.error('Error fetching live vendor dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [vendorProfile.email, vendorProfile.brandName]);

  useEffect(() => {
    loadVendorData();
  }, [loadVendorData]);

  const isVerified = profileStatus?.isVerified || profileStatus?.approvalStatus === 'approved';
  const isRejected = profileStatus?.approvalStatus === 'rejected';
  const isPendingReview = !isVerified && !isRejected && profileStatus?.isProfileSaved;
  const isProfileIncomplete = !isVerified && !isRejected && profileStatus && !profileStatus.isProfileSaved;

  // Real computed metrics from live database
  const pendingOrdersCount = orders.filter(o => (o.trackingStage || 1) < 3).length;

  const totalEscrowLocked = orders
    .filter(o => (o.trackingStage || 1) < 4)
    .reduce((sum, ord) => {
      const itemsTotal = (ord.items || []).reduce((s: number, i: any) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
      const shipping = Number(ord.shippingFee) || 2500;
      return sum + itemsTotal + shipping;
    }, 0);

  const completedOrders = orders.filter(o => (o.trackingStage || 1) >= 4);
  const totalSettled = completedOrders.reduce((sum, ord) => {
    const itemsTotal = (ord.items || []).reduce((s: number, i: any) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
    const shipping = Number(ord.shippingFee) || 2500;
    return sum + itemsTotal + shipping;
  }, 0);

  const totalLiveInventory = dbProducts.reduce((acc, p) => {
    if (p.size_stock && typeof p.size_stock === 'object') {
      const sum = Object.values(p.size_stock).reduce((s: number, item: any) => s + (Number(item?.quantity) || 0), 0);
      return acc + sum;
    }
    if (p.sizes && typeof p.sizes === 'object' && !Array.isArray(p.sizes)) {
      const sum = Object.values(p.sizes).reduce((s: number, item: any) => s + (Number(item?.quantity) || 0), 0);
      return acc + sum;
    }
    return acc + (Number(p.stock_quantity || p.stockQuantity) || 0);
  }, 0);

  if (loadingData) {
    return <VendorLuxuryLoader label="Loading Live Boutique Intelligence & Orders..." />;
  }

  return (
    <>
      {/* 1. DEDICATED MOBILE VENDOR OVERVIEW */}
      <div className="block md:hidden">
        <MobileVendorOverview
          vendorProfile={vendorProfile}
          dbProducts={dbProducts}
          totalLiveInventory={totalLiveInventory}
          profileStatus={profileStatus}
          pendingOrdersCount={pendingOrdersCount}
          activeEscrowBalance={totalEscrowLocked}
          settledPayouts={totalSettled}
          recentOrders={orders}
        />
      </div>

      {/* 2. DESKTOP LUXURY VENDOR OVERVIEW */}
      <div className="hidden md:block space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl pb-16">
      
        {/* ======================================================== */}
        {/* STATUS NOTIFICATION BANNER */}
        {/* ======================================================== */}
        {isRejected && (
          <div className="p-5 sm:p-6 rounded-3xl surface-card border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-md">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-rose-400 tracking-wider">
                  Action Required · Profile Returned
                </span>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  Store Profile Returned for Correction
                </h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                  {profileStatus?.rejectionReason ? `Admin Feedback: "${profileStatus.rejectionReason}"` : 'Please review your store information, turnaround times, or delivery zone rates.'}
                </p>
              </div>
            </div>

            <Link
              href="/vendor-portal/atelier"
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono-luxury uppercase text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md w-fit cursor-pointer"
            >
              <span>Update Store Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {isProfileIncomplete && (
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-lg">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-amber-400">
                  Account Status · Not Verified
                </span>
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

        {isPendingReview && (
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-lg">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono-luxury font-bold uppercase text-amber-400">
                  Account Status · Pending Review
                </span>
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
                ? `Your boutique has ${dbProducts.length} live drops in database and ${pendingOrdersCount} orders awaiting pack.`
                : `Your atelier has ${dbProducts.length} bespoke pieces and ${pendingOrdersCount} orders in queue.`}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={loadVendorData}
              className="p-3 rounded-full surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-secondary)] hover:text-white transition-all"
              title="Refresh Live Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            {isVerified ? (
              <Link
                href="/vendor-portal/publish"
                className="px-5 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>{isBoutique ? 'Add New Product Drop' : 'Publish Bespoke Piece'}</span>
              </Link>
            ) : (
              <Link
                href="/vendor-portal/atelier"
                className="px-5 py-3 rounded-full bg-[var(--bg-secondary)] border border-amber-500/30 text-amber-400 font-mono-luxury uppercase text-xs font-bold tracking-wider hover:bg-amber-500/10 transition-all shadow-md flex items-center gap-2"
                title="Store verification required before adding drops"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Verification Required to Drop</span>
              </Link>
            )}
            <Link
              href="/vendor-portal/orders"
              className="px-5 py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-2"
            >
              <PackageCheck className="h-4 w-4 text-[var(--gold-accent)]" />
              <span>{isBoutique ? 'Pack Orders' : 'Fulfill Orders'} ({pendingOrdersCount})</span>
            </Link>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--gold-accent)]/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 4 Stat Metric Cards (Connected to Real Database Endpoints) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Live Catalog Drops</span>
            <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">{dbProducts.length}</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono-luxury">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Active in live catalog</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">
              {isBoutique ? 'Orders to Pack' : 'Cutting Queue'}
            </span>
            <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
              {pendingOrdersCount} Order{pendingOrdersCount === 1 ? '' : 's'}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
              {pendingOrdersCount === 0 ? 'Fulfillment up to date' : 'Awaiting packaging / dispatch'}
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
            <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Active Escrow Balance</span>
            <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">
              ₦{totalEscrowLocked.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 font-mono-luxury font-bold">
              Instant T+0 Bank Transfers
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
                          src={piece.imageUrl || piece.image_url || '/images/products/BlackTrapStarHoodie.jpg'}
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

          {/* Right Column: Storefront Link Sharing & Recent Orders */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Storefront Link Card */}
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

            {/* Recent Orders Overview */}
            {orders.length > 0 && (
              <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[var(--gold-accent)]" />
                    <span>Recent Incoming Orders</span>
                  </span>
                  <Link
                    href="/vendor-portal/orders"
                    className="text-xs text-[var(--gold-accent)] font-mono-luxury uppercase font-bold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord, idx) => {
                    const rowSubtotal = (ord.items || []).reduce((s: number, i: any) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
                    const isSettled = ord.trackingStage >= 4;

                    return (
                      <div
                        key={ord.id || ord.orderNumber || idx}
                        className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono-luxury"
                      >
                        <div>
                          <span className="font-bold text-[var(--gold-accent)] block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {ord.customerName} · {ord.date || 'Recent'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-editorial font-bold text-sm text-[var(--text-primary)] block">
                            ₦{rowSubtotal.toLocaleString()}
                          </span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full inline-block ${
                            isSettled ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {isSettled ? 'Settled' : 'In Escrow'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}
