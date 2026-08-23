'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  TrendingUp, BarChart3, PieChart, FileText,
  Download, ArrowUpRight, DollarSign, Users, Award
} from 'lucide-react';

export default function VendorReportsPage() {
  const { vendorProfile } = useStore();

  const monthlySales = [
    { month: 'Apr', revenue: 640000, orders: 11 },
    { month: 'May', revenue: 890000, orders: 14 },
    { month: 'Jun', revenue: 1120000, orders: 18 },
    { month: 'Jul', revenue: 1480000, orders: 23 },
    { month: 'Aug (MTD)', revenue: 775000, orders: 12 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Sales Reports & Atelier Analytics
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            Real-time breakdown of native garment sales, customer sizing satisfaction, and revenue trends.
          </p>
        </div>

        <button
          onClick={() => alert('Financial ledger report exported to CSV!')}
          className="px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-2"
        >
          <Download className="h-4 w-4 text-[var(--gold-accent)]" />
          <span>Export Monthly Statement</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Total Lifetime Volume</span>
          <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">₦4,905,000</div>
          <div className="text-xs text-emerald-500 font-mono-luxury font-bold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>78 Bespoke & Ready-to-Wear Drops</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦62,880</div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            Top Category: Handmade Senator Suits
          </div>
        </div>

        <div className="p-6 rounded-3xl surface-card space-y-2 border border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase tracking-wider">Client Fit Rating</span>
          <div className="font-editorial text-3xl font-bold text-emerald-500">4.95 / 5.0</div>
          <div className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            99.4% First-Time Fit Accuracy
          </div>
        </div>
      </div>

      {/* Monthly Sales Breakdown Table */}
      <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
        <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
          Monthly Revenue Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-luxury">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Garments Completed</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Platform Fee (0%)</th>
                <th className="py-3 px-4 text-right">Net Settlement Wired</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              {monthlySales.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold">{row.month}</td>
                  <td className="py-3.5 px-4">{row.orders} Pieces</td>
                  <td className="py-3.5 px-4 font-editorial text-sm font-bold text-[var(--gold-accent)]">
                    ₦{row.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-500 font-bold">₦0 (0% Promo)</td>
                  <td className="py-3.5 px-4 text-right font-editorial text-sm font-bold text-emerald-500">
                    ₦{row.revenue.toLocaleString()}
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
