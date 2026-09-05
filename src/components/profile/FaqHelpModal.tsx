'use client';

import React, { useState, useMemo } from 'react';
import { HelpCircle, X, Search, ChevronDown, MessageSquare, ShieldCheck, Sparkles, Phone, ExternalLink } from 'lucide-react';

interface FaqHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: 'sizing' | 'payment' | 'delivery' | 'returns' | 'concierge';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'sizing',
    question: 'How does the 3D Digital Body Twin predict garment fit?',
    answer: 'Our proprietary Ìrísí Digital Twin algorithms synthesize your height, weight, chest, waist, and hips against the exact pattern measurements drafted by each Nigerian designer. This ensures 98% silhouette fidelity before fabric is even cut, eliminating traditional sizing confusion.',
  },
  {
    id: 'faq-2',
    category: 'sizing',
    question: 'What if a custom tailored piece does not fit me perfectly?',
    answer: 'All bespoke designer pieces ordered through Ìrísí come with our Guaranteed Fit Promise. If adjustments are required within 7 days of delivery, our verified ateliers provide prompt alteration assistance or bespoke tailoring adjustments free of charge.',
  },
  {
    id: 'faq-3',
    category: 'payment',
    question: 'How does Escrow Protection safeguard my money?',
    answer: 'When you purchase via Paystack debit card or instant bank transfer, your payment is held securely in Ìrísí Escrow. The artisan only receives their payout after your order has been successfully delivered and inspected.',
  },
  {
    id: 'faq-4',
    category: 'delivery',
    question: 'What are the delivery timelines across Nigerian states?',
    answer: 'Ready-to-wear pieces ship within 24–48 hours in Lagos, and 2–4 business days across other 35 states via our integrated logistics network. Bespoke tailoring takes 5–7 days for handcrafted production plus courier dispatch.',
  },
  {
    id: 'faq-5',
    category: 'delivery',
    question: 'How do I track my delivery and courier waybill?',
    answer: 'Navigate to "Orders" in your Patron Profile and tap "Track Order". You will see live courier tracking stages (Atelier Crafting -> Quality Verified -> Waybill Dispatched -> Out for Delivery) with direct waybill codes.',
  },
  {
    id: 'faq-6',
    category: 'returns',
    question: 'What is the return and exchange policy?',
    answer: 'Ready-to-wear drops can be returned or exchanged within 7 days of delivery as long as security tags remain intact, unworn, and in original packaging. Simply contact concierge to initiate an instant return.',
  },
  {
    id: 'faq-7',
    category: 'concierge',
    question: 'Can I chat directly with a human stylist or concierge?',
    answer: 'Yes! Our dedicated Ìrísí Luxury Fashion Concierge is available 24/7 on WhatsApp to assist with private sizing consultations, custom bridal/native inquiries, and doorstep order tracking.',
  },
];

export default function FaqHelpModal({ isOpen, onClose }: FaqHelpModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !cleanSearch ||
        item.question.toLowerCase().includes(cleanSearch) ||
        item.answer.toLowerCase().includes(cleanSearch);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl max-h-[85vh] surface-card border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
          <div className="h-12 w-12 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center shrink-0">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Need Help & FAQ Topics
            </h3>
            <p className="text-[11px] font-mono-luxury text-[var(--text-secondary)]">
              Everything about 3D Twin sizing, escrow safety, delivery & alterations
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. sizing, delivery, escrow, returns)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 text-[10px] font-mono-luxury">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'sizing', label: '3D Twin Sizing' },
            { id: 'payment', label: 'Escrow & Paystack' },
            { id: 'delivery', label: 'Waybills & Shipping' },
            { id: 'returns', label: 'Returns & Alterations' },
            { id: 'concierge', label: 'Stylist Concierge' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--gold-accent)] text-black shadow-sm'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs font-mono-luxury text-[var(--text-muted)]">
                No matching topics found for "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-mono-luxury text-[var(--gold-accent)] underline font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl surface-card border border-[var(--border-subtle)] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono-luxury">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--gold-accent)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-secondary)] font-mono-luxury leading-relaxed border-t border-[var(--border-subtle)]/40 bg-[var(--bg-secondary)]/20 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Concierge Assistance Card */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-luxury">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Sparkles className="h-4 w-4 text-[var(--gold-accent)] shrink-0" />
            <span>Still have a question about an order?</span>
          </div>
          <a
            href="https://wa.me/2348000000000?text=Hello%20%C3%8Cr%C3%ADs%C3%AD%20Concierge,%20I%20have%20an%20inquiry%20regarding%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat with Concierge</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
