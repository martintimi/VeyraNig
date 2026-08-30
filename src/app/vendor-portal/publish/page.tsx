'use client';

import { vendorFetch, getActiveVendorId } from '@/lib/services/apiClient';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, CheckCircle2, Sparkles, Plus, Trash2,
  ShoppingBag, Tag, ArrowRight, ExternalLink,
  Loader2, Wand2, X, Palette, Store, Clock,
  Check, AlertTriangle, ShieldCheck, Shirt, Info, Sparkle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import MobileVendorPublish from '@/components/vendor/MobileVendorPublish';

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

  const activeCategoriesList = genderTarget === 'male' 
    ? MALE_CATEGORIES 
    : genderTarget === 'female' 
    ? FEMALE_CATEGORIES 
    : UNISEX_CATEGORIES;

  const handleCategoryChange = (selectedId: string) => {
    setSubCategory(selectedId);
    const found = activeCategoriesList.find(c => c.id === selectedId);
    if (found) {
      setCategory(found.generalCat);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setRawPrice(numeric);
  };

  const formatNumberWithCommas = (val: string) => {
    if (!val) return '';
    return Number(val).toLocaleString();
  };

  const handleToggleColor = (colorObj: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.hex.toLowerCase() === colorObj.hex.toLowerCase());
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c.hex.toLowerCase() !== colorObj.hex.toLowerCase()));
      }
    } else {
      setSelectedColors([...selectedColors, colorObj]);
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newColor = { name: customColorName.trim(), hex: customColorHex };
    setSelectedColors([...selectedColors, newColor]);
    setCustomColorName('');
    setShowCustomColorPicker(false);
  };

  const handleToggleSize = (sz: string) => {
    setSizeStock(prev => ({
      ...prev,
      [sz]: { ...prev[sz], enabled: !prev[sz].enabled }
    }));
  };

  const handleSizeQtyChange = (sz: string, qty: number) => {
    setSizeStock(prev => ({
      ...prev,
      [sz]: { ...prev[sz], quantity: Math.max(0, qty) }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
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
        category: category,
        genderTarget: genderTarget,
        garmentOriginType: 'ready_to_wear',
        imageUrl: finalImageUrl,
        description: description.trim() || `${name} ready-to-wear piece by ${vendorProfile.brandName}.`,
        tags: tags.length > 0 ? tags : [genderTarget, category, 'rtw', 'ready_to_wear'],
        colors: selectedColors,
        sizes: enabledSizes,
        sizeStock: sizeStock,
        vendorId: activeVendorId,
        vendorName: vendorProfile.brandName,
        vendorCity: vendorProfile.location || 'Lagos',
        isBoutiqueDrop: true
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

      {/* Success Modal Screen */}
      {isSuccess ? (
        <div className="p-8 sm:p-12 rounded-3xl surface-card border border-emerald-500/40 text-center space-y-6 animate-fadeIn shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs font-mono-luxury text-emerald-400 uppercase font-bold tracking-widest">
              Live in Veyra Storefront
            </span>
            <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)] mt-1">
              "{name}" is Live!
            </h2>
            <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
              Your piece has been indexed in the marketplace. Customers can now browse, select sizes, and order instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={`/shop/${createdProductId}`}
              target="_blank"
              className="px-6 py-3 rounded-full bg-[var(--gold-accent)] text-black text-xs font-mono-luxury uppercase font-bold hover:bg-[#d8b357] transition-all shadow-md flex items-center gap-2"
            >
              <span>View in Live Shop</span>
              <ExternalLink className="h-4 w-4 text-black" />
            </Link>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury uppercase font-bold hover:border-[var(--gold-accent)] transition-all"
            >
              + Publish Another Garment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublishSubmit} className="space-y-8">
          
          {/* 1. PRODUCT PHOTO SHOWCASE */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                1. Product Showcase Photo <span className="text-rose-500">*</span>
              </h3>
              <span className="text-[11px] font-mono-luxury text-[var(--text-muted)]">High-Res PNG / JPG</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--gold-accent)] transition-all rounded-3xl p-8 text-center cursor-pointer bg-[var(--bg-primary)]/50 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative h-64 max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]">
                    <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                  </div>
                  <p className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold">
                    Click to replace image
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono-luxury font-bold text-[var(--text-primary)]">
                      Upload Product Lookbook Photo
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] font-mono-luxury">
                      Click to select from your phone or desktop
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. CORE DETAILS: TITLE, CATEGORY, PRICE */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              2. Piece Details & Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                  Piece Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={genderTarget === 'male' ? 'e.g. Midnight Wool Senator Kaftan' : genderTarget === 'female' ? 'e.g. Silk Boubou Maxi Gown' : 'e.g. Acid Wash Heavyweight Hoodie'}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                  Retail Price (₦ NGN) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-mono-luxury text-[var(--text-muted)]">₦</span>
                  <input
                    type="text"
                    required
                    value={formatNumberWithCommas(rawPrice)}
                    onChange={handlePriceChange}
                    placeholder="35,000"
                    className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                  {genderTarget === 'male' ? "Men's Category" : genderTarget === 'female' ? "Women's Category" : "Unisex Category"} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
                >
                  {activeCategoriesList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                  Target Department
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'unisex'] as GenderTarget[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderTarget(g)}
                      className={`py-3 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                        genderTarget === g
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {g === 'male' ? "Men's" : g === 'female' ? "Women's" : "Unisex"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COLORWAYS SELECTOR */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                  <span>Available Colorways & Swatches ({selectedColors.length} Selected)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                  className="text-[11px] font-mono-luxury text-[var(--gold-accent)] uppercase font-bold hover:underline cursor-pointer"
                >
                  {showCustomColorPicker ? 'Close' : '+ Add Custom Color'}
                </button>
              </div>

              {showCustomColorPicker && (
                <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3 animate-fadeIn flex-wrap">
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
                    placeholder="e.g. Electric Lime / Mint"
                    className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury flex-1 focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury font-bold uppercase hover:opacity-90 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {STANDARD_COLORS.map((col) => {
                  const isSelected = selectedColors.some(c => c.hex.toLowerCase() === col.hex.toLowerCase());
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => handleToggleColor(col)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-mono-luxury transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]/30 font-bold text-[var(--text-primary)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full shrink-0 border border-black/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Tags */}
            <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold">
                    Description & Care Details
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 hover:bg-[var(--gold-accent)] hover:text-black transition-all text-xs font-mono-luxury font-bold cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? 'Generating Description...' : 'Generate with AI'}</span>
                  </button>
                </div>

                {aiToast && (
                  <div className="mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-luxury font-bold flex items-center gap-2 animate-fadeIn">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--gold-accent)] shrink-0" />
                    <span>{aiToast}</span>
                  </div>
                )}

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fabric composition, fit silhouette, wash instructions... (Or tap 'Generate with AI' above!)"
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                  Search Tags & Keywords (Press Enter)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] min-h-[44px]">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-primary)] flex items-center gap-1.5"
                    >
                      <span>#{t}</span>
                      <button type="button" onClick={() => handleRemoveTag(t)} className="text-[var(--text-muted)] hover:text-rose-500 cursor-pointer">
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "e.g. streetwear, luxury, agbada, boubou (Type and press Enter)" : "Add more tags..."}
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-[var(--text-primary)] font-mono-luxury focus:outline-none px-1"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* 3. READY-TO-WEAR INVENTORY STOCK MATRIX */}
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  3. In-Stock Sizes & Quantities
                </h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
                  Enable the sizes available in your boutique and enter quantity. Total Ready Stock: <strong className="text-[var(--gold-accent)]">{totalStockCount} units</strong>
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono-luxury font-bold uppercase self-start sm:self-center">
                Instant Fulfillment
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {STANDARD_SIZES.map((sz) => {
                const isEnabled = sizeStock[sz]?.enabled ?? true;
                const qty = sizeStock[sz]?.quantity ?? 0;

                return (
                  <div
                    key={sz}
                    className={`p-4 rounded-2xl border transition-all text-center space-y-3 ${
                      isEnabled
                        ? 'border-[var(--gold-accent)]/50 bg-[var(--bg-primary)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm font-mono-luxury text-[var(--text-primary)]">{sz}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`text-[10px] font-mono-luxury font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          isEnabled
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}
                      >
                        {isEnabled ? 'In Stock' : 'Out'}
                      </button>
                    </div>

                    {isEnabled && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono-luxury text-[var(--text-muted)] block uppercase">
                          Units:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => handleSizeQtyChange(sz, parseInt(e.target.value) || 0)}
                          className="w-full py-1.5 px-2 text-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
                  <span>Publishing to Storefront...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Publish {genderTarget === 'male' ? "Men's" : genderTarget === 'female' ? "Women's" : "Unisex"} Piece to Catalog</span>
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
