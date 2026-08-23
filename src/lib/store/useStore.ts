import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ActiveOutfit, BodyProfile, CartItem, Product, GarmentCategory,
  GarmentOriginType, Order, NotificationItem, VendorProfile
} from '@/types';
import { products as initialProducts } from '@/lib/data/products';
import { calculateFitMatch } from '@/lib/utils/sizingEngine';

export interface UserAuth {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  userType: 'shopper' | 'vendor';
}

interface VeyraState {
  // Theme Mode
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Selected Studio & Catalog Gender Target
  selectedGender: 'male' | 'female';
  setSelectedGender: (gender: 'male' | 'female') => void;

  // Garment Origin Filter: All | Handmade Designers | Ready-made Boutiques
  selectedOriginType: 'all' | 'handmade_designer' | 'ready_made_boutique';
  setSelectedOriginType: (origin: 'all' | 'handmade_designer' | 'ready_made_boutique') => void;

  // User Auth & Body Profile
  userAuth: UserAuth;
  setUserAuth: (auth: Partial<UserAuth>) => void;
  logout: () => void;
  bodyProfile: BodyProfile;
  setBodyProfile: (profile: Partial<BodyProfile>) => void;
  resetBodyProfile: () => void;

  // Orders Management
  userOrders: Order[];
  createNewOrder: (order: Omit<Order, 'id'>) => Order;
  rateOrder: (orderId: string, rating: number, comment: string) => void;

  // Notifications Management
  userNotifications: NotificationItem[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Catalog Products (Initial + Vendor Uploaded)
  allProducts: Product[];
  addCustomProduct: (product: Product) => void;

  // Active Outfit Canvas
  activeOutfit: ActiveOutfit;
  setOutfitItem: (product: Product) => void;
  removeOutfitItem: (category: GarmentCategory) => void;
  clearOutfit: () => void;
  randomizeOutfit: () => void;
  fitHeatmapActive: boolean;
  setFitHeatmapActive: (active: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  addEntireOutfitToCart: () => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Vendor Portal State
  isVendorLoggedIn: boolean;
  setIsVendorLoggedIn: (loggedIn: boolean) => void;
  vendorProfile: VendorProfile;
  setVendorProfile: (profile: Partial<VendorProfile>) => void;
  vendorLogout: () => void;

  // Modals
  isProfileWizardOpen: boolean;
  setIsProfileWizardOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

export const defaultVendorProfile: VendorProfile = {
  brandName: 'Klassic Wears',
  designerName: 'Adeola Klassic',
  contactPerson: 'Adeola Klassic',
  email: 'contact@klassicwears.ng',
  phone: '+234 802 345 6789',
  location: 'Ijebu Ode, Ogun / Lagos',
  vendorType: 'fashion_designer',
  bankName: 'Guaranty Trust Bank (GTBank)',
  accountNumber: '0123456789',
  accountName: 'KLASSIC WEARS ENTERPRISE',
  instagram: '@klassic_wears',
  bio: 'Bespoke Nigerian native wears, hand-cut Senators, and modern traditional sets tailored to perfection.',
};

const defaultProfile: BodyProfile = {
  name: 'Chukwudi Eze',
  email: 'chukwudi.eze@gmail.com',
  phone: '+234 803 456 7890',
  deliveryAddress: 'Plot 14B, Adeola Odeku Street',
  city: 'Victoria Island',
  state: 'Lagos',
  heightCm: 182,
  weightKg: 78,
  gender: 'male',
  bodyShape: 'athletic',
  fitPreference: 'tailored',
  avatarStyle: 'minimal_editorial',
  skinTone: 'deep',
  chestCm: 104,
  waistCm: 84,
  hipsCm: 100,
  inseamCm: 84,
  shoulderWidthCm: 49,
  twinId: 'VY-TWIN-9281',
  isInitialized: true,
  isLoggedIn: true,
};

const initialOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#VY-ORD-9201',
    date: '22 Aug 2026',
    totalAmount: 148000,
    status: 'delivered',
    customerName: 'Chukwudi Eze',
    customerPhone: '+234 803 456 7890',
    customerEmail: 'chukwudi.eze@gmail.com',
    deliveryAddress: 'Plot 14B, Adeola Odeku Street, Victoria Island',
    deliveryCity: 'Lagos',
    customerMeasurements: {
      heightCm: 182,
      chestCm: 104,
      shoulderCm: 49,
      waistCm: 84,
      inseamCm: 84,
    },
    items: [
      {
        productId: 'top-senator-black',
        productName: 'Onyx Black Wool Senator Kaftan',
        vendorId: 'sartorial-lagos',
        vendorName: 'Sartorial Lagos',
        price: 65000,
        size: 'L',
        imageUrl: '/images/products/BlackSenator.jpg',
        category: 'tops'
      },
      {
        productId: 'bottom-baggy-jean',
        productName: 'Lagos Wide-Leg Baggy Denim Jeans',
        vendorId: 'yaba-denim',
        vendorName: 'Yaba Denim Works',
        price: 38000,
        size: 'L',
        imageUrl: '/images/products/BaggyJean.jpg',
        category: 'bottoms'
      },
      {
        productId: 'shoes-unisex-slides',
        productName: 'Kano Handcrafted Full-Grain Leather Slides',
        vendorId: 'kano-leather',
        vendorName: 'Kano Artisan Footwear',
        price: 35000,
        size: 'L',
        imageUrl: '/images/products/UnisexSlides.jpg',
        category: 'footwear'
      }
    ],
    paystackRef: 'pstk_live_891028392',
    isRated: false,
  },
  {
    id: 'ord-2',
    orderNumber: '#VY-ORD-9174',
    date: '15 Aug 2026',
    totalAmount: 98000,
    status: 'delivered',
    customerName: 'Chukwudi Eze',
    customerPhone: '+234 803 456 7890',
    customerEmail: 'chukwudi.eze@gmail.com',
    deliveryAddress: 'Plot 14B, Adeola Odeku Street, Victoria Island',
    deliveryCity: 'Lagos',
    customerMeasurements: {
      heightCm: 182,
      chestCm: 104,
      shoulderCm: 49,
      waistCm: 84,
      inseamCm: 84,
    },
    items: [
      {
        productId: 'outer-agbada-black',
        productName: 'Midnight Black Embroidered Agbada Robe',
        vendorId: 'sartorial-lagos',
        vendorName: 'Sartorial Lagos',
        price: 98000,
        size: 'L',
        imageUrl: '/images/products/BlackAgbada.jpg',
        category: 'outerwear'
      }
    ],
    paystackRef: 'pstk_live_771829301',
    isRated: true,
    rating: 5,
    reviewComment: 'The chest embroidery on this Agbada is world-class. Fits my 49cm shoulder line with zero pull.'
  }
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'review_request',
    title: 'How did your outfit fit?',
    message: 'Your order #VY-ORD-9201 from Sartorial Lagos & Yaba Denim was delivered. Rate the fit & tailoring fidelity!',
    timestamp: '10 mins ago',
    read: false,
    orderId: 'ord-1',
    actionUrl: '/profile'
  },
  {
    id: 'notif-2',
    type: 'order_status',
    title: 'Package Delivered by Lagos Express',
    message: 'Unified Box #VY-ORD-9201 containing 3 items was delivered to Victoria Island, Lagos.',
    timestamp: '2 hours ago',
    read: false,
    orderId: 'ord-1'
  },
  {
    id: 'notif-3',
    type: 'tailoring_update',
    title: 'Tailoring Inspection Completed',
    message: 'Sartorial Lagos verified your 104cm chest measurement for the Onyx Senator Kaftan.',
    timestamp: '1 day ago',
    read: true,
    orderId: 'ord-1'
  }
];

const initialOutfit: ActiveOutfit = {
  tops: initialProducts.find(p => p.id === 'top-senator-black'),
  bottoms: initialProducts.find(p => p.id === 'bottom-baggy-jean'),
  outerwear: initialProducts.find(p => p.id === 'outer-agbada-black'),
  footwear: initialProducts.find(p => p.id === 'shoes-unisex-slides'),
  accessories: initialProducts.find(p => p.id === 'acc-cap-fila'),
};

export const useStore = create<VeyraState>()(
  persist(
    (set, get) => ({
      // Theme State
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        if (typeof document !== 'undefined') {
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          }
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          }
        }
      },

      // Gender & Origin Filters
      selectedGender: 'male',
      setSelectedGender: (gender) => {
        const tops = get().allProducts.filter(p => p.category === 'tops' && (p.genderTarget === gender || p.genderTarget === 'unisex'));
        const bottoms = get().allProducts.filter(p => p.category === 'bottoms' && (p.genderTarget === gender || p.genderTarget === 'unisex'));
        
        set((state) => ({
          selectedGender: gender,
          bodyProfile: { ...state.bodyProfile, gender },
          activeOutfit: {
            tops: tops[0] || undefined,
            bottoms: bottoms[0] || undefined,
            outerwear: gender === 'male' ? initialProducts.find(p => p.id === 'outer-agbada-black') : undefined,
            footwear: initialProducts.find(p => p.id === 'shoes-unisex-slides'),
            accessories: initialProducts.find(p => p.id === 'acc-cap-fila'),
          }
        }));
      },

      selectedOriginType: 'all',
      setSelectedOriginType: (origin) => set({ selectedOriginType: origin }),

      // User Auth
      userAuth: {
        isLoggedIn: true,
        name: 'Chukwudi Eze',
        email: 'chukwudi.eze@gmail.com',
        phone: '+234 803 456 7890',
        gender: 'male',
        userType: 'shopper',
      },
      setUserAuth: (authUpdate) => {
        set((state) => {
          const updatedAuth = { ...state.userAuth, ...authUpdate };
          return {
            userAuth: updatedAuth,
            bodyProfile: {
              ...state.bodyProfile,
              name: updatedAuth.name || state.bodyProfile.name,
              email: updatedAuth.email || state.bodyProfile.email,
              phone: updatedAuth.phone || state.bodyProfile.phone,
              gender: updatedAuth.gender || state.bodyProfile.gender,
              isLoggedIn: updatedAuth.isLoggedIn,
              isInitialized: true,
            }
          };
        });
      },
      logout: () => {
        set({
          userAuth: {
            isLoggedIn: false,
            name: '',
            email: '',
            phone: '',
            gender: 'male',
            userType: 'shopper',
          },
          bodyProfile: { ...defaultProfile, isLoggedIn: false },
        });
      },

      // Profile State
      bodyProfile: defaultProfile,
      setBodyProfile: (profileUpdate) => {
        set((state) => ({
          bodyProfile: {
            ...state.bodyProfile,
            ...profileUpdate,
            isInitialized: true,
          },
        }));
      },
      resetBodyProfile: () => {
        set({ bodyProfile: defaultProfile });
      },

      // Orders Management
      userOrders: initialOrders,
      createNewOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
        };
        set((state) => ({
          userOrders: [newOrder, ...state.userOrders]
        }));
        return newOrder;
      },
      rateOrder: (orderId, rating, comment) => {
        set((state) => ({
          userOrders: state.userOrders.map((ord) =>
            ord.id === orderId
              ? { ...ord, isRated: true, rating, reviewComment: comment }
              : ord
          )
        }));
      },

      // Notifications Management
      userNotifications: initialNotifications,
      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          userNotifications: state.userNotifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        }));
      },
      markAllNotificationsAsRead: () => {
        set((state) => ({
          userNotifications: state.userNotifications.map((n) => ({ ...n, read: true }))
        }));
      },
      addNotification: (notification) => {
        const newNotif: NotificationItem = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: 'Just now',
          read: false,
        };
        set((state) => ({
          userNotifications: [newNotif, ...state.userNotifications]
        }));
      },

      // Products Catalog (with dynamic uploads)
      allProducts: initialProducts,
      addCustomProduct: (newProduct) => {
        set((state) => ({
          allProducts: [newProduct, ...state.allProducts],
        }));
      },

      // Active Outfit State
      activeOutfit: initialOutfit,
      fitHeatmapActive: false,
      setFitHeatmapActive: (active) => set({ fitHeatmapActive: active }),
      setOutfitItem: (product) => {
        set((state) => ({
          activeOutfit: {
            ...state.activeOutfit,
            [product.category]: product,
          },
        }));
      },
      removeOutfitItem: (category) => {
        set((state) => {
          const next = { ...state.activeOutfit };
          delete next[category];
          return { activeOutfit: next };
        });
      },
      clearOutfit: () => {
        set({ activeOutfit: {} });
      },
      randomizeOutfit: () => {
        const { selectedGender, allProducts } = get();
        const tops = allProducts.filter(p => p.category === 'tops' && (p.genderTarget === selectedGender || p.genderTarget === 'unisex'));
        const bottoms = allProducts.filter(p => p.category === 'bottoms' && (p.genderTarget === selectedGender || p.genderTarget === 'unisex'));
        const outer = allProducts.filter(p => p.category === 'outerwear' && (p.genderTarget === selectedGender || p.genderTarget === 'unisex'));
        const shoes = allProducts.filter(p => p.category === 'footwear');
        const accs = allProducts.filter(p => p.category === 'accessories');

        set({
          activeOutfit: {
            tops: tops.length ? tops[Math.floor(Math.random() * tops.length)] : undefined,
            bottoms: bottoms.length ? bottoms[Math.floor(Math.random() * bottoms.length)] : undefined,
            outerwear: outer.length ? outer[Math.floor(Math.random() * outer.length)] : undefined,
            footwear: shoes.length ? shoes[Math.floor(Math.random() * shoes.length)] : undefined,
            accessories: accs.length ? accs[Math.floor(Math.random() * accs.length)] : undefined,
          }
        });
      },

      // Cart State
      cart: [],
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      addToCart: (product, size) => {
        const { bodyProfile, cart } = get();
        const fitResult = calculateFitMatch(bodyProfile, product);
        const chosenSize = size || fitResult.recommendedSize;
        const existingIndex = cart.findIndex(
          item => item.product.id === product.id && item.selectedSize === chosenSize
        );

        if (existingIndex > -1) {
          const updated = [...cart];
          updated[existingIndex].quantity += 1;
          set({ cart: updated, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            product,
            selectedSize: chosenSize,
            selectedColor: product.colors[0],
            quantity: 1,
            fitScore: fitResult.matchScore,
          };
          set({ cart: [...cart, newItem], isCartOpen: true });
        }
      },
      addEntireOutfitToCart: () => {
        const { activeOutfit, bodyProfile, cart } = get();
        const itemsToAdd = Object.values(activeOutfit).filter(Boolean) as Product[];
        const newItems: CartItem[] = [];

        itemsToAdd.forEach((product) => {
          const fitResult = calculateFitMatch(bodyProfile, product);
          const existing = cart.find(
            c => c.product.id === product.id && c.selectedSize === fitResult.recommendedSize
          );
          if (!existing) {
            newItems.push({
              id: `cart-outfit-${product.id}-${Date.now()}`,
              product,
              selectedSize: fitResult.recommendedSize,
              selectedColor: product.colors[0],
              quantity: 1,
              fitScore: fitResult.matchScore,
            });
          }
        });

        set({ cart: [...cart, ...newItems], isCartOpen: true });
      },
      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== cartItemId),
        }));
      },
      updateCartQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),

      // Vendor Portal State
      isVendorLoggedIn: true,
      setIsVendorLoggedIn: (loggedIn) => set({ isVendorLoggedIn: loggedIn }),
      vendorProfile: defaultVendorProfile,
      setVendorProfile: (profile) =>
        set((state) => ({
          vendorProfile: { ...state.vendorProfile, ...profile }
        })),
      vendorLogout: () => set({ isVendorLoggedIn: false }),

      // UI Modals
      isProfileWizardOpen: false,
      setIsProfileWizardOpen: (open) => set({ isProfileWizardOpen: open }),
      isAuthModalOpen: false,
      setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
    }),
    {
      name: 'veyra-store-storage',
      partialize: (state) => ({
        theme: state.theme,
        selectedGender: state.selectedGender,
        userAuth: state.userAuth,
        bodyProfile: state.bodyProfile,
        isVendorLoggedIn: state.isVendorLoggedIn,
        vendorProfile: state.vendorProfile,
        cart: state.cart,
        userOrders: state.userOrders,
        userNotifications: state.userNotifications,
      }),
    }
  )
);
