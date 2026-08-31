'use client';

import { vendorFetch, getActiveVendorId } from '@/lib/services/apiClient';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, CheckCircle2, Sparkles, Plus, Trash2,
  ShoppingBag, Tag, ArrowRight, ExternalLink,
  Loader2, Wand2, X, Palette, Store, Clock,
  Check, AlertTriangle, ShieldCheck, Shirt, Info, Sparkle, Lock, RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import MobileVendorPublish from '@/components/vendor/MobileVendorPublish';
import VendorLuxuryLoader from '@/components/vendor/VendorLuxuryLoader';

// Standard Apparel Colors Palette for Boutiques & Designers
const STANDARD_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Charcoal Grey', hex: '#374151' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Khaki / Beige', hex: '#d4b996' },
  { name: 'Chocolate Brown', hex: '#451a03' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Mustard Yellow', hex: '#d97706' },
  { name: 'Vibrant Orange', hex: '#ea580c' },
  { name: 'Lavender Purple', hex: '#9333ea' },
  { name: 'Pastel Pink', hex: '#f472b6' },
  { name: 'Emerald Gold', hex: '#e6c367' },
];

// Department-Specific Categories
const MALE_CATEGORIES = [
  { id: 'senator_kaftan', label: 'Senator & Kaftan Sets', generalCat: 'tops' as GarmentCategory },
  { id: 'agbada_robes', label: 'Grand Agbada & 3-Piece Robes', generalCat: 'outerwear' as GarmentCategory },
  { id: 'streetwear_hoodie', label: 'Streetwear Hoodies & Sweatshirts', generalCat: 'outerwear' as GarmentCategory },
  { id: 'suits_blazers', label: 'Suits, Tuxedos & Blazers', generalCat: 'outerwear' as GarmentCategory },
  { id: 'tshirts_tees', label: 'T-Shirts & Graphic Tees', generalCat: 'tops' as GarmentCategory },
  { id: 'shirts_polos', label: 'Luxury Shirts & Polos', generalCat: 'tops' as GarmentCategory },
  { id: 'jeans_trousers', label: 'Baggy Jeans, Cargo & Trousers', generalCat: 'bottoms' as GarmentCategory },
  { id: 'shorts_sweats', label: 'Shorts & Sweatpants', generalCat: 'bottoms' as GarmentCategory },
  { id: 'men_footwear', label: 'Loafers, Slides & Footwear', generalCat: 'footwear' as GarmentCategory },
  { id: 'men_caps', label: 'Caps, Fila & Accessories', generalCat: 'accessories' as GarmentCategory },
];

const FEMALE_CATEGORIES = [
  { id: 'dresses_gowns', label: 'Dresses, Gowns & Maxis', generalCat: 'tops' as GarmentCategory },
  { id: 'boubou_kaftans', label: 'Silk Boubou, Kaftans & Abayas', generalCat: 'outerwear' as GarmentCategory },
  { id: 'two_piece_sets', label: 'Two-Piece Co-ord Sets', generalCat: 'tops' as GarmentCategory },
  { id: 'corsets_tops', label: 'Corsets, Crop Tops & Blouses', generalCat: 'tops' as GarmentCategory },
  { id: 'skirts_minis', label: 'Skirts & Mini Skirts', generalCat: 'bottoms' as GarmentCategory },
  { id: 'women_jeans_trousers', label: 'High-Waist Jeans, Cargo & Pants', generalCat: 'bottoms' as GarmentCategory },
  { id: 'female_streetwear', label: 'Female Streetwear, Hoodies & Jackets', generalCat: 'outerwear' as GarmentCategory },
  { id: 'women_footwear', label: 'Heels, Mules & Slides', generalCat: 'footwear' as GarmentCategory },
  { id: 'women_bags', label: 'Handbags, Clutches & Accessories', generalCat: 'accessories' as GarmentCategory },
];

const UNISEX_CATEGORIES = [
  { id: 'unisex_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory },
  { id: 'unisex_tees', label: 'Graphic Tees & Oversized Shirts', generalCat: 'tops' as GarmentCategory },
  { id: 'unisex_denim', label: 'Denim Jeans & Baggy Cargo Pants', generalCat: 'bottoms' as GarmentCategory },
  { id: 'unisex_jackets', label: 'Jackets, Windbreakers & Coats', generalCat: 'outerwear' as GarmentCategory },
  { id: 'unisex_footwear', label: 'Sneakers, Crocs & Slides', generalCat: 'footwear' as GarmentCategory },
  { id: 'unisex_accessories', label: 'Caps, Beanies & Jewelry', generalCat: 'accessories' as GarmentCategory },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PublishGarmentPage() {
  const { vendorProfile } = useStore();

  // Verification & Profile Status State
  const [profileStatus, setProfileStatus] = useState<{
    isProfileSaved: boolean;
    isVerified: boolean;
    approvalStatus: string;
    rejectionReason: string;
  } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Department / Gender Filter: male | female | unisex
  const [genderTarget, setGenderTarget] = useState<GenderTarget>('male');

  // Core Form State
  const [name, setName] = useState('');
  const [subCategory, setSubCategory] = useState(MALE_CATEGORIES[0].id);
  const [category, setCategory] = useState<GarmentCategory>(MALE_CATEGORIES[0].generalCat);
  const [rawPrice, setRawPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiToast, setAiToast] = useState('');

  // Interactive Colorway State
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#111111' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563eb');
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);

  // Ready-to-Wear Size Stock
  const [sizeStock, setSizeStock] = useState<{ [size: string]: { enabled: boolean; quantity: number } }>({
    'S': { enabled: true, quantity: 10 },
    'M': { enabled: true, quantity: 25 },
    'L': { enabled: true, quantity: 30 },
    'XL': { enabled: true, quantity: 15 },
    'XXL': { enabled: true, quantity: 5 },
  });

  // Photo Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check vendor verification status on mount
  const checkVerification = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const res = await vendorFetch('/api/vendor/profile');
      const data = await res.json();
      if (res.ok && data.success && data.vendor) {
        const v = data.vendor;
        const verified = !!v.is_verified || !!v.isVerified;
        setProfileStatus({
          isProfileSaved: !!v.isProfileSaved,
          isVerified: verified,
          approvalStatus: verified ? 'approved' : (v.approvalStatus || 'pending'),
          rejectionReason: v.rejectionReason || ''
        });
      }
    } catch (e) {
      console.error('Error verifying vendor status:', e);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkVerification();
  }, [checkVerification]);

  // Auto-scroll to top whenever an error is encountered so user sees it instantly
  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [errorMessage]);

  // Update categories when genderTarget changes
  useEffect(() => {
    if (genderTarget === 'male') {
      setSubCategory(MALE_CATEGORIES[0].id);
      setCategory(MALE_CATEGORIES[0].generalCat);
    } else if (genderTarget === 'female') {
      setSubCategory(FEMALE_CATEGORIES[0].id);
      setCategory(FEMALE_CATEGORIES[0].generalCat);
    } else {
      setSubCategory(UNISEX_CATEGORIES[0].id);
      setCategory(UNISEX_CATEGORIES[0].generalCat);
    }
  }, [genderTarget]);

  const handleGenerateAiDescription = async () => {
    if (!name.trim()) {
      setAiToast('Please enter a garment title first to generate description with AI.');
      setTimeout(() => setAiToast(''), 3500);
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name.trim(),
          category: subCategory,
          genderTarget,
          vendorType: vendorProfile.vendorType,
          brandName: vendorProfile.brandName,
          imageUrl: imagePreview || null
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.description) {
          setDescription(data.description);
        }
        if (data.tags && Array.isArray(data.tags)) {
          setTags(prev => Array.from(new Set([...prev, ...data.tags])));
        }
        if (!rawPrice && data.suggestedPrice) {
          setRawPrice(String(data.suggestedPrice));
        }
        setAiToast('AI generated description, fabric specs, and tags!');
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        setTimeout(() => setAiToast(''), 4000);
      }
    } catch (e) {
      console.error('AI generation error:', e);
      setAiToast('AI generation timed out. Please try again.');
      setTimeout(() => setAiToast(''), 3500);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.name === color.name);
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c.name !== color.name));
      }
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newColor = { name: customColorName.trim(), hex: customColorHex };
    setSelectedColors([...selectedColors, newColor]);
    setCustomColorName('');
    setShowCustomColorPicker(false);
  };

  const handleSizeStockChange = (size: string, quantity: number) => {
    setSizeStock(prev => ({
      ...prev,
      [size]: { ...prev[size], quantity: Math.max(0, quantity) }
    }));
  };

  const handleToggleSize = (size: string) => {
    setSizeStock(prev => ({
      ...prev,
      [size]: { ...prev[size], enabled: !prev[size].enabled }
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }
    if (!rawPrice || Number(rawPrice) <= 0) {
      setErrorMessage('Please enter a valid price in Naira.');
      return;
    }
    if (selectedColors.length === 0) {
      setErrorMessage('Please select at least one available color.');
      return;
    }

    const enabledSizes = Object.keys(sizeStock).filter(s => sizeStock[s].enabled);
    if (enabledSizes.length === 0) {
      setErrorMessage('Please enable at least one ready-to-wear size.');
      return;
    }

    setIsSubmitting(true);
    const activeVendorId = getActiveVendorId();

    try {
      let finalImageUrl = imagePreview || '/images/products/BlackTrapStarHoodie.jpg';

      const payload = {
        name: name.trim(),
        price: Number(rawPrice),
        category,
        genderTarget,
        garmentOriginType: 'ready_made_boutique',
        imageUrl: finalImageUrl,
        image_url: finalImageUrl,
        description: description.trim() || name.trim(),
        tags,
        colors: selectedColors.map(c => c.name),
        sizes: enabledSizes,
        sizeStock,
        stockQuantity: totalStockCount,
        vendorId: activeVendorId,
        vendorName: vendorProfile.brandName || 'Verified Partner',
        is_published: true,
      };

      const res = await vendorFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedProductId(data.product?.id || `prod-${Date.now()}`);
        setIsSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e6c367', '#ffffff', '#10b981']
        });
      } else {
        setErrorMessage(data.error || 'Failed to publish piece to catalog.');
      }
    } catch (err: any) {
      console.error('Publish error:', err);
      setErrorMessage('Error connecting to publishing service. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setRawPrice('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setTags([]);
    setIsSuccess(false);
    setCreatedProductId(null);
    setErrorMessage('');
  };

  const totalStockCount = Object.values(sizeStock)
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + Number(s.quantity || 0), 0);

  const isVerified = profileStatus?.isVerified || profileStatus?.approvalStatus === 'approved';
  const isRejected = profileStatus?.approvalStatus === 'rejected';
  const isPending = profileStatus?.approvalStatus === 'pending' || (profileStatus?.isProfileSaved && !isVerified && !isRejected);

  if (isLoadingAuth) {
    return <VendorLuxuryLoader label="Verifying Boutique Authorization & Status..." />;
  }

  // =========================================================================
  // STRICT VERIFICATION GATE: If vendor is not approved, block publishing!
  // =========================================================================
  if (!isVerified) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto space-y-8 animate-fadeIn text-center">
        {isRejected ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 space-y-6 shadow-2xl">
            <div className="h-20 w-20 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono-luxury font-bold uppercase">
                Action Required · Store Profile Returned
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-3">
                Store Profile Returned For Correction
              </h1>
              <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/30 text-rose-300 text-xs font-mono-luxury mt-3">
                <span className="font-bold block uppercase text-[10px] text-rose-400 mb-1">Super Admin Feedback:</span>
                "{profileStatus?.rejectionReason || 'Please review your store contact details, location, and social handles.'}"
              </div>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] leading-relaxed pt-2">
                You cannot publish products or create drops while your store profile is returned. Please update your details and resubmit for Super Admin approval.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/vendor-portal/atelier"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-rose-500 text-white font-mono-luxury uppercase text-xs font-bold hover:bg-rose-600 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <span>Update Store Profile & Resubmit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : isPending ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 space-y-6 shadow-2xl">
            <div className="h-20 w-20 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
              <Clock className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono-luxury font-bold uppercase">
                Account Status · Pending Review
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-3">
                Store Profile Under Super Admin Review
              </h1>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] leading-relaxed pt-2">
                Your store details and delivery zone rates have been submitted. Super Admin is currently reviewing your account. Product publishing will unlock automatically once your store is approved.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/vendor-portal/atelier"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full surface-card border border-amber-500/40 text-amber-400 font-mono-luxury uppercase text-xs font-bold hover:bg-amber-500/10 transition-all shadow-md"
              >
                <span>View Submitted Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={checkVerification}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Check Approval Status</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-6 shadow-2xl">
            <div className="h-20 w-20 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 flex items-center justify-center mx-auto shadow-lg">
              <Store className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-xs font-mono-luxury font-bold uppercase">
                Setup Required · Store Profile Incomplete
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-3">
                Complete Store Profile to Enable Publishing
              </h1>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)] leading-relaxed pt-2">
                You must complete your brand identity, location, and delivery zone rates so Super Admin can verify your boutique before you publish pieces.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/vendor-portal/atelier"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <span>Complete Store Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // AUTHORIZED / APPROVED PUBLISHING FORM
  // =========================================================================
  return (
    <>
      {/* 1. DEDICATED MOBILE VENDOR PUBLISH */}
      <div className="block md:hidden">
        <MobileVendorPublish
          onPublishSuccess={(productId) => {
            setCreatedProductId(productId);
          }}
          vendorProfile={vendorProfile}
          getActiveVendorId={getActiveVendorId}
        />
      </div>

      {/* 2. DESKTOP LUXURY VENDOR PUBLISH */}
      <div className="hidden md:block p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Ready-to-Wear Catalog Publisher
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Add New Ready-to-Wear Piece
          </h1>
          <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-1">
            Upload ready-made inventory with size stocks, color variants, and instant fulfillment.
          </p>
        </div>

        {/* Gender / Department Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit shrink-0">
          <button
            type="button"
            onClick={() => setGenderTarget('male')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              genderTarget === 'male'
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Men</span>
          </button>

          <button
            type="button"
            onClick={() => setGenderTarget('female')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              genderTarget === 'female'
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Women</span>
          </button>

          <button
            type="button"
            onClick={() => setGenderTarget('unisex')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              genderTarget === 'unisex'
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Unisex</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Modal / Banner */}
      {isSuccess && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                Piece Published to Catalog!
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                Your garment is now live with real-time stock sync and Twin 3D measurement matching.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {createdProductId && (
              <Link
                href={`/shop/${createdProductId}`}
                target="_blank"
                className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              >
                <span>View Live Product</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold hover:border-[var(--gold-accent)] transition-all flex items-center gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publish Another Piece</span>
            </button>
          </div>
        </div>
      )}

      {/* Publishing Form */}
      {!isSuccess && (
        <form onSubmit={handlePublishSubmit} className="space-y-8">
          
          {/* Section 1: Showcase Photo */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold flex items-center gap-2">
                <span>1. Product Showcase Photo</span>
                <strong className="text-rose-400">*</strong>
              </label>
              <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">High-Res PNG / JPG</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/60 rounded-3xl p-8 text-center cursor-pointer transition-all bg-[var(--bg-primary)] group relative overflow-hidden"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative h-72 w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={imagePreview}
                    alt="Upload Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono-luxury uppercase font-bold">
                    Click to Change Photo
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] block">
                      Upload Product Lookbook Photo
                    </span>
                    <span className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
                      Click to select from your phone or desktop
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Piece Details & Pricing */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6">
            <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold block">
              2. Piece Details & Pricing
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Piece Title / Name <strong className="text-rose-400">*</strong>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Midnight Wool Senator Kaftan"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Retail Price (₦ NGN) <strong className="text-rose-400">*</strong>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                    ₦
                  </span>
                  <input
                    type="number"
                    required
                    value={rawPrice}
                    onChange={(e) => setRawPrice(e.target.value)}
                    placeholder="35,000"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Department Category Select */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Garment Silhouette / Category <strong className="text-rose-400">*</strong>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {(genderTarget === 'male' ? MALE_CATEGORIES : genderTarget === 'female' ? FEMALE_CATEGORIES : UNISEX_CATEGORIES).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSubCategory(cat.id);
                      setCategory(cat.generalCat);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-mono-luxury transition-all cursor-pointer ${
                      subCategory === cat.id
                        ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)] text-[var(--text-primary)] font-bold shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--gold-accent)]/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator Button & Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                  Editorial Description & Fabric Notes
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAiDescription}
                  disabled={isGeneratingAi}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-[11px] font-mono-luxury uppercase font-bold hover:bg-[var(--gold-accent)] hover:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Writing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      <span>Auto-Generate with AI</span>
                    </>
                  )}
                </button>
              </div>

              {aiToast && (
                <div className="p-2.5 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[11px] font-mono-luxury flex items-center gap-2 animate-fadeIn">
                  <Sparkle className="h-3.5 w-3.5 shrink-0" />
                  <span>{aiToast}</span>
                </div>
              )}

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tailoring details, fabric quality, occasions, and care instructions..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Section 3: Colorway Variations */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            <div>
              <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold block">
                3. Available Colorways
              </span>
              <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                Select all shades available in your store inventory for this piece.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {STANDARD_COLORS.map((c) => {
                const isSelected = selectedColors.some(sc => sc.name === c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono-luxury flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--gold-accent)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold shadow-sm ring-1 ring-[var(--gold-accent)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-[var(--gold-accent)]" />}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                className="px-3 py-1.5 rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-xs font-mono-luxury text-[var(--gold-accent)] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Custom Color</span>
              </button>
            </div>

            {showCustomColorPicker && (
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3 animate-fadeIn">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-[var(--border-subtle)] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  placeholder="e.g. Royal Emerald"
                  className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none flex-1 font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="px-4 py-2 rounded-xl bg-[var(--gold-accent)] text-black text-xs font-mono-luxury uppercase font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Size Stock & Inventory */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold block">
                  4. Size Stocks & Units
                </span>
                <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                  Set available quantity per standard ready-to-wear sizing.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase block">Total Units</span>
                <span className="text-base font-editorial font-bold text-[var(--gold-accent)]">{totalStockCount} in Stock</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {STANDARD_SIZES.map((size) => {
                const isEnabled = sizeStock[size]?.enabled;
                const qty = sizeStock[size]?.quantity || 0;

                return (
                  <div
                    key={size}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isEnabled
                        ? 'border-[var(--gold-accent)] bg-[var(--bg-primary)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">{size}</span>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleSize(size)}
                        className="rounded text-[var(--gold-accent)] border-[var(--border-subtle)] cursor-pointer"
                      />
                    </div>

                    {isEnabled && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono-luxury uppercase text-[var(--text-secondary)] block">Quantity</span>
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => handleSizeStockChange(size, Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Discovery Tags */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            <div>
              <span className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold block">
                5. Search & Discovery Tags
              </span>
              <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                Type a keyword and press <strong className="text-[var(--text-primary)]">Enter</strong> (e.g. Kaftan, Agbada, Wedding, Lagos).
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press enter..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-xs font-mono-luxury font-bold"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)]">
            <Link
              href="/vendor-portal"
              className="px-6 py-3.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-secondary)] hover:text-white transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
                  <span>Publishing Piece to Catalog...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Publish Ready-to-Wear Piece</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
    </>
  );
}
