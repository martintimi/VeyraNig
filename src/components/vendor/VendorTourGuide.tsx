'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2,
  UploadCloud, PackageCheck, ShieldCheck, MessageSquare
} from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

interface TourStep {
  targetId: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  tagline: string;
  description: string;
  proTip: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  preferredPlacement: 'right' | 'bottom' | 'top';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-nav-publish',
    stepNumber: 1,
    totalSteps: 4,
    title: 'Drop Your Heat',
    tagline: 'Upload your pieces & set your price in Naira.',
    description:
      'Got a fresh Senator cut, 480GSM hoodie, or handmade slides ready? Click here to upload photos, set sizes, and launch to buyers nationwide.',
    proTip: 'Clear chest and waist measurements mean zero return wahala.',
    icon: UploadCloud,
    accentColor: 'text-amber-400',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-orders',
    stepNumber: 2,
    totalSteps: 4,
    title: 'Your Orders & Packing Board',
    tagline: 'Automated waybills, zero motor park arguments.',
    description:
      'When an order drops, Ìrísí generates your courier waybill right here. Just fold the drip, stick the waybill on the package, and hand it to the rider.',
    proTip: 'Dispatch within 24–48 hours to keep your Top Atelier ranking.',
    icon: PackageCheck,
    accentColor: 'text-sky-400',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-stats-escrow',
    stepNumber: 3,
    totalSteps: 4,
    title: '100% Escrow & Bank Payouts',
    tagline: 'Zero stories. Money drops directly to your bank.',
    description:
      'No customer can say "Aunty I transferred, bank network held it". Customer money is locked in Escrow before you cut fabric, then settles straight to your bank after delivery.',
    proTip: 'Verify your 10-digit NUBAN under Settlements for automated payouts.',
    icon: ShieldCheck,
    accentColor: 'text-emerald-400',
    preferredPlacement: 'bottom'
  },
  {
    targetId: 'tour-nav-direct-sales',
    stepNumber: 4,
    totalSteps: 4,
    title: 'Direct Sales & WhatsApp POS',
    tagline: 'Close Instagram DMs & walk-in buyers in 10 seconds.',
    description:
      'Customer bargaining in your WhatsApp DMs or standing inside your physical shop? Generate an instant escrow payment link or QR code so they pay via transfer or card on the spot.',
    proTip: 'Direct sales links also include 100% escrow protection and automated shipping.',
    icon: MessageSquare,
    accentColor: 'text-purple-400',
    preferredPlacement: 'right'
  }
];

const STORAGE_KEY = 'irisi_vendor_tour_v3_dismissed';

interface VendorTourGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function VendorTourGuide({ isOpen: controlledIsOpen, onClose: controlledOnClose }: VendorTourGuideProps = {}) {
  const [tourActive, setTourActive] = useState(false);
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Position coordinates of active spotlight target
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Handle controlled opening from "Tour Guide" button in header
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      if (controlledIsOpen) {
        setTourActive(true);
        setCurrentStepIndex(0);
      } else {
        setTourActive(false);
      }
    }
  }, [controlledIsOpen]);

  // First-time visitor invite pill (unobtrusive, never blocks screen)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed && controlledIsOpen === undefined) {
      const timer = setTimeout(() => {
        setShowInviteToast(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [controlledIsOpen]);

  // Track target element coordinates and smoothly scroll to it
  const updateTargetRect = useCallback(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[currentStepIndex];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setTargetRect(null);
    }
  }, [tourActive, currentStepIndex]);

  // When step changes, smoothly scroll element into center view
  useEffect(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[currentStepIndex];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Short timeout to let smooth scroll finish before measuring final position
      const t = setTimeout(() => {
        updateTargetRect();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [tourActive, currentStepIndex, updateTargetRect]);

  // Keep target rect updated on window resize or scroll
  useEffect(() => {
    if (!tourActive) return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateTargetRect();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [tourActive, updateTargetRect]);

  const handleStartTour = () => {
    setShowInviteToast(false);
    setTourActive(true);
    setCurrentStepIndex(0);
  };

  const handleDismissInvite = () => {
    setShowInviteToast(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const handleCloseTour = useCallback(() => {
    setTourActive(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    if (controlledOnClose) {
      controlledOnClose();
    }
  }, [controlledOnClose]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleCloseTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!tourActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseTour();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tourActive, currentStepIndex, handleCloseTour]);

  const step = TOUR_STEPS[currentStepIndex];
  const StepIcon = step?.icon || Sparkles;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  // Spotlight padding around the target
  const padding = 8;

  // Compute tooltip position relative to spotlight target
  const isDesktop = windowSize.width >= 1024;
  let tooltipStyle: React.CSSProperties = {};
  let arrowDirection: 'left' | 'top' | 'none' = 'none';

  if (targetRect && isDesktop) {
    const tooltipWidth = 350;
    const tooltipHeight = 220;

    if (step.preferredPlacement === 'right') {
      // Position to the right of the target (e.g. sidebar link)
      const idealLeft = targetRect.left + targetRect.width + padding + 16;
      const idealTop = Math.max(
        20,
        Math.min(
          targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          windowSize.height - tooltipHeight - 30
        )
      );
      tooltipStyle = {
        position: 'fixed',
        top: idealTop,
        left: idealLeft,
        width: tooltipWidth
      };
      arrowDirection = 'left';
    } else {
      // Position below the target (e.g. escrow card)
      const idealTop = targetRect.top + targetRect.height + padding + 16;
      const idealLeft = Math.max(
        20,
        Math.min(
          targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          windowSize.width - tooltipWidth - 30
        )
      );
      tooltipStyle = {
        position: 'fixed',
        top: idealTop,
        left: idealLeft,
        width: tooltipWidth
      };
      arrowDirection = 'top';
    }
  }

  return (
    <>
      {/* ── 1. UNOBTRUSIVE FLOATING INVITE TOAST (Bottom-Right, Never Blocks Screen) ── */}
      <AnimatePresence>
        {showInviteToast && !tourActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl surface-card border border-[var(--gold-accent)]/50 shadow-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] max-w-sm flex items-center justify-between gap-3 select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)] shrink-0">
                <IrisiIcon size={18} variant="gold" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                  New to Ìrísí?
                </span>
                <p className="text-xs font-editorial font-bold truncate">
                  Take a 30s spotlight tour?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleStartTour}
                className="px-3.5 py-1.5 rounded-full bg-[var(--gold-accent)] text-black text-[11px] font-mono-luxury font-bold uppercase hover:opacity-90 transition-all shadow-sm cursor-pointer"
              >
                Start
              </button>
              <button
                type="button"
                onClick={handleDismissInvite}
                className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. LIVE SPOTLIGHT OVERLAY WITH SVG CUTOUT MASK ── */}
      <AnimatePresence>
        {tourActive && (
          <div className="fixed inset-0 z-[9990] select-none pointer-events-none">
            
            {/* SVG Dark Backdrop with Animated Cutout Hole */}
            <svg className="fixed inset-0 w-full h-full pointer-events-auto">
              <defs>
                <mask id="spotlight-cutout-mask">
                  {/* White background: dark overlay will show here */}
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {/* Black cutout: dark overlay becomes 100% transparent here */}
                  {targetRect && (
                    <motion.rect
                      initial={false}
                      animate={{
                        x: targetRect.left - padding,
                        y: targetRect.top - padding,
                        width: targetRect.width + padding * 2,
                        height: targetRect.height + padding * 2,
                        rx: 14
                      }}
                      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                      fill="black"
                    />
                  )}
                </mask>
              </defs>

              {/* Dimmed backdrop covering screen with hole cut out */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.72)"
                mask="url(#spotlight-cutout-mask)"
                onClick={handleCloseTour}
                className="cursor-pointer"
              />
            </svg>

            {/* Glowing Golden Ring Gliding Around the Live Target Element */}
            {targetRect && (
              <motion.div
                initial={false}
                animate={{
                  top: targetRect.top - padding,
                  left: targetRect.left - padding,
                  width: targetRect.width + padding * 2,
                  height: targetRect.height + padding * 2,
                }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed z-[9992] pointer-events-none rounded-2xl border-2 border-[var(--gold-accent)] ring-4 ring-[var(--gold-accent)]/20 shadow-[0_0_30px_rgba(212,175,55,0.7)]"
              />
            )}

            {/* Anchored Tooltip Card with Directional Arrow (Desktop: beside target | Mobile: docked bottom) */}
            <div className={isDesktop ? '' : 'fixed bottom-6 inset-x-4 max-w-md mx-auto z-[9995]'}>
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 0.25 }}
                style={isDesktop ? tooltipStyle : {}}
                className="pointer-events-auto surface-card border border-[var(--gold-accent)]/60 shadow-2xl rounded-2xl p-5 bg-[var(--bg-surface)] text-[var(--text-primary)] z-[9995] space-y-3 relative"
              >
                
                {/* Arrow Pointer Pointing at the Target Element (Desktop only) */}
                {isDesktop && arrowDirection === 'left' && (
                  <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[var(--gold-accent)]"
                  />
                )}
                {isDesktop && arrowDirection === 'top' && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-[var(--gold-accent)]"
                  />
                )}

                {/* Tooltip Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)]">
                      <IrisiIcon size={14} variant="gold" />
                    </div>
                    <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                      Spotlight {step.stepNumber} of {step.totalSteps}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    title="Close tour"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Step Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <StepIcon className={`h-4 w-4 shrink-0 ${step.accentColor}`} />
                    <h4 className="font-editorial text-base font-bold text-[var(--text-primary)] leading-tight">
                      {step.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold block">
                    {step.tagline}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Pro Tip Callout */}
                <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-[var(--gold-accent)] font-bold shrink-0">💡</span>
                  <span className="font-light">{step.proTip}</span>
                </div>

                {/* Controls */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                  
                  {/* Step Progress Dots */}
                  <div className="flex items-center gap-1.5">
                    {TOUR_STEPS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentStepIndex(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === currentStepIndex ? 'w-5 bg-[var(--gold-accent)]' : 'w-1.5 bg-[var(--border-subtle)]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Back / Next Buttons */}
                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[10px] font-mono-luxury uppercase font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        <span>Back</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-1.5 rounded-full bg-[var(--gold-accent)] hover:opacity-90 text-black text-[10px] font-mono-luxury uppercase font-bold tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {isLast ? (
                        <>
                          <span>Finish</span>
                          <CheckCircle2 className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
