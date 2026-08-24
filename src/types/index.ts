export type BodyShape = 'hourglass' | 'athletic' | 'inverted_triangle' | 'rectangular' | 'pear';
export type FitPreference = 'skinny' | 'tailored' | 'relaxed' | 'oversized';
export type AvatarStyle = 'bitmoji_cartoon' | 'minimal_editorial' | 'wireframe_cyber';
export type SkinTone = 'fair' | 'golden' | 'olive' | 'bronze' | 'deep';

export type HairStyle =
  | 'waves_fade'
  | 'afro_taper'
  | 'locs'
  | 'cornrows'
  | 'high_fade'
  | 'braids'
  | 'afro_puff'
  | 'buzzcut';

export type FacialHair = 'clean' | 'goatee' | 'full_beard' | 'stubble' | 'mustache';

export interface BodyProfile {
  name: string;
  email?: string;
  phone?: string;
  deliveryAddress?: string;
  city?: string;
  state?: string;
  heightCm: number;
  weightKg: number;
  gender: 'male' | 'female';
  bodyShape: BodyShape;
  fitPreference: FitPreference;
  avatarStyle: AvatarStyle;
  skinTone: SkinTone;
  skinToneHex: string;
  hairStyle: HairStyle;
  hairColor: string;
  facialHair: FacialHair;
  avatarDisplayMode: 'bitmoji' | 'cad_hologram';
  chestCm: number;
  waistCm: number;
  hipsCm: number;
  inseamCm: number;
  shoulderWidthCm: number;
  twinId: string;
  isInitialized: boolean;
  isLoggedIn?: boolean;
}

export type GarmentCategory = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';
export type GarmentOriginType = 'handmade_designer' | 'ready_made_boutique';
export type GenderTarget = 'male' | 'female' | 'unisex';

export interface GarmentMeasurement {
  chest?: [number, number];
  waist?: [number, number];
  hips?: [number, number];
  inseam?: [number, number];
  shoulder?: [number, number];
}

export interface ProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
  quantity?: number;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: GarmentCategory;
  genderTarget: GenderTarget;
  garmentOriginType: GarmentOriginType;
  price: number;
  originalPrice?: number;
  description: string;
  tags: string[];
  colors: ProductColor[];
  sizes: string[];
  sizeChart: Record<string, GarmentMeasurement>;
  imageUrl: string;
  fabricComposition: string;
  fitNotes: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  layerZIndex: number;
  isUserUploaded?: boolean;
  stockQuantity?: number;
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  aesthetic: string;
  code: string;
  heroImage: string;
  productCount: number;
  satisfactionRate: number;
  deliveryDays: string;
  shippingFee: number;
  description: string;
  vendorType?: 'fashion_designer' | 'boutique_seller';
  phone?: string;
}

export interface VendorProfile {
  brandName: string;
  designerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  vendorType: 'fashion_designer' | 'boutique_seller';
  bankName: string;
  accountNumber: string;
  accountName: string;
  instagram: string;
  bio: string;
}

export interface ActiveOutfit {
  tops?: Product;
  bottoms?: Product;
  outerwear?: Product;
  footwear?: Product;
  accessories?: Product;
}

export interface FitMatchResult {
  recommendedSize: string;
  matchScore: number;
  fitLabel: 'Perfect Bespoke Match' | 'Slightly Snug' | 'Relaxed Drape' | 'Check Alterations';
  insights: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  fitScore: number;
}

export type OrderStatus =
  | 'payment_confirmed'
  | 'tailoring_in_progress'
  | 'hub_inspected'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderItem {
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  price: number;
  size: string;
  imageUrl: string;
  category: GarmentCategory;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryCity: string;
  customerMeasurements: {
    heightCm: number;
    chestCm: number;
    shoulderCm: number;
    waistCm: number;
    inseamCm: number;
  };
  items: OrderItem[];
  paymentRef?: string;
  paystackRef?: string;
  isRated?: boolean;
  rating?: number;
  reviewComment?: string;
}

export interface NotificationItem {
  id: string;
  type: 'order_status' | 'tailoring_update' | 'review_request' | 'promo';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  actionUrl?: string;
}
