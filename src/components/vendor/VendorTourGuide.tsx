'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2,
  UploadCloud, PackageCheck, ShieldCheck, MessageSquare,
  BarChart3, Building, LayoutDashboard
} from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

interface TourStep {
  targetId: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  category: string;
  description: string;
  keyAction: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  preferredPlacement: 'right' | 'bottom';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-nav-overview',
    stepNumber: 1,
    totalSteps: 8,
    title: 'Overview (Your Store at a Glance)',
    category: 'Home Base',
    description:
      'This is your main dashboard. Every time you log in, you will see how many orders are waiting for you to pack, how much money is currently in your escrow balance, and how many of your products are live.',
    keyAction: 'Check this page daily to see your incoming sales and pending tasks.',
    icon: LayoutDashboard,
    accentColor: 'text-amber-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-publish',
    stepNumber: 2,
    totalSteps: 8,
    title: 'Add Product (Upload Your Items)',
    category: 'Product Uploads',
    description:
      'Click here whenever you have new clothes, shoes, or accessories to sell. Upload bright, clear photos, write your price in Naira, pick available sizes, and click Publish. Immediately, buyers across all 36 states can see and order your items.',
    keyAction: 'Upload clear photos and accurate measurements so buyers order the right size.',
    icon: UploadCloud,
    accentColor: 'text-amber-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-stories',
    stepNumber: 3,
    totalSteps: 8,
    title: 'Drop Stories (Like WhatsApp Status)',
    category: 'Customer Engagement',
    description:
      'Just like WhatsApp or Instagram status! Post short behind-the-scenes clips of your tailors sewing, new fabric arriving, or finished clothes on a mannequin. Shoppers love seeing your craftsmanship, and stories bring in fast orders.',
    keyAction: 'Post a 15-second video whenever you finish a new design to get buyers excited.',
    icon: Sparkles,
    accentColor: 'text-[var(--gold-accent)]',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-orders',
    stepNumber: 4,
    totalSteps: 8,
    title: 'Orders to Pack & Send',
    category: 'Fulfillment & Dispatch',
    description:
      'When a customer buys your piece, the order appears right here. You will see what they ordered and their delivery details. Ìrísí automatically generates the courier waybill. Just print it, paste it on the parcel, and hand it to the dispatch rider when they arrive.',
    keyAction: 'Pack and dispatch within 24 to 48 hours to maintain a high store rating.',
    icon: PackageCheck,
    accentColor: 'text-sky-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-settlements',
    stepNumber: 5,
    totalSteps: 8,
    title: 'Settlements & Bank Payouts',
    category: 'Getting Your Money',
    description:
      'This is where your money lands! When a customer places an order, their money is safely held in 100% Escrow. Once the rider delivers the parcel to the customer, your money is released straight into your Nigerian bank account. No fake transfer alerts, no stories.',
    keyAction: 'Add your 10-digit NUBAN bank account number here so payouts land automatically.',
    icon: ShieldCheck,
    accentColor: 'text-emerald-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-direct-sales',
    stepNumber: 6,
    totalSteps: 8,
    title: 'Direct Sales Assistant (WhatsApp & In-Store POS)',
    category: 'Close Customers Anywhere',
    description:
      'Do you have customers bargaining with you in your WhatsApp DMs or walking into your physical boutique? Use this tool to create an instant payment link or QR code. Send the link to the customer, they pay with their card or bank transfer, and the sale is recorded instantly.',
    keyAction: 'Use this for walk-in buyers and Instagram DMs so you never lose a sale.',
    icon: MessageSquare,
    accentColor: 'text-purple-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-reports',
    stepNumber: 7,
    totalSteps: 8,
    title: 'Reports & Sales Analytics',
    category: 'Business Growth',
    description:
      'Want to know how much profit you made this week or month? This page shows your total sales, your best-selling designs, and which styles customers are buying the most.',
    keyAction: 'Use reports to know which clothes to make more of and restock.',
    icon: BarChart3,
    accentColor: 'text-indigo-500',
    preferredPlacement: 'right'
  },
  {
    targetId: 'tour-nav-atelier',
    stepNumber: 8,
    totalSteps: 8,
    title: 'Store Profile & Workshop Address',
    category: 'Your Public Brand Window',
    description:
      'This is your official store setup. Set your brand name, logo, shop bio, and your workshop address where delivery couriers will come to pick up parcels. You can also view how your store looks to shoppers on Ìrísí.',
    keyAction: 'Make sure your workshop address and phone number are always correct.',
    icon: Building,
    accentColor: 'text-rose-500',
    preferredPlacement: 'right'
  }
];

const STORAGE_KEY = 'irisi_vendor_tour_completed_v5';

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

  // First-time visitor invite toast (theme-aware, never blocks the screen)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed && controlledIsOpen === undefined) {
      const timer = setTimeout(() => {
        setShowInviteToast(true);
      }, 1500);
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
  const padding = 6;

  // Compute tooltip placement
  const isDesktop = windowSize.width >= 1024;
  let tooltipStyle: React.CSSProperties = {};
  let arrowDirection: 'left' | 'top' | 'none' = 'none';

  if (targetRect && isDesktop) {
    const tooltipWidth = 420;
    const tooltipHeight = 280;

    if (step.preferredPlacement === 'right') {
      // Position cleanly to the right of the sidebar
      const idealLeft = targetRect.left + targetRect.width + padding + 18;
      const idealTop = Math.max(
        30,
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
      // Position below the element
      const idealTop = targetRect.top + targetRect.height + padding + 18;
      const idealLeft = Math.max(
        30,
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
      {/* ── 1. THEME-AWARE FLOATING INVITE TOAST (Matches Light & Dark Mode) ── */}
      <AnimatePresence>
        {showInviteToast && !tourActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl surface-card bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--gold-accent)]/60 shadow-2xl max-w-sm flex items-center justify-between gap-3 select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/40 flex items-center justify-center text-[var(--gold-accent)] shrink-0">
                <IrisiIcon size={20} variant="gold" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                  New to Ìrísí Atelier?
                </span>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                  Take a 1-minute guided tour?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleStartTour}
                className="px-3.5 py-1.5 rounded-full bg-[var(--gold-accent)] text-black text-xs font-mono-luxury font-bold uppercase hover:opacity-90 transition-all shadow-md cursor-pointer whitespace-nowrap"
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
                fill="rgba(0, 0, 0, 0.76)"
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
                className="fixed z-[9992] pointer-events-none rounded-2xl border-2 border-[var(--gold-accent)] ring-4 ring-[var(--gold-accent)]/30 shadow-[0_0_35px_rgba(212,175,55,0.85)]"
              />
            )}

            {/* Theme-Aware Anchored Tooltip Card with Directional Arrow */}
            <div className={isDesktop ? '' : 'fixed bottom-6 inset-x-4 max-w-lg mx-auto z-[9995]'}>
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.25 }}
                style={isDesktop ? tooltipStyle : {}}
                className="pointer-events-auto surface-card bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--gold-accent)]/60 shadow-2xl rounded-3xl p-6 z-[9995] space-y-4 relative"
              >
                
                {/* Arrow Pointer Pointing at the Target Element (Desktop only) */}
                {isDesktop && arrowDirection === 'left' && (
                  <div
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[12px] border-r-[var(--gold-accent)]"
                  />
                )}
                {isDesktop && arrowDirection === 'top' && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[12px] border-b-[var(--gold-accent)]"
                  />
                )}

                {/* Tooltip Header: Step Counter & Close */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/40 flex items-center justify-center text-[var(--gold-accent)]">
                      <IrisiIcon size={16} variant="gold" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                        Step {step.stepNumber} of {step.totalSteps}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono-luxury uppercase">
                        {step.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
                    title="Close tour"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Step Title & Main Explanation in Simple English */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                      <StepIcon className={`h-5 w-5 ${step.accentColor}`} />
                    </div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)] leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] font-normal leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Key Action Callout Box */}
                <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
                  <span className="text-[var(--gold-accent)] font-bold shrink-0">📌 What to do here:</span>
                  <span className="font-medium text-[var(--text-primary)] leading-snug">{step.keyAction}</span>
                </div>

                {/* Bottom Navigation Controls */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                  
                  {/* Step Progress Dots */}
                  <div className="flex items-center gap-1.5">
                    {TOUR_STEPS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentStepIndex(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === currentStepIndex ? 'w-6 bg-[var(--gold-accent)]' : 'w-2 bg-[var(--border-subtle)] hover:bg-[var(--gold-accent)]/50'
                        }`}
                        title={`Go to step ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Back / Next Buttons (Clean, concise, never wraps) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-3.5 py-2 rounded-full border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 rounded-full bg-[var(--gold-accent)] hover:opacity-90 text-black text-xs font-mono-luxury uppercase font-bold tracking-wider transition-all shadow-lg cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      {isLast ? (
                        <>
                          <span>Done</span>
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
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
