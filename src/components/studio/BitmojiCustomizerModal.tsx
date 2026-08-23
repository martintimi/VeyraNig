'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { BodyProfile, HairStyle, FacialHair } from '@/types';
import { Sparkles, X, Check, User, Scissors, Palette, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import BitmojiAvatar from './BitmojiAvatar';

interface BitmojiCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const skinTones = [
  { label: 'Deep Espresso', hex: '#2b1d16' },
  { label: 'Rich Cocoa', hex: '#3d2314' },
  { label: 'Golden Bronze', hex: '#5c3a21' },
  { label: 'Warm Chestnut', hex: '#7c4a2d' },
  { label: 'Caramel Honey', hex: '#a06a44' },
  { label: 'Warm Sand', hex: '#c69062' },
];

const hairStylesList: { id: HairStyle; label: string; gender: 'male' | 'female' | 'both' }[] = [
  { id: 'waves_fade', label: '360 Waves & Low Fade', gender: 'male' },
  { id: 'afro_taper', label: 'Tapered Afro Curls', gender: 'both' },
  { id: 'locs', label: 'Shoulder Dreadlocks', gender: 'both' },
  { id: 'cornrows', label: 'Straight-Back Cornrows', gender: 'both' },
  { id: 'high_fade', label: 'High Top Box Fade', gender: 'male' },
  { id: 'braids', label: 'Goddess Box Braids', gender: 'female' },
  { id: 'afro_puff', label: 'High Afro Puff & Edges', gender: 'female' },
  { id: 'buzzcut', label: 'Clean Razor Buzzcut', gender: 'both' },
];

const hairColors = [
  { label: 'Jet Black', hex: '#0a0a0a' },
  { label: 'Dark Chocolate', hex: '#271810' },
  { label: 'Honey Blonde', hex: '#d4af37' },
  { label: 'Platinum Gold', hex: '#e2e8f0' },
  { label: 'Rich Auburn', hex: '#7c2d12' },
];

const facialBeards: { id: FacialHair; label: string }[] = [
  { id: 'clean', label: 'Clean Shaven' },
  { id: 'goatee', label: 'Crisp Sharp Goatee' },
  { id: 'full_beard', label: 'Full Tailored Beard' },
  { id: 'stubble', label: 'Lineup Stubble' },
  { id: 'mustache', label: 'Classic Mustache' },
];

export default function BitmojiCustomizerModal({ isOpen, onClose }: BitmojiCustomizerModalProps) {
  const { bodyProfile, setBodyProfile, activeOutfit } = useStore();

  const [tempProfile, setTempProfile] = useState<BodyProfile>({
    ...bodyProfile,
    skinToneHex: bodyProfile.skinToneHex || '#3d2314',
    hairStyle: bodyProfile.hairStyle || 'waves_fade',
    hairColor: bodyProfile.hairColor || '#0a0a0a',
    facialHair: bodyProfile.facialHair || 'goatee',
  });

  const [activeCategory, setActiveCategory] = useState<'skin' | 'hair' | 'beard' | 'body'>('skin');

  if (!isOpen) return null;

  const handleSave = () => {
    setBodyProfile(tempProfile);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl surface-card rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[90vh] max-h-[700px] animate-fadeIn">
        
        {/* Left Side: Live Bitmoji Avatar Canvas Stage */}
        <div className="w-full lg:w-1/2 bg-[var(--bg-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] p-6 flex flex-col items-center justify-between relative overflow-hidden">
          
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono-luxury uppercase tracking-wider font-bold text-[var(--text-primary)]">
                3D Bitmoji Studio
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/20 text-[10px] font-mono-luxury font-bold">
              Live Snap Engine
            </span>
          </div>

          {/* Interactive Avatar Preview */}
          <div className="relative w-full h-[360px] lg:h-[440px] flex items-center justify-center my-auto">
            <BitmojiAvatar profile={tempProfile} outfit={activeOutfit} />
          </div>

          <div className="text-[11px] font-mono-luxury text-[var(--text-muted)] text-center">
            Stylized clothes auto-drape over your custom hairstyle & body build
          </div>

        </div>

        {/* Right Side: Customization Tool Panel */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Header & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  Customize 3D Body Twin
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-0.5">
                  Snapchat Bitmoji-Style Character Customizer
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--badge-bg)] text-[var(--text-secondary)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customization Category Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider text-center">
              <button
                onClick={() => setActiveCategory('skin')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeCategory === 'skin'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Skin
              </button>
              <button
                onClick={() => setActiveCategory('hair')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeCategory === 'hair'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Hair
              </button>
              <button
                onClick={() => setActiveCategory('beard')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeCategory === 'beard'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Beard
              </button>
              <button
                onClick={() => setActiveCategory('body')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeCategory === 'body'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Build
              </button>
            </div>

            {/* CATEGORY 1: SKIN TONES */}
            {activeCategory === 'skin' && (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                  Select Skin Tone:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.hex}
                      onClick={() => setTempProfile({ ...tempProfile, skinToneHex: tone.hex })}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        tempProfile.skinToneHex === tone.hex
                          ? 'border-[var(--gold-accent)] ring-2 ring-[var(--gold-accent)]/40 bg-[var(--bg-secondary)]'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <div
                        className="h-10 w-10 rounded-full shadow-md border border-white/20"
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className="text-[11px] font-mono-luxury font-bold text-[var(--text-primary)] text-center">
                        {tone.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 2: HAIRSTYLE & COLOR */}
            {activeCategory === 'hair' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Hair Color Bar */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                    Hair Color:
                  </span>
                  <div className="flex items-center gap-3">
                    {hairColors.map((hc) => (
                      <button
                        key={hc.hex}
                        onClick={() => setTempProfile({ ...tempProfile, hairColor: hc.hex })}
                        className={`h-9 w-9 rounded-full border-2 transition-transform ${
                          tempProfile.hairColor === hc.hex
                            ? 'border-[var(--gold-accent)] scale-110 shadow-lg'
                            : 'border-[var(--border-subtle)]'
                        }`}
                        style={{ backgroundColor: hc.hex }}
                        title={hc.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hairstyles Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                    Hair Style & Texture:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {hairStylesList.map((hs) => (
                      <button
                        key={hs.id}
                        onClick={() => setTempProfile({ ...tempProfile, hairStyle: hs.id })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          tempProfile.hairStyle === hs.id
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold border-transparent shadow-md'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        <span className="text-xs font-mono-luxury block truncate">{hs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* CATEGORY 3: FACIAL HAIR / BEARD */}
            {activeCategory === 'beard' && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold block">
                  Facial Hair & Lineup:
                </span>
                <div className="space-y-2">
                  {facialBeards.map((fb) => (
                    <button
                      key={fb.id}
                      onClick={() => setTempProfile({ ...tempProfile, facialHair: fb.id })}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        tempProfile.facialHair === fb.id
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold border-transparent shadow-md'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <span className="text-xs font-mono-luxury">{fb.label}</span>
                      {tempProfile.facialHair === fb.id && <Check className="h-4 w-4 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 4: BODY BUILD & STATS */}
            {activeCategory === 'body' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                      Height: {tempProfile.heightCm} cm
                    </label>
                    <input
                      type="range"
                      min={150}
                      max={210}
                      value={tempProfile.heightCm}
                      onChange={(e) => setTempProfile({ ...tempProfile, heightCm: Number(e.target.value) })}
                      className="w-full accent-[var(--gold-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                      Weight: {tempProfile.weightKg} kg
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={125}
                      value={tempProfile.weightKg}
                      onChange={(e) => setTempProfile({ ...tempProfile, weightKg: Number(e.target.value) })}
                      className="w-full accent-[var(--gold-accent)]"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] font-bold">
                    Body Build Silhouette:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['athletic', 'hourglass', 'rectangular', 'pear'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setTempProfile({ ...tempProfile, bodyShape: shape })}
                        className={`p-3 rounded-2xl border text-center capitalize text-xs font-mono-luxury transition-all ${
                          tempProfile.bodyShape === shape
                            ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] text-[var(--gold-accent)] font-bold'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-1/2 py-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase text-[var(--text-primary)] font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-1/2 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-mono-luxury uppercase font-bold hover:opacity-90 transition-all shadow-xl"
            >
              Save 3D Body Twin
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
