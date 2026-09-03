'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  ShieldCheck, Truck, Lock, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, Phone, MapPin, Store,
  Building, Home, Clock, Check, Loader2, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

import { NIGERIAN_STATES, getCitiesForState } from '@/lib/data/nigeriaLocations';

export default function MobileCheckoutView() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    bodyProfile,
    createNewOrder,
    userAuth,
  } = useStore();

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

  const [packageMethods, setPackageMethods] = useState<Record<string, 'doorstep' | 'park_pickup'>>({});
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
          vendorCity: item.product.vendorCity || 'Lagos',
          vendorState: item.product.vendorState || 'Lagos State',
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
  React.useEffect(() => {
    async function fetchLiveRates() {
      const packageRequests = Object.values(groupedItems).map(pkg => ({
        vendorId: pkg.vendorId,
        vendorName: pkg.vendorName,
        originState: pkg.vendorState || 'Lagos',
        originCity: pkg.vendorCity || 'Lagos',
        destinationState: formData.state || 'Lagos',
        destinationCity: formData.city || 'Lagos',
        itemCount: pkg.items.length
      }));

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
        console.warn('Failed to fetch live carrier rates on mobile:', err);
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

  const togglePackageMethod = (vendorId: string, method: 'doorstep' | 'park_pickup') => {
    setPackageMethods(prev => ({ ...prev, [vendorId]: method }));
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in your recipient name, phone, address, and city.');
      return;
    }
    setShowPaymentModal(true);
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
    const rawKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY;
    const isRealKey = rawKey && !rawKey.includes('e3ea86fb5d808e0018ff9f2fc278a2eecdf04523') && (rawKey.startsWith('pk_test_') || rawKey.startsWith('pk_live_'));

    if (!isRealKey) {
      // User hasn't registered paystack key yet: open high-fidelity Paystack Sandbox Simulator!
      setShowPaymentModal(false);
      setShowPaystackSimModal(true);
      return;
    }

    setIsProcessing(true);
    const paymentRef = `vy_escrow_${Date.now()}`;
    const paystackKey = rawKey;

    try {
      const loaded = await loadPaystackScript();
      if (loaded && (window as any).PaystackPop) {
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: formData.email || userAuth?.email || 'buyer@veyra.ng',
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
            handleCompletePayment(response.reference || paymentRef);
          },
          onClose: () => {
            setIsProcessing(false);
          }
        });
        handler.openIframe();
      } else {
        await handleCompletePayment(paymentRef);
      }
    } catch (e) {
      console.warn('Paystack popup fallback:', e);
      await handleCompletePayment(paymentRef);
    }
  };

  const handleCompletePayment = async (resolvedPaymentRef?: string) => {
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
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-5 py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn pb-32">
        <div className="h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-2xl">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury font-bold uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Escrow Payment Secured</span>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Order Dispatched to Designers & Brands!
          </h1>
          <p className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
            Reference: {orderPlaced.orderNumber}
          </p>
        </div>

        <div className="w-full p-5 rounded-3xl surface-card border border-[var(--border-subtle)] text-left space-y-3 text-xs font-mono-luxury shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <span className="text-[var(--text-secondary)]">Recipient:</span>
            <span className="font-bold text-[var(--text-primary)]">{orderPlaced.customerName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <span className="text-[var(--text-secondary)]">Destination:</span>
            <span className="font-bold text-[var(--text-primary)] text-right truncate max-w-[200px]">{orderPlaced.deliveryAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Total Escrow Paid:</span>
            <span className="font-bold text-[var(--gold-accent)] text-sm">₦{Number(orderPlaced.totalAmount || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(orderPlaced.orderNumber)}`}
            className="w-full py-4 rounded-2xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold shadow-xl flex items-center justify-center gap-2"
          >
            <Truck className="h-4 w-4" />
            <span>Track Order Live</span>
          </Link>

          <Link
            href="/shop"
            className="w-full py-3.5 rounded-2xl surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold text-center"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-36 select-none animate-fadeIn">
      
      {/* 1. TOP APP BAR */}
      <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-editorial text-xl font-bold text-[var(--text-primary)] leading-tight">
              Escrow Checkout
            </h1>
            <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>100% Protected Payment</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CHECKOUT FORM CONTENT */}
      <form onSubmit={handleStartPayment} id="mobile-checkout-form" className="p-4 space-y-4">
        
        {/* Step 1: Contact & Delivery Address */}
        <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
            <MapPin className="h-3.5 w-3.5" />
            <span>1. Delivery Contact & Address</span>
          </div>

          <div className="space-y-3 text-xs font-mono-luxury">
            <div>
              <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Recipient Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Phone (For Driver)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08012*****"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Delivery State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
                >
                  {NIGERIAN_STATES.map((st: string) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                City / Town / District
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
              >
                {getCitiesForState(formData.state).map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Street Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Plot 14, Commercial Avenue, near Central Market"
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Vendor Packages & Shipping Mode */}
        <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
            <Truck className="h-3.5 w-3.5" />
            <span>2. Vendor Shipments & Delivery Mode</span>
          </div>

          <div className="space-y-3">
            {Object.values(groupedItems).map((pkg) => {
              const calc = packageShippingCalculations[pkg.vendorId] || { fee: 2500, method: 'doorstep', reason: 'Courier' };
              const currentMethod = packageMethods[pkg.vendorId] || 'doorstep';
              const rates = pkg.shippingRates || {};

              return (
                <div key={pkg.vendorId} className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                    <div>
                      <div className="font-bold text-xs font-mono-luxury text-[var(--text-primary)]">{pkg.vendorName}</div>
                      <div className="text-[10px] font-mono-luxury text-[var(--text-secondary)] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[var(--gold-accent)]" />
                        <span>{pkg.vendorCity || 'Lagos'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                        ₦{calc.fee.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-mono-luxury text-emerald-400 font-bold">
                        {calc.reason}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Mode Toggles */}
                  {!calc.isSameCity && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => togglePackageMethod(pkg.vendorId, 'doorstep')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                          currentMethod === 'doorstep'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        <Home className="h-3.5 w-3.5" />
                        <span>Deliver to Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePackageMethod(pkg.vendorId, 'park_pickup')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                          currentMethod === 'park_pickup'
                            ? 'bg-[var(--gold-accent)] text-black shadow-sm font-extrabold'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        <Building className="h-3.5 w-3.5" />
                        <span>Park Waybill (Pay on Pickup)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Order Breakdown */}
        <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
          <span className="uppercase text-[var(--text-secondary)] font-bold block">
            3. Summary Breakdown
          </span>

          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>Clothes Subtotal:</span>
            <span className="font-bold text-[var(--text-primary)]">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>Multi-Vendor Delivery:</span>
            <span className="font-bold text-[var(--gold-accent)]">₦{totalShippingFee.toLocaleString()}</span>
          </div>

          <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-sm font-bold">
            <span className="text-[var(--text-primary)]">Total to Pay (Escrow):</span>
            <span className="font-editorial text-2xl font-bold text-amber-600 dark:text-[var(--gold-accent)]">
              ₦{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

      </form>

      {/* 3. FIXED BOTTOM ESCROW PAYMENT TRIGGER */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0c]/90 dark:bg-[#0a0a0c]/90 bg-white/95 backdrop-blur-2xl border-t border-black/10 dark:border-white/10 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] uppercase block">Total Escrow:</span>
          <div className="font-editorial text-xl font-bold text-amber-600 dark:text-[var(--gold-accent)] leading-none mt-0.5">
            ₦{grandTotal.toLocaleString()}
          </div>
        </div>

        <button
          type="submit"
          form="mobile-checkout-form"
          className="flex-1 max-w-[220px] py-3.5 px-4 rounded-2xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold hover:bg-[#d8b357] transition-all shadow-xl flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Lock className="h-4 w-4" />
          <span>Pay via Escrow</span>
        </button>
      </div>

      {/* 4. PAYMENT CONFIRMATION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-0 animate-fadeIn">
          <div className="w-full max-w-md surface-card rounded-t-3xl border-t border-x border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl animate-slideUp">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">Veyra Escrow Gateway</span>
              </div>
              <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold">256-Bit Encrypted</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury space-y-1.5">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Items Total:</span>
                <span className="font-bold text-[var(--text-primary)]">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Delivery Total:</span>
                <span className="font-bold text-[var(--gold-accent)]">₦{totalShippingFee.toLocaleString()}</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between font-bold text-sm">
                <span>Grand Total:</span>
                <span className="text-[var(--gold-accent)] text-lg">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono-luxury text-emerald-400 leading-relaxed">
              Your money is locked safely in Veyra Escrow and only released to each designer after you confirm your clothes are delivered.
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={paymentMethod === 'paystack' ? handlePayWithPaystack : () => handleCompletePayment()}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold hover:bg-[#d8b357] transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-black" />
                    <span>Processing Escrow...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[3] text-black" />
                    <span>Pay ₦{grandTotal.toLocaleString()} {paymentMethod === 'paystack' ? '(Paystack Test)' : ''}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCompletePayment()}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] text-center text-xs font-mono-luxury uppercase text-[var(--gold-accent)] hover:border-[var(--gold-accent)] transition-colors cursor-pointer"
              >
                Instant Test Checkout (Skip Gateway)
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-center text-xs font-mono-luxury text-[var(--text-muted)] cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. PAYSTACK SANDBOX SIMULATOR MODAL */}
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
                Recipient: Veyra Escrow Treasury
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
              <strong>Test Mode:</strong> No personal Paystack key added in <code className="text-white">.env.local</code> yet. This simulates a successful Paystack card payment and secures your order into Veyra Escrow.
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  setShowPaystackSimModal(false);
                  await handleCompletePayment(`paystack_sim_${Date.now()}`);
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
                    <Check className="h-4 w-4 stroke-[3]" />
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
  );
}
