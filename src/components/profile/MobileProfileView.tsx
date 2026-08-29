'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  User, Sparkles, Bookmark, Package, Store, MapPin,
  Phone, ShieldCheck, LogOut, Check, ChevronRight,
  ArrowRight, ShoppingBag, ArrowLeft, Ruler
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileTwinDrawer from '@/components/studio/MobileTwinDrawer';
import MobileQuickBuyDrawer from '@/components/mobile/MobileQuickBuyDrawer';

export default function MobileProfileView() {
  const router = useRouter();
  const {
    userAuth,
    setUserAuth,
    bodyProfile,
    setBodyProfile,
    vault,
    userOrders,
    followedVendors,
    toggleVaultItem,
    setOutfitItem,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'vault' | 'orders' | 'brands'>('profile');
  const [isTwinOpen, setIsTwinOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(bodyProfile.deliveryAddress || '');
  const [city, setCity] = useState(bodyProfile.city || '');
  const [state, setState] = useState(bodyProfile.state || 'Lagos');
  const [phone, setPhone] = useState(bodyProfile.phone || userAuth.phone || '');

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setBodyProfile({
      deliveryAddress,
      city,
      state,
      phone,
    });
    setIsEditingAddress(false);
  };

  const handleLogout = () => {
    setUserAuth({
      isLoggedIn: false,
      email: '',
      name: '',
      phone: '',
      gender: 'male',
      userType: 'shopper',
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-36 select-none animate-fadeIn">
      
      {/* 3D Mobile Twin Bottom Sheet Drawer */}
      <MobileTwinDrawer
        isOpen={isTwinOpen}
        onClose={() => setIsTwinOpen(false)}
      />

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
              Patron Profile
            </h1>
            <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold">
              3D Twin & Account Hub
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-full surface-card border border-[var(--border-subtle)] text-rose-400 hover:text-rose-300"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        
        {/* 2. PATRON IDENTITY CARD */}
        <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-[var(--gold-subtle)] border-2 border-[var(--gold-accent)] flex items-center justify-center text-xl font-bold text-[var(--gold-accent)] font-mono-luxury shrink-0">
              {userAuth.name ? userAuth.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)] truncate">
                  {userAuth.name || bodyProfile.name || 'Veyra Patron'}
                </h2>
                <ShieldCheck className="h-4 w-4 text-[var(--gold-accent)] shrink-0" />
              </div>
              <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] truncate">
                {userAuth.email || 'Verified Patron'}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-[9px] font-mono-luxury font-bold uppercase">
                Veyra Black Patron
              </span>
            </div>
          </div>

          {/* 3D Twin Status Pill */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-xs font-mono-luxury text-[var(--text-primary)] block">
                  3D Body Twin Active
                </span>
                <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">
                  Size: {bodyProfile.preferredSize || 'M'} · {bodyProfile.gender || 'Men'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTwinOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-[10px] font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              Open Studio
            </button>
          </div>
        </div>

        {/* 3. NAVIGATION PILLS */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
          {[
            { id: 'profile', label: 'Twin Fit', icon: Ruler },
            { id: 'vault', label: `Vault (${vault.length})`, icon: Bookmark },
            { id: 'orders', label: `Orders (${userOrders.length})`, icon: Package },
            { id: 'brands', label: `Ateliers (${followedVendors.length})`, icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const isChosen = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isChosen
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[9px] uppercase tracking-wider truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. TAB CONTENTS */}
        
        {/* Tab 1: 3D Twin Fit Profile & Address */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            
            {/* Preferred Size & Measurements */}
            <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3">
              <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] block">
                Preferred Garment Size:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const isSel = (bodyProfile.preferredSize || 'M') === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setBodyProfile({ preferredSize: sz as 'S' | 'M' | 'L' | 'XL' | 'XXL' })}
                      className={`py-2.5 rounded-2xl text-xs font-mono-luxury font-bold uppercase transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
                  Default Delivery Location:
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold uppercase underline"
                >
                  {isEditingAddress ? 'Cancel' : 'Edit Address'}
                </button>
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs font-mono-luxury">
                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
                      Phone Number (For Courier)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08012345678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lekki Phase 1, Victoria Island"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. 14 Admiralty Way"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold shadow-md"
                  >
                    Save Delivery Details
                  </button>
                </form>
              ) : (
                <div className="space-y-1.5 text-xs font-mono-luxury text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold">
                    <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                    <span>{bodyProfile.deliveryAddress || 'No default street address saved.'}</span>
                  </div>
                  <div className="text-[11px] pl-5">
                    {bodyProfile.city ? `${bodyProfile.city}, ` : ''}{bodyProfile.state || 'Lagos State'}
                  </div>
                  {bodyProfile.phone && (
                    <div className="flex items-center gap-1.5 text-[11px] pl-5 text-[var(--text-muted)]">
                      <Phone className="h-3 w-3" />
                      <span>{bodyProfile.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vendor Portal Link if user is vendor */}
            {userAuth.userType === 'vendor' && (
              <Link
                href="/vendor"
                className="block p-4 rounded-3xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/50 text-[var(--gold-accent)] font-mono-luxury uppercase text-xs font-bold text-center shadow-lg"
              >
                <span>Go to Designer Vendor Portal →</span>
              </Link>
            )}

          </div>
        )}

        {/* Tab 2: Vault Saved Items */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            {vault.length === 0 ? (
              <div className="p-10 rounded-3xl surface-card text-center space-y-3 border border-[var(--border-subtle)]">
                <Bookmark className="h-8 w-8 mx-auto text-[var(--gold-accent)] opacity-60" />
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">Your Vault is Empty</h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                  Save pieces from the feed or boutique drops to preview them here anytime.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {vault.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-2xl surface-card border border-[var(--border-subtle)] space-y-2 shadow-sm"
                  >
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/40">
                      <Image
                        src={product.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{product.name}</h4>
                      <div className="font-mono-luxury text-xs font-bold text-[var(--gold-accent)]">
                        ₦{Number(product.price || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setOutfitItem(product)}
                        className="py-1.5 px-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[9px] font-mono-luxury uppercase font-bold text-[var(--gold-accent)] flex items-center justify-center gap-0.5"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>3D Fit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickBuyProduct(product)}
                        className="py-1.5 px-1 rounded-lg bg-[var(--gold-accent)] text-black text-[9px] font-mono-luxury uppercase font-bold flex items-center justify-center gap-0.5"
                      >
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="p-10 rounded-3xl surface-card text-center space-y-3 border border-[var(--border-subtle)]">
                <Package className="h-8 w-8 mx-auto text-[var(--gold-accent)] opacity-60" />
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">No Active Orders</h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                  Once you order from Nigerian ateliers, track live waybills and courier dispatch here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                    className="block p-4 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="font-editorial text-sm font-bold text-[var(--gold-accent)]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold uppercase">
                        Escrow Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-luxury">
                      <span className="text-[var(--text-secondary)]">{order.items?.length || 1} Piece(s)</span>
                      <span className="font-bold text-[var(--text-primary)]">₦{Number(order.totalAmount || 0).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold pt-1">
                      <span>Track Shipment Live</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Followed Ateliers */}
        {activeTab === 'brands' && (
          <div className="space-y-4">
            {followedVendors.length === 0 ? (
              <div className="p-10 rounded-3xl surface-card text-center space-y-3 border border-[var(--border-subtle)]">
                <Store className="h-8 w-8 mx-auto text-[var(--gold-accent)] opacity-60" />
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">No Followed Brands</h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                  Follow designers from the home feed or lookbooks to get notified of new ready-to-wear drops.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {followedVendors.map((vId) => (
                  <Link
                    key={vId}
                    href={`/brand/${encodeURIComponent(vId)}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/40 text-[var(--gold-accent)] flex items-center justify-center font-bold text-xs font-mono-luxury">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs font-mono-luxury text-[var(--text-primary)] block capitalize">
                          {vId.replace(/-/g, ' ')}
                        </span>
                        <span className="text-[9px] font-mono-luxury text-emerald-400 font-bold uppercase">
                          Verified Atelier
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Quick Buy Drawer */}
      {quickBuyProduct && (
        <MobileQuickBuyDrawer
          product={quickBuyProduct}
          onClose={() => setQuickBuyProduct(null)}
        />
      )}

    </div>
  );
}
