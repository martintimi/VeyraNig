'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Product } from '@/types';
import Image from 'next/image';
import {
  Sparkles, Download, Copy, Check, Send,
  CheckCircle2, Smartphone, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DirectSalesAssistantPage() {
  const { allProducts, vendorProfile } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>('top-senator-black');
  const [customerName, setCustomerName] = useState<string>('Emeka');
  const [customNote, setCustomNote] = useState<string>('Free Lagos Island dispatch included today');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<boolean>(false);

  const activeProduct = allProducts.find(p => p.id === selectedProductId) || allProducts[0];
  const productLink = typeof window !== 'undefined' ? `${window.location.origin}/shop/${activeProduct.id}` : `https://veyra.ng/shop/${activeProduct.id}`;
  const generatedMessage = `Hi ${customerName || 'there'}! ✨ Thanks for reaching out about the ${activeProduct.name} (₦${activeProduct.price.toLocaleString()}).\n\nTo see how this fits your exact body measurements in 3D and order with 24h Lagos delivery, tap this direct link: ${productLink}\n\n${customNote ? `Note: ${customNote}` : ''}`;

  // Genuine client-side image generation and download using HTML5 canvas
  const downloadBrandedCard = async (product: Product) => {
    try {
      setIsDownloading(true);

      // Automatically copy direct checkout link to clipboard on download
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(productLink);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = product.imageUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => {
          const fallback = new window.Image();
          fallback.src = product.imageUrl;
          fallback.onload = () => resolve();
          fallback.onerror = () => reject(new Error('Image failed to load'));
        };
      });

      // 1080 x 1350 High-Definition Portrait Card
      canvas.width = 1080;
      canvas.height = 1350;

      // Draw product photo
      ctx.drawImage(img, 0, 0, 1080, 1350);

      // Draw bottom luxury gradient overlay
      const gradient = ctx.createLinearGradient(0, 850, 0, 1350);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.35, 'rgba(10, 10, 10, 0.88)');
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 800, 1080, 550);

      // 1. Top Left Atelier Brand Crest Badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(50, 50, 420, 68, 34);
      ctx.fill();
      ctx.strokeStyle = 'rgba(230, 195, 103, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#e6c367';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(vendorProfile.brandName.toUpperCase(), 80, 93);

      // 2. Top Right VEYRA Signature Logo & 3D Atelier Watermark Badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(740, 50, 290, 68, 34);
      ctx.fill();
      ctx.strokeStyle = 'rgba(230, 195, 103, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Veyra Brand text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px serif';
      ctx.fillText('VEYRA', 775, 93);

      ctx.fillStyle = '#e6c367';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('● 3D ATELIER', 885, 92);

      // 3. Bottom Product Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 46px serif';
      ctx.fillText(product.name, 50, 1140);

      // 4. Bottom Price Tag
      ctx.fillStyle = '#e6c367';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(`₦${product.price.toLocaleString()}`, 50, 1210);

      // 5. Bottom Veyra 3D Sizing & Delivery Tag
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('● 3D Virtual Fit & 24h Lagos Dispatch · veyra.ng', 50, 1270);

      // Trigger Instant Browser Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `veyra-${vendorProfile.brandName.toLowerCase().replace(/\s+/g, '-')}-${product.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadToast(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => setDownloadToast(false), 4000);
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold-accent)] animate-pulse" />
            <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
              Direct Sales Suite
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Direct Sales & Social Order Assistant
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1 max-w-2xl">
            Generate high-resolution branded lookbook cards with Veyra watermarks and 1-tap direct checkout links to close customer sales across Instagram, WhatsApp, and messaging in seconds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-mono-luxury font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Direct Checkout Enabled</span>
          </span>
        </div>
      </div>

      {/* 1. SELECT GARMENT SELECTOR */}
      <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-3">
        <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
          Step 1: Select Garment from Your Catalog
        </span>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allProducts.slice(0, 8).map((p) => {
            const isSelected = selectedProductId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 shrink-0 ${
                  isSelected
                    ? 'bg-[var(--gold-subtle)]/40 border-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                  <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
                </div>
                <div className="pr-2">
                  <div className="font-bold text-xs text-[var(--text-primary)] max-w-[140px] truncate">{p.name}</div>
                  <div className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold">₦{p.price.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DUAL TOOLKIT: VISUAL STATUS CARD + DM CLOSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 5 COLS: AUTO-BRANDED STATUS PHOTO (VISUAL FIRST) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
              Branded Lookbook Card
            </span>
            <span className="text-[10px] font-mono-luxury text-emerald-500 font-bold">● High Resolution</span>
          </div>

          {/* The Generated Status Card with Bottom Luxury Bar */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group select-none">
            <Image
              src={activeProduct.imageUrl}
              alt={activeProduct.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Luxury Top Left Atelier Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20">
              <span className="text-[10px] font-mono-luxury uppercase font-bold text-amber-300">
                {vendorProfile.brandName}
              </span>
            </div>

            {/* Luxury Top Right VEYRA Logo Watermark */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[var(--gold-accent)]/60 shadow-lg">
              <span className="font-editorial text-xs font-bold text-white tracking-wider">
                VEYRA
              </span>
              <span className="text-[9px] font-mono-luxury font-bold text-[var(--gold-accent)]">
                ● 3D ATELIER
              </span>
            </div>

            {/* Bottom Luxury Overlay Bar Embedded on Photo */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/90 backdrop-blur-md border border-white/15 flex items-center justify-between">
              <div className="truncate">
                <h4 className="font-editorial text-xs font-bold text-white truncate">{activeProduct.name}</h4>
                <div className="text-[10px] font-mono-luxury text-amber-300 font-bold">
                  ₦{activeProduct.price.toLocaleString()} · <span className="text-emerald-400">3D Fit on Veyra</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black text-[9px] font-mono-luxury font-bold uppercase shrink-0">
                Tap Link to Fit
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => downloadBrandedCard(activeProduct)}
              disabled={isDownloading}
              className="w-full py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Generating High-Res Card...' : 'Download Card & Copy Link (PNG)'}</span>
            </button>

            {downloadToast && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono-luxury font-bold flex items-center justify-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Card Downloaded & Checkout Link Copied to Clipboard!</span>
              </div>
            )}

            <p className="text-[10px] font-mono-luxury text-[var(--text-muted)] text-center">
              Downloads high-res card with Veyra watermark & automatically copies the direct checkout link!
            </p>
          </div>
        </div>

        {/* RIGHT 7 COLS: 1-TAP DM CLOSER & QUICK REPLIES */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold">
              1-Tap Direct Checkout Message
            </span>
            <span className="text-[10px] font-mono-luxury text-zinc-400">Copy & Send in 1-Click</span>
          </div>

          {/* Quick Customizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Customer Name / Handle
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Emeka"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono-luxury font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                Optional Note / Perk
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Free Lagos Dispatch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Generated Message Box */}
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono-luxury leading-relaxed space-y-2">
            <div className="text-[10px] text-[var(--gold-accent)] font-bold uppercase">Ready-to-Send Order Message:</div>
            <div className="text-[var(--text-primary)] whitespace-pre-line bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
              {generatedMessage}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedMessage);
                setCopied(true);
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
                setTimeout(() => setCopied(false), 3000);
              }}
              className="py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Order Message Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[var(--gold-accent)]" />
                  <span>Copy Message & Link</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generatedMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono-luxury uppercase text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4 text-black" />
              <span>Open Direct Chat</span>
            </a>
          </div>

          {/* 3 Common Direct Message Objection Busters */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
              1-Tap Quick Scripts (Click to Copy):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-luxury">
              <button
                onClick={() => {
                  const text = `We have an exact 3D body twin tool that tests your chest and shoulder measurements in 5 seconds! Tap: ${productLink}`;
                  navigator.clipboard.writeText(text);
                  confetti({ particleCount: 20, spread: 40 });
                }}
                className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-left truncate text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                📏 &quot;Will this size fit me?&quot;
              </button>

              <button
                onClick={() => {
                  const text = `You can pay securely via debit card or direct bank transfer into our escrow account: ${productLink}`;
                  navigator.clipboard.writeText(text);
                  confetti({ particleCount: 20, spread: 40 });
                }}
                className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-left truncate text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                💳 &quot;How do I pay?&quot;
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
