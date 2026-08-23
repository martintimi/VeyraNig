'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { vendors } from '@/lib/data/vendors';
import {
  ShieldCheck, Truck, Lock, CreditCard, Building2, CheckCircle2,
  ArrowRight, ArrowLeft, Phone, Mail, MapPin, Sparkles, Check,
  AlertCircle, ChevronRight, Package, Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    bodyProfile,
    createNewOrder,
    addNotification,
    userAuth
  } = useStore();

  // Form State
  const [formData, setFormData] = useState({
    name: bodyProfile.name || userAuth.name || 'Chukwudi Eze',
    phone: bodyProfile.phone || userAuth.phone || '+234 803 456 7890',
    email: bodyProfile.email || userAuth.email || 'chukwudi.eze@gmail.com',
    address: bodyProfile.deliveryAddress || 'Plot 14B, Adeola Odeku Street',
    city: bodyProfile.city || 'Victoria Island',
    state: bodyProfile.state || 'Lagos',
    notes: 'Please call before gate entry in Victoria Island.',
  });

  // Delivery options
  const [deliverySpeed, setDeliverySpeed] = useState<'lagos_express' | 'nationwide' | 'same_day'>('lagos_express');
  const deliveryCosts = {
    lagos_express: 3500,
    nationwide: 5000,
    same_day: 7500,
  };

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer' | 'escrow'>('paystack');

  // Interactive Paystack Modal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);

  // Grouped vendor cart items
  const groupedItems = cart.reduce((acc, item) => {
    const vendorId = item.product.vendorId;
    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendorName: item.product.vendorName,
        items: [],
      };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendorName: string; items: typeof cart }>);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const distinctBrandsCount = Object.keys(groupedItems).length;
  const multiBrandDiscount = distinctBrandsCount > 1 ? 10000 : 0;
  const shippingFee = cart.length > 0 ? deliveryCosts[deliverySpeed] : 0;
  const grandTotal = Math.max(0, subtotal - multiBrandDiscount + shippingFee);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setShowPaystackModal(true);
  };

  const handleCompletePaystackSimulation = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNum = `#VY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = createNewOrder({
        orderNumber: orderNum,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalAmount: grandTotal,
        status: 'payment_confirmed',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: `${formData.address}, ${formData.city}`,
        deliveryCity: formData.city,
        customerMeasurements: {
          heightCm: bodyProfile.heightCm || 182,
          chestCm: bodyProfile.chestCm || 104,
          shoulderCm: bodyProfile.shoulderWidthCm || 49,
          waistCm: bodyProfile.waistCm || 84,
          inseamCm: bodyProfile.inseamCm || 84,
        },
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          vendorId: item.product.vendorId,
          vendorName: item.product.vendorName,
          price: item.product.price,
          size: item.selectedSize,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
        })),
        paystackRef: `pstk_live_${Math.random().toString(36).substr(2, 9)}`,
      });

      addNotification({
        type: 'order_status',
        title: `Payment Confirmed (${orderNum})`,
        message: `Your payment of ₦${grandTotal.toLocaleString()} was secured via Paystack Escrow. Ateliers have received your body measurements for tailoring!`,
        orderId: newOrder.id,
        actionUrl: '/profile',
      });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });

      setIsProcessing(false);
      setShowPaystackModal(false);
      setOrderPlaced(newOrder);
      clearCart();
    }, 1800);
  };

  // SUCCESS CONFIRMATION RECEIPT VIEW
  if (orderPlaced) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="surface-card p-8 sm:p-12 rounded-3xl border border-[var(--border-subtle)] text-center space-y-6 shadow-2xl">
          
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Paystack Escrow Payment Successful
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--text-primary)] mt-1">
              Order Confirmed & Secured!
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-2 max-w-md mx-auto leading-relaxed">
              Order reference <strong className="text-[var(--text-primary)] font-mono-luxury">{orderPlaced.orderNumber}</strong>. Your garments will be inspected at Veyra Lagos Central Hub before express single-box delivery to Victoria Island.
            </p>
          </div>

          {/* Delivery & Dispatch Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] font-mono-luxury text-xs">
            <div>
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Recipient & Phone</span>
              <strong className="text-[var(--text-primary)] text-sm">{orderPlaced.customerName}</strong>
              <div className="text-[var(--gold-accent)] mt-0.5">{orderPlaced.customerPhone}</div>
            </div>

            <div>
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Destination Address</span>
              <strong className="text-[var(--text-primary)]">{orderPlaced.deliveryAddress}</strong>
              <div className="text-[var(--text-secondary)]">{orderPlaced.deliveryCity}, Nigeria</div>
            </div>
          </div>

          {/* Individual Items Dispatched */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
              Items in Consolidated Package ({orderPlaced.items.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orderPlaced.items.map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                    <Image src={item.imageUrl} alt={item.productName} fill unoptimized className="object-cover" />
                  </div>
                  <div className="truncate">
                    <span className="text-[9px] font-mono-luxury text-[var(--gold-accent)] font-bold block truncate">{item.vendorName}</span>
                    <h5 className="font-bold text-xs text-[var(--text-primary)] truncate">{item.productName}</h5>
                    <div className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">Size {item.size} · ₦{item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Package className="h-4 w-4" />
              <span>Track in Order History</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold hover:border-[var(--border-hover)] transition-all"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
          <Package className="h-8 w-8 text-[var(--text-muted)]" />
        </div>
        <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-light max-w-sm">
          Please add Senator Kaftans, trousers, or shoes from our catalog before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md inline-flex items-center gap-2"
        >
          <span>Explore Nigerian Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Paystack 256-Bit Escrow Secured
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Express Multi-Vendor Checkout
          </h1>
        </div>

        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1 text-xs font-mono-luxury uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: DELIVERY DETAILS, SPEED & PAYMENT (7 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-mono-luxury font-bold text-xs">
                  1
                </span>
                <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                  Contact & Nigerian Delivery Address
                </h3>
              </div>
              <span className="text-[10px] font-mono-luxury text-emerald-500 font-bold uppercase">● Phone Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chukwudi Eze"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Mobile Phone Number (For Dispatch)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold-accent)]" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 803 123 4567"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Email for Paystack Receipt
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Lagos or Abuja"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Street Address & Area
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot 14B, Adeola Odeku Street, Victoria Island"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Delivery Note for Dispatch Rider
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Leave with estate gate security / Call when outside"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* STEP 2: LOGISTICS & SPEED */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-mono-luxury font-bold text-xs">
                2
              </span>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Lagos Central Hub Dispatch Speed
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              <div
                onClick={() => setDeliverySpeed('lagos_express')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  deliverySpeed === 'lagos_express'
                    ? 'bg-[var(--gold-subtle)]/30 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[var(--gold-accent)]" />
                  <div>
                    <div className="font-bold text-xs text-[var(--text-primary)]">Veyra Lagos Express Hub (24 - 48 Hours)</div>
                    <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Consolidated single box delivery in Lagos</div>
                  </div>
                </div>
                <span className="font-mono-luxury font-bold text-xs text-[var(--text-primary)]">₦3,500</span>
              </div>

              <div
                onClick={() => setDeliverySpeed('nationwide')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  deliverySpeed === 'nationwide'
                    ? 'bg-[var(--gold-subtle)]/30 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-xs text-[var(--text-primary)]">Nationwide Express (Abuja, PH, Kano - 3 to 4 Days)</div>
                    <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Air & ground freight via GIG Logistics</div>
                  </div>
                </div>
                <span className="font-mono-luxury font-bold text-xs text-[var(--text-primary)]">₦5,000</span>
              </div>

              <div
                onClick={() => setDeliverySpeed('same_day')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  deliverySpeed === 'same_day'
                    ? 'bg-[var(--gold-subtle)]/30 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-xs text-[var(--text-primary)]">VIP Same-Day Atelier White-Glove (Lagos Island / Ikoyi)</div>
                    <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Direct courier dispatch with hanger & garment bag</div>
                  </div>
                </div>
                <span className="font-mono-luxury font-bold text-xs text-[var(--text-primary)]">₦7,500</span>
              </div>
            </div>
          </div>

          {/* STEP 3: NIGERIAN PAYMENT METHOD */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center font-mono-luxury font-bold text-xs">
                3
              </span>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Secure Nigerian Payment Gateway
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => setPaymentMethod('paystack')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  paymentMethod === 'paystack'
                    ? 'bg-[var(--gold-subtle)]/40 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="h-5 w-5 text-[var(--gold-accent)]" />
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-mono-luxury font-bold">Instant</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">Paystack Checkout</div>
                  <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Debit Card, Bank Transfer, USSD, Apple Pay</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-[var(--gold-subtle)]/40 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-mono-luxury font-bold">NUBAN</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">Direct Escrow Transfer</div>
                  <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Dedicated Veyra Virtual NUBAN Account</div>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-emerald-500/30 flex items-start gap-3 mt-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                <strong className="text-[var(--text-primary)]">100% Paystack Escrow Protection:</strong> Your payment is held safely until the Nigerian design houses tailor and dispatch your garments to our Lagos Hub with verified measurements.
              </p>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: MULTI-VENDOR ORDER SUMMARY (5 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6 sticky lg:top-24">
          
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-2xl">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] pb-4 border-b border-[var(--border-subtle)]">
              Multi-Vendor Bag Summary
            </h3>

            {/* Grouped Atelier Garments */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {Object.entries(groupedItems).map(([vId, group]) => (
                <div key={vId} className="space-y-2">
                  <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] uppercase font-bold tracking-wider block">
                    Atelier: {group.vendorName}
                  </span>
                  
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                            <Image src={item.product.imageUrl} alt={item.product.name} fill unoptimized className="object-cover" />
                          </div>
                          <div className="truncate">
                            <h5 className="font-bold text-xs text-[var(--text-primary)] truncate">{item.product.name}</h5>
                            <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                              Size {item.selectedSize} · Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className="font-editorial font-bold text-sm text-[var(--text-primary)] shrink-0">
                          ₦{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5 text-xs font-mono-luxury">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal ({cart.length} pcs)</span>
                <span className="font-bold text-[var(--text-primary)]">₦{subtotal.toLocaleString()}</span>
              </div>

              {multiBrandDiscount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Multi-Brand Set Savings</span>
                  <span>-₦{multiBrandDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Lagos Central Hub Delivery</span>
                <span className="font-bold text-[var(--text-primary)]">₦{shippingFee.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-baseline">
                <span className="font-mono-luxury uppercase text-xs font-bold text-[var(--text-primary)]">Total in Naira</span>
                <span className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Lock className="h-4 w-4" />
              <span>Pay ₦{grandTotal.toLocaleString()} with Paystack</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-[10px] font-mono-luxury text-[var(--text-muted)] text-center space-y-1">
              <div>🇳🇬 Lagos Hub Inspection & Consolidated Delivery</div>
              <div>Free 7-Day Fit Alterations Guaranteed</div>
            </div>

          </div>

        </div>

      </form>

      {/* ======================================================== */}
      {/* INTERACTIVE PAYSTACK MODAL SIMULATION */}
      {/* ======================================================== */}
      {showPaystackModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-white">
            
            {/* Paystack Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wider">paystack</div>
                  <div className="text-[10px] text-zinc-400 font-mono-luxury">Secured Checkout Gateway</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase font-mono-luxury">Amount to Pay</div>
                <div className="font-editorial text-xl font-bold text-emerald-400">₦{grandTotal.toLocaleString()}</div>
              </div>
            </div>

            {/* Recipient & Body Stats confirmation */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1 font-mono-luxury">
              <div className="flex justify-between text-zinc-400">
                <span>Customer:</span>
                <strong className="text-white">{formData.name}</strong>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Dispatch Line:</span>
                <strong className="text-emerald-400">{formData.phone}</strong>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Atelier Sizing:</span>
                <strong className="text-amber-400">{bodyProfile.chestCm}cm Chest · {bodyProfile.shoulderWidthCm}cm Shoulder</strong>
              </div>
            </div>

            {/* Card Simulation Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono-luxury text-zinc-400 mb-1">Debit Card Number</label>
                <input
                  type="text"
                  readOnly
                  value="5399 •••• •••• 8821 (Access / GTB / Zenith)"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono-luxury"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono-luxury text-zinc-400 mb-1">Card Expiry</label>
                  <input
                    type="text"
                    readOnly
                    value="08 / 29"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono-luxury"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono-luxury text-zinc-400 mb-1">CVV</label>
                  <input
                    type="password"
                    readOnly
                    value="•••"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono-luxury"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompletePaystackSimulation}
                className="w-full py-4 rounded-full bg-emerald-500 text-black font-mono-luxury uppercase tracking-widest font-bold text-xs hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-black" />
                    <span>Processing Escrow Split with Paystack...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize Payment of ₦{grandTotal.toLocaleString()}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPaystackModal(false)}
                className="w-full py-2.5 text-xs font-mono-luxury uppercase text-zinc-400 hover:text-white transition-colors"
              >
                Cancel Transaction
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
