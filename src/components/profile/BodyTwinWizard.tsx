'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { BodyShape, FitPreference, SkinTone } from '@/types';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, SlidersHorizontal, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BodyTwinWizard() {
  const {
    bodyProfile,
    setBodyProfile,
    isProfileWizardOpen,
    setIsProfileWizardOpen
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: bodyProfile.name || 'Tunde Balogun',
    heightCm: bodyProfile.heightCm || 180,
    weightKg: bodyProfile.weightKg || 78,
    gender: bodyProfile.gender || 'male',
    bodyShape: bodyProfile.bodyShape || ('athletic' as BodyShape),
    fitPreference: bodyProfile.fitPreference || ('tailored' as FitPreference),
    skinTone: bodyProfile.skinTone || ('deep' as SkinTone),
    chestCm: bodyProfile.chestCm || 102,
    waistCm: bodyProfile.waistCm || 84,
    hipsCm: bodyProfile.hipsCm || 100,
    inseamCm: bodyProfile.inseamCm || 84,
    shoulderWidthCm: bodyProfile.shoulderWidthCm || 46,
  });

  const [isSavedCelebration, setIsSavedCelebration] = useState(false);

  if (!isProfileWizardOpen) return null;

  const handleSave = () => {
    const twinId = `VY-NIG-${Math.floor(100 + Math.random() * 900)}`;
    setBodyProfile({
      ...formData,
      twinId,
      isInitialized: true,
    });

    setIsSavedCelebration(true);
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#e6c367', '#10b981', '#ffffff']
    });

    setTimeout(() => {
      setIsSavedCelebration(false);
      setIsProfileWizardOpen(false);
    }, 1200);
  };

  const bodyShapes: { id: BodyShape; label: string; desc: string }[] = [
    { id: 'athletic', label: 'Athletic / V-Cut', desc: 'Broad shoulders & tapered waist for Senator fits' },
    { id: 'hourglass', label: 'Contoured / Curvy', desc: 'Balanced shoulders & hips with defined waist' },
    { id: 'rectangular', label: 'Straight / Regular', desc: 'Even proportion from shoulders to waist' },
    { id: 'pear', label: 'Relaxed / Broad Hips', desc: 'Roomier fit around hips & thighs' },
  ];

  const fitPreferences: { id: FitPreference; label: string; desc: string }[] = [
    { id: 'tailored', label: 'Senator Tailored', desc: 'Crisp structured drape, sharp shoulder lines' },
    { id: 'relaxed', label: 'Relaxed / Agbada Flow', desc: 'Breezy and comfortable for all-day events' },
    { id: 'skinny', label: 'Fitted', desc: 'Contoured closely to your frame' },
    { id: 'oversized', label: 'Streetwear Oversized', desc: 'Drop shoulders & roomier boxy cut' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold-subtle)] text-[var(--gold-accent)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Set Your Body Fit (Takes 30 Sec)
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Enter your details once so you never have to guess sizes again.</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileWizardOpen(false)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 border-b border-[var(--border-subtle)] text-xs font-mono-luxury uppercase tracking-wider">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-4 text-center border-r border-[var(--border-subtle)] transition-colors ${
              step === 1 ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold border-b-2 border-[var(--gold-accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            1. Your Measurements
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 px-4 text-center transition-colors ${
              step === 2 ? 'bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold border-b-2 border-[var(--gold-accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            2. Fit Style
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Basic Stats */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                  placeholder="e.g. Tunde Balogun"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">e.g. 175cm = 5ft 9in</span>
                </div>
                <div>
                  <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-accent)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">e.g. 75 - 85 kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-2">Body Build Archetype</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {bodyShapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setFormData({ ...formData, bodyShape: shape.id })}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        formData.bodyShape === shape.id
                          ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] shadow-sm'
                          : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[var(--text-primary)]">{shape.label}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-light mt-0.5">{shape.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fit Preference & Quick Save */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] mb-2">How Do You Like Your Clothes To Fit?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {fitPreferences.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => setFormData({ ...formData, fitPreference: pref.id })}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        formData.fitPreference === pref.id
                          ? 'bg-[var(--gold-subtle)] border-[var(--gold-accent)] shadow-sm'
                          : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[var(--text-primary)]">{pref.label}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-light mt-0.5">{pref.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready Confirmation */}
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">Ready for 100% Fit Predictions</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">All Senator sets and native wear will auto-calculate your exact size.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          {step > 1 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono-luxury uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-subtle)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-mono-luxury uppercase tracking-wider font-semibold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-all"
            >
              Next Step
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSavedCelebration}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full text-xs font-mono-luxury uppercase tracking-wider font-bold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-all"
            >
              {isSavedCelebration ? (
                <>
                  <Check className="h-4 w-4" />
                  Profile Ready!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" />
                  Save & Activate
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
