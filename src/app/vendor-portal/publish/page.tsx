'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, CheckCircle2, Sparkles, Plus, Trash2,
  ShoppingBag, Scissors, Tag, ArrowRight, ExternalLink,
  Loader2, Wand2, X, Image as ImageIcon, Layers, Palette, Store, Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';

// Clean standard apparel colors (no bespoke or native terms)
const STANDARD_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Brown', hex: '#5c3a21' },
  { name: 'Beige / Khaki', hex: '#78716c' },
  { name: 'Green', hex: '#065f46' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Yellow', hex: '#eab308' },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PublishGarmentPage() {
  const { vendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';

  // 1. Core Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('tops');
  const [genderTarget, setGenderTarget] = useState<GenderTarget>('unisex');
  const [rawPrice, setRawPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Size Stock Quantities (S, M, L, XL, XXL)
  const [sizeStock, setSizeStock] = useState<{ [size: string]: { enabled: boolean; quantity: number } }>({
    'S': { enabled: true, quantity: 10 },
    'M': { enabled: true, quantity: 25 },
    'L': { enabled: true, quantity: 30 },
    'XL': { enabled: true, quantity: 15 },
    'XXL': { enabled: true, quantity: 5 },
  });

  // Optional Color Variants (empty by default because shoppers see the photo!)
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');

  // Image Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // AI Assistant State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessBadge, setAiSuccessBadge] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [publishedProduct, setPublishedProduct] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Store Profile Verification Gate State
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>('pending');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    async function checkProfileStatus() {
      try {
        const res = await fetch('/api/vendor/profile');
        const data = await res.json();
        if (res.ok && data.success && data.vendor) {
          setIsProfileSaved(!!data.vendor.isProfileSaved);
          setApprovalStatus(data.vendor.approvalStatus || 'pending');
          setIsVerified(!!data.vendor.isVerified);
        }
      } catch (e) {
      } finally {
        setIsCheckingProfile(false);
      }
    }
    checkProfileStatus();
  }, []);

  // Calculate total stock units across enabled sizes
  const totalStockUnits = Object.entries(sizeStock)
    .filter(([_, item]) => item.enabled)
    .reduce((sum, [_, item]) => sum + (Number(item.quantity) || 0), 0);

  // Format price with thousand separators
  const formatNumberWithCommas = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, '');
    if (!numericOnly) return '';
    return Number(numericOnly).toLocaleString();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setRawPrice(rawVal);
  };

  // Toggle a size on/off
  const toggleSizeEnabled = (size: string) => {
    setSizeStock(prev => ({
      ...prev,
      [size]: {
        ...prev[size],
        enabled: !prev[size].enabled
      }
    }));
  };

  // Update quantity for a specific size
  const updateSizeQty = (size: string, qty: number) => {
    setSizeStock(prev => ({
      ...prev,
      [size]: {
        ...prev[size],
        quantity: Math.max(0, qty)
      }
    }));
  };

  // Color Toggle
  const toggleColor = (color: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.name.toLowerCase() === color.name.toLowerCase());
    if (exists) {
      setSelectedColors(selectedColors.filter(c => c.name.toLowerCase() !== color.name.toLowerCase()));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Add Custom Color
  const handleAddCustomColor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customColorInput.trim()) return;
    
    const exists = selectedColors.some(c => c.name.toLowerCase() === customColorInput.trim().toLowerCase());
    if (!exists) {
      setSelectedColors([...selectedColors, { name: customColorInput.trim(), hex: '#111111' }]);
    }
    setCustomColorInput('');
  };

  // AI Quick-Fill / Auto-Write Assistant
  const handleAiAutoFill = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a product title first (e.g. "Acid Wash Oversized Hoodie") for the AI to analyze.');
      return;
    }

    setIsGeneratingAi(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name.trim(),
          category,
          vendorType: vendorProfile.vendorType || (isBoutique ? 'boutique_merchant' : 'fashion_designer'),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDescription(data.description || '');
        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags);
        }
        if (data.category) {
          setCategory(data.category);
        }
        if (!rawPrice && data.suggestedPrice) {
          setRawPrice(String(data.suggestedPrice));
        }

        setAiSuccessBadge(true);
        setTimeout(() => setAiSuccessBadge(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage('AI assistant was unable to generate description right now.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Image Upload Handler
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) setImageUrl(e.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImageUrl(e.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Tag Management
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }
    if (!rawPrice || Number(rawPrice) <= 0) {
      setErrorMessage('Please enter a valid price in Naira (₦).');
      return;
    }
    if (!imageUrl) {
      setErrorMessage('Please upload a product photo.');
      return;
    }

    // Active sizes and their stock map
    const activeSizes = Object.entries(sizeStock)
      .filter(([_, item]) => item.enabled)
      .map(([size, _]) => size);

    if (activeSizes.length === 0) {
      setErrorMessage('Please select at least 1 size for your product drop.');
      return;
    }

    const sizeStockMap: Record<string, number> = {};
    Object.entries(sizeStock).forEach(([size, item]) => {
      if (item.enabled) {
        sizeStockMap[size] = Number(item.quantity) || 0;
      }
    });

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        name: name.trim(),
        price: Number(rawPrice),
        category,
        genderTarget,
        garmentOriginType: isBoutique ? 'ready_made_boutique' : 'handmade_designer',
        imageUrl,
        description: description.trim() || name.trim(),
        tags: tags.length > 0 ? tags : ['Ready-to-Wear', 'Streetwear'],
        colors: selectedColors.length > 0 ? selectedColors.map(c => c.hex) : ['#111111'],
        sizes: activeSizes,
        sizeStock: sizeStockMap,
        stockQuantity: totalStockUnits,
        vendorName: vendorProfile.brandName || 'Boutique Seller',
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Failed to publish product drop.');
        setIsSubmitting(false);
        return;
      }

      setPublishedProduct(result.product);
      setShowSuccessModal(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });

      // Reset form
      setName('');
      setRawPrice('');
      setDescription('');
      setTags([]);
      setSelectedColors([]);
      setImageUrl('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while publishing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn">
        <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin" />
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Verifying boutique status...</p>
      </div>
    );
  }

  if (!isVerified || approvalStatus !== 'approved') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-5 surface-card rounded-3xl border border-[var(--border-subtle)] max-w-xl mx-auto my-12 animate-fadeIn shadow-xl">
        <div className="h-16 w-16 rounded-3xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center shadow-lg">
          {approvalStatus === 'rejected' ? (
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          ) : isProfileSaved ? (
            <Clock className="h-8 w-8 text-amber-400 animate-pulse" />
          ) : (
            <Store className="h-8 w-8 text-[var(--gold-accent)]" />
          )}
        </div>
        <div className="space-y-2">
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {approvalStatus === 'rejected'
              ? 'Store Profile Returned for Correction'
              : isProfileSaved
              ? 'Store Profile Under Admin Review'
              : 'Complete Store Profile First'}
          </h2>
          <p className="text-xs font-mono-luxury text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
            {approvalStatus === 'rejected'
              ? 'Your store profile was returned with notes. Please update your details and resubmit before publishing new products.'
              : isProfileSaved
              ? 'Your boutique profile has been submitted and is awaiting Super Admin verification. You will be able to publish product drops once approved.'
              : 'Before publishing inventory drops, you must configure your store profile, contacts, and social media handles.'}
          </p>
        </div>
        <Link
          href="/vendor-portal/atelier"
          className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
        >
          <span>{approvalStatus === 'rejected' ? 'Update Store Details' : isProfileSaved ? 'View Store Profile' : 'Complete Store Profile'}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[11px] font-mono-luxury uppercase font-bold mb-1.5">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Ready-to-Wear Product Publisher</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Add New Product Drop
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury">
            Upload your inventory with instant sizes, stock quantities, and AI auto-write.
          </p>
        </div>

        <Link
          href="/shop"
          target="_blank"
          className="px-4 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] transition-all inline-flex items-center gap-2 w-fit"
        >
          <span>View Live Store</span>
          <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
        </Link>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage('')} className="text-[10px] uppercase font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Publishing Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT 5 COLS: PRODUCT PHOTO DROPZONE */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                1. Product Photo
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[10px] font-mono-luxury uppercase text-rose-400 hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
            />

            {imageUrl ? (
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] group shadow-xl">
                <Image
                  src={imageUrl}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-mono-luxury font-bold uppercase shadow-lg hover:scale-105 transition-transform"
                  >
                    Replace Image
                  </button>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono-luxury uppercase text-emerald-400 font-bold border border-emerald-500/30">
                  ● Ready
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImageFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`relative aspect-[3/4] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--gold-accent)]/60'
                }`}
              >
                {isUploadingImage ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--gold-accent)] mx-auto" />
                    <span className="text-xs font-mono-luxury text-[var(--text-secondary)]">Uploading...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--gold-accent)]">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)] uppercase font-mono-luxury">
                        Upload Product Photo
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono-luxury mt-0.5">
                        Tap to choose from phone or desktop
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fast Dispatch Badge */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/20 text-emerald-400 text-xs font-mono-luxury flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>24-48h Lagos Express Dispatch Guarantee</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT 7 COLS: DETAILS + SIZES WITH STOCK + OPTIONAL COLORS */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card 1: Title & AI Auto-Fill */}
          <div className="p-5 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                  2. Product Title
                </label>
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isGeneratingAi || !name.trim()}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-luxury uppercase font-bold transition-all shadow-sm ${
                    name.trim()
                      ? 'bg-gradient-to-r from-[var(--gold-accent)] to-amber-400 text-black hover:opacity-90 cursor-pointer animate-pulse'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed opacity-60'
                  }`}
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Writing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3" />
                      <span>✨ Auto-Fill with AI</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acid Wash Heavyweight Hoodie"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] font-bold focus:border-[var(--gold-accent)] focus:outline-none"
              />

              {aiSuccessBadge && (
                <div className="text-[11px] text-emerald-400 font-mono-luxury mt-1.5 flex items-center gap-1 animate-fadeIn">
                  <Sparkles className="h-3 w-3 text-[var(--gold-accent)]" />
                  <span>AI generated description and smart tags based on your item!</span>
                </div>
              )}
            </div>

            {/* Price with Thousand Separator + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                    Price (₦ NGN)
                  </label>
                  {rawPrice && (
                    <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold">
                      ₦{Number(rawPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">₦</span>
                  <input
                    type="text"
                    required
                    value={formatNumberWithCommas(rawPrice)}
                    onChange={handlePriceChange}
                    placeholder="35,000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm font-mono-luxury font-bold text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
                >
                  <option value="tops">👕 Tops / T-Shirts</option>
                  <option value="outerwear">🧥 Hoodies & Outerwear</option>
                  <option value="bottoms">👖 Denim & Cargo Pants</option>
                  <option value="footwear">👟 Slides & Footwear</option>
                  <option value="accessories">🧢 Caps & Accessories</option>
                </select>
              </div>
            </div>

            {/* Gender Target */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Gender Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['unisex', 'male', 'female'] as GenderTarget[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenderTarget(g)}
                    className={`py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all border ${
                      genderTarget === g
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {g === 'unisex' ? 'Unisex' : g === 'male' ? 'Men' : 'Women'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Card 2: SIZES WITH INDIVIDUAL QUANTITY COUNTERS */}
          <div className="p-5 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--gold-accent)]" />
                <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold">
                  3. Available Sizes & Stock Quantity
                </label>
              </div>
              <span className="text-xs font-mono-luxury text-emerald-400 font-bold">
                Total Stock: {totalStockUnits} Pcs
              </span>
            </div>

            {/* Size Matrix with Quantity Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {STANDARD_SIZES.map((size) => {
                const item = sizeStock[size] || { enabled: false, quantity: 0 };
                return (
                  <div
                    key={size}
                    onClick={() => toggleSizeEnabled(size)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
                      item.enabled
                        ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)] shadow-sm ring-1 ring-[var(--gold-accent)]/20'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono-luxury font-bold text-sm text-[var(--text-primary)]">{size}</span>
                      <span className={`h-2 w-2 rounded-full ${item.enabled ? (item.quantity > 0 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-zinc-600'}`} />
                    </div>

                    {item.enabled ? (
                      <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateSizeQty(size, Number(e.target.value))}
                          className="w-full px-1.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold text-center text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                        />
                        <span className="text-[9px] font-mono-luxury text-[var(--text-muted)] block">
                          {item.quantity === 0 ? 'Out of stock' : `${item.quantity} in stock`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] block py-2">
                        Disabled
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ======================================================== */}
            {/* 4. OPTIONAL COLOR VARIANTS (CLEAN & SIMPLE) */}
            {/* ======================================================== */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-primary)] font-bold flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                    <span>4. Color Variants (Optional)</span>
                  </label>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono-luxury">
                    Leave unselected if item comes in a single colorway (as seen in photo).
                  </p>
                </div>

                {selectedColors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedColors([])}
                    className="text-[10px] font-mono-luxury text-rose-400 hover:underline uppercase"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Standard Color Buttons (Tap to toggle) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {STANDARD_COLORS.map((c) => {
                  const isSelected = selectedColors.some(sc => sc.name.toLowerCase() === c.name.toLowerCase());
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono-luxury flex items-center gap-2 border transition-all ${
                        isSelected
                          ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)] font-bold shadow-sm'
                          : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Color Name */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  placeholder="Other color (e.g. Olive, Lavender, Coral)..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  disabled={!customColorInput.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold hover:bg-[var(--bg-secondary)] disabled:opacity-40"
                >
                  Add Color
                </button>
              </div>

            </div>

          </div>

          {/* Card 3: Description & Smart Tags */}
          <div className="p-5 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                5. Product Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe fabric, cut, and fit (or click '✨ Auto-Fill with AI' above)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Smart Tags */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Search Tags (Press Enter to add)
              </label>

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--gold-accent)]/40 text-[var(--gold-accent)] text-[10px] font-mono-luxury font-bold flex items-center gap-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Streetwear, Heavyweight, Drop"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold hover:bg-[var(--bg-secondary)]"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing to Live Storefront...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
                <span>Publish Product Drop</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </div>

      </form>

      {/* ======================================================== */}
      {/* SUCCESS MODAL */}
      {/* ======================================================== */}
      {showSuccessModal && publishedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--gold-accent)] shadow-2xl text-center space-y-5 animate-scaleUp">
            
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                Live on Veyra Storefront
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Drop Published!
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                <strong>{publishedProduct.name}</strong> is live and available for shoppers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/shop"
                target="_blank"
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>View Live on Shop</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:bg-[var(--bg-secondary)] transition-all"
              >
                Add Another Item
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
