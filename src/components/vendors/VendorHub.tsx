'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { GarmentCategory, GarmentOriginType, GenderTarget, Product } from '@/types';
import { Store, Scissors, Plus, CheckCircle2, UploadCloud, ArrowRight, Sparkles, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function VendorHub() {
  const { addCustomProduct, allProducts } = useStore();

  const [activeTab, setActiveTab] = useState<'designer' | 'boutique'>('designer');
  const [submitted, setSubmitted] = useState(false);

  // Upload Form State
  const [formData, setFormData] = useState({
    name: '',
    vendorName: 'Kolawole Bespoke Atelier',
    category: 'tops' as GarmentCategory,
    genderTarget: 'male' as GenderTarget,
    garmentOriginType: 'handmade_designer' as GarmentOriginType,
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    fabricComposition: '100% Fine Wool & Silk Blend',
    fitNotes: 'Handmade bespoke cut with tailored shoulder lines.',
    tags: 'Senator, Handmade, Native',
  });

  const [uploadedProduct, setUploadedProduct] = useState<Product | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      vendorId: `vendor-${Date.now()}`,
      vendorName: formData.vendorName || 'Independent Nigerian Designer',
      name: formData.name,
      category: formData.category,
      genderTarget: formData.genderTarget,
      garmentOriginType: activeTab === 'designer' ? 'handmade_designer' : 'ready_made_boutique',
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      description: `${formData.name} crafted by ${formData.vendorName}. Available for virtual try-on on Ìrísí.`,
      tags: formData.tags.split(',').map(t => t.trim()),
      colors: [{ name: 'Default Color', hex: '#111111' }],
      sizes: ['S', 'M', 'L', 'XL'],
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
      badge: activeTab === 'designer' ? 'Handmade Designer' : 'Boutique Ready-Made',
      layerZIndex: formData.category === 'bottoms' ? 1 : formData.category === 'outerwear' ? 3 : formData.category === 'footwear' ? 4 : 2,
      isUserUploaded: true,
    };

    addCustomProduct(newProduct);
    setUploadedProduct(newProduct);
    setSubmitted(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      vendorName: activeTab === 'designer' ? 'Kolawole Bespoke Atelier' : 'Lagos City Boutique',
      category: 'tops',
      genderTarget: 'male',
      garmentOriginType: activeTab === 'designer' ? 'handmade_designer' : 'ready_made_boutique',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      fabricComposition: '100% Fine Fabric',
      fitNotes: 'Standard fit.',
      tags: 'New Drop, Nigerian Fashion',
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--border-subtle)] text-[var(--gold-accent)] text-xs font-mono-luxury uppercase tracking-widest font-bold">
          <Store className="h-3.5 w-3.5" />
          <span>DESIGNER & VENDOR PORTAL</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
          List Your Clothes on Ìrísí
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
          Whether you make bespoke handmade Senator/Ankara wear or sell ready-made hoodies & denim, upload your garments here to enable 3D virtual try-on for thousands of shoppers.
        </p>
      </div>

      {/* Role Toggle: Fashion Designer vs Boutique Seller */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
        <button
          onClick={() => {
            setActiveTab('designer');
            setFormData(prev => ({ ...prev, garmentOriginType: 'handmade_designer', vendorName: 'Kolawole Bespoke Atelier' }));
          }}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-mono-luxury uppercase tracking-wider font-bold transition-all ${
            activeTab === 'designer'
              ? 'bg-[var(--gold-accent)] text-black shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Scissors className="h-4 w-4" />
          <span>1. Fashion Designer (Handmade)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('boutique');
            setFormData(prev => ({ ...prev, garmentOriginType: 'ready_made_boutique', vendorName: 'Lagos Urban Boutique' }));
          }}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-mono-luxury uppercase tracking-wider font-bold transition-all ${
            activeTab === 'boutique'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>2. Boutique (Ready-Made)</span>
        </button>
      </div>

      {/* Upload Box */}
      <div className="max-w-2xl mx-auto p-8 rounded-3xl surface-card shadow-2xl">
        
        {submitted && uploadedProduct ? (
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-3xl font-normal text-[var(--text-primary)]">
                Garment Published Live!
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                <strong>{uploadedProduct.name}</strong> is now live in the store and ready for 3D virtual try-on.
              </p>
            </div>

            {/* Live Card Preview */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-emerald-500/30 flex items-center gap-4 text-left max-w-md mx-auto">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                <Image src={uploadedProduct.imageUrl} alt={uploadedProduct.name} fill className="object-cover" />
              </div>
              <div>
                <div className="text-[10px] font-mono-luxury text-[var(--gold-accent)] uppercase">{uploadedProduct.vendorName}</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{uploadedProduct.name}</div>
                <div className="text-xs font-editorial font-bold text-emerald-500 mt-0.5">₦{uploadedProduct.price.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-wider text-xs font-bold hover:opacity-90 transition-all"
              >
                Try on Model in Studio
              </Link>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono-luxury uppercase tracking-wider text-xs font-bold hover:border-[var(--border-hover)] transition-all"
              >
                Upload Another Garment
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {activeTab === 'designer' ? 'Upload Bespoke / Handmade Piece' : 'Upload Ready-Made Boutique Item'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
                {activeTab === 'designer'
                  ? 'List Senator tops, bespoke Ankara gowns, or Agbada with custom tailoring sizes.'
                  : 'List baggy hoodies, denim jeans, graphic tees, or cargo pants.'}
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Designer / Brand Name */}
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Brand / Atelier Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  placeholder="e.g. Kolawole Bespoke Tailors"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              {/* Garment Title */}
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Garment Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={activeTab === 'designer' ? 'e.g. Royal Emerald Senator Kaftan' : 'e.g. Heavyweight Baggy Denim Jeans'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              {/* Category, Gender, and Price in 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as GarmentCategory })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  >
                    <option value="tops">Top / Senator / Shirt</option>
                    <option value="bottoms">Trouser / Jeans / Skirt</option>
                    <option value="outerwear">Agbada / Jacket / Robe</option>
                    <option value="footwear">Shoes / Leather Slides</option>
                    <option value="accessories">Fila Cap / Accessory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.genderTarget}
                    onChange={(e) => setFormData({ ...formData, genderTarget: e.target.value as GenderTarget })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  >
                    <option value="male">Men</option>
                    <option value="female">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Price (₦ Naira)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Product Image URL (High Definition)
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                />
              </div>

              {/* Fabric & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    value={formData.fabricComposition}
                    onChange={(e) => setFormData({ ...formData, fabricComposition: e.target.value })}
                    placeholder="e.g. 100% Cashmere Wool"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Senator, Native, Bespoke"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase tracking-widest font-bold text-xs hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Publish Garment Live to Store</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
