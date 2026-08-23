'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { vendors } from '@/lib/data/vendors';
import { X, Trash2, Plus, Minus, Check, Sparkles, Truck, ArrowRight, Store } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

export default function SplitCartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    bodyProfile
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

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

  const handleReset = () => {
    setOrderComplete(false);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)]">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Your Shopping Bag
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono-luxury uppercase">
                {cart.length} {cart.length === 1 ? 'Garment' : 'Garments'} · {distinctVendors} {distinctVendors === 1 ? 'Brand' : 'Brands'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {orderComplete ? (
            /* Order Placed */
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h4 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
                Order Confirmed!
              </h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed font-light">
                Your clothes will be tailored and delivered together to your address for <strong>{bodyProfile.name}</strong>.
              </p>

              <div className="w-full p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-left space-y-2 text-xs font-mono-luxury uppercase">
                <div className="text-[var(--gold-accent)] font-bold">Brand Dispatch Status:</div>
                {Object.values(groupedItems).map(({ vendor, items }) => (
                  <div key={vendor.id} className="flex justify-between text-[var(--text-primary)]">
                    <span>{vendor.name} ({items.length} pcs)</span>
                    <span className="text-emerald-500">Confirmed (Lagos Hub)</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-all mt-4"
              >
                Return to Shop
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-[var(--text-muted)] space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center">
                <Store className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] font-mono-luxury uppercase">
                Shopping Bag Empty
              </p>
              <p className="text-xs max-w-xs text-[var(--text-secondary)] font-light">
                Explore our catalog to mix and match Senator sets, tees, and shoes.
              </p>
            </div>
          ) : (
            /* Grouped Packages */
            <div className="space-y-6">
              {Object.values(groupedItems).map(({ vendor, items }) => (
                <div
                  key={vendor.id}
                  className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-[var(--badge-bg)] text-[10px] font-mono-luxury font-bold flex items-center justify-center">
                        {vendor.code || 'VY'}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)] font-mono-luxury uppercase tracking-wider">{vendor.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono-luxury text-[var(--text-muted)]">
                      <Truck className="h-3 w-3 text-[var(--gold-accent)]" />
                      <span>{vendor.deliveryDays}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-subtle)]">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {item.product.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                            <span className="text-[var(--gold-accent)] font-bold">Size {item.selectedSize}</span>
                            <span>·</span>
                            <span>₦{item.product.price.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)]">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono-luxury text-[var(--text-primary)] px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        {!orderComplete && cart.length > 0 && (
          <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-4">
            <div className="space-y-1.5 text-xs font-mono-luxury">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Delivery (Lagos & Nationwide)</span>
                <span className={shippingTotal === 0 ? 'text-emerald-500 font-semibold' : ''}>
                  {shippingTotal === 0 ? 'FREE (Orders > ₦100k)' : `₦${shippingTotal.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Total Amount</span>
                <span className="font-editorial text-2xl font-bold">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-lg"
            >
              {isCheckingOut ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>1-Click Checkout (₦{grandTotal.toLocaleString()})</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
