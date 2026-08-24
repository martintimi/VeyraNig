'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { vendors } from '@/lib/data/vendors';
import {
  ShieldCheck, Truck, Lock, CreditCard, Building2, CheckCircle2,
  ArrowRight, ArrowLeft, Phone, Mail, MapPin, Sparkles, Check,
  AlertCircle, ChevronRight, Package, Clock, Loader2, User
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { signInCustomer, signUpCustomer } from '@/lib/services/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    bodyProfile,
    createNewOrder,
    addNotification,
    userAuth,
    setUserAuth,
    setBodyProfile,
    setSelectedGender,
  } = useStore();

  // Auth Gate State (for unauthenticated visitors)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authGender, setAuthGender] = useState<'male' | 'female'>('male');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

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
  const [paymentMethod, setPaymentMethod] = useState<'card_transfer' | 'bank_transfer' | 'escrow'>('card_transfer');

  // Interactive Payment Gateway Modal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  // Quick Auth Handler on Checkout
  const handleQuickAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      if (authTab === 'login') {
        const res = await signInCustomer(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || 'Invalid credentials');
          setIsAuthenticating(false);
          return;
        }

        const patronName = res.profile?.full_name || authEmail.split('@')[0];
        setUserAuth({
          isLoggedIn: true,
          name: patronName,
          email: authEmail,
          userType: 'shopper',
        });
        setFormData(prev => ({ ...prev, email: authEmail, name: patronName }));
      } else {
        const res = await signUpCustomer({
          email: authEmail,
          password: authPassword,
          fullName: authName || authEmail.split('@')[0],
          gender: authGender,
        });

        if (!res.success) {
          setAuthError(res.error || 'Registration failed');
          setIsAuthenticating(false);
          return;
        }

        const patronName = authName || authEmail.split('@')[0];
        const twinId = `VY-NIG-${Math.floor(100 + Math.random() * 900)}`;

        setUserAuth({
          isLoggedIn: true,
          name: patronName,
          email: authEmail,
          gender: authGender,
          userType: 'shopper',
        });
        setSelectedGender(authGender);
        setBodyProfile({
          name: patronName,
          email: authEmail,
          gender: authGender,
          twinId,
          isInitialized: true,
        });
        setFormData(prev => ({ ...prev, email: authEmail, name: patronName }));
      }

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const handleCompletePaymentSimulation = async () => {
    setIsProcessing(true);

    try {
      const orderNum = `#VY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentRef = `vy_escrow_${Date.now()}`;

      const orderPayload = {
        orderNumber: orderNum,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: `${formData.address}, ${formData.city}`,
        deliveryCity: formData.city,
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
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
        paymentRef,
      };

      // 1. Sync to backend API endpoint
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      // 2. Add to Zustand store
      const newOrder = createNewOrder({
        orderNumber: orderNum,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'calibrated',
        ...orderPayload,
      });

      addNotification({
        type: 'order_status',
        title: `Payment Confirmed (${orderNum})`,
        message: `Your payment of ₦${grandTotal.toLocaleString()} was secured in escrow. Ateliers have received your body measurements!`,
        orderId: newOrder.id,
        actionUrl: '/profile',
      });

      clearCart();
      setIsProcessing(false);
      setShowPaymentModal(false);
      setOrderPlaced(newOrder);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Order error:', err);
      setIsProcessing(false);
    }
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
              Secured Escrow Payment Successful
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--text-primary)] mt-1">
              Order Confirmed & Secured!
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-2 max-w-md mx-auto leading-relaxed">
              Order reference <strong className="text-[var(--text-primary)] font-mono-luxury">{orderPlaced.orderNumber}</strong>. Your garments will be inspected at Veyra Lagos Central Hub before express single-box delivery.
            </p>
          </div>

          {/* Delivery & Dispatch Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] font-mono-luxury text-xs">
            <div>
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Recipient & Phone</span>
              <strong className="text-[var(--text-primary)] text-sm">{orderPlaced.customerName}</strong>
              <div className="text-[var(--text-secondary)]">{orderPlaced.customerPhone}</div>
            </div>

            <div>
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Delivery Address</span>
              <div className="text-[var(--text-primary)] font-medium">{orderPlaced.deliveryAddress}</div>
              <span className="text-emerald-500 font-bold">Lagos Central Hub Inspection</span>
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

  // AUTH GUARD: USER MUST BE LOGGED IN TO CHECKOUT
  if (!userAuth.isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 space-y-6 max-w-lg mx-auto text-center animate-fadeIn py-12">
        <div className="h-16 w-16 rounded-3xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 flex items-center justify-center shadow-lg">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
            Patron Authentication Required
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Sign In to Checkout
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
            Please log in or create an account so our master tailors can receive your exact 3D body measurements and track your order.
          </p>
        </div>

        {/* Auth Box */}
        <div className="w-full rounded-3xl surface-card border border-[var(--border-subtle)] overflow-hidden shadow-2xl text-left">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-[var(--border-subtle)] font-mono-luxury text-xs">
            <button
              onClick={() => setAuthTab('login')}
              className={`py-3.5 text-center transition-all font-bold ${
                authTab === 'login'
                  ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] border-b-2 border-[var(--gold-accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`py-3.5 text-center transition-all font-bold ${
                authTab === 'register'
                  ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] border-b-2 border-[var(--gold-accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleQuickAuth} className="p-6 space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono-luxury">
                {authError}
              </div>
            )}

            {authTab === 'register' && (
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Chukwudi Eze"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
              />
            </div>

            {authTab === 'register' && (
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5">
                  Fitting Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthGender('male')}
                    className={`py-2 rounded-xl text-xs font-mono-luxury font-bold border transition-all ${
                      authGender === 'male'
                        ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)]'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Men&apos;s Wear
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthGender('female')}
                    className={`py-2 rounded-xl text-xs font-mono-luxury font-bold border transition-all ${
                      authGender === 'female'
                        ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)]'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Women&apos;s Wear
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isAuthenticating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{authTab === 'login' ? 'Sign In & Proceed' : 'Create Account & Proceed'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

        </div>

        <Link
          href="/auth"
          className="text-xs font-mono-luxury text-[var(--gold-accent)] hover:underline block"
        >
          Want full 3D body twin calibration? Visit Full Auth Suite →
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
              256-Bit Escrow Secured Gateway
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Shipping + Logistics + Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: Delivery Address in Lagos / Nigeria */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-mono-luxury text-xs font-bold flex items-center justify-center border border-[var(--gold-accent)]/30">
                1
              </div>
              <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Delivery Destination
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  Phone Number (WhatsApp for Fitting)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot number, street name, estate name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  City / Area
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Victoria Island, Lekki, Ikeja..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Rivers">Rivers (Port Harcourt)</option>
                  <option value="Oyo">Oyo (Ibadan)</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Kano">Kano State</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: Dispatch & Inspection Speed */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-mono-luxury text-xs font-bold flex items-center justify-center border border-[var(--gold-accent)]/30">
                2
              </div>
              <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Lagos Central Hub Consolidation
              </h2>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setDeliverySpeed('lagos_express')}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliverySpeed === 'lagos_express'
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${
                    deliverySpeed === 'lagos_express' ? 'border-[var(--gold-accent)] bg-[var(--gold-accent)] text-black' : 'border-zinc-500'
                  }`}>
                    {deliverySpeed === 'lagos_express' && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[var(--text-primary)]">Lagos Central Hub Express (1-2 Days)</div>
                    <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
                      All garments consolidated and quality-audited before single dispatch.
                    </p>
                  </div>
                </div>
                <span className="font-mono-luxury font-bold text-sm text-[var(--text-primary)]">₦3,500</span>
              </label>

              <label
                onClick={() => setDeliverySpeed('same_day')}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliverySpeed === 'same_day'
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${
                    deliverySpeed === 'same_day' ? 'border-[var(--gold-accent)] bg-[var(--gold-accent)] text-black' : 'border-zinc-500'
                  }`}>
                    {deliverySpeed === 'same_day' && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[var(--text-primary)]">Same-Day VIP Courier (Lagos Only)</div>
                    <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
                      Direct courier dispatch from Victoria Island hub for Ready-to-Wear pieces.
                    </p>
                  </div>
                </div>
                <span className="font-mono-luxury font-bold text-sm text-[var(--text-primary)]">₦7,500</span>
              </label>
            </div>
          </div>

          {/* STEP 3: Payment Method Selection */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-mono-luxury text-xs font-bold flex items-center justify-center border border-[var(--gold-accent)]/30">
                3
              </div>
              <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Secured Payment Gateway
              </h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card_transfer')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  paymentMethod === 'card_transfer'
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[var(--gold-accent)]" />
                  <div>
                    <div className="font-bold text-sm text-[var(--text-primary)]">Direct Card / Bank Transfer</div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">Instant Mastercard, Visa, Verve & NUBAN Virtual Transfer</span>
                  </div>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('escrow')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  paymentMethod === 'escrow'
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-[var(--gold-accent)]" />
                  <div>
                    <div className="font-bold text-sm text-[var(--text-primary)]">Direct Escrow Transfer</div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">Funds held safely in escrow until you approve tailor fitting</span>
                  </div>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Multi-Vendor Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 sticky top-24 shadow-xl">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              Package Breakdown
            </h3>

            {/* Grouped Vendor Garment List */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {Object.entries(groupedItems).map(([vendorId, group]) => (
                <div key={vendorId} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-luxury">
                    <span className="font-bold text-[var(--gold-accent)]">{group.vendorName}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{group.items.length} piece(s)</span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                          <Image src={item.product.imageUrl} alt={item.product.name} fill unoptimized className="object-cover" />
                        </div>
                        <div className="flex-1 truncate">
                          <h5 className="font-bold text-[var(--text-primary)] truncate">{item.product.name}</h5>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono-luxury">
                            Size: <strong className="text-[var(--text-primary)]">{item.selectedSize}</strong> · Qty: {item.quantity}
                          </div>
                        </div>
                        <span className="font-mono-luxury font-bold text-[var(--text-primary)]">
                          ₦{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)] font-mono-luxury text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              {multiBrandDiscount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Multi-Brand Box Saving</span>
                  <span>-₦{multiBrandDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Quality Inspection & Dispatch</span>
                <span>₦{shippingFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-3 border-t border-[var(--border-subtle)]">
                <span>Total Escrow Charge</span>
                <span className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleStartPayment}
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Lock className="h-4 w-4" />
              <span>Complete Payment (₦{grandTotal.toLocaleString()})</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono-luxury text-[var(--text-muted)]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>256-Bit Escrow Encrypted & Verified</span>
            </div>

          </div>

        </div>

      </div>

      {/* INTERACTIVE PAYMENT GATEWAY MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold tracking-tight text-[var(--gold-accent)]">
                  VEYRA SECURED GATEWAY
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono-luxury text-[10px] font-bold">
                ● 256-BIT SSL
              </span>
            </div>

            <div className="space-y-3 text-center">
              <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-muted)]">
                Amount to Pay
              </span>
              <div className="font-editorial text-4xl font-bold text-[var(--gold-accent)]">
                ₦{grandTotal.toLocaleString()}
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">
                Multi-brand consolidated order · {formData.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono-luxury">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Escrow Status:</span>
                <span className="text-emerald-500 font-bold">Funds Held Until Inspection</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Beneficiaries:</span>
                <span className="text-[var(--text-primary)] font-bold">{distinctBrandsCount} Verified Ateliers</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCompletePaymentSimulation}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-mono-luxury uppercase text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing & Routing Escrow...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Pay ₦{grandTotal.toLocaleString()} (Simulate Gateway)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
                className="w-full py-2.5 text-center text-xs font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel & Return
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
