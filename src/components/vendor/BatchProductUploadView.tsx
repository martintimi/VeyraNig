'use client';

import React, { useState, useRef } from 'react';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, Sparkles, Plus, Trash2, Check,
  Layers, ChevronDown, CheckCircle2, ArrowRight,
  Loader2, AlertCircle, Eye, RefreshCw, X, ShieldCheck, Edit3, Palette
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { vendorFetch } from '@/lib/services/apiClient';

interface BatchItem {
  id: string;
  name: string;
  price: string;
  category: GarmentCategory;
  subCategory: string;
  genderTarget: GenderTarget;
  imageFile: File | null;
  imagePreview: string;
  selectedColor: { name: string; hex: string };
  isCustomColorOpen?: boolean;
  customColorText?: string;
  sizeStock: { [size: string]: number | string }; // Allows empty string while typing
}

interface BatchProductUploadViewProps {
  vendorProfile: any;
  getActiveVendorId: () => string;
  onSwitchToSingle?: () => void;
}

const CATEGORY_OPTIONS = [
  // Tops / Streetwear
  { id: 'streetwear_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'unisex_tees', label: 'Graphic Tees & Shirts', generalCat: 'tops' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'senator_kaftan', label: 'Senator & Kaftan Sets', generalCat: 'tops' as GarmentCategory, dept: 'male' as GenderTarget },
  { id: 'boubou_kaftans', label: 'Silk Boubou & Kaftans', generalCat: 'outerwear' as GarmentCategory, dept: 'female' as GenderTarget },
  { id: 'two_piece_sets', label: 'Two-Piece Co-ord Sets', generalCat: 'tops' as GarmentCategory, dept: 'female' as GenderTarget },
  { id: 'dresses_gowns', label: 'Dresses, Gowns & Maxis', generalCat: 'tops' as GarmentCategory, dept: 'female' as GenderTarget },
  { id: 'suits_blazers', label: 'Suits, Tuxedos & Blazers', generalCat: 'outerwear' as GarmentCategory, dept: 'male' as GenderTarget },
  // Bottoms
  { id: 'unisex_denim', label: 'Denim Jeans & Cargo Pants', generalCat: 'bottoms' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'skirts_minis', label: 'Skirts & Mini Skirts', generalCat: 'bottoms' as GarmentCategory, dept: 'female' as GenderTarget },
  // Footwear
  { id: 'unisex_slides_palms', label: 'Slides, Palms & Slippers', generalCat: 'footwear' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'unisex_sneakers', label: 'Sneakers & Shoes', generalCat: 'footwear' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'women_heels_mules', label: 'Heels & Mules', generalCat: 'footwear' as GarmentCategory, dept: 'female' as GenderTarget },
  // Accessories
  { id: 'unisex_caps_hats', label: 'Caps, Beanies & Hats', generalCat: 'accessories' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'unisex_jewelry', label: 'Jewelry & Chains', generalCat: 'accessories' as GarmentCategory, dept: 'unisex' as GenderTarget },
  { id: 'unisex_bags', label: 'Bags & Backpacks', generalCat: 'accessories' as GarmentCategory, dept: 'unisex' as GenderTarget },
];

const POPULAR_SWATCHES = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Off-White / Cream', hex: '#fdfbf7' },
  { name: 'Khaki / Beige', hex: '#d4b996' },
  { name: 'Chocolate Brown', hex: '#451a03' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Olive Green', hex: '#556b2f' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Multi-Color / Pattern', hex: '#6366f1' },
];

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FOOTWEAR_SIZES = ['39', '40', '41', '42', '43', '44', '45', '46'];

function cleanFileNameToTitle(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const clean = withoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return 'Collection Piece';
  return clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatPriceString(val: string): string {
  const digits = (val || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString();
}

export default function BatchProductUploadView({
  vendorProfile,
  getActiveVendorId,
  onSwitchToSingle,
}: BatchProductUploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ current: number; total: number } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Bulk Apply Toolbar State
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState('15');
  const [bulkCategory, setBulkCategory] = useState(CATEGORY_OPTIONS[0].id);
  const [bulkSizes, setBulkSizes] = useState<string[]>(['M', 'L', 'XL']);

  // Handle multi-file selection from gallery / camera / desktop
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const defaultQty = bulkQuantity === '' ? 15 : (Number(bulkQuantity) || 15);

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        const defaultCat = CATEGORY_OPTIONS[0];
        const defaultSizes = bulkSizes.length > 0 ? [...bulkSizes] : ['M', 'L', 'XL'];
        
        const initSizeStock: { [sz: string]: number | string } = {};
        defaultSizes.forEach(sz => {
          initSizeStock[sz] = defaultQty;
        });

        setItems(prev => [
          ...prev,
          {
            id: `batch-${Date.now()}-${index}-${Math.random()}`,
            name: cleanFileNameToTitle(file.name),
            price: bulkPrice || '',
            category: defaultCat.generalCat,
            subCategory: defaultCat.id,
            genderTarget: defaultCat.dept,
            imageFile: file,
            imagePreview: previewUrl,
            selectedColor: POPULAR_SWATCHES[0],
            isCustomColorOpen: false,
            customColorText: '',
            sizeStock: initSizeStock,
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update a single item field
  const updateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Remove an item from the batch
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Update size stock for an item (allows empty string while erasing, no stuck 0s!)
  const setItemSizeQty = (itemId: string, size: string, rawVal: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const cleanVal = typeof rawVal === 'string'
        ? (rawVal.trim() === '' ? '' : parseInt(rawVal.replace(/[^0-9]/g, ''), 10))
        : rawVal;
      const updated = { ...item.sizeStock, [size]: isNaN(cleanVal as number) ? '' : cleanVal };
      return { ...item, sizeStock: updated };
    }));
  };

  // Toggle size active/inactive for an item
  const toggleItemSize = (itemId: string, size: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const updated = { ...item.sizeStock };
      if (updated[size] !== undefined) {
        delete updated[size];
      } else {
        const defaultQty = bulkQuantity === '' ? 15 : (Number(bulkQuantity) || 15);
        updated[size] = defaultQty;
      }
      return { ...item, sizeStock: updated };
    }));
  };

  // BULK PRESET APPLIERS
  const applyPriceToAll = () => {
    if (!bulkPrice) return;
    setItems(prev => prev.map(item => ({ ...item, price: bulkPrice })));
  };

  const applyQuantityToAll = () => {
    const qty = bulkQuantity === '' ? 1 : Math.max(1, Number(bulkQuantity) || 1);
    setItems(prev => prev.map(item => {
      const updated: { [sz: string]: number | string } = {};
      Object.keys(item.sizeStock).forEach(sz => {
        updated[sz] = qty;
      });
      return { ...item, sizeStock: updated };
    }));
  };

  const applyCategoryToAll = () => {
    const matched = CATEGORY_OPTIONS.find(c => c.id === bulkCategory);
    if (!matched) return;
    setItems(prev => prev.map(item => ({
      ...item,
      category: matched.generalCat,
      subCategory: matched.id,
      genderTarget: matched.dept,
    })));
  };

  const applySizesToAll = () => {
    if (bulkSizes.length === 0) return;
    const defaultQty = bulkQuantity === '' ? 15 : (Number(bulkQuantity) || 15);
    setItems(prev => prev.map(item => {
      const updated: { [sz: string]: number | string } = {};
      bulkSizes.forEach(sz => {
        updated[sz] = item.sizeStock[sz] !== undefined ? item.sizeStock[sz] : defaultQty;
      });
      return { ...item, sizeStock: updated };
    }));
  };

  const toggleBulkSize = (sz: string) => {
    setBulkSizes(prev => prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]);
  };

  // Calculate total piece stock
  const calculateTotalStock = (item: BatchItem): number => {
    if (item.category === 'accessories') {
      const q = item.sizeStock['One Size'];
      return q === '' ? 0 : Number(q) || 20;
    }
    return Object.values(item.sizeStock).reduce((sum: number, q) => sum + (q === '' ? 0 : Number(q) || 0), 0);
  };

  // PUBLISH ALL ITEMS TO DATABASE
  const handlePublishAll = async () => {
    if (items.length === 0) return;

    // Validation
    const invalidItem = items.find(i => !i.name.trim() || !i.price || Number(String(i.price).replace(/[^0-9.]/g, '')) <= 0);
    if (invalidItem) {
      setErrorMessage(`Please make sure every item has a title and a valid price in Naira.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setPublishProgress({ current: 0, total: items.length });

    try {
      const activeVendorId = getActiveVendorId();

      const payloadItems = items.map(item => {
        const cleanPrice = Number(String(item.price).replace(/[^0-9.]/g, '')) || 10000;
        const sizeStockObj: { [k: string]: { enabled: boolean; quantity: number } } = {};
        
        if (item.category === 'accessories') {
          const accQty = item.sizeStock['One Size'] === '' ? 20 : (Number(item.sizeStock['One Size']) || 20);
          sizeStockObj['One Size'] = { enabled: true, quantity: accQty };
        } else {
          Object.entries(item.sizeStock).forEach(([sz, qty]) => {
            const numQty = qty === '' ? 0 : Number(qty) || 0;
            if (numQty > 0) {
              sizeStockObj[sz] = { enabled: true, quantity: numQty };
            }
          });
        }

        const totalItemStock = calculateTotalStock(item);
        const activeSizes = Object.keys(sizeStockObj);

        return {
          name: item.name.trim(),
          price: cleanPrice,
          category: item.category,
          genderTarget: item.genderTarget,
          garmentOriginType: 'ready_made_boutique',
          imageUrl: item.imagePreview,
          image_url: item.imagePreview,
          description: '',
          tags: ['Ready-to-Wear', 'Collection Drop'],
          colors: item.category === 'accessories' ? [] : [{ name: item.selectedColor.name.trim() || 'Standard', hex: item.selectedColor.hex || '#111111' }],
          sizes: item.category === 'accessories' ? ['One Size'] : (activeSizes.length > 0 ? activeSizes : ['M', 'L', 'XL']),
          sizeStock: sizeStockObj,
          stockQuantity: totalItemStock,
          vendorId: activeVendorId,
          vendorName: vendorProfile?.brandName || 'Verified Partner',
          is_published: true,
        };
      });

      const res = await vendorFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: payloadItems,
          vendorId: activeVendorId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish batch collection.');
      }

      setPublishedCount(items.length);
      setIsSuccess(true);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#e6c367', '#10b981', '#ffffff']
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during batch publishing.');
    } finally {
      setIsSubmitting(false);
      setPublishProgress(null);
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto p-6 sm:p-10 surface-card rounded-3xl border border-[var(--border-subtle)] text-center space-y-6 animate-fadeIn my-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
            {publishedCount} Pieces Published Live
          </h2>
          <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-md mx-auto">
            Your collection has been published and is now live across the Veyra catalog, available for orders and Shipbubble courier delivery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
          >
            <span>View Live Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setItems([]);
              setIsSuccess(false);
              setPublishedCount(0);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury font-bold text-xs uppercase tracking-wider hover:border-[var(--gold-accent)] cursor-pointer"
          >
            Upload Another Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-24">
      
      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Multi-Product Batch Creator
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-0.5">
            Quick Batch Upload Drop
          </h1>
          <p className="text-xs font-mono-luxury text-[var(--text-secondary)] mt-0.5">
            Select 2 to 20 garment photos at once from your phone or studio gallery and launch your collection in seconds.
          </p>
        </div>

        {onSwitchToSingle && (
          <button
            type="button"
            onClick={onSwitchToSingle}
            className="px-4 py-2 rounded-xl surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-primary)] hover:border-[var(--gold-accent)] self-start sm:self-auto cursor-pointer font-bold"
          >
            Switch to Single Piece Form
          </button>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs font-mono-luxury animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="ml-auto text-xs hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* STEP 1: DROPZONE / SELECT PHOTOS BUTTON */}
      {items.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--gold-accent)] surface-card rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all space-y-4 group"
        >
          <div className="h-16 w-16 mx-auto rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Tap to Select Multiple Garment Photos
            </h3>
            <p className="text-xs font-mono-luxury text-[var(--text-secondary)] max-w-md mx-auto">
              Select pictures of your new hoodies, kaftans, dresses, or footwear directly from your phone gallery or files.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury text-xs font-bold uppercase tracking-wider shadow-lg group-hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            <span>Choose Photos</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">

          {/* QUICK BULK PRESETS TOOLBAR */}
          <div className="p-4 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono-luxury font-bold text-xs uppercase tracking-wider text-[var(--gold-accent)]">
                <Sparkles className="h-4 w-4" />
                <span>Quick Bulk Presets (Fill All {items.length} Items in 1 Tap)</span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl surface-card border border-[var(--border-subtle)] text-[11px] font-mono-luxury font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                <span>Add More Photos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-luxury">
              
              {/* Preset 1: Price */}
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold block">1. Standard Price</span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gold-accent)] font-bold">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(formatPriceString(e.target.value))}
                      placeholder="30,000"
                      onFocus={(e) => e.target.select()}
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none font-bold font-mono-luxury focus:border-[var(--gold-accent)]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPriceToAll}
                    disabled={!bulkPrice}
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-[10px] uppercase tracking-wider hover:opacity-90 disabled:opacity-30 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Preset 2: Quantity per size */}
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold block">2. Stock Qty / Size</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="15"
                    onFocus={(e) => e.target.select()}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none font-bold font-mono-luxury focus:border-[var(--gold-accent)]"
                  />
                  <button
                    type="button"
                    onClick={applyQuantityToAll}
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-[10px] uppercase tracking-wider hover:opacity-90 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Preset 3: Category */}
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold block">3. Category Preset</span>
                <div className="flex items-center gap-2">
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={applyCategoryToAll}
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-[10px] uppercase tracking-wider hover:opacity-90 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Preset 4: Sizing */}
              <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold block">4. Available Sizes</span>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    {APPAREL_SIZES.map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleBulkSize(sz)}
                        className={`h-6 w-6 rounded-md border text-[9px] font-bold transition-all cursor-pointer ${
                          bulkSizes.includes(sz)
                            ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)]'
                            : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={applySizesToAll}
                    className="px-2 py-1.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-[10px] uppercase tracking-wider hover:opacity-90 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* BATCH ITEMS LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-luxury px-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                {items.length} {items.length === 1 ? 'Piece in Batch' : 'Pieces in Batch'}
              </span>
              <button
                type="button"
                onClick={() => setItems([])}
                className="text-rose-400 hover:underline text-[11px] font-bold cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const totalItemStock = calculateTotalStock(item);
                const sizeList = item.category === 'footwear' ? FOOTWEAR_SIZES : APPAREL_SIZES;
                const isMulti = item.selectedColor?.name?.toLowerCase().includes('multi');

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Item Thumbnail */}
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-black border border-[var(--border-subtle)] shrink-0 shadow-sm">
                        <Image
                          src={item.imagePreview}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover object-center"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono-luxury font-bold text-white border border-white/20">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Main Specs */}
                      <div className="flex-1 space-y-2.5 min-w-0">
                        
                        {/* Name & Remove */}
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            placeholder="Garment Title (e.g. Vintage Wash Hoodie)"
                            className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                            title="Remove from batch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price & Category Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-luxury">
                          {/* Price */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gold-accent)] font-bold">₦</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, { price: formatPriceString(e.target.value) })}
                              placeholder="Price in ₦"
                              onFocus={(e) => e.target.select()}
                              className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold font-mono-luxury"
                            />
                          </div>

                          {/* Category Selector */}
                          <select
                            value={item.subCategory}
                            onChange={(e) => {
                              const subId = e.target.value;
                              const matched = CATEGORY_OPTIONS.find(c => c.id === subId);
                              if (matched) {
                                updateItem(item.id, {
                                  subCategory: subId,
                                  category: matched.generalCat,
                                  genderTarget: matched.dept,
                                });
                              }
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] focus:outline-none"
                          >
                            {CATEGORY_OPTIONS.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Visual Swatch Color Palette + Native Color Wheel Picker */}
                        {item.category !== 'accessories' && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs font-mono-luxury">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Color:</span>
                                <span className="font-bold text-[var(--text-primary)] text-xs flex items-center gap-1.5">
                                  <span
                                    className="inline-block h-3 w-3 rounded-full border border-white/20 shadow-sm"
                                    style={{
                                      background: isMulti
                                        ? 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ec4899)'
                                        : (item.selectedColor?.hex || '#111111')
                                    }}
                                  />
                                  <span>{item.selectedColor?.name || 'Black'}</span>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => updateItem(item.id, {
                                  isCustomColorOpen: !item.isCustomColorOpen,
                                  customColorText: item.selectedColor?.name || ''
                                })}
                                className="text-[10px] text-[var(--gold-accent)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="h-2.5 w-2.5" />
                                <span>{item.isCustomColorOpen ? 'Close edit' : 'Edit name'}</span>
                              </button>
                            </div>

                            {/* 1-Line Visual Circular Swatches */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                              {POPULAR_SWATCHES.map(c => {
                                const isSelected = item.selectedColor?.name === c.name && !item.isCustomColorOpen;
                                const isSwatchMulti = c.name.toLowerCase().includes('multi');
                                return (
                                  <button
                                    key={c.name}
                                    type="button"
                                    title={c.name}
                                    onClick={() => updateItem(item.id, {
                                      selectedColor: c,
                                      isCustomColorOpen: false
                                    })}
                                    className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full shrink-0 transition-all cursor-pointer relative ${
                                      isSelected
                                        ? 'ring-2 ring-[var(--gold-accent)] ring-offset-2 ring-offset-black scale-110 shadow-md'
                                        : 'hover:scale-105 border border-white/20 opacity-80 hover:opacity-100'
                                    }`}
                                    style={{
                                      background: isSwatchMulti
                                        ? 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ec4899)'
                                        : c.hex
                                    }}
                                  />
                                );
                              })}

                              {/* Native Visual Color Wheel Swatch */}
                              <label
                                title="Custom Visual Color Wheel"
                                className="relative h-5 w-5 sm:h-6 sm:w-6 rounded-full shrink-0 border border-white/30 cursor-pointer overflow-hidden flex items-center justify-center hover:scale-110 transition-all shadow-sm group"
                                style={{
                                  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
                                }}
                              >
                                <input
                                  type="color"
                                  value={item.selectedColor?.hex || '#2563eb'}
                                  onChange={(e) => {
                                    const hex = e.target.value;
                                    updateItem(item.id, {
                                      selectedColor: {
                                        name: item.customColorText?.trim() || 'Custom Shade',
                                        hex
                                      },
                                      isCustomColorOpen: true,
                                      customColorText: item.customColorText || 'Custom Shade'
                                    });
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <Palette className="h-3 w-3 text-white drop-shadow pointer-events-none group-hover:scale-110" />
                              </label>
                            </div>

                            {/* Inline Custom Color Name Input */}
                            {item.isCustomColorOpen && (
                              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--gold-accent)]/40 animate-fadeIn">
                                <span
                                  className="h-4 w-4 rounded-full border border-white/20 shrink-0"
                                  style={{ backgroundColor: item.selectedColor?.hex || '#111111' }}
                                />
                                <input
                                  type="text"
                                  value={item.customColorText !== undefined ? item.customColorText : item.selectedColor?.name}
                                  onChange={(e) => {
                                    const text = e.target.value;
                                    updateItem(item.id, {
                                      customColorText: text,
                                      selectedColor: { name: text.trim() || 'Custom Shade', hex: item.selectedColor?.hex || '#111111' }
                                    });
                                  }}
                                  placeholder="Type color/pattern (e.g. Sage Green, Black & White Fleece, Tie Dye)"
                                  className="w-full px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)]"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => updateItem(item.id, { isCustomColorOpen: false })}
                                  className="px-2.5 py-1 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                                >
                                  Done
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sizing & Stock Boxes: Zero Stuck Issues with Backspace Erase */}
                        <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs font-mono-luxury">
                            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">
                              {item.category === 'accessories' ? 'Stock Quantity' : 'Sizes & Available Stock'}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                              {totalItemStock} in Stock
                            </span>
                          </div>

                          {item.category === 'accessories' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[var(--text-primary)]">Total Stock:</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={item.sizeStock['One Size'] === '' ? '' : (item.sizeStock['One Size'] ?? 20)}
                                placeholder="0"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setItemSizeQty(item.id, 'One Size', e.target.value)}
                                className="w-24 px-3 py-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--gold-accent)] font-mono-luxury"
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                              {sizeList.map(sz => {
                                const isEnabled = item.sizeStock[sz] !== undefined;
                                const qty = item.sizeStock[sz];

                                return (
                                  <div
                                    key={sz}
                                    className={`p-2 rounded-xl border text-center transition-all ${
                                      isEnabled
                                        ? 'bg-[var(--bg-primary)] border-[var(--gold-accent)] shadow-sm'
                                        : 'bg-[var(--bg-primary)]/40 border-[var(--border-subtle)] opacity-40'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-bold text-[var(--text-primary)]">{sz}</span>
                                      <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => toggleItemSize(item.id, sz)}
                                        className="h-3.5 w-3.5 rounded text-[var(--gold-accent)] cursor-pointer"
                                      />
                                    </div>
                                    {isEnabled && (
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={qty === '' ? '' : (qty ?? 0)}
                                        placeholder="0"
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setItemSizeQty(item.id, sz, e.target.value)}
                                        className="w-full text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)] font-mono-luxury"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="sticky bottom-6 z-20 p-4 sm:p-5 rounded-3xl surface-card border border-[var(--border-subtle)] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-[var(--bg-primary)]/90">
              <div>
                <span className="font-editorial text-lg font-bold text-[var(--text-primary)] block">
                  Ready to Publish {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}
                </span>
                <span className="text-xs font-mono-luxury text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Instant live synchronization to Veyra catalog</span>
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-primary)] font-bold hover:border-[var(--gold-accent)] cursor-pointer"
                >
                  + Add Photos
                </button>

                <button
                  type="button"
                  onClick={handlePublishAll}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Publishing Batch ({publishProgress?.current || 1}/{publishProgress?.total || items.length})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-black" />
                      <span>Publish All ({items.length} Pieces)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
