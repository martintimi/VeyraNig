'use client';

import { vendorFetch, getActiveVendorId } from '@/lib/services/apiClient';


import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget } from '@/types';
import {
  UploadCloud, CheckCircle2, Sparkles, Plus, Trash2,
  ShoppingBag, Scissors, Tag, ArrowRight, ExternalLink,
  Loader2, Wand2, X, Image as ImageIcon, Layers, Palette, Store, Clock,
  Check, AlertTriangle, ShieldCheck, Ruler, Shirt, Info, Sparkle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';

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
];

// Boutique-Specific Categories
const BOUTIQUE_CATEGORIES = [
  { id: 'hoodie', label: 'Hoodies & Sweatshirts', generalCat: 'tops' },
  { id: 'tshirt', label: 'T-Shirts & Graphic Tees', generalCat: 'tops' },
  { id: 'shirt', label: 'Shirts & Polos', generalCat: 'tops' },
  { id: 'baggy_jeans', label: 'Baggy Jeans & Denim', generalCat: 'bottoms' },
  { id: 'cargo_pants', label: 'Cargo Pants & Baggy Trousers', generalCat: 'bottoms' },
  { id: 'shorts_sweatpants', label: 'Shorts & Sweatpants', generalCat: 'bottoms' },
  { id: 'underwear', label: 'Underwear (Boxers, Singlets & Undershirts)', generalCat: 'bottoms' },
  { id: 'jackets', label: 'Jackets, Coats & Windbreakers', generalCat: 'outerwear' },
  { id: 'footwear_slides', label: 'Slides, Crocs & Footwear', generalCat: 'footwear' },
  { id: 'caps_beanies', label: 'Caps, Beanies & Hats', generalCat: 'accessories' },
  { id: 'jewelry_belts', label: 'Jewelry, Bags & Belts', generalCat: 'accessories' },
];

// Bespoke Fashion Designer Categories
const BESPOKE_CATEGORIES = [
  { id: 'senator_kaftan', label: 'Senator & Kaftan Sets', generalCat: 'tops' },
  { id: 'native_trousers', label: 'Native Trousers & Pants', generalCat: 'bottoms' },
  { id: 'agbada_3piece', label: '3-Piece Grand Agbada Robes', generalCat: 'outerwear' },
  { id: 'bespoke_suits', label: 'Bespoke Suits & Blazers', generalCat: 'outerwear' },
  { id: 'aso_oke_fila', label: 'Handwoven Aso-Oke Fila & Caps', generalCat: 'accessories' },
];

// Bespoke Fabric Library
const BESPOKE_FABRICS = [
  { id: 'italian_wool', name: '100% Super 160s Italian Wool', desc: 'Crisp drape, breathable luxury for Senators and sharp suits.' },
  { id: 'atiku_cotton', name: 'Heavyweight Atiku Cotton', desc: 'Premium structured cotton with subtle jacquard sheen.' },
  { id: 'guinea_brocade', name: 'Royal Guinea Brocade (Bazin)', desc: 'Stiff ceremonial sheen with deep resonant color.' },
  { id: 'silk_adire', name: 'Hand-Dyed Silk Adire', desc: 'Artisanal heritage patterns from Abeokuta dyers.' },
  { id: 'aso_oke', name: 'Handloomed Aso-Oke', desc: 'Traditional Yoruba woven silk-cotton for ceremonial wear.' },
  { id: 'cashmere_blend', name: 'Cashmere & Wool Blend', desc: 'Ultra-soft hand-feel for bespoke kaftans and agbadas.' },
  { id: 'pure_linen', name: 'Heavy European Linen', desc: 'Effortless warm-weather luxury and resort wear.' },
];

// Bespoke Style Customization Options
const COLLAR_OPTIONS = [
  { id: 'mandarin', label: 'Mandarin Band Collar' },
  { id: 'geometric', label: 'Geometric Cutout Collar' },
  { id: 'turn_down', label: 'Classic Notch Collar' },
  { id: 'bishop', label: 'Bishop Standing Collar' },
  { id: 'collarless', label: 'Collarless Clean V-Neck' },
];

const SLEEVE_OPTIONS = [
  { id: 'french_cuff', label: 'French Cuff (for Cufflinks)' },
  { id: 'barrel_cuff', label: 'Single Button Barrel Cuff' },
  { id: 'short_sleeve', label: 'Short Sleeve Straight' },
  { id: 'agbada_wing', label: 'Agbada Wide Wing Sleeve' },
];

const EMBROIDERY_OPTIONS = [
  { id: 'tone_on_tone', label: 'Minimalist Tone-on-Tone Stitch' },
  { id: 'geometric_placket', label: 'Geometric Placket Hand-Embroidery' },
  { id: 'gold_metallic', label: 'Gold & Metallic Thread Motifs' },
  { id: 'plain_clean', label: 'Plain / No Embroidery' },
];

const MEASUREMENT_FIELDS = [
  { id: 'neck', label: 'Neck Circumference' },
  { id: 'chest', label: 'Chest / Bust Width' },
  { id: 'shoulder', label: 'Shoulder Span' },
  { id: 'sleeve', label: 'Sleeve Length' },
  { id: 'top_length', label: 'Top / Kaftan Length' },
  { id: 'waist', label: 'Trouser Waist' },
  { id: 'inseam', label: 'Inseam / Trouser Length' },
  { id: 'thigh', label: 'Thigh Circumference' },
  { id: 'ankle', label: 'Ankle Opening' },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PublishGarmentPage() {
  const { vendorProfile } = useStore();
  const isVendorBoutique = vendorProfile.vendorType === 'boutique_merchant' || vendorProfile.vendorType === 'boutique_seller';

  // Active publisher mode: boutique (RTW) vs bespoke (Fashion Designer)
  const [publishMode, setPublishMode] = useState<'boutique' | 'bespoke'>(
    isVendorBoutique ? 'boutique' : 'bespoke'
  );

  // 1. Core Shared Form State
  const [name, setName] = useState('');
  const [boutiqueCategory, setBoutiqueCategory] = useState('hoodie');
  const [category, setCategory] = useState<GarmentCategory>('tops');
  const [genderTarget, setGenderTarget] = useState<GenderTarget>('unisex');
  const [rawPrice, setRawPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Interactive Colorway State
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#111111' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563eb');
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);

  // 2. RTW Size Stock (Boutique Mode)
  const [sizeStock, setSizeStock] = useState<{ [size: string]: { enabled: boolean; quantity: number } }>({
    'S': { enabled: true, quantity: 10 },
    'M': { enabled: true, quantity: 25 },
    'L': { enabled: true, quantity: 30 },
    'XL': { enabled: true, quantity: 15 },
    'XXL': { enabled: true, quantity: 5 },
  });

  // 3. Bespoke Fashion Designer State
  const [bespokeGarmentType, setBespokeGarmentType] = useState('senator');
  const [selectedFabric, setSelectedFabric] = useState('italian_wool');
  const [fabricYardage, setFabricYardage] = useState('4.0');
  const [fabricSupplyMode, setFabricSupplyMode] = useState<'atelier' | 'client' | 'both'>('atelier');
  const [turnaroundDays, setTurnaroundDays] = useState('5-7');
  
  // Customization Options Enabled for Shoppers
  const [enabledCollars, setEnabledCollars] = useState<string[]>(['mandarin', 'geometric', 'collarless']);
  const [enabledSleeves, setEnabledSleeves] = useState<string[]>(['french_cuff', 'short_sleeve']);
  const [enabledEmbroidery, setEnabledEmbroidery] = useState<string[]>(['tone_on_tone', 'geometric_placket', 'plain_clean']);
  const [requiredMeasurements, setRequiredMeasurements] = useState<string[]>([
    'neck', 'chest', 'shoulder', 'sleeve', 'top_length', 'waist', 'inseam', 'thigh', 'ankle'
  ]);

  // Image Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Description & Form submission states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
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
        const res = await vendorFetch('/api/vendor/profile');
        const data = await res.json();
        if (res.ok && data.success && data.vendor) {
          const verified = !!data.vendor.is_verified || !!data.vendor.isVerified;
          const status = (verified || data.vendor.approvalStatus === 'approved') ? 'approved' : (data.vendor.approvalStatus || 'pending');
          setIsProfileSaved(!!data.vendor.isProfileSaved || verified);
          setApprovalStatus(status);
          setIsVerified(verified || status === 'approved');
        }
      } catch (e) {
      } finally {
        setIsCheckingProfile(false);
      }
    }
    checkProfileStatus();
  }, []);

  // Auto-map category when boutique category changes
  const handleBoutiqueCategoryChange = (catId: string) => {
    setBoutiqueCategory(catId);
    const found = BOUTIQUE_CATEGORIES.find(c => c.id === catId);
    if (found) {
      setCategory(found.generalCat as GarmentCategory);
    }
  };

  // Toggle Color selection
  const handleToggleColor = (colorObj: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.hex.toLowerCase() === colorObj.hex.toLowerCase());
    if (exists) {
      if (selectedColors.length === 1) return; // Keep at least one
      setSelectedColors(selectedColors.filter(c => c.hex.toLowerCase() !== colorObj.hex.toLowerCase()));
    } else {
      setSelectedColors([...selectedColors, colorObj]);
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newCol = { name: customColorName.trim(), hex: customColorHex };
    if (!selectedColors.some(c => c.hex.toLowerCase() === newCol.hex.toLowerCase())) {
      setSelectedColors([...selectedColors, newCol]);
    }
    setCustomColorName('');
    setShowCustomColorPicker(false);
  };

  // Formatting helpers
  const formatNumberWithCommas = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (!clean) return '';
    return parseInt(clean, 10).toLocaleString();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setRawPrice(raw);
  };

  // Local image upload preview handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setImageUrl(base64);
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tToRemove: string) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  // AI Auto-Generator for descriptions
  const handleGenerateAIDescription = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a product title first so AI can describe your piece.');
      return;
    }

    setIsGeneratingAI(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name,
          category,
          genderTarget,
          vendorType: publishMode === 'bespoke' ? 'fashion_designer' : 'boutique_merchant',
          fabric: publishMode === 'bespoke' ? selectedFabric : 'Heavyweight Cotton Fleece',
        }),
      });

      const data = await res.json();
      if (res.ok && data.description) {
        setDescription(data.description);
      } else {
        setDescription(
          publishMode === 'bespoke'
            ? `Precision-tailored ${name} crafted from luxury fabrics. Features world-class Nigerian needlework, crisp drape, and tailored zero-pull fitting.`
            : `Premium quality ${name}. Heavyweight structured cotton, high-density stitching, and relaxed contemporary streetwear cut for everyday luxury.`
        );
      }
    } catch (e) {
      setDescription(
        `High-end ${name} offering refined Nigerian craftsmanship, luxury comfort, and flawless silhouette drape.`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const toggleArrayItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Final Form Submission
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const numericPrice = parseInt(rawPrice, 10);
    if (!name.trim()) {
      setErrorMessage('Please provide a piece title.');
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage('Please provide a valid selling price.');
      return;
    }
    if (!imageUrl && !imagePreview) {
      setErrorMessage('Please upload a showcase product photo.');
      return;
    }

    setIsSubmitting(true);

    try {
      let activeSizes: string[] = [];
      let sizeStockMap: any = {};
      let totalStockUnits = 10;

      if (publishMode === 'boutique') {
        activeSizes = Object.keys(sizeStock).filter(s => sizeStock[s].enabled);
        sizeStockMap = Object.entries(sizeStock)
          .filter(([_, item]) => item.enabled)
          .reduce((acc, [size, item]) => ({ ...acc, [size]: item.quantity }), {});
        totalStockUnits = Object.values(sizeStockMap).reduce((a: any, b: any) => Number(a) + Number(b), 0) as number;
      }

      // Bespoke tailoring metadata
      const tailoringSpecs = publishMode === 'bespoke' ? {
        garmentType: bespokeGarmentType,
        fabric: selectedFabric,
        fabricYardage,
        fabricSupplyMode,
        turnaroundDays,
        customizationOptions: {
          collars: enabledCollars,
          sleeves: enabledSleeves,
          embroidery: enabledEmbroidery
        },
        requiredMeasurements
      } : null;

      const currentVendorId = getActiveVendorId();
      const currentVendorName = vendorProfile.brandName || (publishMode === 'bespoke' ? 'Bespoke Atelier' : 'Moji wears');

      const payload = {
        name: name.trim(),
        price: numericPrice,
        category,
        genderTarget,
        garmentOriginType: publishMode === 'bespoke' ? 'bespoke_atelier' : 'ready_made_boutique',
        imageUrl: imageUrl || imagePreview,
        description: description.trim() || name.trim(),
        tags: tags.length > 0 ? tags : (publishMode === 'bespoke' ? ['Bespoke', 'Native'] : ['Ready-to-Wear', 'Boutique', 'Streetwear']),
        colors: selectedColors.map(c => c.hex),
        sizes: publishMode === 'bespoke' ? ['Custom Fit'] : activeSizes,
        sizeStock: sizeStockMap,
        stockQuantity: publishMode === 'bespoke' ? 99 : totalStockUnits,
        vendorId: currentVendorId,
        vendorName: currentVendorName,
        tailoringSpecs
      };

      const res = await vendorFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Failed to publish piece.');
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
      setImageUrl('');
      setImagePreview(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while publishing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Profile verification gating check
  if (isCheckingProfile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn">
        <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin" />
        <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Verifying boutique status...</p>
      </div>
    );
  }

  if (!isVerified && approvalStatus !== 'approved') {
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
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-20">
      
      {/* Top Header & Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-[11px] font-mono-luxury uppercase font-bold mb-1.5">
            {publishMode === 'bespoke' ? <Scissors className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
            <span>{publishMode === 'bespoke' ? 'Bespoke Tailoring Publisher' : 'Ready-to-Wear Product Publisher'}</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {publishMode === 'bespoke' ? 'Publish Bespoke Garment Piece' : 'Add New Ready-to-Wear Drop'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-0.5">
            {publishMode === 'bespoke'
              ? 'Configure custom tailoring options, fabric specifications, and customer measurements intake.'
              : 'Upload ready-made inventory with size stocks, color variants, and instant fulfillment.'}
          </p>
        </div>

        {/* Only show mode switcher if vendor is a Fashion Designer / Tailor */}
        {!isVendorBoutique && (
          <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit shrink-0">
            <button
              type="button"
              onClick={() => setPublishMode('bespoke')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                publishMode === 'bespoke'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>Bespoke Tailoring</span>
            </button>

            <button
              type="button"
              onClick={() => setPublishMode('boutique')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-luxury uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                publishMode === 'boutique'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Ready-to-Wear (RTW)</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Publishing Form */}
      <form onSubmit={handlePublishSubmit} className="space-y-8">
        
        {/* ======================================================== */}
        {/* 1. PRODUCT PHOTO SHOWCASE */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
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

        {/* ======================================================== */}
        {/* 2. CORE DETAILS: TITLE, CATEGORY, PRICE */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5">
          <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
            2. Piece Title & Base Pricing
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
                placeholder={publishMode === 'bespoke' ? 'e.g. Onyx Wool Geometric Senator Kaftan' : 'e.g. Acid Wash Heavyweight Hoodie'}
                className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                {publishMode === 'bespoke' ? 'Bespoke Commission Price (₦ NGN)' : 'Retail Price (₦ NGN)'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs font-mono-luxury text-[var(--text-muted)]">₦</span>
                <input
                  type="text"
                  required
                  value={formatNumberWithCommas(rawPrice)}
                  onChange={handlePriceChange}
                  placeholder="30,000"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                Garment Category <span className="text-rose-500">*</span>
              </label>
              
              {publishMode === 'boutique' ? (
                <select
                  value={boutiqueCategory}
                  onChange={(e) => handleBoutiqueCategoryChange(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
                >
                  {BOUTIQUE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold focus:border-[var(--gold-accent)] focus:outline-none cursor-pointer"
                >
                  {BESPOKE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.generalCat}>{cat.label}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                Gender Target
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

          {/* ======================================================== */}
          {/* COLORWAYS SELECTOR & SWATCHES */}
          {/* ======================================================== */}
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

            {/* Custom Color Input Drawer */}
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

            {/* Color Swatch Grid */}
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
                    <span className="truncate text-[11px]">{col.name}</span>
                    {isSelected && <Check className="h-3 w-3 ml-auto text-[var(--gold-accent)] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Active Selected Color Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)]">Selected:</span>
              {selectedColors.map((col) => (
                <span
                  key={col.hex}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-mono-luxury font-bold text-[var(--text-primary)]"
                >
                  <span className="h-2.5 w-2.5 rounded-full border border-black/20" style={{ backgroundColor: col.hex }} />
                  <span>{col.name}</span>
                  {selectedColors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleToggleColor(col)}
                      className="text-[var(--text-muted)] hover:text-rose-500 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Description & AI Generator */}
          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold">
                Garment Description
              </label>
              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={isGeneratingAI}
                className="text-[11px] font-mono-luxury text-[var(--gold-accent)] uppercase font-bold hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAI ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                <span>Auto-Write with AI</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                publishMode === 'bespoke'
                  ? 'Describe the stitch finish, fabric drape, and traditional ceremonial detailing...'
                  : 'Describe the fit, heavyweight textile feel, fabric composition, and street styling...'
              }
              className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. BESPOKE SPECIFICATIONS (ONLY IN BESPOKE TAILORING MODE) */}
        {/* ======================================================== */}
        {publishMode === 'bespoke' && (
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center shrink-0">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  3. Bespoke Fabric & Tailoring Architecture
                </h3>
                <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                  Select supported fabrics, yardage requirements, and tailoring completion timeline.
                </p>
              </div>
            </div>

            {/* Fabric Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold">
                Primary Fabric Specification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BESPOKE_FABRICS.map((fab) => {
                  const isSel = selectedFabric === fab.id;
                  return (
                    <div
                      key={fab.id}
                      onClick={() => setSelectedFabric(fab.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                        isSel
                          ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]/30 shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-subtle)]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--text-primary)] font-editorial">
                          {fab.name}
                        </span>
                        {isSel && <Check className="h-3.5 w-3.5 text-[var(--gold-accent)]" />}
                      </div>
                      <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)] leading-relaxed">
                        {fab.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Yardage & Turnaround */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-subtle)]">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Fabric Yardage Required
                </label>
                <select
                  value={fabricYardage}
                  onChange={(e) => setFabricYardage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                >
                  <option value="3.5">3.5 Yards (Senator Short Sleeve)</option>
                  <option value="4.0">4.0 Yards (Standard Senator 2-Piece)</option>
                  <option value="5.0">5.0 Yards (Full Kaftan & Pants)</option>
                  <option value="7.0">7.0 Yards (Royal 3-Piece Agbada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Fabric Supply Mode
                </label>
                <select
                  value={fabricSupplyMode}
                  onChange={(e) => setFabricSupplyMode(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                >
                  <option value="atelier">Atelier Sourced (All-Inclusive)</option>
                  <option value="client">Client Ships Own Fabric</option>
                  <option value="both">Both Options Available</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Tailoring Turnaround
                </label>
                <select
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury focus:border-[var(--gold-accent)] focus:outline-none"
                >
                  <option value="2-3">Express (2–3 Business Days)</option>
                  <option value="5-7">Standard Bespoke (5–7 Business Days)</option>
                  <option value="10-14">Intricate Embroidery (10–14 Days)</option>
                </select>
              </div>
            </div>

            {/* Customization Options Enabled for Shoppers */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-mono-luxury uppercase text-[var(--text-primary)] font-bold">
                Shopper Customization Options
              </h4>

              {/* Collars */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono-luxury text-[var(--text-muted)] font-bold block">Collar Styles:</span>
                <div className="flex flex-wrap gap-2">
                  {COLLAR_OPTIONS.map(c => {
                    const active = enabledCollars.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleArrayItem(enabledCollars, setEnabledCollars, c.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono-luxury transition-all cursor-pointer ${
                          active
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {active ? '✓ ' : '+ '} {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Embroidery */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono-luxury text-[var(--text-muted)] font-bold block">Embroidery Styles:</span>
                <div className="flex flex-wrap gap-2">
                  {EMBROIDERY_OPTIONS.map(e => {
                    const active = enabledEmbroidery.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => toggleArrayItem(enabledEmbroidery, setEnabledEmbroidery, e.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono-luxury transition-all cursor-pointer ${
                          active
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {active ? '✓ ' : '+ '} {e.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Measurements Required */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                  <span className="text-[11px] font-mono-luxury text-[var(--text-muted)] font-bold">
                    Required 3D Virtual Fitting Body Measurements:
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MEASUREMENT_FIELDS.map(m => {
                    const isReq = requiredMeasurements.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleArrayItem(requiredMeasurements, setRequiredMeasurements, m.id)}
                        className={`p-2.5 rounded-xl border text-xs font-mono-luxury transition-all cursor-pointer flex items-center justify-between ${
                          isReq
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <span>{m.label}</span>
                        {isReq && <Check className="h-3 w-3 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 4. RTW SIZES & STOCK (ONLY IN BOUTIQUE MODE) */}
        {/* ======================================================== */}
        {publishMode === 'boutique' && (
          <div className="p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                3. Ready-to-Wear Size Stock Quantities
              </h3>
              <span className="text-[11px] font-mono-luxury text-[var(--gold-accent)] font-bold">
                Total Units: {Object.entries(sizeStock).filter(([_, item]) => item.enabled).reduce((sum, [_, item]) => sum + (Number(item.quantity) || 0), 0)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {STANDARD_SIZES.map((size) => {
                const isEnabled = sizeStock[size]?.enabled;
                const qty = sizeStock[size]?.quantity || 0;

                return (
                  <div
                    key={size}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      isEnabled
                        ? 'border-[var(--gold-accent)]/50 bg-[var(--gold-subtle)]/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--text-primary)]">{size}</span>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => setSizeStock(prev => ({
                          ...prev,
                          [size]: { ...prev[size], enabled: !prev[size].enabled }
                        }))}
                        className="rounded accent-[var(--gold-accent)] cursor-pointer"
                      />
                    </div>
                    {isEnabled && (
                      <div>
                        <label className="text-[10px] font-mono-luxury text-[var(--text-muted)] block mb-1">Stock Qty:</label>
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => setSizeStock(prev => ({
                            ...prev,
                            [size]: { ...prev[size], quantity: Number(e.target.value) || 0 }
                          }))}
                          className="w-full p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBMIT BUTTON */}
        {/* ======================================================== */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Publishing Piece to Veyra Catalog...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Publish Drop to Storefront</span>
            </>
          )}
        </button>

      </form>

      {/* Success Modal */}
      {showSuccessModal && publishedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-6 text-center shadow-2xl animate-scaleUp">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                Piece Published Live!
              </h3>
              <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{publishedProduct.name}</strong> is now live in your store catalog and available to customers nationwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:border-[var(--gold-accent)] text-[var(--text-primary)] transition-all"
              >
                Upload Another
              </button>

              <Link
                href={`/shop/${publishedProduct.id}`}
                className="flex-1 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all inline-flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>View in Shop</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
