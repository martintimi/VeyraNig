'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  Search, ShieldCheck, CheckCircle2, Truck, Scissors, PackageCheck,
  Building, Phone, MapPin, Clock, ArrowRight, ArrowLeft, RefreshCw,
  ExternalLink, Check, AlertCircle, Loader2, Star, Send
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrderNo = searchParams.get('orderNumber') || '';

  const { userOrders, getOrderById } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialOrderNo);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReleasingEscrow, setIsReleasingEscrow] = useState(false);
  const [escrowReleasedToast, setEscrowReleasedToast] = useState(false);

  // Rating & Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFit, setReviewFit] = useState('true_to_size');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch live order directly from PostgreSQL backend API
  const fetchOrderFromDb = async (queryNum: string) => {
    if (!queryNum) return;
    setIsSearching(true);
    setIsRefreshing(true);

    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(queryNum.trim())}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();

      if (res.ok && data.success && data.orders && data.orders.length > 0) {
        setSearchedOrder(data.orders[0]);
        if (data.orders[0].customer_measurements?.isRated) {
          setReviewSubmitted(true);
        }
      } else {
        const storeMatch = userOrders.find(
          (o) => o.orderNumber.toLowerCase() === queryNum.toLowerCase().trim() || o.id === queryNum.trim()
        );
        if (storeMatch) {
          setSearchedOrder(storeMatch);
        } else {
          setSearchedOrder(null);
        }
      }
    } catch (e) {
      console.error('Error fetching live order tracking:', e);
    } finally {
      setIsSearching(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialOrderNo) {
      fetchOrderFromDb(initialOrderNo);
    }
  }, [initialOrderNo]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchOrderFromDb(searchQuery);
  };

  const handleConfirmReceived = async () => {
    if (!searchedOrder) return;
    setIsReleasingEscrow(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: searchedOrder.orderNumber,
          status: 'delivered',
          trackingStage: 4,
        })
      });

      if (res.ok) {
        setSearchedOrder((prev: any) => ({
          ...prev,
          status: 'delivered',
          trackingStage: 4,
        }));
        setEscrowReleasedToast(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e6c367', '#10b981', '#ffffff']
        });
        setTimeout(() => setEscrowReleasedToast(false), 5000);
        // Automatically open review dialog
        setShowReviewModal(true);
      }
    } catch (e) {
      console.error('Error confirming receipt:', e);
    } finally {
      setIsReleasingEscrow(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedOrder || !reviewComment.trim()) return;
    setIsSubmittingReview(true);

    try {
      const firstItem = searchedOrder.items?.[0] || {};
      const payload = {
        orderNumber: searchedOrder.orderNumber,
        orderId: searchedOrder.id,
        productId: firstItem.productId || firstItem.id,
        productName: firstItem.productName || firstItem.name || 'Garment Piece',
        vendorId: firstItem.vendorId || 'moji-wears',
        customerName: searchedOrder.customerName || 'Valued Client',
        rating: reviewRating,
        fitRating: reviewFit,
        comment: reviewComment.trim()
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setShowReviewModal(false);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e6c367', '#10b981', '#ffffff']
        });
      }
    } catch (e) {
      console.error('Error submitting review:', e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const currentStage = searchedOrder?.trackingStage || 1;

  const stages = [
    {
      num: 1,
      title: 'Escrow Secured & Confirmed',
      desc: 'Customer payment is secured in Veyra escrow. Order sent to merchant atelier.',
      time: 'Completed',
    },
    {
      num: 2,
      title: 'Packed & Ready at Store',
      desc: 'Vendor has verified inventory and sealed package for logistics handoff.',
      time: currentStage >= 2 ? 'Completed' : 'In Progress',
    },
    {
      num: 3,
      title: 'Dispatched with Courier',
      desc: 'Package is in transit with dispatch rider or interstate motor park driver.',
      time: currentStage >= 3 ? 'In Transit' : 'Pending',
    },
    {
      num: 4,
      title: 'Delivered & Escrow Released',
      desc: 'Customer receives clothes and approves release of escrow funds to vendors.',
      time: currentStage >= 4 ? 'Completed' : 'Pending',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-fadeIn pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Live Logistics Tracking
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Track Your Order
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {searchedOrder && (
            <button
              type="button"
              onClick={() => fetchOrderFromDb(searchedOrder.orderNumber)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] hover:underline font-bold cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          )}

          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>

      {/* Order Search Box */}
      <form onSubmit={handleSearch} className="p-4 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] shadow-sm space-y-3">
        <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold">
          Enter Your Order Reference Number:
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. #VY-ORD-7564"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Track</span>}
          </button>
        </div>
      </form>

      {/* Order Tracking Dashboard */}
      {searchedOrder ? (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Status Card */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider block">
                  Order Number
                </span>
                <span className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--gold-accent)]">
                  {searchedOrder.orderNumber}
                </span>
                <div className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Placed on: {searchedOrder.date || 'Today'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono-luxury font-bold uppercase">
                  {searchedOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* 4-Stage Visual Progress Tracker */}
            <div className="space-y-6 pt-2">
              <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
                Fulfillment Timeline
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {stages.map((st) => {
                  const isCompleted = currentStage >= st.num;
                  const isCurrent = currentStage === st.num;

                  return (
                    <div
                      key={st.num}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-[var(--bg-primary)] border-[var(--gold-accent)]/50 shadow-sm'
                          : 'bg-[var(--bg-secondary)]/50 border-[var(--border-subtle)] opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono-luxury ${
                          isCompleted
                            ? 'bg-[var(--gold-accent)] text-white'
                            : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : st.num}
                        </div>
                        <span className={`text-[10px] font-mono-luxury font-bold ${isCurrent ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                          {st.time}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[var(--text-primary)] leading-tight">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Driver Information (if Dispatched) */}
            {currentStage >= 3 && (searchedOrder.trackingDetails?.driverPhone || searchedOrder.trackingDetails?.waybillNumber) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--gold-subtle)]/40 border border-[var(--gold-accent)]/30 flex items-center justify-between text-xs font-mono-luxury text-[var(--text-primary)] flex-wrap gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[var(--gold-accent)]/20 border border-[var(--gold-accent)]/40 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-[var(--gold-accent)]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[var(--gold-accent)]">Package In Transit With Rider</div>
                    {searchedOrder.trackingDetails?.driverPhone && (
                      <div className="font-bold text-sm text-[var(--text-primary)] mt-0.5 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                        <span>Driver: {searchedOrder.trackingDetails.driverPhone}</span>
                      </div>
                    )}
                    {searchedOrder.trackingDetails?.waybillNumber && (
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Waybill / Park Code: <strong>{searchedOrder.trackingDetails.waybillNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {searchedOrder.trackingDetails?.driverPhone && (
                  <a
                    href={`tel:${searchedOrder.trackingDetails.driverPhone}`}
                    className="px-4 py-2.5 rounded-full bg-[var(--gold-accent)] text-black font-bold uppercase text-xs hover:bg-[#d8b357] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 text-black" />
                    <span>Call Driver Directly</span>
                  </a>
                )}
              </div>
            )}

            {/* Customer Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs font-mono-luxury">
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] uppercase text-[10px]">Recipient:</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{searchedOrder.customerName}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">{searchedOrder.customerPhone}</div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] uppercase text-[10px]">Delivery Address:</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{searchedOrder.deliveryAddress}</div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] uppercase text-[10px]">Total Escrow Paid:</div>
                <div className="font-bold text-[var(--gold-accent)] text-sm mt-0.5">₦{Number(searchedOrder.totalAmount || 0).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400">Protected by Veyra Escrow</div>
              </div>
            </div>

            {/* Release Escrow Action if Delivered */}
            {currentStage < 4 ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono-luxury text-amber-400 font-bold uppercase">
                      Escrow Active & Protected
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                      Your money is held safely. Once your clothes arrive and you inspect them, click below to confirm receipt.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmReceived}
                  disabled={isReleasingEscrow}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 text-white text-xs font-mono-luxury uppercase font-bold hover:bg-emerald-400 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isReleasingEscrow ? 'Releasing Funds...' : 'Confirm Delivery Received'}
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-mono-luxury text-emerald-400 font-bold uppercase">
                      Order Completed & Escrow Released
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                      {reviewSubmitted ? 'Thank you! Your verified rating and review has been published.' : 'Your package has been delivered! Leave a rating for the vendor.'}
                    </div>
                  </div>
                </div>

                {!reviewSubmitted && (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="px-5 py-2 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold hover:bg-[#d8b357] transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Star className="h-4 w-4 fill-current text-black" />
                    <span>Rate & Review Vendor</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Garments in this Order */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] shadow-md space-y-4">
            <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
              Items in Package
            </span>

            <div className="space-y-3">
              {(searchedOrder.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                      <Image src={item.imageUrl} alt={item.productName || item.name} fill unoptimized className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{item.productName || item.name}</h4>
                      <div className="text-[11px] font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                        Brand: <strong className="text-[var(--gold-accent)]">{item.vendorName || 'Atelier'}</strong> · Size: <strong className="text-[var(--text-primary)]">{item.size || 'M'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono-luxury text-[var(--gold-accent)] font-bold">
                      ₦{Number(item.price || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold uppercase">
                      Ready-to-Wear
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : searchQuery && !isSearching ? (
        <div className="p-12 rounded-3xl surface-card border border-[var(--border-subtle)] text-center space-y-4 animate-fadeIn">
          <div className="h-14 w-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              Order Not Found
            </h3>
            <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find an order matching &quot;{searchQuery}&quot;. Please check your reference code from your receipt.
            </p>
          </div>
        </div>
      ) : null}

      {/* Interactive Rating & Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[var(--border-subtle)] space-y-5 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center">
                  <Star className="h-5 w-5 fill-current text-[var(--gold-accent)]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                    Rate Your Order & Vendor
                  </h3>
                  <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                    Your feedback is published on the product and store storefront.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-mono-luxury">
              {/* Star Rating Selector */}
              <div>
                <label className="block uppercase text-[var(--text-secondary)] mb-2 font-bold">
                  Overall Star Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= reviewRating
                            ? 'text-[var(--gold-accent)] fill-[var(--gold-accent)]'
                            : 'text-[var(--border-subtle)] fill-none'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-sm text-[var(--gold-accent)]">{reviewRating}.0 / 5.0</span>
                </div>
              </div>

              {/* Fit Accuracy */}
              <div>
                <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Sizing & Fit Accuracy:
                </label>
                <select
                  value={reviewFit}
                  onChange={(e) => setReviewFit(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                >
                  <option value="true_to_size">True to Size (Perfect Fit)</option>
                  <option value="runs_small">Runs Slightly Small / Snug</option>
                  <option value="runs_large">Runs Loose / Oversized</option>
                </select>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Your Review & Comments:
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on fabric quality, sizing drape, and vendor speed..."
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 rounded-full surface-card border border-[var(--border-subtle)] uppercase font-bold text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 py-3 rounded-full bg-[var(--gold-accent)] text-white uppercase font-bold hover:bg-[#d8b357] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Send className="h-4 w-4 text-white" />}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
