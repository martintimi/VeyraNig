'use client';

import React, { useState, useMemo } from 'react';
import {
  Star, ShieldCheck, CheckCircle2, MessageSquare,
  RefreshCw, Sparkles, Filter, ChevronRight, User
} from 'lucide-react';
import VendorLuxuryLoader from './VendorLuxuryLoader';

interface MobileVendorReviewsProps {
  reviewsData: {
    averageRating: number;
    fitAccuracyPercent: number;
    count: number;
    reviews: any[];
  };
  isLoading: boolean;
  onRefresh: () => void;
}

export default function MobileVendorReviews({
  reviewsData,
  isLoading,
  onRefresh
}: MobileVendorReviewsProps) {
  const [filterTab, setFilterTab] = useState<'all' | '5stars' | 'comments'>('all');

  const reviews = reviewsData.reviews || [];

  const fiveStarReviews = useMemo(() => {
    return reviews.filter(r => Number(r.rating || 5) >= 5);
  }, [reviews]);

  const commentedReviews = useMemo(() => {
    return reviews.filter(r => r.comment && r.comment.trim().length > 0);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filterTab === '5stars') return fiveStarReviews;
    if (filterTab === 'comments') return commentedReviews;
    return reviews;
  }, [reviews, filterTab, fiveStarReviews, commentedReviews]);

  if (isLoading) {
    return <VendorLuxuryLoader label="Loading Customer Reputation Ledger..." />;
  }

  return (
    <div className="space-y-4 animate-fadeIn pb-24 select-none">
      
      {/* 1. Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase font-bold border border-[var(--gold-accent)]/20 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-accent)] animate-pulse" />
            <span>Reputation Ledger</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] leading-tight">
            Client Reviews & Scores
          </h2>
          <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
            Verified ratings & sizing accuracy left by shoppers.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-2xl surface-card border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer shrink-0 active:scale-95"
          title="Refresh Reviews"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Overview Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Rating Score */}
        <div className="p-3.5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1.5 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] font-mono-luxury tracking-wider block">
            Brand Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-[var(--gold-accent)]">
              {reviewsData.count > 0 ? reviewsData.averageRating.toFixed(1) : '—'}
            </span>
            <div className="flex items-center gap-0.5 text-[var(--gold-accent)]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${
                    reviewsData.count > 0 && s <= Math.round(reviewsData.averageRating)
                      ? 'fill-current text-[var(--gold-accent)]'
                      : 'text-[var(--border-subtle)]'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[9px] font-mono-luxury text-[var(--text-secondary)]">
            {reviewsData.count > 0 ? `${reviewsData.count} Verified Review(s)` : 'No ratings yet'}
          </p>
        </div>

        {/* Fit Accuracy */}
        <div className="p-3.5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1.5 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] font-mono-luxury tracking-wider block">
            Fit Accuracy
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-emerald-400">
              {reviewsData.count > 0 ? `${reviewsData.fitAccuracyPercent}%` : '—'}
            </span>
            {reviewsData.count > 0 && (
              <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10">
                True Size
              </span>
            )}
          </div>
          <p className="text-[9px] font-mono-luxury text-[var(--text-secondary)]">
            {reviewsData.count > 0 ? 'Matches RTW standard' : 'Awaiting orders'}
          </p>
        </div>

      </div>

      {/* Verified Guarantee Pill */}
      <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono-luxury">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-[var(--text-primary)] font-bold">
            100% Verified Buyer Reviews
          </span>
        </div>
        <span className="text-[9px] text-[var(--text-muted)]">
          Escrow-Inspected
        </span>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-2 rounded-xl text-center font-bold uppercase text-[10px] transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('5stars')}
          className={`flex-1 py-2 rounded-xl text-center font-bold uppercase text-[10px] transition-all cursor-pointer ${
            filterTab === '5stars'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          5 Stars ({fiveStarReviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('comments')}
          className={`flex-1 py-2 rounded-xl text-center font-bold uppercase text-[10px] transition-all cursor-pointer ${
            filterTab === 'comments'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          Comments ({commentedReviews.length})
        </button>
      </div>

      {/* 4. Review Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="p-8 rounded-3xl surface-card text-center space-y-2 border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-muted)]">
          <MessageSquare className="h-8 w-8 text-[var(--gold-accent)] mx-auto opacity-50 mb-1" />
          <p className="font-bold text-[var(--text-primary)] text-sm">No Reviews in this Filter</p>
          <p className="text-[11px]">When customers complete orders and leave feedback, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev: any, idx: number) => {
            const customerInitials = (rev.customerName || 'Verified Client')
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={rev.id || idx}
                className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm text-xs font-mono-luxury"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold text-xs flex items-center justify-center border border-[var(--gold-accent)]/30 shrink-0 font-editorial">
                      {customerInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--text-primary)] text-xs">
                          {rev.customerName || 'Verified Client'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">
                          Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {rev.orderNumber || '#VY-ORD'} · {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-[var(--gold-accent)] shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= Number(rev.rating || 5)
                            ? 'fill-current text-[var(--gold-accent)]'
                            : 'text-[var(--border-subtle)]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Piece name & Fit Rating */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)] truncate max-w-[180px]">
                    {rev.productName || 'Garment Piece'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[9px] font-bold shrink-0">
                    {rev.fitRating === 'true_to_size' ? 'True to Size' : (rev.fitRating?.replace(/_/g, ' ') || 'True to Size')}
                  </span>
                </div>

                {/* Comment Box */}
                {rev.comment && (
                  <p className="text-[11px] font-mono-luxury text-[var(--text-primary)] leading-relaxed italic bg-[var(--bg-secondary)] p-3 rounded-2xl border border-[var(--border-subtle)]">
                    &quot;{rev.comment}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
