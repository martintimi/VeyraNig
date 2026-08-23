'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { vendors } from '@/lib/data/vendors';
import { Trash2, Plus, Minus, Store, Truck, ArrowRight, Sparkles, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, bodyProfile } = useStore();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);

  const groupedItems = cart.reduce((acc, item) => {
    const vendorId = item.product.vendorId;
    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendor: vendors.find(v => v.id === vendorId) || {
          id: vendorId,
          name: item.product.vendorName,
          code: 'VY',
          deliveryDays: '1 - 2 business days (Lagos)',
          shippingFee: 2000,
        },
        items: [],
      };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendor: any; items: typeof cart }>);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const distinctVendors = Object.keys(groupedItems).length;
  const shippingTotal = distinctVendors > 0 ? (subtotal > 100000 ? 0 : 3500) : 0;
  const grandTotal = subtotal + shippingTotal;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 text-xs font-mono-luxury text-[var(--gold-accent)] uppercase tracking-widest mb-1 font-bold">
          <Store className="h-3.5 w-3.5" />
          <span>MULTI-BRAND CHECKOUT</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
          Your Shopping Bag
        </h1>
      </div>

      {orderComplete ? (
        <div className="p-12 sm:p-16 rounded-3xl surface-card text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
          <h3 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">Order Confirmed & Sent to Tailors!</h3>
          <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
            Your clothes are tailored to <strong>{bodyProfile.name}&apos;s Body Profile</strong> and will be shipped together in one delivery.
          </p>
          <button
            onClick={() => {
              setOrderComplete(false);
              clearCart();
            }}
            className="px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      ) : cart.length === 0 ? (
        <div className="p-16 rounded-3xl surface-card text-center space-y-4">
          <p className="text-base text-[var(--text-secondary)] font-light">Your shopping bag is currently empty.</p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all shadow-md"
          >
            <span>Open Outfit Builder</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            {Object.values(groupedItems).map(({ vendor, items }) => (
              <div key={vendor.id} className="p-6 rounded-3xl surface-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-lg bg-[var(--badge-bg)] text-[10px] font-mono-luxury font-bold flex items-center justify-center">
                      {vendor.code || 'VY'}
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)] font-mono-luxury uppercase tracking-wider">{vendor.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-luxury text-[var(--text-muted)]">
                    <Truck className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                    <span>{vendor.deliveryDays}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[var(--text-primary)] truncate">{item.product.name}</h4>
                        <div className="text-xs font-mono-luxury text-[var(--gold-accent)] mt-0.5 font-bold">Size {item.selectedSize} · ₦{item.product.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-2 py-1 rounded-xl border border-[var(--border-subtle)]">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-mono-luxury text-[var(--text-primary)] px-1">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[var(--text-muted)] hover:text-rose-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 rounded-3xl surface-card space-y-5 sticky top-24 shadow-xl">
              <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">Order Summary</h3>
              <div className="space-y-2.5 text-xs font-mono-luxury">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Items Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Delivery (Lagos & Nationwide)</span>
                  <span className={shippingTotal === 0 ? 'text-emerald-500 font-semibold' : ''}>
                    {shippingTotal === 0 ? 'FREE' : `₦${shippingTotal.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-3 border-t border-[var(--border-subtle)]">
                  <span>Total Amount</span>
                  <span className="font-editorial text-2xl font-bold">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isCheckingOut ? <Sparkles className="h-4 w-4 animate-spin" /> : <span>1-Click Order (₦{grandTotal.toLocaleString()})</span>}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
