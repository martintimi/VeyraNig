'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2,
  UploadCloud, PackageCheck, ShieldCheck, MessageSquare,
  BarChart3, Building, LayoutDashboard
} from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';
import { useStore } from '@/lib/store/useStore';
import { getVendorSpecialty, isBoutiqueVendor, VendorSpecialty } from '@/types';

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

function getTourSteps(specialty: VendorSpecialty, isBoutique: boolean): TourStep[] {
  // 1. Specialized Jewelry Studio Tour
  if (specialty === 'jewelry') {
    return [
      {
        targetId: 'tour-nav-overview',
        stepNumber: 1,
        totalSteps: 8,
        title: 'Overview (Your Jewelry Studio at a Glance)',
        category: 'Jewelry Command',
        description:
          'Your jewelry command tower. Track daily chain, ring, and bracelet orders, active escrow payouts, and live inventory across metal finishes (18K PVD Gold, 925 Silver, Stainless Steel).',
        keyAction: 'Check this page daily to monitor ring size stock and pending order shipments.',
        icon: Sparkles,
        accentColor: 'text-[var(--gold-accent)]',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-publish',
        stepNumber: 2,
        totalSteps: 8,
        title: 'Add Jewelry Drop (Chains, Rings & Pendants)',
        category: 'Drop Launch',
        description:
          'Upload macro photos of your Cuban chains, tennis bracelets, signet rings, or pendants. Specify chain lengths (18"-24"), ring sizes (US 6-12), and metal purity, set your Naira price, and publish.',
        keyAction: 'Clearly state metal type (e.g. 316L Stainless Steel, Water-Resistant) to build buyer trust.',
        icon: UploadCloud,
        accentColor: 'text-amber-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-stories',
        stepNumber: 3,
        totalSteps: 8,
        title: 'Drop Stories (Macro Shine & Stacking Clips)',
        category: 'Social Selling',
        description:
          'Post 15-second high-clarity video clips showing jewelry shine under daylight, water-resistance tests, or wrist/neck stacking combinations. Jewelry videos convert rapidly.',
        keyAction: 'Post daily jewelry stacking videos to sell out limited pieces quickly.',
        icon: Sparkles,
        accentColor: 'text-[var(--gold-accent)]',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-orders',
        stepNumber: 4,
        totalSteps: 8,
        title: 'Jewelry Orders to Pack & Dispatch',
        category: 'Secure Packaging',
        description:
          'When an order drops, confirm the customer’s chain length or ring size. Place the piece inside its velvet pouch or jewelry box, pack into a padded courier bubble mailer, attach the waybill, and hand it to the rider.',
        keyAction: 'Always pack in padded bubble packaging to protect chains and stone prongs during transit.',
        icon: PackageCheck,
        accentColor: 'text-sky-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-settlements',
        stepNumber: 5,
        totalSteps: 8,
        title: 'Settlements & Bank Payouts',
        category: 'Guaranteed Payouts',
        description:
          'Customer funds are locked in 100% Escrow upfront before you pack the order. Once the courier delivers to the customer, your payout settles directly into your Nigerian bank account.',
        keyAction: 'Add your 10-digit NUBAN bank account number here so jewelry payouts land automatically.',
        icon: ShieldCheck,
        accentColor: 'text-emerald-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-direct-sales',
        stepNumber: 6,
        totalSteps: 8,
        title: 'Direct Sales & WhatsApp Jewelry POS',
        category: 'Close Customers Anywhere',
        description:
          'Have clients bargaining in your WhatsApp/Instagram DMs or requesting custom jewelry pieces? Generate an instant 1-click escrow payment link or QR code so they pay via transfer or card on the spot.',
        keyAction: 'Use direct payment links for custom commissions and DM inquiries.',
        icon: MessageSquare,
        accentColor: 'text-purple-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-reports',
        stepNumber: 7,
        totalSteps: 8,
        title: 'Jewelry Analytics & Best-Selling Pieces',
        category: 'Business Growth',
        description:
          'See your most popular chain designs, most requested ring sizes, and monthly revenue so you know exactly which jewelry pieces to restock.',
        keyAction: 'Restock your fastest-moving chain lengths and ring sizes before they sell out.',
        icon: BarChart3,
        accentColor: 'text-indigo-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-atelier',
        stepNumber: 8,
        totalSteps: 8,
        title: 'Jewelry Brand Profile & Studio Address',
        category: 'Storefront Setup',
        description:
          'Set your brand name, logo, jewelry aesthetic bio, and the studio pickup address where courier riders will collect parcels.',
        keyAction: 'Make sure your studio pickup address and phone number are always correct.',
        icon: Building,
        accentColor: 'text-rose-500',
        preferredPlacement: 'right'
      }
    ];
  }

  // 2. Specialized Footwear & Slides Tour
  if (specialty === 'footwear') {
    return [
      {
        targetId: 'tour-nav-overview',
        stepNumber: 1,
        totalSteps: 8,
        title: 'Overview (Your Footwear & Slides Hub)',
        category: 'Footwear Command',
        description:
          'Your footwear command center. Monitor daily slide, mule, sneaker, and loafer orders, active escrow payouts, and live stock count across all EU shoe sizes (38–46).',
        keyAction: 'Check this page daily to manage incoming shoe orders and stock availability.',
        icon: LayoutDashboard,
        accentColor: 'text-amber-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-publish',
        stepNumber: 2,
        totalSteps: 8,
        title: 'Add Footwear / Slide Drop (List New Pairs)',
        category: 'Drop Launch',
        description:
          'Upload angle shots and on-foot pictures of your leather slides, mules, loafers, or sneakers. Set EU shoe sizes (38 to 46), colorways, and sole materials, set your price in Naira, and publish.',
        keyAction: 'State if sizing is true-to-size or wide-fit to eliminate shoe sizing returns.',
        icon: UploadCloud,
        accentColor: 'text-amber-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-stories',
        stepNumber: 3,
        totalSteps: 8,
        title: 'Footwear Stories (On-Foot Styling & Flex Videos)',
        category: 'Social Selling',
        description:
          'Post 15-second clips of on-foot styling, sole comfort flexing, or leather craftsmanship. Shoppers buy slides and shoes much faster when they see how they look on-foot with socks or trousers.',
        keyAction: 'Post on-foot styling videos to showcase comfort and drive fast orders.',
        icon: Sparkles,
        accentColor: 'text-[var(--gold-accent)]',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-orders',
        stepNumber: 4,
        totalSteps: 8,
        title: 'Footwear Orders to Pack & Dispatch',
        category: 'Shoe Fulfillment',
        description:
          'When an order drops, confirm the customer’s EU shoe size, place the shoes in their dust bag and branded shoebox, print the automated courier waybill, and hand it to the rider.',
        keyAction: 'Pack securely in dust bags and shoeboxes to prevent scuffs during transit.',
        icon: PackageCheck,
        accentColor: 'text-sky-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-settlements',
        stepNumber: 5,
        totalSteps: 8,
        title: 'Settlements & Bank Payouts',
        category: 'Guaranteed Payouts',
        description:
          'Customer funds are locked in 100% Escrow upfront before you dispatch. Once the courier delivers to the customer, your payout settles directly into your Nigerian bank account.',
        keyAction: 'Add your 10-digit NUBAN account number here so footwear payouts land automatically.',
        icon: ShieldCheck,
        accentColor: 'text-emerald-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-direct-sales',
        stepNumber: 6,
        totalSteps: 8,
        title: 'Direct Sales & WhatsApp Shoe POS',
        category: 'Instant Selling',
        description:
          'Have walk-in customers trying on shoes in your physical store or clients chatting on WhatsApp? Generate an instant 1-click escrow payment link or QR code so they pay via transfer or card on the spot.',
        keyAction: 'Close in-person and DM shoe buyers with 1-click escrow payment links.',
        icon: MessageSquare,
        accentColor: 'text-purple-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-reports',
        stepNumber: 7,
        totalSteps: 8,
        title: 'Footwear Sales & Top Size Analytics',
        category: 'Stock Trends',
        description:
          'See which EU sizes (e.g. 42, 43, 44) and which slide colorways sell out quickest so you can restock high-demand sizes proactively.',
        keyAction: 'Keep your top-selling shoe sizes (EU 41–44) constantly restocked.',
        icon: BarChart3,
        accentColor: 'text-indigo-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-atelier',
        stepNumber: 8,
        totalSteps: 8,
        title: 'Footwear Brand Profile & Workshop',
        category: 'Brand Setup',
        description:
          'Set your brand name, logo, craft bio, and the workshop or store pickup address where courier riders will collect shoeboxes.',
        keyAction: 'Keep your pickup address and phone number accurate for dispatch riders.',
        icon: Building,
        accentColor: 'text-rose-500',
        preferredPlacement: 'right'
      }
    ];
  }

  // 3. Ready-to-Wear (RTW) Boutique Seller Tour
  if (isBoutique) {
    return [
      {
        targetId: 'tour-nav-overview',
        stepNumber: 1,
        totalSteps: 8,
        title: 'Overview (Your Boutique at a Glance)',
        category: 'Boutique Hub',
        description:
          'Your central command tower. See your daily sales, orders waiting to be packed from your shelves, active escrow payouts, and live stock count across all sizes.',
        keyAction: 'Check this page daily to track your incoming orders and live stock levels.',
        icon: LayoutDashboard,
        accentColor: 'text-amber-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-publish',
        stepNumber: 2,
        totalSteps: 8,
        title: 'Add RTW Product (Upload Ready-Made Inventory)',
        category: 'Stock Management',
        description:
          'Upload your streetwear drops, party dresses, co-ords, blazers, cargo pants, or footwear. Select sizes (XS, S, M, L, XL), assign quantities per colorway, set your Naira price, and launch to shoppers nationwide.',
        keyAction: 'Set accurate quantities per size so you never oversell out-of-stock pieces.',
        icon: UploadCloud,
        accentColor: 'text-amber-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-stories',
        stepNumber: 3,
        totalSteps: 8,
        title: 'Drop Stories (Promote New Arrivals & Restocks)',
        category: 'Customer Engagement',
        description:
          'Just like Instagram or WhatsApp status! Post short 15-second videos of new boutique arrivals, styling videos on models, or announcing a restock of sold-out sizes. Stories drive fast sales.',
        keyAction: 'Post new arrivals to create excitement and sell out limited sizes fast.',
        icon: Sparkles,
        accentColor: 'text-[var(--gold-accent)]',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-orders',
        stepNumber: 4,
        totalSteps: 8,
        title: 'Orders to Pack & Dispatch',
        category: 'Fulfillment & Courier',
        description:
          'When a shopper buys your item, it lands here with their chosen size and colorway. Pick the piece from your shelf, fold it clean into a courier flyer bag, print the automated courier waybill, and hand it to the rider.',
        keyAction: 'Same-day or 24h dispatch earns your boutique a Top Merchant badge.',
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
          'Customer payment is locked in 100% Escrow upfront before you even pack the box. Once the courier delivers the parcel, your payout settles directly into your Nigerian bank account.',
        keyAction: 'Add your 10-digit NUBAN bank account number here so payouts land automatically.',
        icon: ShieldCheck,
        accentColor: 'text-emerald-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-direct-sales',
        stepNumber: 6,
        totalSteps: 8,
        title: 'Direct Sales & In-Store POS',
        category: 'Sell Anywhere',
        description:
          'Selling to walk-in customers inside your physical boutique or chatting with buyers in your Instagram DMs? Generate a quick 1-click escrow payment link or QR code so they pay via transfer, card, or USSD on the spot.',
        keyAction: 'Use this for in-store shoppers and Instagram DMs to close sales immediately.',
        icon: MessageSquare,
        accentColor: 'text-purple-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-reports',
        stepNumber: 7,
        totalSteps: 8,
        title: 'Sales Reports & Best Sellers',
        category: 'Store Analytics',
        description:
          'Track which sizes (S, M, L, XL) and styles (dresses, tees, cargo pants) sell out fastest. See your daily revenue so you know exactly what inventory to restock.',
        keyAction: 'Restock your best-selling sizes and styles before they sell out.',
        icon: BarChart3,
        accentColor: 'text-indigo-500',
        preferredPlacement: 'right'
      },
      {
        targetId: 'tour-nav-atelier',
        stepNumber: 8,
        totalSteps: 8,
        title: 'Boutique Profile & Storefront',
        category: 'Your Public Brand Window',
        description:
          'Set your boutique name, brand logo, shop bio, and your physical store or warehouse address where courier riders will pick up parcels.',
        keyAction: 'Make sure your store address and phone number are always correct.',
        icon: Building,
        accentColor: 'text-rose-500',
        preferredPlacement: 'right'
      }
    ];
  }

  // 4. Bespoke Fashion Designer & Atelier Tour
  return [
    {
      targetId: 'tour-nav-overview',
      stepNumber: 1,
      totalSteps: 8,
      title: 'Overview (Your Atelier at a Glance)',
      category: 'Command Tower',
      description:
        'Your central atelier dashboard. See your active cutting queue, orders waiting to be sewn and packaged, active escrow balance, and live bespoke pieces.',
      keyAction: 'Check this page daily to manage incoming commissions and delivery deadlines.',
      icon: LayoutDashboard,
      accentColor: 'text-amber-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-publish',
      stepNumber: 2,
      totalSteps: 8,
      title: 'Publish Piece (Drop Your Designs)',
      category: 'Collection Launch',
      description:
        'Upload your native sets, bespoke cuts, streetwear drops, or handcrafted footwear. Set your price in Naira, configure sizing and lead times, and publish to clients nationwide.',
      keyAction: 'Upload high-resolution editorial photos to showcase your tailoring details.',
      icon: UploadCloud,
      accentColor: 'text-amber-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-stories',
      stepNumber: 3,
      totalSteps: 8,
      title: 'Drop Stories (Showcase Your Craft)',
      category: 'Customer Engagement',
      description:
        'Post behind-the-scenes video clips of your workshop, fabric cutting, embroidery details, or garments on a mannequin. Craftsmanship stories attract high-ticket clients.',
      keyAction: 'Post a 15-second clip whenever you finish a new garment to build brand prestige.',
      icon: Sparkles,
      accentColor: 'text-[var(--gold-accent)]',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-orders',
      stepNumber: 4,
      totalSteps: 8,
      title: 'Orders to Pack & Dispatch',
      category: 'Fulfillment & Dispatch',
      description:
        'When a client orders, their piece appears here. Ìrísí automatically generates the courier waybill. Pack the garment neatly, attach the waybill, and hand it to the dispatch rider.',
      keyAction: 'Dispatch within your promised lead time to maintain a Top Atelier rating.',
      icon: PackageCheck,
      accentColor: 'text-sky-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-settlements',
      stepNumber: 5,
      totalSteps: 8,
      title: 'Settlements & Bank Payouts',
      category: 'Guaranteed Earnings',
      description:
        'Client funds are locked in 100% Escrow before you cut a single inch of fabric. Once the courier delivers to the client, your payout lands straight in your Nigerian bank account.',
      keyAction: 'Add your 10-digit NUBAN bank account number here so payouts settle automatically.',
      icon: ShieldCheck,
      accentColor: 'text-emerald-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-direct-sales',
      stepNumber: 6,
      totalSteps: 8,
      title: 'Direct Sales & Atelier POS',
      category: 'Client Orders Anywhere',
      description:
        'Have clients consulting in your WhatsApp DMs or walking into your physical atelier? Create an instant escrow payment link or QR code so they pay via transfer, card, or USSD.',
      keyAction: 'Use direct payment links for custom commissions and in-person consultations.',
      icon: MessageSquare,
      accentColor: 'text-purple-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-reports',
      stepNumber: 7,
      totalSteps: 8,
      title: 'Atelier Reports & Revenue',
      category: 'Business Growth',
      description:
        'Track your total commission revenue, your most popular styles, and monthly growth to expand your fashion brand.',
      keyAction: 'Analyze your top revenue-generating styles to plan your next seasonal collection.',
      icon: BarChart3,
      accentColor: 'text-indigo-500',
      preferredPlacement: 'right'
    },
    {
      targetId: 'tour-nav-atelier',
      stepNumber: 8,
      totalSteps: 8,
      title: 'Atelier Profile & Workshop Address',
      category: 'Brand Identity',
      description:
        'Set your atelier brand name, logo, designer bio, and workshop pickup address for delivery riders.',
      keyAction: 'Keep your workshop pickup address and phone number accurate for riders.',
      icon: Building,
      accentColor: 'text-rose-500',
      preferredPlacement: 'right'
    }
  ];
}

const STORAGE_KEY = 'irisi_vendor_tour_completed_v7';

interface VendorTourGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function VendorTourGuide({ isOpen: controlledIsOpen, onClose: controlledOnClose }: VendorTourGuideProps = {}) {
  const { vendorProfile } = useStore();
  const isBoutique = isBoutiqueVendor(vendorProfile);
  const specialty = getVendorSpecialty(vendorProfile);

  const tourSteps = useMemo(() => getTourSteps(specialty, isBoutique), [specialty, isBoutique]);

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
    const step = tourSteps[currentStepIndex];
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
  }, [tourActive, currentStepIndex, tourSteps]);

  // When step changes, smoothly scroll element into center view
  useEffect(() => {
    if (!tourActive) return;
    const step = tourSteps[currentStepIndex];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const t = setTimeout(() => {
        updateTargetRect();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [tourActive, currentStepIndex, updateTargetRect, tourSteps]);

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
    if (currentStepIndex < tourSteps.length - 1) {
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

  const step = tourSteps[currentStepIndex];
  const StepIcon = step?.icon || Sparkles;
  const isLast = currentStepIndex === tourSteps.length - 1;

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

  const portalDescriptor = 
    specialty === 'caps' ? 'Headwear Studio' :
    specialty === 'accessories' ? 'Accessories Studio' :
    specialty === 'jewelry' ? 'Jewelry Studio' :
    specialty === 'footwear' ? 'Footwear Hub' :
    isBoutique ? 'Boutique' : 'Atelier';

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
                  New to Ìrísí {portalDescriptor}?
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
                    {tourSteps.map((_, i) => (
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
