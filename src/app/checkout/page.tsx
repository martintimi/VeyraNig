'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  Home, ShieldCheck, Truck, Lock, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, Phone, Mail, MapPin, Sparkles, Check,
  AlertCircle, ChevronRight, Package, Clock, Loader2, Store,
  Building, Navigation
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { signInCustomer, signUpCustomer } from '@/lib/services/auth';
import MobileCheckoutView from '@/components/checkout/MobileCheckoutView';
import { NIGERIAN_STATES, getCitiesForState } from '@/lib/data/nigeriaLocations';
import { estimateItemWeightKg } from '@/lib/services/logistics';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    bodyProfile,
    createNewOrder,
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

  // Customer Delivery Form State (Empty by default with clean placeholders)
  const initialDeliveryState = bodyProfile.state || 'Lagos';
  const initialCities = getCitiesForState(initialDeliveryState);

  const [formData, setFormData] = useState({
    name: bodyProfile.name || userAuth.name || '',
    phone: bodyProfile.phone || userAuth.phone || '',
    email: bodyProfile.email || userAuth.email || '',
    address: bodyProfile.deliveryAddress || '',
    state: initialDeliveryState,
    city: bodyProfile.city || initialCities[0] || 'Ikeja',
    notes: '',
  });

  const handleStateChange = (newState: string) => {
    const cities = getCitiesForState(newState);
    setFormData(prev => ({
      ...prev,
      state: newState,
      city: cities[0] || ''
    }));
  };

  // Package delivery methods per vendor (key: vendorId, value: 'doorstep' | 'park_pickup')
  const [packageMethods, setPackageMethods] = useState<Record<string, 'doorstep' | 'park_pickup'>>({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaystackSimModal, setShowPaystackSimModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);

  // Group items by vendor
  const groupedItems = useMemo(() => {
    return cart.reduce((acc, item) => {
      const vendorId = item.product.vendorId || 'boutique';
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName: item.product.vendorName,
          vendorCity: item.product.vendorCity || 'Ijebu-Ode',
          vendorState: item.product.vendorState || 'Ogun State',
          dispatchDays: item.product.dispatchDays || '1-2 business days',
          shippingRates: item.product.shippingRates || {
            sameCity: 1000,
            closeHub: 2500,
            interstate: 4500,
            parkPickup: 1500,
            parkPickupEnabled: true,
          },
          items: [],
        };
      }
      acc[vendorId].items.push(item);
      return acc;
    }, {} as Record<string, {
      vendorId: string;
      vendorName: string;
      vendorCity: string;
      vendorState: string;
      dispatchDays: string;
      shippingRates: any;
      items: typeof cart;
    }>);
  }, [cart]);

  // Live Logistics API State
  const [liveRates, setLiveRates] = useState<Record<string, any>>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch real-time live carrier quotes from /api/logistics/rates
  useEffect(() => {
    async function fetchLiveRates() {
      const packageRequests = Object.values(groupedItems).map(pkg => {
        const pkgWeight = pkg.items.reduce((sum, item) => {
          return sum + estimateItemWeightKg(item.product) * item.quantity;
        }, 0);

        return {
          vendorId: pkg.vendorId,
          vendorName: pkg.vendorName,
          originState: pkg.vendorState || 'Lagos',
          originCity: pkg.vendorCity || 'Lagos',
          destinationState: formData.state || 'Lagos',
          destinationCity: formData.city || 'Lagos',
          itemCount: pkg.items.length,
          totalWeightKg: Math.max(0.5, Number(pkgWeight.toFixed(2)))
        };
      });

      if (packageRequests.length === 0) return;

      setIsLoadingRates(true);
      try {
        const res = await fetch('/api/logistics/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packages: packageRequests })
        });
        const data = await res.json();
        if (data.success && data.rates) {
          setLiveRates(data.rates);
        }
      } catch (err) {
        console.warn('Failed to fetch live carrier rates:', err);
      } finally {
        setIsLoadingRates(false);
      }
    }

    const timer = setTimeout(fetchLiveRates, 300);
    return () => clearTimeout(timer);
  }, [groupedItems, formData.state, formData.city]);

  // Calculate dynamic shipping fee per vendor package
  const packageShippingCalculations = useMemo(() => {
    const calcs: Record<string, { fee: number; method: 'doorstep' | 'park_pickup'; reason: string; isSameCity: boolean; courierName?: string; eta?: string }> = {};

    Object.values(groupedItems).forEach((pkg) => {
      const live = liveRates[pkg.vendorId];
      const chosenMethod = packageMethods[pkg.vendorId] || 'doorstep';

      if (live) {
        if (chosenMethod === 'park_pickup') {
          calcs[pkg.vendorId] = {
            fee: 0,
            method: 'park_pickup',
            reason: 'Pay Driver on Pickup (~₦1,500 - ₦2,500)',
            isSameCity: live.isSameCity,
            courierName: live.parkPickup?.courierName || 'Motor Park Waybill',
            eta: live.parkPickup?.estimatedDeliveryDays || '1-2 business days',
          };
        } else {
          calcs[pkg.vendorId] = {
            fee: live.doorstep?.fee || 4500,
            method: 'doorstep',
            reason: live.doorstep?.serviceType || 'Doorstep Courier',
            isSameCity: live.isSameCity,
            courierName: live.doorstep?.courierName || 'GIG Logistics',
            eta: live.doorstep?.estimatedDeliveryDays || '1-3 business days',
          };
        }
      } else {
        const customerCity = (formData.city || '').toLowerCase().trim();
        const vendorCity = (pkg.vendorCity || '').toLowerCase().trim();
        const isSameCity = !!(customerCity && vendorCity && (customerCity === vendorCity || customerCity.includes(vendorCity) || vendorCity.includes(customerCity)));

        if (chosenMethod === 'park_pickup') {
          calcs[pkg.vendorId] = {
            fee: 0,
            method: 'park_pickup',
            reason: 'Pay Driver on Pickup (~₦1,500 - ₦2,500)',
            isSameCity: false,
          };
        } else {
          calcs[pkg.vendorId] = {
            fee: isSameCity ? 1500 : 4500,
            method: 'doorstep',
            reason: isSameCity ? 'Same-City Direct Rider' : 'Interstate Doorstep Courier',
            isSameCity,
          };
        }
      }
    });

    return calcs;
  }, [groupedItems, liveRates, packageMethods, formData.city]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalShippingFee = Object.values(packageShippingCalculations).reduce((sum, item) => sum + item.fee, 0);
  const grandTotal = subtotal + totalShippingFee;

  // Toggle park pickup vs doorstep for a specific vendor package
  const togglePackageMethod = (vendorId: string, method: 'doorstep' | 'park_pickup') => {
    setPackageMethods(prev => ({ ...prev, [vendorId]: method }));
  };

  // Auth Handler
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
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in your name, phone number, address, and city for delivery.');
      return;
    }
    handlePayWithPaystack();
  };

  const loadPaystackScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).PaystackPop) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayWithPaystack = async () => {
    setIsProcessing(true);
    const paymentRef = `vy_escrow_${Date.now()}`;
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_747039dcebc800028fafa806d62e38f2ed02ab95';

    try {
      const loaded = await loadPaystackScript();
      if (loaded && (window as any).PaystackPop) {
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: formData.email || userAuth?.email || 'customer@irisi.ng',
          amount: Math.round(grandTotal * 100),
          currency: 'NGN',
          ref: paymentRef,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: formData.name },
              { display_name: 'Phone Number', variable_name: 'phone_number', value: formData.phone }
            ]
          },
          callback: (response: any) => {
            setShowPaymentModal(false);
            handleCompleteOrder(response.reference || paymentRef);
          },
          onClose: () => {
            setIsProcessing(false);
          }
        });
        handler.openIframe();
      } else {
        alert('Could not load Paystack gateway. Please check your internet connection.');
        setIsProcessing(false);
      }
    } catch (e) {
      console.error('Paystack popup error:', e);
      setIsProcessing(false);
    }
  };

  const handleCompleteOrder = async (resolvedPaymentRef?: string) => {
    setIsProcessing(true);

    try {
      const orderNum = `#VY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentRef = resolvedPaymentRef || `vy_escrow_${Date.now()}`;

      const orderPayload: any = {
        orderNumber: orderNum,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || userAuth?.email || bodyProfile?.email || '',
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        deliveryCity: formData.city,
        subtotal,
        shippingFee: totalShippingFee,
        totalAmount: grandTotal,
        customerMeasurements: {
          heightCm: 0,
          chestCm: 0,
          shoulderCm: 0,
          waistCm: 0,
          inseamCm: 0,
        },
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          vendorId: item.product.vendorId,
          vendorName: item.product.vendorName,
          price: item.product.price,
          quantity: Number(item.quantity || 1),
          size: item.selectedSize,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
        })),
        paymentRef,
        paystackRef: paymentRef,
        packageMethods,
      };

      // 1. Send live POST request to PostgreSQL database
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (res.ok && data.success && data.order) {
          orderPayload.id = data.order.id || orderPayload.id;
        }
      } catch (dbErr) {
        console.error('Failed to post order to DB:', dbErr);
      }

      // 2. Update local state & clear cart
      createNewOrder(orderPayload);
      setOrderPlaced(orderPayload);
      clearCart();
      setIsProcessing(false);
      setShowPaymentModal(false);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
    } catch (err) {
      console.error('Payment completion error:', err);
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-7 max-w-2xl mx-auto animate-fadeIn py-16">
        
        {/* Luxury Animated Escrow Secured Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full bg-emerald-500/15 animate-ping opacity-75" />
          <div className="absolute h-24 w-24 rounded-full bg-[var(--gold-accent)]/10 animate-pulse" />
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black flex items-center justify-center shadow-2xl ring-4 ring-emerald-400/20 transform transition-transform hover:scale-105">
            <Check className="h-10 w-10 stroke-[3] text-black drop-shadow-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Escrow Payment Confirmed & Secured</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight pt-1">
            Order Sent to Designers & Brands!
          </h1>
          <p className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold tracking-wider">
            Order Reference: {orderPlaced.orderNumber}
          </p>
        </div>

        <div className="w-full p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] text-left space-y-4 text-xs font-mono-luxury shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <span className="text-[var(--text-secondary)]">Recipient Name:</span>
            <span className="font-bold text-[var(--text-primary)]">{orderPlaced.customerName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <span className="text-[var(--text-secondary)]">Delivery Destination:</span>
            <span className="font-bold text-[var(--text-primary)] text-right">{orderPlaced.deliveryAddress}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <span className="text-[var(--text-secondary)]">Total Paid (Escrow):</span>
            <span className="font-bold text-[var(--gold-accent)] text-sm">₦{Number(orderPlaced.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2.5 text-[11px] text-[var(--text-secondary)]">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Each vendor has been notified with your sizes. They are preparing your garments for courier dispatch. Funds will only be released after you confirm receipt.</span>
          </div>
        </div>

        {/* Action Buttons: Track Order & Continue Shopping */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(orderPlaced.orderNumber)}`}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="h-4 w-4" />
            <span>Track Order Live</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-full surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold transition-all shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    );
  }

  return (
    <>
      {/* 1. DEDICATED MOBILE CHECKOUT VIEW */}
      <div className="block md:hidden">
        <MobileCheckoutView />
      </div>

      {/* 2. DESKTOP LUXURY CHECKOUT VIEW */}
      <div className="hidden md:block min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn pb-24">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Secure Escrow Checkout
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Delivery & Payment
          </h1>
        </div>

        <Link
          href="/cart"
          className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Bag</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="p-16 rounded-3xl surface-card text-center space-y-4 border border-[var(--border-subtle)]">
          <p className="text-base text-[var(--text-secondary)] font-light">Your shopping bag is empty.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            <span>Browse Clothes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 7 COLS: DELIVERY ADDRESS & DETAILS */}
          <div className="lg:col-span-7 space-y-6">

            {/* Quick Login / Create Account if not logged in */}
            {!userAuth.isLoggedIn && (
              <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
                    Quick Shopper Access (Optional)
                  </span>
                  <div className="flex items-center p-0.5 rounded-lg bg-[var(--bg-secondary)] text-[10px] font-mono-luxury font-bold">
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className={`px-2.5 py-1 rounded-md transition-all ${authTab === 'login' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthTab('register')}
                      className={`px-2.5 py-1 rounded-md transition-all ${authTab === 'register' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                <form onSubmit={handleQuickAuth} className="space-y-3 text-xs font-mono-luxury">
                  {authTab === 'register' && (
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                  </div>

                  {authError && <p className="text-rose-400 text-[11px] font-bold">{authError}</p>}

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--gold-accent)] font-bold uppercase text-[10px] transition-all"
                  >
                    {isAuthenticating ? 'Authenticating...' : authTab === 'login' ? 'Quick Login' : 'Create Shopper Account'}
                  </button>
                </form>
              </div>
            )}

            {/* Delivery Destination Form */}
            <form onSubmit={handleStartPayment} id="checkout-form" className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
                1. Delivery Contact & Address
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Full Name"
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Phone Number (For Courier)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08012*****"
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Street Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / flat number, street name, and landmark"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Delivery State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    City / Town / District
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold cursor-pointer"
                  >
                    {getCitiesForState(formData.state).map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Opposite first bank, call on arrival"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            </form>

            {/* Vendor Package Breakdown & Shipping Mode Selection */}
            <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-sm">
              <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
                2. Vendor Packages & Delivery Method
              </span>

              <div className="space-y-4">
                {Object.values(groupedItems).map((pkg) => {
                  const calc = packageShippingCalculations[pkg.vendorId] || { fee: 2500, method: 'doorstep', reason: 'Direct Courier' };
                  const currentMethod = packageMethods[pkg.vendorId] || 'doorstep';
                  const rates = pkg.shippingRates || {};

                  return (
                    <div key={pkg.vendorId} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3">
                      
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 flex-wrap gap-2">
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{pkg.vendorName}</div>
                          <div className="text-[10px] font-mono-luxury text-[var(--text-secondary)] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[var(--gold-accent)]" />
                            <span>{pkg.vendorCity ? `Ships from ${pkg.vendorCity}${pkg.vendorState ? `, ${pkg.vendorState}` : ''}` : 'Boutique Dispatch'} · <span>{pkg.dispatchDays}</span></span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                            ₦{calc.fee.toLocaleString()} Delivery
                          </div>
                          <div className="text-[9px] font-mono-luxury text-emerald-400 font-bold">
                            {calc.reason}
                          </div>
                        </div>
                      </div>

                      {/* Items in this package */}
                      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                        {pkg.items.map((item) => (
                          <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-2 bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded-xl shrink-0 border border-[var(--border-subtle)]">
                            <div className="relative h-8 w-8 rounded-lg overflow-hidden shrink-0">
                              <Image src={item.product.imageUrl} alt={item.product.name} fill unoptimized className="object-cover" />
                            </div>
                            <div className="text-[11px] font-mono-luxury">
                              <span className="font-bold text-[var(--text-primary)] truncate max-w-[100px] block">{item.product.name}</span>
                              <span className="text-[var(--text-muted)]">{item.selectedSize} × {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Mode Toggles (Only show for inter-city/inter-state, never for same city) */}
                      {!calc.isSameCity && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => togglePackageMethod(pkg.vendorId, 'doorstep')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                              currentMethod === 'doorstep'
                                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <Home className="h-3.5 w-3.5" />
                            <span>Deliver to My Address</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePackageMethod(pkg.vendorId, 'park_pickup')}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                              currentMethod === 'park_pickup'
                                ? 'bg-[var(--gold-accent)] text-black shadow-sm font-extrabold'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <Building className="h-3.5 w-3.5" />
                            <span>Motor Park Waybill (Pay on Pickup)</span>
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: CHECKOUT TOTAL & ESCROW PAYMENT BUTTON */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-md sticky lg:top-24">
            <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-mono-luxury">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Clothes Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span className="font-bold text-[var(--text-primary)]">₦{subtotal.toLocaleString()}</span>
              </div>

              {/* Per-Vendor Delivery Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-mono-luxury uppercase font-bold text-[var(--text-primary)] block">
                  Delivery Fees (By Vendor Location):
                </span>

                {Object.values(groupedItems).map((pkg) => {
                  const calc = packageShippingCalculations[pkg.vendorId] || { fee: 2500, reason: 'Courier' };
                  return (
                    <div key={pkg.vendorId} className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                      <span className="truncate pr-2">{pkg.vendorName} ({pkg.vendorCity}):</span>
                      <span className="font-bold text-[var(--gold-accent)] shrink-0">₦{calc.fee.toLocaleString()}</span>
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between font-bold text-[var(--text-primary)]">
                  <span>Total Delivery:</span>
                  <span className="text-[var(--gold-accent)]">₦{totalShippingFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-sm">
                <span className="font-bold text-[var(--text-primary)]">Total to Pay (Escrow):</span>
                <span className="font-editorial text-2xl sm:text-3xl font-bold text-amber-600 dark:text-[var(--gold-accent)]">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Pay ₦{grandTotal.toLocaleString()} via Escrow</span>
            </button>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-400 text-[11px] font-mono-luxury">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>Buyer Escrow Protection:</strong> Payment is credited into secure escrow and only released to each vendor when your clothes arrive.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Interactive Escrow Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">Ìrísí Escrow Gateway</span>
              </div>
              <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold">256-Bit Encrypted</span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono-luxury">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[var(--text-primary)]">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Multi-Vendor Shipping:</span>
                <span className="font-bold text-[var(--gold-accent)]">₦{totalShippingFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                <span>Total Charge:</span>
                <span className="text-[var(--gold-accent)] text-lg">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                Select Payment Channel:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-3.5 rounded-2xl border text-center font-mono-luxury text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'paystack'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                      : 'surface-card border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Debit Card (Paystack)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-2xl border text-center font-mono-luxury text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                      : 'surface-card border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Instant Bank Transfer</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={paymentMethod === 'paystack' ? handlePayWithPaystack : () => handleCompleteOrder()}
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-emerald-500 text-black font-mono-luxury uppercase text-xs font-bold hover:bg-emerald-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Processing Escrow Authorization...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Pay ₦{grandTotal.toLocaleString()} {paymentMethod === 'paystack' ? '(Paystack Test)' : '(Bank Transfer)'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCompleteOrder()}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] text-center text-xs font-mono-luxury uppercase text-[var(--gold-accent)] hover:border-[var(--gold-accent)] transition-colors cursor-pointer"
              >
                Instant Test Checkout (Skip Gateway)
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
                className="w-full py-2 text-center text-xs font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYSTACK SANDBOX SIMULATOR MODAL */}
      {showPaystackSimModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm surface-card rounded-3xl border border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl animate-scaleUp text-center">
            
            {/* Paystack Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono-luxury font-bold uppercase tracking-wider">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Paystack Sandbox Simulation</span>
              </div>
              <div className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                ₦{grandTotal.toLocaleString()}
              </div>
              <p className="text-[11px] font-mono-luxury text-[var(--text-muted)]">
                Recipient: Ìrísí Escrow Treasury
              </p>
            </div>

            {/* Simulated Debit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-white/10 text-white text-left space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">TEST DEBIT CARD</span>
                <span className="text-[var(--gold-accent)] font-bold">VERVE / MASTERCARD</span>
              </div>
              <div className="font-mono text-base tracking-widest text-zinc-100 font-bold py-1">
                4084 •••• •••• 0840
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <div>
                  <span>EXPIRY: </span>
                  <strong className="text-white">12/28</strong>
                </div>
                <div>
                  <span>CVV: </span>
                  <strong className="text-white">408</strong>
                </div>
                <div>
                  <span>PIN: </span>
                  <strong className="text-white">1234</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono-luxury text-amber-400 text-left leading-relaxed">
              <strong>Test Mode:</strong> No personal Paystack key added in <code className="text-white">.env.local</code> yet. This simulates a successful Paystack card payment and secures your order into Ìrísí Escrow.
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  setShowPaystackSimModal(false);
                  await handleCompleteOrder(`paystack_sim_${Date.now()}`);
                }}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-emerald-500 text-black font-mono-luxury uppercase text-xs font-bold hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-black" />
                    <span>Securing Escrow...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 stroke-[2]" />
                    <span>Simulate Successful Payment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPaystackSimModal(false)}
                className="w-full py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Cancel Payment
              </button>
            </div>

          </div>
        </div>
      )}

      </div>
    </>
  );
}
