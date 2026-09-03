export interface ConciergeConfig {
  whatsappNumber: string;
  isEnabled: boolean;
  businessHours: string;
  advisorName: string;
}

const DEFAULT_CONCIERGE_CONFIG: ConciergeConfig = {
  whatsappNumber: process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP || '2348000000000',
  isEnabled: true,
  businessHours: '8:00 AM – 10:00 PM WAT (7 Days)',
  advisorName: 'Veyra Concierge & Vendor Desk'
};

const STORAGE_KEY = 'veyra_concierge_config_v1';

export function getConciergeConfig(): ConciergeConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_CONCIERGE_CONFIG;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONCIERGE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load concierge config from storage:', e);
  }
  return DEFAULT_CONCIERGE_CONFIG;
}

export function saveConciergeConfig(config: Partial<ConciergeConfig>): ConciergeConfig {
  if (typeof window === 'undefined') return DEFAULT_CONCIERGE_CONFIG;
  try {
    const current = getConciergeConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch storage event for live multi-tab updates
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (e) {
    console.warn('Failed to save concierge config:', e);
    return DEFAULT_CONCIERGE_CONFIG;
  }
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
