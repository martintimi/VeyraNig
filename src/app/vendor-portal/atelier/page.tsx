'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  Building, User, Mail, Phone, MapPin, Check,
  ShieldCheck, ExternalLink, Sparkles, Store, Loader2,
  Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

// Vector App Logos
const InstagramLogo = () => (
  <svg className="h-4 w-4 shrink-0 text-pink-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokLogo = () => (
  <svg className="h-4 w-4 shrink-0 text-cyan-400 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.48 6.27 6.27 0 0 0 1.9-4.47V8.62a8.27 8.27 0 0 0 4.88 1.58V6.75c-.34-.01-.67-.03-1-.06z"/>
  </svg>
);

const SnapchatLogo = () => (
  <svg className="h-4 w-4 shrink-0 text-amber-300 fill-current" viewBox="0 0 24 24">
    <path d="M12.002 2c-3.528 0-6.136 2.548-6.136 5.86 0 .894.227 1.83.67 2.66-.25.13-.538.258-.871.393-1.077.441-1.637.95-1.665 1.512-.03.585.503 1.135 1.583 1.635.035.016.07.032.106.048-.052.288-.13.722-.387 1.253-.332.684-.816 1.183-1.438 1.482-.676.326-.777.685-.758.895.03.328.375.568.995.692.658.132 1.458.118 2.327-.04.423-.077.873-.193 1.341-.334.422.56.985.939 1.688 1.132.846.232 1.745.244 2.545.035.801.21 1.7.198 2.546-.035.703-.193 1.266-.572 1.688-1.132.468.141.918.257 1.341.334.869.158 1.669.172 2.327.04.62-.124.965-.364.995-.692.019-.21-.082-.569-.758-.895-.622-.299-1.106-.798-1.438-1.482-.257-.531-.335-.965-.387-1.253.036-.016.071-.032.106-.048 1.08-.5 1.613-1.05 1.583-1.635-.028-.562-.588-1.071-1.665-1.512-.333-.135-.621-.263-.871-.393.443-.83.67-1.766.67-2.66 0-3.312-2.608-5.86-6.136-5.86z"/>
  </svg>
);

export default function VendorAtelierProfilePage() {
  const { vendorProfile, setVendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';
  
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>('pending');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [form, setForm] = useState({
    id: vendorProfile.id || 'moji-wears',
    brandName: vendorProfile.brandName || 'Moji wears',
    designerName: vendorProfile.designerName || '',
    email: vendorProfile.email || '',
    phone: vendorProfile.phone || '',
    location: vendorProfile.location || 'Victoria Island, Lagos',
    instagram: '@' + (vendorProfile.brandName || 'moji').toLowerCase().replace(/\s+/g, '_'),
    tiktok: '',
    snapchat: '',
    whatsapp: vendorProfile.phone || '',
    bio: vendorProfile.bio || (isBoutique ? 'Curated contemporary streetwear & ready-to-wear boutique apparel.' : 'Bespoke Nigerian artisanal tailoring.'),
    vendorType: vendorProfile.vendorType || 'boutique_merchant'
  });

  // Fetch live vendor profile from DB endpoint
  const fetchLiveProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/profile');
      const data = await res.json();
      if (res.ok && data.success && data.vendor) {
        const v = data.vendor;
        setForm({
          id: v.id || 'moji-wears',
          brandName: v.brandName || v.brand_name || 'Moji wears',
          designerName: v.designerName || v.designer_name || v.contact_person || '',
          email: v.email || '',
          phone: v.phone || '',
          location: v.location || 'Victoria Island, Lagos',
          instagram: v.instagram || v.socialLinks?.instagram || ('@' + (v.brandName || 'moji').toLowerCase().replace(/\s+/g, '_')),
          tiktok: v.tiktok || v.socialLinks?.tiktok || '',
          snapchat: v.snapchat || v.socialLinks?.snapchat || '',
          whatsapp: v.whatsapp || v.socialLinks?.whatsapp || v.phone || '',
          bio: v.bio || (isBoutique ? 'Curated contemporary streetwear & ready-to-wear boutique apparel.' : 'Bespoke Nigerian artisanal tailoring.'),
          vendorType: v.vendorType || v.vendor_type || (isBoutique ? 'boutique_merchant' : 'fashion_designer')
        });

        // Set persistent saved state and approval
        setIsProfileSaved(!!v.isProfileSaved);
        setApprovalStatus(v.approvalStatus || 'pending');
        setRejectionReason(v.rejectionReason || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isBoutique]);

  useEffect(() => {
    fetchLiveProfile();
  }, [fetchLiveProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/vendor/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          approvalStatus: 'pending'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVendorProfile(form);
        setIsProfileSaved(true);
        setApprovalStatus('pending');
        await fetchLiveProfile(); // Re-fetch saved data directly from the endpoint!
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Fields are disabled whenever profile is saved and not rejected
  const isFieldsDisabled = isProfileSaved && approvalStatus !== 'rejected';

  if (isLoadingProfile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn">
        <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin" />
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading store profile from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {isBoutique ? 'Boutique Store Profile & Branding' : 'Atelier Profile & Storefront'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            {isBoutique
              ? 'Manage your boutique identity, contact details, and social media channels.'
              : 'Configure your brand identity, lead tailor credentials, and social links visible across Veyra.'}
          </p>
        </div>

        <Link
          href={`/brand/${encodeURIComponent(form.brandName)}`}
          target="_blank"
          className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
        >
          <span>{isBoutique ? 'View Boutique Storefront' : 'View Public Storefront'}</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Profile Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6">
          
          {/* Approval & Lock Status Banner */}
          {isProfileSaved && approvalStatus === 'approved' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-mono-luxury text-emerald-400 font-bold uppercase">
                  Store Profile Approved & Active
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                  Your store profile is locked and live across Veyra storefront.
                </div>
              </div>
            </div>
          )}

          {isProfileSaved && approvalStatus === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-mono-luxury text-amber-400 font-bold uppercase">
                  Store Profile Under Admin Review
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                  Your store details have been submitted. Fields remain locked during verification.
                </div>
              </div>
            </div>
          )}

          {approvalStatus === 'rejected' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono-luxury text-rose-400 font-bold uppercase">
                  Store Profile Returned For Correction
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                  {rejectionReason || 'Please update your details below and resubmit for approval.'}
                </div>
              </div>
            </div>
          )}

          {/* 1. Basic Identity */}
          <div className="space-y-4">
            <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold block">
              1. Store Identity & Contacts
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  {isBoutique ? 'Boutique / Store Name' : 'Atelier Brand Name'}
                </label>
                <input
                  type="text"
                  required
                  disabled={isFieldsDisabled}
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  {isBoutique ? 'Store Manager / Contact Person' : 'Lead Designer / Tailor'}
                </label>
                <input
                  type="text"
                  required
                  disabled={isFieldsDisabled}
                  value={form.designerName}
                  onChange={(e) => setForm({ ...form, designerName: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
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
                  disabled={isFieldsDisabled}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  {isBoutique ? 'Store Location (Lagos / City)' : 'Studio Location'}
                </label>
                <input
                  type="text"
                  required
                  disabled={isFieldsDisabled}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>
            </div>
          </div>

          {/* 2. Social Media Channels */}
          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold block">
                2. Social Media Channels
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                Add your brand handles so shoppers can discover and connect with your store.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Instagram */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <InstagramLogo />
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  disabled={isFieldsDisabled}
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@your_instagram"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-pink-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <TikTokLogo />
                  <span>TikTok</span>
                </label>
                <input
                  type="text"
                  disabled={isFieldsDisabled}
                  value={form.tiktok}
                  onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                  placeholder="@your_tiktok"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Snapchat */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <SnapchatLogo />
                  <span>Snapchat</span>
                </label>
                <input
                  type="text"
                  disabled={isFieldsDisabled}
                  value={form.snapchat}
                  onChange={(e) => setForm({ ...form, snapchat: e.target.value })}
                  placeholder="@your_snapchat"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-amber-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                </label>
                <input
                  type="tel"
                  disabled={isFieldsDisabled}
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
                />
              </div>
            </div>
          </div>

          {/* 3. Store Bio */}
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold">
              3. {isBoutique ? 'Store Bio & Brand Story' : 'Atelier Craftsmanship Bio'}
            </label>
            <textarea
              rows={3}
              disabled={isFieldsDisabled}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed focus:border-[var(--gold-accent)] focus:outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-surface)]"
            />
          </div>

          {/* Save Button ONLY shown when fields are enabled / pending submission / rejected */}
          {!isFieldsDisabled && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Store Profile...</span>
                  </>
                ) : (
                  <span>{approvalStatus === 'rejected' ? 'Resubmit Store Profile' : 'Save & Submit Store Profile'}</span>
                )}
              </button>
            </div>
          )}

        </form>

        {/* Right 5 Cols: Live Public Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-muted)] font-bold block">
            Public Storefront Preview
          </span>

          <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] font-editorial font-bold text-xl flex items-center justify-center">
                {form.brandName ? form.brandName.charAt(0).toUpperCase() : 'V'}
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  {form.brandName || 'Brand Name'}
                </h3>
                <span className="text-[10px] font-mono-luxury text-emerald-500 font-bold flex items-center gap-1">
                  ● {isBoutique ? 'Verified Nigerian Boutique' : 'Verified Nigerian Atelier'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
              {form.bio || 'Store description appears here...'}
            </p>

            {/* Social Channels Preview Bar */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
                Connected Brand Channels:
              </span>
              <div className="flex flex-wrap gap-2">
                {form.instagram && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full surface-card border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold text-[var(--text-primary)]">
                    <InstagramLogo />
                    <span>{form.instagram}</span>
                  </span>
                )}
                {form.tiktok && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full surface-card border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold text-[var(--text-primary)]">
                    <TikTokLogo />
                    <span>{form.tiktok}</span>
                  </span>
                )}
                {form.snapchat && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full surface-card border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold text-[var(--text-primary)]">
                    <SnapchatLogo />
                    <span>{form.snapchat}</span>
                  </span>
                )}
                {form.whatsapp && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full surface-card border border-[var(--border-subtle)] text-[10px] font-mono-luxury font-bold text-[var(--text-primary)]">
                    <Phone className="h-3 w-3 text-emerald-400" />
                    <span>{form.whatsapp}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono-luxury text-[var(--text-muted)] flex items-center justify-between">
              <span>{isBoutique ? 'Manager:' : 'Lead Tailor:'} <strong className="text-[var(--text-primary)]">{form.designerName || 'N/A'}</strong></span>
              <span>{form.location}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
