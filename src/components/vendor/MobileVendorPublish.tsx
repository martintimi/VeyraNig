'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, Sparkles, Plus, Trash2,
  Tag, ArrowRight, Loader2, X, Palette,
  Check, AlertTriangle, ShieldCheck, Camera,
  RefreshCw, Minus, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const STANDARD_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Khaki / Beige', hex: '#d4b996' },
  { name: 'Chocolate Brown', hex: '#451a03' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Emerald Gold', hex: '#e6c367' },
];

const MALE_CATEGORIES = [
  { id: 'senator_kaftan', label: 'Senator & Kaftan Sets', generalCat: 'tops' as GarmentCategory },
  { id: 'agbada_robes', label: 'Grand Agbada & 3-Piece Robes', generalCat: 'outerwear' as GarmentCategory },
  { id: 'streetwear_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory },
  { id: 'suits_blazers', label: 'Suits, Tuxedos & Blazers', generalCat: 'outerwear' as GarmentCategory },
  { id: 'tshirts_tees', label: 'T-Shirts & Graphic Tees', generalCat: 'tops' as GarmentCategory },
  { id: 'jeans_trousers', label: 'Baggy Jeans, Cargo & Trousers', generalCat: 'bottoms' as GarmentCategory },
  { id: 'men_footwear', label: 'Loafers, Slides & Footwear', generalCat: 'footwear' as GarmentCategory },
];

const FEMALE_CATEGORIES = [
  { id: 'dresses_gowns', label: 'Dresses, Gowns & Maxis', generalCat: 'tops' as GarmentCategory },
  { id: 'boubou_kaftans', label: 'Silk Boubou & Kaftans', generalCat: 'outerwear' as GarmentCategory },
  { id: 'two_piece_sets', label: 'Two-Piece Co-ord Sets', generalCat: 'tops' as GarmentCategory },
  { id: 'corsets_tops', label: 'Corsets, Tops & Blouses', generalCat: 'tops' as GarmentCategory },
  { id: 'female_streetwear', label: 'Female Streetwear & Hoodies', generalCat: 'outerwear' as GarmentCategory },
  { id: 'women_jeans_trousers', label: 'Jeans, Cargo & Pants', generalCat: 'bottoms' as GarmentCategory },
  { id: 'women_footwear', label: 'Heels, Mules & Slides', generalCat: 'footwear' as GarmentCategory },
];

const UNISEX_CATEGORIES = [
  { id: 'unisex_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory },
  { id: 'unisex_tees', label: 'Graphic Tees & Oversized Shirts', generalCat: 'tops' as GarmentCategory },
  { id: 'unisex_denim', label: 'Denim Jeans & Baggy Cargo Pants', generalCat: 'bottoms' as GarmentCategory },
  { id: 'unisex_footwear', label: 'Sneakers, Crocs & Slides', generalCat: 'footwear' as GarmentCategory },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

interface MobileVendorPublishProps {
  onPublishSuccess: (productId: string) => void;
  vendorProfile: any;
  getActiveVendorId: () => string;
}

export default function MobileVendorPublish({
  onPublishSuccess,
  vendorProfile,
  getActiveVendorId
}: MobileVendorPublishProps) {
  const [genderTarget, setGenderTarget] = useState<GenderTarget>('male');
  const [name, setName] = useState('');
  const [subCategory, setSubCategory] = useState(MALE_CATEGORIES[0].id);
  const [category, setCategory] = useState<GarmentCategory>(MALE_CATEGORIES[0].generalCat);
  const [rawPrice, setRawPrice] = useState<string>('');
  
  // Colors
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#111111' }
  ]);
  const [customHex, setCustomHex] = useState('#2563eb');
  const [customName, setCustomName] = useState('');
  const [showCustomColor, setShowCustomColor] = useState(false);

  // Size Stock
  const [sizeStock, setSizeStock] = useState<{ [size: string]: { enabled: boolean; quantity: number } }>({
    'S': { enabled: true, quantity: 10 },
    'M': { enabled: true, quantity: 20 },
    'L': { enabled: true, quantity: 20 },
    'XL': { enabled: true, quantity: 10 },
    'XXL': { enabled: false, quantity: 5 },
  });

  // Photo
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Update categories when gender changes
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
    if (found) setCategory(found.generalCat);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setRawPrice(numeric);
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
    if (!customName.trim()) return;
    setSelectedColors([...selectedColors, { name: customName.trim(), hex: customHex }]);
    setCustomName('');
    setShowCustomColor(false);
  };

  const handleToggleSize = (sz: string) => {
    setSizeStock(prev => ({
      ...prev,
      [sz]: { ...prev[sz], enabled: !prev[sz].enabled }
    }));
  };

  const handleAdjustQty = (sz: string, delta: number) => {
    setSizeStock(prev => ({
      ...prev,
      [sz]: { ...prev[sz], quantity: Math.max(1, prev[sz].quantity + delta) }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter product title.');
      return;
    }
    if (!rawPrice || Number(rawPrice) <= 0) {
      setErrorMessage('Please enter a valid price.');
      return;
    }
    if (!imagePreview) {
      setErrorMessage('Please upload a product showcase photo.');
      return;
    }

    const enabledSizes = Object.keys(sizeStock).filter(s => sizeStock[s].enabled);
    if (enabledSizes.length === 0) {
      setErrorMessage('Please enable at least 1 size.');
      return;
    }

    setIsSubmitting(true);
    const activeVendorId = getActiveVendorId();

    try {
      const payload = {
        name: name.trim(),
        price: Number(rawPrice),
        category: category,
        genderTarget: genderTarget,
        imageUrl: imagePreview,
        colors: selectedColors,
        sizes: sizeStock,
        vendorId: activeVendorId,
        vendorName: vendorProfile.brandName || 'Atelier',
        isBoutique: vendorProfile.vendorType === 'boutique_seller',
        garmentOriginType: vendorProfile.vendorType === 'boutique_seller' ? 'boutique_ready_to_wear' : 'bespoke_atelier',
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        onPublishSuccess(data.product?.id || `prod-${Date.now()}`);
      } else {
        setErrorMessage(data.error || 'Failed to publish product. Please retry.');
      }
    } catch (err: any) {
      console.error('Publish error:', err);
      setErrorMessage('Server connection error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-3xl surface-card border border-[var(--border-subtle)] text-center space-y-4 animate-fadeIn my-6">
        <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>
        <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
          Piece Published Successfully!
        </h3>
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-xs mx-auto">
          Your product is now live on your verified storefront and available for instant 3D digital fitting.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setName('');
              setRawPrice('');
              setImagePreview(null);
            }}
            className="w-full py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-md"
          >
            + Add Another Piece
          </button>
          <Link
            href="/vendor-portal"
            className="w-full py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono-luxury uppercase text-xs font-bold text-[var(--text-primary)]"
          >
            Go to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn pb-20 select-none">
      
      {/* 1. Top Header */}
      <div>
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono-luxury uppercase font-bold border border-emerald-500/20 mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Live Catalog Publisher</span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] leading-tight">
          Add New Garment Piece
        </h2>
        <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
          Upload photo, set colorways & size inventory.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2 animate-shake">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Department Selector Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono-luxury text-xs font-bold">
        {[
          { id: 'male', label: '👨 Men' },
          { id: 'female', label: '👩 Women' },
          { id: 'unisex', label: '👕 Unisex' },
        ].map((d) => {
          const isChosen = genderTarget === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setGenderTarget(d.id as GenderTarget)}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                isChosen
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* 3. Product Photo Upload Card */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)]">
            1. Product Showcase Photo <strong className="text-rose-400">*</strong>
          </span>
          <span className="text-[9px] font-mono-luxury text-[var(--text-muted)]">PNG / JPG</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-[var(--border-subtle)] group">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute bottom-3 inset-x-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-black/80 backdrop-blur-md text-white text-[10px] font-mono-luxury uppercase font-bold border border-white/20 flex items-center justify-center gap-1.5"
              >
                <Camera className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                <span>Replace Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="p-2 rounded-xl bg-rose-500/80 text-white backdrop-blur-md text-[10px] font-mono-luxury"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--gold-accent)] bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer transition-all active:scale-98"
          >
            <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center shadow-sm">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-xs text-[var(--text-primary)] block font-mono-luxury uppercase">
                Tap to Upload Photo
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono-luxury">
                Studio lookbook or mannequin shot
              </span>
            </div>
          </button>
        )}
      </div>

      {/* 4. Product Metadata (Title, Category, Price) */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
          2. Garment Details
        </span>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Product Title <strong className="text-rose-400">*</strong>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midnight Onyx Senator Kaftan"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Category
          </label>
          <div className="relative">
            <select
              value={subCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none appearance-none pr-8 font-bold"
            >
              {activeCategoriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Price in Nigerian Naira (₦) <strong className="text-rose-400">*</strong>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[var(--gold-accent)] text-sm">
              ₦
            </span>
            <input
              type="text"
              required
              value={rawPrice ? Number(rawPrice).toLocaleString() : ''}
              onChange={handlePriceChange}
              placeholder="35,000"
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold text-sm"
            />
          </div>
        </div>
      </div>

      {/* 5. Colorways Picker */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-[var(--text-primary)]">
            3. Available Colors ({selectedColors.length})
          </span>
          <button
            type="button"
            onClick={() => setShowCustomColor(!showCustomColor)}
            className="text-[10px] text-[var(--gold-accent)] uppercase font-bold underline"
          >
            {showCustomColor ? 'Cancel' : '+ Custom Color'}
          </button>
        </div>

        {showCustomColor && (
          <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="h-8 w-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Color Name (e.g. Royal Maroon)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
              <button
                type="button"
                onClick={handleAddCustomColor}
                className="px-3 py-1.5 rounded-lg bg-[var(--gold-accent)] text-black text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {STANDARD_COLORS.map((col) => {
            const isChosen = selectedColors.some(c => c.hex.toLowerCase() === col.hex.toLowerCase());
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => handleToggleColor(col)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isChosen
                    ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)] text-[var(--text-primary)] font-bold'
                    : 'surface-card border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-70'
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="text-[10px]">{col.name}</span>
                {isChosen && <Check className="h-2.5 w-2.5 text-[var(--gold-accent)]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Ready-to-Wear Sizes & Stock Counters */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm text-xs font-mono-luxury">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
          4. Ready-to-Wear Sizing Stock
        </span>

        <div className="space-y-2">
          {STANDARD_SIZES.map((sz) => {
            const isEnabled = sizeStock[sz]?.enabled;
            const qty = sizeStock[sz]?.quantity || 0;
            return (
              <div
                key={sz}
                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isEnabled
                    ? 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
                    : 'bg-[var(--bg-secondary)]/50 border-[var(--border-subtle)] opacity-40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleSize(sz)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-xs transition-all cursor-pointer ${
                    isEnabled
                      ? 'bg-[var(--gold-accent)] text-black shadow-sm'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  Size {sz}
                </button>

                {isEnabled ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-secondary)]">Stock:</span>
                    <div className="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(sz, -1)}
                        className="p-1 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[var(--text-primary)]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(sz, 1)}
                        className="p-1 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleSize(sz)}
                    className="text-[10px] text-[var(--text-muted)] uppercase hover:underline"
                  >
                    + Enable Size
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Full-Width Sticky/Floating Publish Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--gold-accent)] to-amber-600 text-black font-mono-luxury uppercase text-xs font-bold shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Publishing Piece...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 stroke-[2.5]" />
              <span>Publish to Store Catalog</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
