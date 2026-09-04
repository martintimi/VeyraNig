'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, UploadCloud, PackageCheck, ShieldCheck,
  MessageSquare, CheckCircle2, ArrowRight, ArrowLeft,
  X, HelpCircle, ExternalLink, Flame, Gem, Truck,
  BadgeCheck
} from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

interface TourStep {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  wittyTagline: string;
  description: string;
  actionHref?: string;
  actionText?: string;
  proTip: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    badge: 'Step 1 of 5 · Command Tower',
    title: 'Welcome boss! You make the drip, Ìrísí handles the wahala.',
    wittyTagline: 'From your workshop to doorsteps nationwide.',
    description:
      'Welcome to your official Ìrísí fashion command center. Real talk: you focus on cutting fine fabrics, sewing bespoke native fits, dropping heavyweight fleece hoodies, or crafting leather mules. We take care of verified customer payments, nationwide courier dispatch, and automated escrow. Soft work!',
    proTip: 'Your brand profile is live to shoppers across all 36 states 24/7. Even while you are sleeping, your catalog is working for you.',
    icon: Sparkles,
    accentColor: 'text-[var(--gold-accent)]'
  },
  {
    id: 'publish',
    stepNumber: 2,
    badge: 'Step 2 of 5 · Catalog & Drops',
    title: 'Drop your latest heat before fabric finishes!',
    wittyTagline: 'Upload your pieces and set your price in Naira.',
    description:
      'Got a new royal Agbada, custom-milled graphic hoodie, or handcrafted slides ready? Head straight to Add Product. Upload crisp photos, set your price in Naira (₦), choose your sizes, and publish. Clean studio pictures mean faster sales — simple maths!',
    actionHref: '/vendor-portal/publish',
    actionText: 'Check Publish Page',
    proTip: 'Pro move: Include clear chest and waist measurements so customers order their exact fit with zero back-and-forth.',
    icon: UploadCloud,
    accentColor: 'text-amber-400'
  },
  {
    id: 'orders',
    stepNumber: 3,
    badge: 'Step 3 of 5 · Orders & Dispatch',
    title: 'Pack it clean, paste waybill, hand to courier. No headache.',
    wittyTagline: 'Automated delivery tracking with zero park negotiations.',
    description:
      'When an order drops, don’t stress! Ìrísí generates your automated courier waybill right here. Just iron and fold the clothes neatly, paste the printed waybill on your bag, and hand it to the rider when they arrive at your atelier. No going to motor park to argue with drivers.',
    actionHref: '/vendor-portal/orders',
    actionText: 'View Orders Board',
    proTip: 'Dispatch within 24 to 48 hours to maintain your Top Atelier badge and rank higher on the homepage.',
    icon: PackageCheck,
    accentColor: 'text-sky-400'
  },
  {
    id: 'settlements',
    stepNumber: 4,
    badge: 'Step 4 of 5 · Escrow & Banking',
    title: 'Zero stories. Money drops directly to your Nigerian bank.',
    wittyTagline: '100% Escrow security — no fake transfer screenshots.',
    description:
      'Tired of customers saying "Aunty I transferred, bank network is holding it"? With Ìrísí, customer money is locked safely in Escrow BEFORE you even cut the fabric. The moment the courier delivers and the buyer inspects the fit, your payout clears straight to your bank account. Clean and transparent.',
    actionHref: '/vendor-portal/settlements',
    actionText: 'Check Settlements & Bank',
    proTip: 'Verify your 10-digit NUBAN account number under Settlements so automatic payouts land smoothly without delays.',
    icon: ShieldCheck,
    accentColor: 'text-emerald-400'
  },
  {
    id: 'direct-sales',
    stepNumber: 5,
    badge: 'Step 5 of 5 · Secret Weapon',
    title: 'Close WhatsApp DMs and walk-in buyers in 10 seconds.',
    wittyTagline: 'Instant Escrow links for customers outside the platform.',
    description:
      'Got a serious buyer bargaining in your Instagram DMs or standing inside your physical shop? Don’t let them slip away! Use the Direct Sales Assistant to generate a 1-click payment link or QR code. They pay via card, bank transfer, or USSD on their phone in seconds flat.',
    actionHref: '/vendor-portal/direct-sales',
    actionText: 'Open Direct Sales POS',
    proTip: 'Direct sales links also enjoy 100% escrow protection and automated courier booking if the customer is outside your city.',
    icon: MessageSquare,
    accentColor: 'text-purple-400'
  }
];

const LOCAL_STORAGE_KEY = 'irisi_vendor_tour_v1_completed';

interface VendorTourGuideProps {
  /** Optional custom trigger state */
  isOpen?: boolean;
  onClose?: () => void;
}

export default function VendorTourGuide({ isOpen: controlledIsOpen, onClose: controlledOnClose }: VendorTourGuideProps = {}) {
  const router = useRouter();
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Determine if controlled or uncontrolled
  const isControlled = controlledIsOpen !== undefined;
  const showModal = isControlled ? controlledIsOpen : isOpenInternal;

  // Auto-launch on initial visit if never completed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const completed = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => {
        setIsOpenInternal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    }
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setIsOpenInternal(false);
    }
  }, [controlledOnClose]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNavigateToPage = (href: string) => {
    handleClose();
    router.push(href);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, currentStepIndex, handleClose]);

  const step = TOUR_STEPS[currentStepIndex];
  const StepIcon = step.icon;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Tour Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl rounded-3xl surface-card border border-[var(--gold-accent)]/40 shadow-2xl p-6 sm:p-8 bg-[var(--bg-surface)] text-[var(--text-primary)] z-10 overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--gold-accent)] via-amber-300 to-emerald-400" />

            {/* Header: Step counter + close button */}
            <div className="flex items-center justify-between pb-5 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 flex items-center justify-center text-[var(--gold-accent)] shadow-sm">
                  <IrisiIcon size={24} variant="gold" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold block">
                    {step.badge}
                  </span>
                  <span className="font-editorial text-sm font-bold text-[var(--text-primary)] block">
                    Ìrísí Atelier Onboarding Guide
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
                title="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Step Content */}
            <div className="py-6 space-y-4">
              
              {/* Step Title & Icon Pill */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 shadow-sm">
                  <StepIcon className={`h-6 w-6 ${step.accentColor}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold leading-tight text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <span className="text-xs font-mono-luxury text-[var(--gold-accent)] font-bold block">
                    {step.wittyTagline}
                  </span>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                {step.description}
              </p>

              {/* Pro Tip Box with Nigerian Banter */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-light leading-snug">
                  <strong className="text-[var(--text-primary)] font-bold">Designer Tip: </strong>
                  {step.proTip}
                </p>
              </div>

              {/* Jump to Page Quick Link (if applicable) */}
              {step.actionHref && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigateToPage(step.actionHref!)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-luxury font-bold text-[var(--gold-accent)] hover:underline uppercase tracking-wider"
                  >
                    <span>{step.actionText}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              )}

            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Step Progress Dots */}
              <div className="flex items-center gap-2">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStepIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentStepIndex
                        ? 'w-7 bg-[var(--gold-accent)]'
                        : 'w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-secondary)]'
                    }`}
                    title={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2.5 rounded-full border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[var(--gold-accent)] hover:opacity-90 text-black text-xs font-mono-luxury font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {isLastStep ? (
                    <>
                      <span>Oya, Let&apos;s Make Sales!</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Skip Text Link */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-[10px] font-mono-luxury text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer underline underline-offset-4"
              >
                Skip guide (I know my way around)
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
