'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  Building, User, Mail, Phone, MapPin, Check,
  ShieldCheck, ExternalLink, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function VendorAtelierProfilePage() {
  const { vendorProfile, setVendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    brandName: vendorProfile.brandName,
    designerName: vendorProfile.designerName,
    email: vendorProfile.email,
    phone: vendorProfile.phone,
    location: vendorProfile.location,
    instagram: vendorProfile.instagram,
    bio: vendorProfile.bio,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVendorProfile(form);
    setSaved(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {isBoutique ? 'Boutique Store Profile & Branding' : 'Atelier Profile & Storefront'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            {isBoutique
              ? 'Configure your store identity, boutique manager contacts, and Instagram showcase across Veyra.'
              : 'Configure your brand identity, lead tailor credentials, and social links visible across Veyra.'}
          </p>
        </div>

        <Link
          href={`/brand/${encodeURIComponent(vendorProfile.brandName)}`}
          target="_blank"
          className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
        >
          <span>{isBoutique ? 'View Boutique Storefront' : 'View Public Storefront'}</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Profile Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                {isBoutique ? 'Boutique / Store Name' : 'Atelier Brand Name'}
              </label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                {isBoutique ? 'Store Manager / Contact Person' : 'Lead Designer / Tailor'}
              </label>
              <input
                type="text"
                required
                value={form.designerName}
                onChange={(e) => setForm({ ...form, designerName: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Business Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Studio Location
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Instagram Handle
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
              Atelier Brand Story & Craftsmanship Bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="py-3.5 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Profile Updated Successfully!</span>
              </>
            ) : (
              <span>Save Atelier Changes</span>
            )}
          </button>
        </form>

        {/* Right 5 Cols: Public Card Preview */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
          <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
            Public Storefront Preview
          </span>

          <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[var(--gold-accent)]/15 text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-xl">
                {form.brandName.charAt(0)}
              </div>
              <div>
                <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  {form.brandName}
                </h4>
                <div className="text-xs font-mono-luxury text-emerald-500 font-bold">
                  ● Verified Nigerian Atelier
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {form.bio}
            </p>

            <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-xs font-mono-luxury">
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">Lead Tailor:</span>
                <span className="text-[var(--text-primary)] font-bold">{form.designerName}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">Instagram:</span>
                <span className="text-[var(--gold-accent)] font-bold">{form.instagram}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
