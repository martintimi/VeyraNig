'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GarmentCategory, GenderTarget, VendorSpecialty, getVendorSpecialty } from '@/types';
import {
  UploadCloud, Sparkles, Plus, Trash2,
  Tag, ArrowRight, Loader2, X, Palette,
  Check, AlertTriangle, ShieldCheck, Camera,
  RefreshCw, Minus, ChevronDown, Sparkle,
  Shirt, Footprints, Gem, Layers, CheckCircle2, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { vendorFetch } from '@/lib/services/apiClient';

const STANDARD_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black & White', hex: '#111111' },
  { name: 'Multi-Color / Pattern', hex: '#6366f1' },
  { name: 'Khaki / Beige', hex: '#d4b996' },
  { name: 'Chocolate Brown', hex: '#451a03' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Emerald Gold', hex: '#e6c367' },
];

const MALE_CATEGORIES = [
  // Apparel
  { id: 'senator_kaftan', label: 'Senator & Kaftan Sets', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'agbada_robes', label: 'Grand Agbada & 3-Piece Robes', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'streetwear_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'suits_blazers', label: 'Suits, Tuxedos & Blazers', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'tshirts_tees', label: 'T-Shirts & Graphic Tees', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'shirts_polos', label: 'Luxury Shirts & Polos', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'jeans_trousers', label: 'Baggy Jeans & Cargo Pants', generalCat: 'bottoms' as GarmentCategory, group: 'apparel' },
  // Footwear
  { id: 'men_slides_palms', label: 'Slides, Palms & Slippers', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  { id: 'men_shoes_loafers', label: 'Loafers, Shoes & Sneakers', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  // Accessories & Jewelry
  { id: 'men_jewelry_chains', label: 'Jewelry, Chains & Watches', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'men_caps_fila', label: 'Caps, Fila & Headwear', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'men_bags_wallets', label: 'Bags, Wallets & Belts', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
];

const FEMALE_CATEGORIES = [
  // Apparel
  { id: 'dresses_gowns', label: 'Dresses, Gowns & Maxis', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'boubou_kaftans', label: 'Silk Boubou & Kaftans', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'two_piece_sets', label: 'Two-Piece Co-ord Sets', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'corsets_tops', label: 'Corsets, Tops & Blouses', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'female_streetwear', label: 'Female Streetwear & Hoodies', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'women_jeans_trousers', label: 'Jeans, Cargo & Pants', generalCat: 'bottoms' as GarmentCategory, group: 'apparel' },
  // Footwear
  { id: 'women_slides_palms', label: 'Slides, Palms & Slippers', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  { id: 'women_heels_mules', label: 'Heels, Mules & Loafers', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  // Accessories & Jewelry
  { id: 'women_jewelry', label: 'Jewelry, Necklaces & Bangles', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'women_bags', label: 'Handbags, Totes & Clutches', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'women_caps_scarves', label: 'Caps, Scarves & Headbands', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
];

const UNISEX_CATEGORIES = [
  // Apparel
  { id: 'unisex_hoodie', label: 'Streetwear Hoodies & Sweaters', generalCat: 'outerwear' as GarmentCategory, group: 'apparel' },
  { id: 'unisex_tees', label: 'Graphic Tees & Oversized Shirts', generalCat: 'tops' as GarmentCategory, group: 'apparel' },
  { id: 'unisex_denim', label: 'Denim Jeans & Cargo Pants', generalCat: 'bottoms' as GarmentCategory, group: 'apparel' },
  // Footwear
  { id: 'unisex_slides_palms', label: 'Slides, Palms & Crocs', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  { id: 'unisex_sneakers', label: 'Sneakers & Casual Shoes', generalCat: 'footwear' as GarmentCategory, group: 'footwear' },
  // Accessories & Jewelry
  { id: 'unisex_jewelry', label: 'Chains, Rings & Jewelry', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'unisex_caps_hats', label: 'Caps, Beanies & Hats', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
  { id: 'unisex_bags', label: 'Crossbody Bags & Backpacks', generalCat: 'accessories' as GarmentCategory, group: 'accessories' },
];

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FOOTWEAR_SIZES = ['39', '40', '41', '42', '43', '44', '45', '46'];
const ACCESSORY_SIZES = ['One Size'];

interface MobileVendorPublishProps {
  onPublishSuccess: (productId: string) => void;
  vendorProfile: any;
  getActiveVendorId: () => string;
  onSwitchToBatch?: () => void;
}

export default function MobileVendorPublish({
  onPublishSuccess,
  vendorProfile,
  getActiveVendorId,
  onSwitchToBatch
}: MobileVendorPublishProps) {
  const vendorSpecialty: VendorSpecialty = getVendorSpecialty(vendorProfile);

  const [genderTarget, setGenderTarget] = useState<GenderTarget>('male');
  const [catFilterTab, setCatFilterTab] = useState<'all' | 'apparel' | 'footwear' | 'accessories'>(
    vendorSpecialty === 'jewelry' ? 'accessories' :
    vendorSpecialty === 'footwear' ? 'footwear' :
    vendorSpecialty === 'apparel' ? 'apparel' : 'all'
  );
  const [name, setName] = useState('');
  const [subCategory, setSubCategory] = useState(
    vendorSpecialty === 'jewelry' ? 'men_jewelry_chains' :
    vendorSpecialty === 'footwear' ? 'men_slides_palms' :
    MALE_CATEGORIES[0].id
  );
  const [category, setCategory] = useState<GarmentCategory>(
    vendorSpecialty === 'jewelry' ? 'accessories' :
    vendorSpecialty === 'footwear' ? 'footwear' :
    MALE_CATEGORIES[0].generalCat
  );
  const [rawPrice, setRawPrice] = useState<string>('');
  
  // Colors (for apparel and footwear)
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#111111' }
  ]);
  const [customHex, setCustomHex] = useState('#2563eb');
  const [customName, setCustomName] = useState('');
  const [showCustomColor, setShowCustomColor] = useState(false);

  // Description, Tags & AI Generator
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiToast, setAiToast] = useState('');

  // Sizing & Stock
  const [sizeStock, setSizeStock] = useState<{ [size: string]: { enabled: boolean; quantity: number | string } }>(
    vendorSpecialty === 'jewelry'
      ? { 'One Size': { enabled: true, quantity: 20 } }
      : vendorSpecialty === 'footwear'
      ? {
          '39': { enabled: true, quantity: 5 },
          '40': { enabled: true, quantity: 10 },
          '41': { enabled: true, quantity: 10 },
          '42': { enabled: true, quantity: 10 },
          '43': { enabled: true, quantity: 10 },
          '44': { enabled: true, quantity: 5 },
          '45': { enabled: false, quantity: 0 },
          '46': { enabled: false, quantity: 0 },
        }
      : {
          'S': { enabled: true, quantity: 10 },
          'M': { enabled: true, quantity: 20 },
          'L': { enabled: true, quantity: 20 },
          'XL': { enabled: true, quantity: 10 },
          'XXL': { enabled: false, quantity: 0 },
        }
  );

  // Photo
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPublishSuccess, setIsPublishSuccess] = useState(false);
  const [publishedProductId, setPublishedProductId] = useState<string | null>(null);
  const [lastPublishedName, setLastPublishedName] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Auto-scroll to top whenever an error is encountered
  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [errorMessage]);

  const currentCategoryList = genderTarget === 'male' ? MALE_CATEGORIES : genderTarget === 'female' ? FEMALE_CATEGORIES : UNISEX_CATEGORIES;
  const filteredCategoryList = catFilterTab === 'all' 
    ? currentCategoryList 
    : currentCategoryList.filter(c => c.group === catFilterTab);
  const currentSizeList = category === 'footwear' ? FOOTWEAR_SIZES : category === 'accessories' ? ACCESSORY_SIZES : APPAREL_SIZES;

  const handleCategorySelect = (selectedSubCatId: string, generalCat: GarmentCategory) => {
    setSubCategory(selectedSubCatId);
    setCategory(generalCat);

    if (generalCat === 'footwear') {
      setSizeStock({
        '39': { enabled: true, quantity: 5 },
        '40': { enabled: true, quantity: 10 },
        '41': { enabled: true, quantity: 10 },
        '42': { enabled: true, quantity: 10 },
        '43': { enabled: true, quantity: 10 },
        '44': { enabled: true, quantity: 5 },
        '45': { enabled: false, quantity: 0 },
        '46': { enabled: false, quantity: 0 },
      });
    } else if (generalCat === 'accessories') {
      setSizeStock({
        'One Size': { enabled: true, quantity: 20 }
      });
    } else {
      setSizeStock({
        'S': { enabled: true, quantity: 10 },
        'M': { enabled: true, quantity: 20 },
        'L': { enabled: true, quantity: 20 },
        'XL': { enabled: true, quantity: 10 },
        'XXL': { enabled: false, quantity: 0 },
      });
    }
  };

  const handlePriceChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, '');
    if (!cleanDigits) {
      setRawPrice('');
      return;
    }
    const formatted = Number(cleanDigits).toLocaleString('en-NG');
    setRawPrice(formatted);
  };

  const handleGenerateAiDescription = async () => {
    if (!name.trim()) {
      setAiToast('Enter product title first (e.g. Leather Palms or Senator Kaftan)');
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
        if (data.description) setDescription(data.description);
        if (data.tags && Array.isArray(data.tags)) setTags(prev => Array.from(new Set([...prev, ...data.tags])));
        if (!rawPrice && data.suggestedPrice) setRawPrice(Number(data.suggestedPrice).toLocaleString('en-NG'));
        setAiToast('AI generated description & tags!');
        setTimeout(() => setAiToast(''), 3500);
      }
    } catch (e) {
      console.error(e);
      setAiToast('AI generation timed out');
      setTimeout(() => setAiToast(''), 3000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.name.toLowerCase() === color.name.toLowerCase());
    if (exists) {
      setSelectedColors(selectedColors.filter(c => c.name.toLowerCase() !== color.name.toLowerCase()));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleAddCustomColor = () => {
    if (!customName.trim()) return;
    setSelectedColors([...selectedColors, { name: customName.trim(), hex: customHex }]);
    setCustomName('');
    setShowCustomColor(false);
  };

  const handleSizeStockChange = (size: string, rawQuantity: number | string) => {
    const cleanQty = typeof rawQuantity === 'string'
      ? (rawQuantity.trim() === '' ? '' : parseInt(rawQuantity.replace(/[^0-9]/g, ''), 10))
      : rawQuantity;
    setSizeStock(prev => ({
      ...prev,
      [size]: {
        ...prev[size],
        quantity: typeof cleanQty === 'number' && isNaN(cleanQty) ? '' : cleanQty
      }
    }));
  };

  const handleToggleSize = (size: string) => {
    setSizeStock(prev => ({
      ...prev,
      [size]: { ...prev[size], enabled: !prev[size]?.enabled }
    }));
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

  const totalStock = Object.values(sizeStock)
    .filter(s => s?.enabled)
    .reduce((sum, s) => sum + (s?.quantity === '' ? 0 : Number(s?.quantity || 0)), 0);

  const handleResetForm = () => {
    setName('');
    setRawPrice('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setImageFile(null);
    setImagePreview(null);
    setSelectedColors([{ name: 'Black', hex: '#111111' }]);
    setSizeStock(
      category === 'footwear'
        ? {
            '39': { enabled: true, quantity: 5 },
            '40': { enabled: true, quantity: 10 },
            '41': { enabled: true, quantity: 10 },
            '42': { enabled: true, quantity: 10 },
            '43': { enabled: true, quantity: 10 },
            '44': { enabled: true, quantity: 5 },
            '45': { enabled: false, quantity: 0 },
            '46': { enabled: false, quantity: 0 },
          }
        : category === 'accessories'
        ? { 'One Size': { enabled: true, quantity: 20 } }
        : {
            'S': { enabled: true, quantity: 10 },
            'M': { enabled: true, quantity: 20 },
            'L': { enabled: true, quantity: 20 },
            'XL': { enabled: true, quantity: 10 },
            'XXL': { enabled: false, quantity: 0 },
          }
    );
    setIsPublishSuccess(false);
    setPublishedProductId(null);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-clicks
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter product title');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const numericPrice = Number(rawPrice.replace(/,/g, ''));
    if (!rawPrice || isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMessage('Please enter valid price in Naira');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const enabledSizes = Object.keys(sizeStock).filter(s => sizeStock[s]?.enabled && Number(sizeStock[s]?.quantity) > 0);
    if (enabledSizes.length === 0) {
      setErrorMessage(category === 'accessories' ? 'Please set stock quantity' : 'Enable at least one size with stock');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const activeVendorId = getActiveVendorId();

    try {
      let finalImg = imagePreview || '/images/products/BlackTrapStarHoodie.jpg';

      const payload = {
        name: name.trim(),
        price: numericPrice,
        category,
        genderTarget,
        garmentOriginType: 'ready_made_boutique',
        imageUrl: finalImg,
        image_url: finalImg,
        description: description.trim(),
        tags,
        colors: category === 'accessories' ? [] : (selectedColors.length > 0 ? selectedColors.map(c => ({ name: c.name, hex: c.hex })) : [{ name: 'As Pictured', hex: '#111111' }]),
        sizes: enabledSizes,
        sizeStock,
        stockQuantity: totalStock,
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
        const prodId = data.product?.id || `prod-${Date.now()}`;
        setPublishedProductId(prodId);
        setLastPublishedName(name.trim());
        setIsPublishSuccess(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onPublishSuccess(prodId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(data.error || 'Failed to publish piece');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Network error while publishing piece');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully published, render celebration confirmation screen
  if (isPublishSuccess) {
    return (
      <div className="p-2 sm:p-4 space-y-6 animate-fadeIn text-center pb-24 select-none">
        <div className="p-6 sm:p-8 rounded-3xl surface-card border border-emerald-500/30 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="h-16 w-16 rounded-3xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono-luxury font-bold uppercase tracking-wider">
              Live on Storefront
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Piece Published!
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury leading-relaxed max-w-sm mx-auto">
              <strong className="text-[var(--text-primary)]">{lastPublishedName}</strong> is now live on your catalog with real-time stock sync and verified checkout.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {publishedProductId && (
              <Link
                href={`/shop/${publishedProductId}`}
                className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-xl hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>View Live in Shop</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            <Link
              href="/vendor-portal/drops"
              className="w-full py-3.5 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase text-xs font-bold hover:border-[var(--gold-accent)] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Manage Inventory Drops</span>
            </Link>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full py-3 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold transition-colors inline-flex items-center justify-center gap-1.5 pt-2 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publish Another Piece</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn pb-24 select-none">
      
      {/* 1. Header & Department Switcher */}
      <div className="space-y-3">
        {/* Mode Switcher */}
        {onSwitchToBatch && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold">
            <button
              type="button"
              className="py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm text-center cursor-pointer"
            >
              Single Piece
            </button>
            <button
              type="button"
              onClick={onSwitchToBatch}
              className="py-2 rounded-xl text-[var(--gold-accent)] hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 fill-current" />
              <span>Multi-Photo Batch</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
              Catalog Publisher
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] leading-tight">
              Add New Piece
            </h2>
          </div>
          <span className="text-[10px] font-mono-luxury text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {totalStock} in Stock
          </span>
        </div>

        {/* Gender Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          {(['male', 'female', 'unisex'] as GenderTarget[]).map((gt) => (
            <button
              key={gt}
              type="button"
              onClick={() => {
                setGenderTarget(gt);
                const list = gt === 'male' ? MALE_CATEGORIES : gt === 'female' ? FEMALE_CATEGORIES : UNISEX_CATEGORIES;
                handleCategorySelect(list[0].id, list[0].generalCat);
              }}
              className={`py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                genderTarget === gt
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {gt === 'male' ? 'Men' : gt === 'female' ? 'Women' : 'Unisex'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Showcase Photo Card */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] font-mono-luxury block">
          1. Photo Showcase <strong className="text-rose-400">*</strong>
        </span>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[var(--bg-primary)] flex flex-col items-center justify-center min-h-[160px]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative h-44 w-full rounded-xl overflow-hidden">
              <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
            </div>
          ) : (
            <div className="space-y-1.5 py-4">
              <Camera className="h-8 w-8 text-[var(--gold-accent)] mx-auto" />
              <span className="text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] block">
                Tap to Upload Photo
              </span>
              <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                Take camera photo or pick from gallery
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Title, Price & Category */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm font-mono-luxury text-xs">
        <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
          2. Piece Details & Category
        </span>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Piece Name / Title <strong className="text-rose-400">*</strong>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Leather Crocodile Palms, Velvet Fila, Silk Boubou, Cuban Chain"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold">
            Price (₦ NGN) <strong className="text-rose-400">*</strong>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--gold-accent)] font-bold">₦</span>
            <input
              type="text"
              inputMode="numeric"
              required
              value={rawPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="35,000"
              className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-bold"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[var(--text-secondary)] uppercase font-bold text-[10px]">
              Category / Piece Type <strong className="text-rose-400">*</strong>
            </label>
            <span className="text-[9px] text-[var(--gold-accent)] font-bold uppercase">
              {category === 'footwear' ? 'Shoe Sizing' : category === 'accessories' ? 'Jewelry / One-Size' : 'Apparel Sizing'}
            </span>
          </div>

          {/* Quick Segment Tabs with Lucide Icons */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'all', label: 'All', icon: Layers, allowed: vendorSpecialty === 'multi_department' },
              { id: 'apparel', label: 'Apparel', icon: Shirt, allowed: vendorSpecialty === 'multi_department' || vendorSpecialty === 'apparel' },
              { id: 'footwear', label: 'Footwear', icon: Footprints, allowed: vendorSpecialty === 'multi_department' || vendorSpecialty === 'footwear' },
              { id: 'accessories', label: 'Jewelry & Accessories', icon: Gem, allowed: vendorSpecialty === 'multi_department' || vendorSpecialty === 'jewelry' },
            ].filter(t => t.allowed).map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCatFilterTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-luxury font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                    catFilterTab === tab.id
                      ? 'bg-[var(--gold-accent)] text-black shadow-sm'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <IconComp className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Clean Category Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {filteredCategoryList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id, cat.generalCat)}
                className={`p-2.5 rounded-xl border text-left text-[11px] font-mono-luxury transition-all cursor-pointer ${
                  subCategory === cat.id
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)] text-[var(--text-primary)] font-bold ring-1 ring-[var(--gold-accent)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Generator Button */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[var(--text-secondary)] uppercase font-bold text-[10px]">Description</span>
            <button
              type="button"
              onClick={handleGenerateAiDescription}
              disabled={isGeneratingAi}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 text-[10px] font-bold"
            >
              {isGeneratingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              <span>Auto-Write</span>
            </button>
          </div>

          {aiToast && (
            <div className="p-2 rounded-lg bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[10px] mb-2 animate-fadeIn">
              {aiToast}
            </div>
          )}

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fabric specs, tailoring notes, occasion..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none min-h-[120px] leading-relaxed resize-y overflow-y-auto text-xs"
          />
        </div>
      </div>

      {/* 4. Adaptive Size Stocks */}
      <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3 shadow-sm font-mono-luxury text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
            {category === 'footwear' ? '3. Shoe / Slide Sizing (EU)' : category === 'accessories' ? '3. Inventory Stock' : '3. Ready-to-Wear Sizes'}
          </span>
          <span className="text-[10px] text-[var(--gold-accent)] font-bold">{totalStock} Units</span>
        </div>

        {category === 'accessories' ? (
          <div>
            <label className="block text-[var(--text-secondary)] uppercase mb-1 font-bold text-[11px]">
              Total Available Units
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={sizeStock['One Size']?.quantity === '' ? '' : (sizeStock['One Size']?.quantity ?? 20)}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleSizeStockChange('One Size', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {currentSizeList.map((sz) => {
              const isEn = sizeStock[sz]?.enabled;
              const qty = sizeStock[sz]?.quantity;
              return (
                <div
                  key={sz}
                  className={`p-2 rounded-xl border text-center ${
                    isEn ? 'border-[var(--gold-accent)] bg-[var(--bg-primary)]' : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-primary)]">{sz}</span>
                    <input
                      type="checkbox"
                      checked={isEn}
                      onChange={() => handleToggleSize(sz)}
                      className="rounded text-[var(--gold-accent)] cursor-pointer"
                    />
                  </div>
                  {isEn && (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={qty === '' ? '' : (qty ?? 0)}
                      placeholder="0"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleSizeStockChange(sz, e.target.value)}
                      className="w-full text-center px-1 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)] font-mono-luxury"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Color Palette (Only shown for Apparel and Footwear - Hidden for Jewelry & Accessories) */}
      {category !== 'accessories' && (
        <div className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2.5 shadow-sm font-mono-luxury text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[var(--text-primary)] block">
              4. Colorways &amp; Finishes
            </span>
            <button
              type="button"
              onClick={() => setShowCustomColor(!showCustomColor)}
              className="text-[10px] text-[var(--gold-accent)] font-bold hover:underline cursor-pointer"
            >
              {showCustomColor ? 'Close' : '+ Custom Color'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {STANDARD_COLORS.map((c) => {
              const isSel = selectedColors.some(sc => sc.name.toLowerCase() === c.name.toLowerCase());
              const isMulti = c.name.toLowerCase().includes('multi');
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSel ? 'border-[var(--gold-accent)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold ring-1 ring-[var(--gold-accent)] shadow-sm' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                    style={{
                      background: isMulti
                        ? 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ec4899)'
                        : c.hex
                    }}
                  />
                  <span>{c.name}</span>
                </button>
              );
            })}

            {/* Native Visual Color Wheel Trigger */}
            <label
              title="Pick exact shade"
              className="px-2.5 py-1 rounded-xl border border-[var(--border-subtle)] text-[11px] flex items-center gap-1.5 cursor-pointer hover:border-[var(--gold-accent)] bg-[var(--bg-secondary)]"
            >
              <input
                type="color"
                value={customHex}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  setShowCustomColor(true);
                }}
                className="sr-only"
              />
              <span
                className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
              />
              <span className="text-[var(--gold-accent)] font-bold">Color Wheel</span>
            </label>
          </div>

          {/* Custom Color Input */}
          {showCustomColor && (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--gold-accent)]/50 mt-1 animate-fadeIn">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="h-7 w-7 rounded-lg border border-white/20 cursor-pointer bg-transparent shrink-0"
              />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Type custom color (e.g. Sage Green, Tie Dye)"
                className="w-full px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomColor}
                disabled={!customName.trim()}
                className="px-3 py-1 rounded-lg bg-[var(--gold-accent)] text-black font-bold text-[10px] uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-40"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-6 left-4 right-4 z-50 p-4 rounded-2xl bg-emerald-500 text-black font-mono-luxury font-bold text-xs flex items-center gap-2 shadow-2xl animate-slideDown">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="pt-2 space-y-2.5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold shadow-xl hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin text-[var(--gold-accent)]" />
              <span>Publishing Piece...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Publish Piece to Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            // Execute quick submit & reset
            const numericPrice = Number(rawPrice.replace(/[^0-9.]/g, ''));
            if (!name.trim()) {
              setErrorMessage('Please enter garment title.');
              return;
            }
            if (!rawPrice || isNaN(numericPrice) || numericPrice <= 0) {
              setErrorMessage('Please enter a valid price in Naira.');
              return;
            }
            setIsSubmitting(true);
            setErrorMessage('');
            try {
              const activeVendorId = getActiveVendorId();
              const finalImageUrl = imagePreview || '/images/products/BlackTrapStarHoodie.jpg';
              const enabledSizes = Object.keys(sizeStock).filter(s => sizeStock[s]?.enabled && Number(sizeStock[s]?.quantity) > 0);
              
              const payload = {
                name: name.trim(),
                price: numericPrice,
                category,
                genderTarget,
                garmentOriginType: 'ready_made_boutique',
                imageUrl: finalImageUrl,
                image_url: finalImageUrl,
                description: description.trim(),
                tags,
                colors: category === 'accessories' ? [] : selectedColors.map(c => ({ name: c.name, hex: c.hex })),
                sizes: enabledSizes.length > 0 ? enabledSizes : ['M', 'L', 'XL'],
                sizeStock,
                stockQuantity: totalStock,
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
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
                setSuccessToast(`"${name.trim()}" published! Form cleared for your next piece.`);
                setTimeout(() => setSuccessToast(''), 4000);
                setName('');
                setRawPrice('');
                setDescription('');
                setImageFile(null);
                setImagePreview(null);
                setTags([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setErrorMessage(data.error || 'Failed to publish piece');
              }
            } catch (err) {
              setErrorMessage('Network error while publishing');
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="w-full py-3.5 rounded-full surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--gold-accent)] font-mono-luxury uppercase text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Publish &amp; Add Another Piece</span>
        </button>
      </div>

    </form>
  );
}
