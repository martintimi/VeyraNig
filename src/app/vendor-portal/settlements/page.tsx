'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  DollarSign, CreditCard, ShieldCheck, CheckCircle2,
  Clock, ArrowUpRight, TrendingUp, Download
} from 'lucide-react';

export default function VendorSettlementsPage() {
  const { vendorProfile } = useStore();

  const settlementHistory = [
    {
      id: 'SET-9201',
      date: '22 Aug 2026',
      amount: 485000,
      bank: vendorProfile.bankName,
      account: `•••• ${vendorProfile.accountNumber.slice(-4)}`,
      status: 'Settled to Bank (T+1)',
      reference: 'VY-ESCROW-TX9201'
    },
    {
      id: 'SET-9188',
      date: '15 Aug 2026',
      amount: 620000,
      bank: vendorProfile.bankName,
      account: `•••• ${vendorProfile.accountNumber.slice(-4)}`,
      status: 'Settled to Bank (T+1)',
      reference: 'VY-ESCROW-TX9188'
    },
    {
      id: 'SET-9142',
      date: '08 Aug 2026',
      amount: 940000,
      bank: vendorProfile.bankName,
      account: `•••• ${vendorProfile.accountNumber.slice(-4)}`,
      status: 'Settled to Bank (T+1)',
      reference: 'VY-ESCROW-TX9142'
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Settlements & Merchant Treasury
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            Automated split payouts wired directly into your verified Nigerian commercial bank account with 0% platform promo fee.
          </p>
        </div>

        <button
          onClick={() => alert('Payout ledger statement downloaded!')}
          className="px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-2"
        >
          <Download className="h-4 w-4 text-[var(--gold-accent)]" />
          <span>Download Payout Advice</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Available for Settlement</span>
          <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦485,000</div>
          <span className="text-xs text-emerald-500 font-mono-luxury font-bold">Auto-Settles in 24h</span>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Lifetime Payouts</span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦4,905,000</div>
          <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">78 Orders Settled</span>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Active Platform Fee</span>
          <div className="font-editorial text-3xl font-bold text-emerald-500">0% Special Rate</div>
          <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">Verified Partner Atelier</span>
        </div>
      </div>

      {/* Verified Bank Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 6 Cols: Bank Details Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl surface-card space-y-4 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified Merchant Settlement Account</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase">Settlement Bank:</span>
              <span className="font-bold text-[var(--text-primary)]">{vendorProfile.bankName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase">NUBAN Account Number:</span>
              <span className="font-bold text-[var(--text-primary)] tracking-widest">{vendorProfile.accountNumber}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase">Account Name:</span>
              <span className="font-bold text-[var(--text-primary)]">{vendorProfile.accountName}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-luxury">
              <span className="text-[var(--text-secondary)] uppercase">Settlement Cadence:</span>
              <span className="font-bold text-emerald-500">Daily Automated Split (T+1)</span>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Escrow Protection Info */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl surface-card space-y-3 border border-[var(--border-subtle)]">
          <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
            How Veyra Escrow Protects Your Atelier
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono-luxury">
            Every customer payment is pre-authorized and locked in escrow when an order is placed. Once your garment passes sizing inspection and is dispatched to our Lagos Central Hub, funds automatically unlock and wire directly into your commercial bank account.
          </p>
          <div className="pt-2 text-xs font-mono-luxury text-emerald-500 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Zero Fake Bank Alert Fraud Guaranteed</span>
          </div>
        </div>

      </div>

      {/* Payout History Ledger */}
      <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
        <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
          Recent Payout Disbursements
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-luxury">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Settlement Bank</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount Wired</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              {settlementHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[var(--gold-accent)]">{item.id}</td>
                  <td className="py-3.5 px-4">{item.date}</td>
                  <td className="py-3.5 px-4">
                    {item.bank} <span className="text-[var(--text-muted)]">({item.account})</span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">{item.reference}</td>
                  <td className="py-3.5 px-4 text-right font-editorial text-sm font-bold text-emerald-500">
                    ₦{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
