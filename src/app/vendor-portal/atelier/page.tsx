'use client';

import { vendorFetch } from '@/lib/services/apiClient';
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  Building, User, Mail, Phone, MapPin, Check,
  ShieldCheck, ExternalLink, Sparkles, Store, Loader2,
  Clock, AlertCircle, CheckCircle2, Truck, Package, Navigation, X
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import MobileVendorAtelier from '@/components/vendor/MobileVendorAtelier';
import VendorLuxuryLoader from '@/components/vendor/VendorLuxuryLoader';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

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

import { isBoutiqueVendor } from '@/types';

export default function VendorAtelierProfilePage() {
  const { vendorProfile, setVendorProfile } = useStore();
  const isBoutique = isBoutiqueVendor(vendorProfile);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>('pending');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    brandName: vendorProfile.brandName || '',
    designerName: vendorProfile.designerName || '',
    email: vendorProfile.email || '',
    phone: vendorProfile.phone || '',
    city: '',
    state: '',
    location: '',
    dispatchDays: '1-2 business days',
    sameCityFee: 1000,
    closeHubFee: 2500,
    interstateFee: 4500,
    parkPickupFee: 1500,
    parkPickupEnabled: true,
    instagram: '',
    tiktok: '',
    snapchat: '',
    whatsapp: '',
    bio: '',
    vendorType: vendorProfile.vendorType || 'fashion_designer'
  });

  // Auto-dismiss alert messages after 10 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch live vendor profile from DB endpoint on mount
  const fetchLiveProfile = useCallback(async () => {
    try {
      const res = await vendorFetch('/api/vendor/profile');
      const data = await res.json();
      if (res.ok && data.success && data.vendor) {
        const v = data.vendor;
        const rates = v.shippingRates || {};
        setForm({
          brandName: v.brandName || v.brand_name || '',
          designerName: v.designerName || v.designer_name || v.contact_person || '',
          email: v.email || '',
          phone: v.phone || '',
          city: v.city || '',
          state: v.state || '',
          location: v.location || (v.city && v.state ? `${v.city}, ${v.state}` : v.city || v.state || ''),
          dispatchDays: v.dispatchDays || '1-2 business days',
          sameCityFee: rates.sameCity !== undefined ? Number(rates.sameCity) : 1000,
          closeHubFee: rates.closeHub !== undefined ? Number(rates.closeHub) : 2500,
          interstateFee: rates.interstate !== undefined ? Number(rates.interstate) : 4500,
          parkPickupFee: rates.parkPickup !== undefined ? Number(rates.parkPickup) : 1500,
          parkPickupEnabled: rates.parkPickupEnabled !== undefined ? !!rates.parkPickupEnabled : true,
          instagram: v.instagram || v.socialLinks?.instagram || '',
          tiktok: v.tiktok || v.socialLinks?.tiktok || '',
          snapchat: v.snapchat || v.socialLinks?.snapchat || '',
          whatsapp: v.whatsapp || v.socialLinks?.whatsapp || v.phone || '',
          bio: v.bio || '',
          vendorType: isBoutiqueVendor(v) ? 'boutique_seller' : 'fashion_designer'
        });

        setIsProfileSaved(!!v.isProfileSaved);
        setApprovalStatus(v.approvalStatus || (v.isVerified ? 'approved' : 'pending'));
        setRejectionReason(v.rejectionReason || '');

        // Sync to Zustand Store
        const normalizedType = isBoutiqueVendor(v) ? 'boutique_seller' : 'fashion_designer';
        setVendorProfile({
          brandName: v.brandName || v.brand_name || 'My Brand',
          designerName: v.designerName || v.designer_name || v.contact_person || 'Manager',
          contactPerson: v.contactPerson || v.contact_person || v.designerName || v.designer_name || 'Manager',
          email: v.email || '',
          phone: v.phone || '',
          location: v.location || (v.city && v.state ? `${v.city}, ${v.state}` : '') || 'Lagos, Nigeria',
          vendorType: normalizedType,
          bankName: v.bankName || v.bank_name || 'Guaranty Trust Bank (GTBank)',
          accountNumber: v.accountNumber || v.account_number || '',
          accountName: v.accountName || v.account_name || '',
          bio: v.bio || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [setVendorProfile]);

  useEffect(() => {
    fetchLiveProfile();
  }, [fetchLiveProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const cleanLoc = form.city && form.state ? `${form.city.trim()}, ${form.state.trim()}` : form.city || form.state || '';
      const payload = {
        ...form,
        location: cleanLoc,
        shippingRates: {
          sameCity: Number(form.sameCityFee) || 0,
          closeHub: Number(form.closeHubFee) || 2500,
          interstate: Number(form.interstateFee) || 4500,
          parkPickup: Number(form.parkPickupFee) || 1500,
          parkPickupEnabled: !!form.parkPickupEnabled,
        },
        approvalStatus: 'approved'
      };

      const res = await vendorFetch('/api/vendor/profile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errText = data.error || 'Failed to save store profile. Please check details.';
        setErrorMessage(errText);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      setVendorProfile(payload as any);
      setIsProfileSaved(true);
      setApprovalStatus('approved');
      setSuccessMessage('Store profile, delivery zone rates, and social channels saved successfully!');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Network error while saving profile.');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return <VendorLuxuryLoader label="Loading Store Profile from Database..." />;
  }

  return (
    <>
      {/* 1. DEDICATED MOBILE ATELIER PROFILE */}
      <div className="block md:hidden">
        <MobileVendorAtelier
          form={form}
          setForm={setForm}
          handleSave={handleSave}
          isSaving={isSaving}
          isProfileSaved={isProfileSaved}
          approvalStatus={approvalStatus}
          rejectionReason={rejectionReason}
          isLoadingProfile={isLoadingProfile}
          isBoutique={isBoutique}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      </div>

      {/* 2. DESKTOP LUXURY ATELIER PROFILE */}
      <div className="hidden md:block space-y-8 animate-fadeIn max-w-7xl pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {isBoutique ? 'Boutique Store Profile & Logistics' : 'Atelier Profile & Storefront'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
            Configure your store location, turnaround time, and delivery zone rates.
          </p>
        </div>

        <Link
          href={`/brand/${encodeURIComponent(form.brandName || 'brand')}`}
          target="_blank"
          className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>View Public Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0 animate-ping" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-[10px] text-rose-400/70 hover:text-rose-300 uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-bold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-[10px] text-emerald-400/70 hover:text-emerald-300 uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2 Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Configuration Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-md">
          
          {/* Status Alert Banner */}
          {approvalStatus === 'approved' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-mono-luxury text-emerald-400 font-bold uppercase">
                  Store Profile Approved & Verified
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                  Your store profile and delivery rates are live across the Veyra storefront.
                </div>
              </div>
            </div>
          )}

          {isProfileSaved && approvalStatus === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-mono-luxury text-amber-400 font-bold uppercase">
                  Store Profile Under Super Admin Review
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                  Your store details and delivery rates have been submitted for admin verification.
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
                  {isBoutique ? 'Boutique / Brand Name' : 'Atelier Brand Name'}
                </label>
                <input
                  type="text"
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g. Your Brand Name"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  {isBoutique ? 'Store Manager / Contact Person' : 'Lead Designer / Tailor'}
                </label>
                <input
                  type="text"
                  value={form.designerName}
                  onChange={(e) => setForm({ ...form, designerName: e.target.value })}
                  placeholder="e.g. Lead Tailor or Store Manager"
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
                  placeholder="store@example.com"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Official Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. Store Location & Delivery Zone Rates */}
          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--gold-accent)]" />
                <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold">
                  2. Store Location & Delivery Zone Rates
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                Set where your boutique/workshop is located so checkout calculates accurate delivery fees for customers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Store City / Town
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Ikeja, Yaba, Ibadan, etc."
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Store State
                </label>
                <select
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold cursor-pointer"
                >
                  <option value="">-- Select State --</option>
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Dispatches In
                </label>
                <select
                  value={form.dispatchDays}
                  onChange={(e) => setForm({ ...form, dispatchDays: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
                >
                  <option value="Same-day / 1 day">Same-day / 1 business day</option>
                  <option value="1-2 business days">1-2 business days</option>
                  <option value="2-3 business days">2-3 business days</option>
                  <option value="3-5 business days">3-5 business days</option>
                </select>
              </div>
            </div>

            {/* Delivery Fees Configuration */}
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <span className="text-[11px] font-mono-luxury uppercase font-bold text-[var(--text-primary)] block">
                Delivery Charges for Your Dispatch
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Same City / Local
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--gold-accent)] font-bold">₦</span>
                    <input
                      type="number"
                      value={form.sameCityFee}
                      onChange={(e) => setForm({ ...form, sameCityFee: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono-luxury">Direct local rider</span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Nearby / Intra-State
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--gold-accent)] font-bold">₦</span>
                    <input
                      type="number"
                      value={form.closeHubFee}
                      onChange={(e) => setForm({ ...form, closeHubFee: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono-luxury">Within state / nearby hub</span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                    Nationwide (Interstate)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--gold-accent)] font-bold">₦</span>
                    <input
                      type="number"
                      value={form.interstateFee}
                      onChange={(e) => setForm({ ...form, interstateFee: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono-luxury">Other Nigerian states</span>
                </div>
              </div>

              {/* Park Pickup Option */}
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.parkPickupEnabled}
                    onChange={(e) => setForm({ ...form, parkPickupEnabled: e.target.checked })}
                    className="rounded border-[var(--border-subtle)] text-[var(--gold-accent)] cursor-pointer"
                  />
                  <span className="text-xs font-mono-luxury text-[var(--text-primary)]">
                    Allow Park / Hub Waybill Pickup Option
                  </span>
                </label>

                {form.parkPickupEnabled && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono-luxury text-[var(--text-secondary)]">Pickup Fee:</span>
                    <div className="relative w-24">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--gold-accent)] font-bold">₦</span>
                      <input
                        type="number"
                        value={form.parkPickupFee}
                        onChange={(e) => setForm({ ...form, parkPickupFee: Number(e.target.value) })}
                        className="w-full pl-6 pr-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* 3. Social Media Channels */}
          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--gold-accent)] font-bold block">
                3. Social Media Channels
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                Add your brand handles so shoppers can discover and connect with your boutique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <InstagramLogo />
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@your_brand"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <TikTokLogo />
                  <span>TikTok</span>
                </label>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                  placeholder="@your_tiktok"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <SnapchatLogo />
                  <span>Snapchat</span>
                </label>
                <input
                  type="text"
                  value={form.snapchat}
                  onChange={(e) => setForm({ ...form, snapchat: e.target.value })}
                  placeholder="@your_snapchat"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-amber-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* Submit / Update Button */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
                  <span>Saving Store Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save Store Profile & Delivery Rates</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Right 5 Cols: Live Storefront Card Preview */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 shadow-md">
          <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
            Customer Storefront Badge Preview
          </span>

          <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-lg font-editorial font-bold text-[var(--gold-accent)]">
                {(form.brandName || 'V').charAt(0)}
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold">
                {isBoutique ? 'Verified Boutique' : 'Verified Atelier'}
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                {form.brandName || (isBoutique ? 'My Boutique Brand' : 'My Fashion Atelier')}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono-luxury flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                <span>
                  {form.city && form.state ? `${form.city}, ${form.state}` : form.location || 'Victoria Island, Lagos'}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono-luxury">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] block">Dispatch Window</span>
                <span className="font-bold text-[var(--text-primary)]">{form.dispatchDays}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] block">Local Dispatch Fee</span>
                <span className="font-bold text-[var(--gold-accent)]">₦{Number(form.sameCityFee).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
    </>
  );
}
