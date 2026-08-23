'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GenderTarget, Product, ProductColor } from '@/types';
import {
  UploadCloud, CheckCircle2, Sparkles, Plus, Trash2,
  Layers, ShoppingBag, Scissors, Tag, Info, Check
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';

const PRESET_COLORS = [
  { name: 'Jet Black', hex: '#111111' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Heather Grey', hex: '#6b7280' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Emerald Green', hex: '#065f46' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Mustard / Ochre', hex: '#d97706' },
  { name: 'Earth Khaki', hex: '#78716c' },
];

export default function PublishGarmentPage() {
  const { addCustomProduct, vendorProfile } = useStore();
  const isBoutique = vendorProfile.vendorType === 'boutique_seller';

  // Form State
  const [formData, setFormData] = useState({
    name: isBoutique ? 'Heavyweight Boxy Drop-Shoulder Tee' : 'Imperial Emerald Silk Senator Kaftan',
    category: isBoutique ? 'tops' : 'tops' as GarmentCategory,
    genderTarget: 'unisex' as GenderTarget,
    price: isBoutique ? 28000 : 68000,
    imageUrl: isBoutique ? '/images/products/BlackTrapStarHoodie.jpg' : '/images/products/BlackSenator.jpg',
    fabricComposition: isBoutique ? '100% 320 GSM Combed Heavyweight Cotton' : '100% Fine Merino Wool & Silk Blend',
    fitNotes: isBoutique ? 'Boxy street silhouette with reinforced collar and ribbed cuffs.' : 'Hand-tailored bespoke cut with reinforced shoulder lines.',
    tags: isBoutique ? 'Streetwear, Heavyweight, Graphic Tee, Urban' : 'Senator, Bespoke Native, Occasion',
  });

  // Color Variants with individual quantity per color (for Boutique and Atelier)
  const [colorVariants, setColorVariants] = useState<ProductColor[]>([
    { name: isBoutique ? 'Jet Black' : 'Emerald Green', hex: isBoutique ? '#111111' : '#065f46', quantity: 15 },
    { name: isBoutique ? 'Pure White' : 'Midnight Onyx', hex: isBoutique ? '#ffffff' : '#18181b', quantity: 10 },
  ]);

  // New color adder state
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1e3a8a');
  const [newColorQty, setNewColorQty] = useState<number>(10);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Total quantity computed across all color variants
  const totalStockQuantity = colorVariants.reduce((sum, c) => sum + (c.quantity || 0), 0);

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColorVariants(prev => [
      ...prev,
      { name: newColorName.trim(), hex: newColorHex, quantity: Number(newColorQty) || 5 }
    ]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    if (colorVariants.length <= 1) {
      alert('At least 1 colorway is required.');
      return;
    }
    setColorVariants(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateColorQty = (index: number, quantity: number) => {
    setColorVariants(prev => prev.map((item, idx) => idx === index ? { ...item, quantity: Math.max(0, quantity) } : item));
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData(prev => ({ ...prev, imageUrl: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      vendorId: `vendor-${vendorProfile.brandName.toLowerCase().replace(/\s+/g, '-')}`,
      vendorName: vendorProfile.brandName,
      name: formData.name,
      category: formData.category,
      genderTarget: formData.genderTarget,
      garmentOriginType: isBoutique ? 'ready_made_boutique' : 'handmade_designer',
      price: Number(formData.price),
      stockQuantity: totalStockQuantity || 10,
      imageUrl: formData.imageUrl,
      description: `${formData.name} released by ${vendorProfile.brandName} (${vendorProfile.location}). Available for 3D virtual try-on on Veyra.`,
      tags: formData.tags.split(',').map(t => t.trim()),
      colors: colorVariants,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      sizeChart: {
        'S': { chest: [88, 94], waist: [70, 76] },
        'M': { chest: [95, 102], waist: [77, 84] },
        'L': { chest: [103, 110], waist: [85, 92] },
        'XL': { chest: [111, 120], waist: [93, 100] },
      },
      fabricComposition: formData.fabricComposition,
      fitNotes: formData.fitNotes,
      rating: 5.0,
      reviewCount: 1,
      badge: isBoutique ? 'Ready-to-Wear Drop' : 'Bespoke Handmade',
      layerZIndex: formData.category === 'bottoms' ? 1 : formData.category === 'outerwear' ? 3 : formData.category === 'footwear' ? 4 : 2,
      isUserUploaded: true,
    };

    addCustomProduct(newProduct);
    setPublishedProduct(newProduct);
    setShowSuccessModal(true);

    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.5 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase font-bold mb-2">
          {isBoutique ? <ShoppingBag className="h-3.5 w-3.5" /> : <Scissors className="h-3.5 w-3.5" />}
          <span>{isBoutique ? 'Ready-to-Wear Boutique Studio' : 'Bespoke Tailoring Atelier Studio'}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          {isBoutique ? 'Add Ready-to-Wear Product Drop' : 'Publish Bespoke Garment'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
          {isBoutique
            ? 'Set product drop photos, configure multiple colorways with individual stock quantities, and publish directly to Veyra.'
            : 'Upload bespoke tailored garment photos, define fabric composition, and publish for made-to-measure 3D fitting.'}
        </p>
      </div>

      {showSuccessModal && publishedProduct ? (
        <div className="p-10 rounded-3xl surface-card border border-emerald-500/40 text-center space-y-4 max-w-2xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h3 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
            {isBoutique ? 'Product Drop Published Live!' : 'Bespoke Garment Published!'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            <strong>{publishedProduct.name}</strong> ({totalStockQuantity} units across {colorVariants.length} colorways) is now live on Veyra under <strong>{vendorProfile.brandName}</strong>.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/vendor-portal/direct-sales"
              className="px-6 py-3 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Lookbook Card & Order Link</span>
            </Link>
            <Link
              href="/shop"
              target="_blank"
              className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold shadow-lg"
            >
              Preview in Shop
            </Link>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury uppercase font-bold"
            >
              {isBoutique ? 'Add Another Product' : 'Upload Another Garment'}
            </button>
          </div>
        </div>
      ) : (
        
        /* 2-COLUMN STUDIO LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Structured Product / Garment Form */}
          <form onSubmit={handlePublish} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card space-y-6 border border-[var(--border-subtle)]">
            
            {/* Title & Department */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                  {isBoutique ? 'Product Name / Drop Title' : 'Garment Title / Model Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isBoutique ? "e.g. Trapstar Heavyweight Graphic Hoodie" : "e.g. Onyx Black Wool Senator Kaftan"}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as GarmentCategory })}
                    className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  >
                    {isBoutique ? (
                      <>
                        <option value="tops">👕 Polos & T-Shirts</option>
                        <option value="outerwear">🧥 Hoodies, Sweatshirts & Jackets</option>
                        <option value="bottoms">👖 Cargo & Denim Jeans</option>
                        <option value="footwear">👟 Sneakers & Footwear</option>
                        <option value="accessories">🧢 Caps, Headwarmers & Beanies</option>
                      </>
                    ) : (
                      <>
                        <option value="tops">🧵 Senator Kaftan / Native Top</option>
                        <option value="bottoms">👖 Bespoke Native Trouser</option>
                        <option value="outerwear">👑 Agbada / Royal Robe / Wrap</option>
                        <option value="accessories">🎩 Fila / Traditional Cap</option>
                        <option value="footwear">👡 Leather Native Slides</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Department
                  </label>
                  <select
                    value={formData.genderTarget}
                    onChange={(e) => setFormData({ ...formData, genderTarget: e.target.value as GenderTarget })}
                    className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="male">Men&apos;s Collection</option>
                    <option value="female">Women&apos;s Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono-luxury font-bold"
                  />
                </div>
              </div>
            </div>

            {/* MULTI-COLOR VARIANT & QUANTITY MANAGER */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[var(--gold-accent)]" />
                  <span className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
                    Available Colors & Quantity Per Color
                  </span>
                </div>
                <span className="text-xs font-mono-luxury text-emerald-500 font-bold">
                  Total Drop Stock: {totalStockQuantity} Units
                </span>
              </div>

              {/* Active Color Variants List */}
              <div className="space-y-2.5">
                {colorVariants.map((color, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-6 w-6 rounded-full border border-white/20 shadow-sm shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-mono-luxury font-bold text-[var(--text-primary)] truncate">
                        {color.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-mono-luxury text-[var(--text-muted)] uppercase">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={color.quantity || 0}
                          onChange={(e) => handleUpdateColorQty(idx, Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-center font-bold text-[var(--text-primary)]"
                        />
                        <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">pcs</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove colorway"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Color Row */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
                <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
                  + Add Another Colorway:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g. Ash Grey, Navy, Wine"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="h-8 w-full rounded-lg cursor-pointer bg-transparent border-0"
                      title="Choose color hex"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min="1"
                      value={newColorQty}
                      onChange={(e) => setNewColorQty(Number(e.target.value))}
                      placeholder="Qty"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-center font-bold text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="w-full py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-[10px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Popular Quick Color Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-mono-luxury text-[var(--text-muted)] mr-1">Presets:</span>
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setNewColorName(preset.name);
                        setNewColorHex(preset.hex);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[10px] font-mono-luxury flex items-center gap-1 transition-colors"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PHOTO UPLOAD DROPZONE */}
            <div className="space-y-2">
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] font-bold">
                {isBoutique ? 'Product Photos (Front Look)' : 'Garment Photo (Bespoke Cut)'}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleImageFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                  isDragging
                    ? 'border-[var(--gold-accent)] bg-[var(--gold-subtle)]/30'
                    : 'border-[var(--border-subtle)] hover:border-[var(--gold-accent)] bg-[var(--bg-primary)]'
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] flex items-center justify-center mx-auto">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Click to Browse Photo from Gallery or Drag & Drop
                </div>
                <div className="text-[11px] text-[var(--text-muted)] font-mono-luxury">
                  Supports JPG, PNG, WEBP high-resolution photos
                </div>
              </div>
            </div>

            {/* Fabric / Material & Fit Notes */}
            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                {isBoutique ? 'Material & Fabric Specifications' : 'Fabric Composition & Weave'}
              </label>
              <input
                type="text"
                required
                value={formData.fabricComposition}
                onChange={(e) => setFormData({ ...formData, fabricComposition: e.target.value })}
                placeholder={isBoutique ? "e.g. 100% 320 GSM Combed Heavyweight Cotton" : "e.g. 100% Fine Merino Wool & Silk Blend"}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                {isBoutique ? 'Street Fit & Silhouette Details' : 'Tailoring & Fit Specifications'}
              </label>
              <textarea
                rows={2}
                required
                value={formData.fitNotes}
                onChange={(e) => setFormData({ ...formData, fitNotes: e.target.value })}
                placeholder={isBoutique ? "e.g. Boxy drop-shoulder street cut with reinforced ribbed neckline." : "e.g. Hand-tailored bespoke cut with reinforced shoulder lines."}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                Catalog Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={isBoutique ? "Streetwear, Hoodie, Heavyweight, Urban" : "Senator, Bespoke Native, Occasion"}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
              <span>{isBoutique ? 'Publish RTW Product Drop to Veyra' : 'Publish Garment to Catalog'}</span>
            </button>
          </form>

          {/* Right 5 Cols: Live Product Card Preview */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
                Live Storefront Card
              </span>
              <span className="text-[10px] font-mono-luxury text-emerald-500 font-bold">
                {totalStockQuantity} in Stock
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)] space-y-3 p-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src={formData.imageUrl}
                  alt={formData.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-mono-luxury uppercase font-bold text-amber-300">
                  {vendorProfile.brandName}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-mono-luxury uppercase font-bold">
                  {isBoutique ? 'RTW Drop' : 'Bespoke Native'}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)] truncate">
                  {formData.name || 'Product Name'}
                </h4>
                <div className="font-editorial text-base font-bold text-[var(--gold-accent)]">
                  ₦{formData.price ? Number(formData.price).toLocaleString() : '0'}
                </div>

                {/* Color Swatches Preview */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono-luxury text-[var(--text-muted)]">Colors ({colorVariants.length}):</span>
                  <div className="flex items-center gap-1">
                    {colorVariants.map((c, i) => (
                      <span
                        key={i}
                        className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.quantity} pcs)`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                  {formData.fitNotes}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
