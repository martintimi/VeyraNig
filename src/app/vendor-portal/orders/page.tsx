'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import Image from 'next/image';
import {
  PackageCheck, Clock, CheckCircle2, ShieldCheck,
  Phone, MapPin, User, Truck, ShoppingBag, Scissors, Layers
} from 'lucide-react';

export default function VendorOrdersPage() {
  const { vendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';

  const tailorOrders = [
    {
      id: 'ord-lagos-101',
      orderNumber: '#VY-ORD-9204',
      date: 'Today, 2:15 PM',
      customerName: 'Babatunde Adeleke',
      phone: '+234 803 222 1199',
      location: 'Ikoyi, Lagos',
      productName: 'Onyx Black Wool Senator Kaftan',
      colorway: 'Midnight Black Wool',
      size: 'L (Chest: 104cm, Shoulder: 49cm, Inseam: 84cm)',
      quantity: 1,
      amount: 65000,
      status: 'Ready for Cutting',
      dispatchDeadline: 'Tomorrow, 5:00 PM (Lagos Express)',
      image: '/images/products/BlackSenator.jpg'
    },
    {
      id: 'ord-lagos-102',
      orderNumber: '#VY-ORD-9205',
      date: 'Today, 11:30 AM',
      customerName: 'Chioma Okonkwo',
      phone: '+234 802 888 4433',
      location: 'Lekki Phase 1, Lagos',
      productName: 'Midnight Black Embroidered Agbada',
      colorway: 'Royal Gold & Black',
      size: 'XL (Chest: 112cm, Shoulder: 52cm, Height: 185cm)',
      quantity: 1,
      amount: 98000,
      status: 'Tailoring in Progress',
      dispatchDeadline: '24 Aug 2026 (Lagos Express)',
      image: '/images/products/BlackAgbada.jpg'
    }
  ];

  const boutiqueOrders = [
    {
      id: 'ord-btq-201',
      orderNumber: '#VY-ORD-9210',
      date: 'Today, 3:45 PM',
      customerName: 'Tobi Daniels',
      phone: '+234 814 999 3322',
      location: 'Victoria Island, Lagos',
      productName: 'Trapstar Cyber Heavyweight Hoodie',
      colorway: 'Heather Grey',
      size: 'Size L · 1 Unit',
      quantity: 1,
      amount: 48000,
      status: 'Ready to Pack',
      dispatchDeadline: 'Same-Day Dispatch (Lagos Hub)',
      image: '/images/products/BlackTrapStarHoodie.jpg'
    },
    {
      id: 'ord-btq-202',
      orderNumber: '#VY-ORD-9211',
      date: 'Today, 1:10 PM',
      customerName: 'Zainab Bello',
      phone: '+234 809 111 8844',
      location: 'Ikeja GRA, Lagos',
      productName: 'Lagos Wide-Leg Baggy Denim Jeans',
      colorway: 'Vintage Washed Indigo',
      size: 'Size 34 / M · 1 Unit',
      quantity: 1,
      amount: 42000,
      status: 'Packed in Box',
      dispatchDeadline: 'Tomorrow Morning (Lagos Hub)',
      image: '/images/products/BaggyJean.jpg'
    }
  ];

  const activeOrders = isBoutique ? boutiqueOrders : tailorOrders;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold mb-2">
            {isBoutique ? <ShoppingBag className="h-3.5 w-3.5" /> : <Scissors className="h-3.5 w-3.5" />}
            <span>{isBoutique ? 'Retail Fulfillment Desk' : 'Bespoke Cutting & Tailoring Desk'}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {isBoutique ? 'Orders to Pack & Dispatch' : 'Tailoring Orders to Fulfill'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            {isBoutique
              ? 'Pre-paid retail orders with selected colorway and sizing ready to pack for Lagos Hub pickup.'
              : 'Pre-paid bespoke customer orders with verified 3D body measurements ready for cutting and sewing.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-mono-luxury font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Escrow Payment Secured</span>
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6"
          >
            {/* Top Row: Order Number, Date & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono-luxury text-sm font-bold text-[var(--gold-accent)]">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono-luxury">
                  ● {order.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono-luxury font-bold">
                  {order.status}
                </span>
                <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  ₦{order.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Middle Row: Product & Customer Measurement Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Product Info */}
              <div className="md:col-span-6 flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                  <Image src={order.image} alt={order.productName} fill unoptimized className="object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-editorial text-base font-bold text-[var(--text-primary)]">
                    {order.productName}
                  </h4>
                  <div className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                    {isBoutique ? `Colorway: ${order.colorway} · ${order.size}` : `Tailoring Spec: ${order.size}`}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Dispatch Deadline: {order.dispatchDeadline}</span>
                  </div>
                </div>
              </div>

              {/* Customer Contact & Delivery Info */}
              <div className="md:col-span-6 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1.5 text-xs font-mono-luxury">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold">
                  <User className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Phone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span>{order.location}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono-luxury text-emerald-500 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isBoutique
                    ? 'Inventory Reserved & Escrow Locked'
                    : '3D Body Measurements Verified by Sizing Engine'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Marked ${order.orderNumber} as Packed & Ready for Lagos Hub Dispatch!`)}
                  className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  <span>{isBoutique ? 'Mark Packed for Pickup' : 'Mark Tailored & Ready for Pickup'}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
