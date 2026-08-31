'use client';

import React, { useState } from 'react';
import {
  Building, User, Mail, Phone, MapPin, Check,
  ShieldCheck, ExternalLink, Sparkles, Store, Loader2,
  Clock, AlertCircle, CheckCircle2, Truck, Navigation, Save
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import VendorLuxuryLoader from './VendorLuxuryLoader';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

interface MobileVendorAtelierProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleSave: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
  isProfileSaved: boolean;
  approvalStatus: string;
  rejectionReason: string;
  isLoadingProfile: boolean;
  isBoutique: boolean;
  errorMessage?: string;
  setErrorMessage?: (msg: string) => void;
  successMessage?: string;
  setSuccessMessage?: (msg: string) => void;
}

export default function MobileVendorAtelier({
  form,
  setForm,
  handleSave,
  isSaving,
  isProfileSaved,
  approvalStatus,
  rejectionReason,
  isLoadingProfile,
  isBoutique,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage
}: MobileVendorAtelierProps) {
  if (isLoadingProfile) {
    return <VendorLuxuryLoader label="Loading Store Profile from Database..." />;
  }

  const isVerified = approvalStatus === 'approved';
  const isRejected = approvalStatus === 'rejected';

  return (
    <form onSubmit={handleSave} className="space-y-4 animate-fadeIn pb-20 select-none">
      
      {/* Top Error Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          {setErrorMessage && (
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-[10px] text-rose-400/70 hover:text-rose-300 uppercase font-bold cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Top Success Alert Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury flex items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-bold">{successMessage}</span>
          </div>
          {setSuccessMessage && (
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              className="text-[10px] text-emerald-400/70 hover:text-emerald-300 uppercase font-bold cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* 1. Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase font-bold border border-[var(--gold-accent)]/20 mb-1">
          <span>{isBoutique ? 'Boutique Store' : 'Atelier Profile'}</span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] leading-tight">
          Store Profile & Logistics
        </h2>
        <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
          Configure identity, location, and delivery zone fees.
        </p>
      </div>

      {/* 2. Live Status Banner */}
      {isVerified ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs font-mono-luxury">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-bold">Store Profile Approved & Active</span>
          </div>
          <Link
            href={`/brand/${encodeURIComponent(form.brandName || 'Atelier')}`}
            target="_blank"
            className="text-[10px] text-[var(--gold-accent)] uppercase font-bold flex items-center gap-1 shrink-0 underline"
          >
            <span>Preview</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      ) : isRejected ? (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-xs font-mono-luxury">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Profile Needs Update</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {rejectionReason || 'Please review contact numbers and store address.'}
          </p>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono-luxury text-amber-400">
          <Clock className="h-4 w-4 animate-pulse shrink-0" />
          <span>Pending Super Admin Verification</span>
        </div>
      )}

      {/* 3. Store Identity & Contacts */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
          1. Brand Identity & Contacts
        </span>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Brand / Store Name <strong className="text-rose-400">*</strong>
          </label>
          <input
            type="text"
            required
            value={form.brandName}
            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            placeholder="e.g. Moji Wears"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Contact Person / Manager
          </label>
          <input
            type="text"
            value={form.designerName}
            onChange={(e) => setForm({ ...form, designerName: e.target.value })}
            placeholder="e.g. Mojisola"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Official Phone / WhatsApp <strong className="text-rose-400">*</strong>
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 08012345678"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
              State
            </label>
            <select
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
              City / Area
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Ikeja"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Store Bio / Tagline
          </label>
          <textarea
            rows={2}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="e.g. Luxury bespoke tailoring and modern Nigerian streetwear."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* 4. Logistics & Delivery Rates */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
          2. Delivery Rates & Turnaround
        </span>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Dispatch Turnaround Time
          </label>
          <select
            value={form.dispatchDays}
            onChange={(e) => setForm({ ...form, dispatchDays: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
          >
            <option value="1-2 business days">1-2 business days (In Stock / Ready)</option>
            <option value="3-5 business days">3-5 business days (Custom Cut)</option>
            <option value="5-7 business days">5-7 business days (Handmade Bespoke)</option>
          </select>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
              Same-City Intra Delivery Fee (₦)
            </label>
            <input
              type="number"
              value={form.sameCityFee}
              onChange={(e) => setForm({ ...form, sameCityFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
              Inter-State Courier Waybill Fee (₦)
            </label>
            <input
              type="number"
              value={form.interstateFee}
              onChange={(e) => setForm({ ...form, interstateFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
              Motor Park Pickup Fee (₦)
            </label>
            <input
              type="number"
              value={form.parkPickupFee}
              onChange={(e) => setForm({ ...form, parkPickupFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* 5. Clean Luxury Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-xl hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 stroke-[2.5]" />
              <span>Save Store Profile</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
