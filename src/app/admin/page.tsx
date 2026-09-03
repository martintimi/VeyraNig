'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  ShieldCheck, LayoutDashboard, Users, PackageCheck, Scissors,
  DollarSign, TrendingUp, Search, Filter, CheckCircle2, XCircle,
  AlertTriangle, Eye, ArrowUpRight, Phone, Mail, MapPin, Building,
  Clock, Sun, Moon, ExternalLink, LogOut, Sparkles, Check, ChevronRight,
  ShoppingBag, ArrowRight, Star, RefreshCw, Loader2, Store, AlertCircle,
  Lock, KeyRound, Layers, BarChart3, Settings, ShieldAlert,
  EyeOff, Zap, ShoppingCart, Truck, CreditCard, Trash2, Download,
  SlidersHorizontal, CheckSquare, FileText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const adminEditorialSlides = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    title: 'Executive Platform Governance',
    subtitle: 'Master control for Nigerian brand verifications, catalog curation, and marketplace operations.',
    tag: 'Platform Control'
  },
  {
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
    title: 'Authentic Brand Assurance',
    subtitle: 'Verify genuine fashion houses and maintain top-tier craftsmanship standards across the platform.',
    tag: 'Brand Verification'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    title: 'Catalog Curation & Moderation',
    subtitle: 'Oversee ready-to-wear drops, boutique collections, and designer releases in real time.',
    tag: 'Catalog Moderation'
  }
];

// Vector App Logos
const InstagramLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-pink-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-cyan-400 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.48 6.27 6.27 0 0 0 1.9-4.47V8.62a8.27 8.27 0 0 0 4.88 1.58V6.75c-.34-.01-.67-.03-1-.06z"/>
  </svg>
);

const SnapchatLogo = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-amber-300 fill-current" viewBox="0 0 24 24">
    <path d="M12.002 2c-3.528 0-6.136 2.548-6.136 5.86 0 .894.227 1.83.67 2.66-.25.13-.538.258-.871.393-1.077.441-1.637.95-1.665 1.512-.03.585.503 1.135 1.583 1.635.035.016.07.032.106.048-.052.288-.13.722-.387 1.253-.332.684-.816 1.183-1.438 1.482-.676.326-.777.685-.758.895.03.328.375.568.995.692.658.132 1.458.118 2.327-.04.423-.077.873-.193 1.341-.334.422.56.985.939 1.688 1.132.846.232 1.745.244 2.545.035.801.21 1.7.198 2.546-.035.703-.193 1.266-.572 1.688-1.132.468.141.918.257 1.341.334.869.158 1.669.172 2.327.04.62-.124.965-.364.995-.692.019-.21-.082-.569-.758-.895-.622-.299-1.106-.798-1.438-1.482-.257-.531-.335-.965-.387-1.253.036-.016.071-.032.106-.048 1.08-.5 1.613-1.05 1.583-1.635-.028-.562-.588-1.071-1.665-1.512-.333-.135-.621-.263-.871-.393.443-.83.67-1.766.67-2.66 0-3.312-2.608-5.86-6.136-5.86z"/>
  </svg>
);

export default function SuperAdminPage() {
  const { theme, toggleTheme } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'catalog' | 'approvals' | 'finance' | 'customers'>('overview');

  // Live Orders Data from DB
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStageFilter, setOrderStageFilter] = useState<'all' | 'escrow_secured' | 'packing' | 'dispatched' | 'delivered'>('all');
  const [selectedOrderModal, setSelectedOrderModal] = useState<any | null>(null);

  // Live Products Data from DB
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Live Vendors Data from DB
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const [vendorSearch, setVendorSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [rejectionModalVendor, setRejectionModalVendor] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Auto-rotate editorial carousel on login
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adminEditorialSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('veyra_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch all orders from DB
  const fetchOrdersList = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch('/api/orders?limit=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders for admin:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch all products from DB
  const fetchProductsList = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products for admin:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch all vendors from DB
  const fetchVendorsList = useCallback(async () => {
    try {
      setIsLoadingVendors(true);
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (res.ok && data.success) {
        setVendors(data.vendors || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendors for admin:', err);
    } finally {
      setIsLoadingVendors(false);
    }
  }, []);

  // Refresh all data when authenticated
  const refreshAllData = useCallback(() => {
    fetchOrdersList();
    fetchProductsList();
    fetchVendorsList();
  }, [fetchOrdersList, fetchProductsList, fetchVendorsList]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated, refreshAllData]);

  // Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('veyra_admin_auth', 'true');
        }
        confetti({
          particleCount: 60,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#e6c367', '#10b981', '#ffffff']
        });
      } else {
        setAuthError(data.error || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('veyra_admin_auth');
    }
  };

  // 1. ORDER ACTIONS
  const handleUpdateOrderStage = async (orderId: string, stage: number) => {
    try {
      setActionLoadingId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingStage: stage })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Order ${orderId} advanced to Stage ${stage}`);
        await fetchOrdersList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReleaseEscrow = async (orderId: string) => {
    if (!confirm('Are you sure you want to release escrow funds for this order to the vendor?')) return;
    try {
      setActionLoadingId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, releaseEscrow: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Escrow released for order ${orderId}! Payout logged.`);
        await fetchOrdersList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error releasing escrow:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to permanently delete order ${orderId}?`)) return;
    try {
      setActionLoadingId(orderId);
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Order ${orderId} deleted successfully.`);
        await fetchOrdersList();
        if (selectedOrderModal?.id === orderId) setSelectedOrderModal(null);
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 2. PRODUCT ACTIONS
  const handleToggleProductFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      setActionLoadingId(productId);
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isFeatured: !currentFeatured })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(currentFeatured ? 'Product removed from featured' : 'Product featured on homepage!');
        await fetchProductsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error toggling featured product:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to remove "${productName}" from the marketplace?`)) return;
    try {
      setActionLoadingId(productId);
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(productId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Product "${productName}" removed from catalog.`);
        await fetchProductsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. VENDOR ACTIONS
  const handleApproveBrand = async (vendorId: string) => {
    try {
      setActionLoadingId(vendorId);
      const res = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action: 'approve' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Brand "${vendorId}" approved and verified live!`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffffff', '#e6c367']
        });
        await fetchVendorsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error approving brand:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalVendor) return;

    try {
      setActionLoadingId(rejectionModalVendor.id);
      const res = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: rejectionModalVendor.id,
          action: 'reject',
          rejectionReason: rejectionReasonInput || 'Store profile information requires revision.'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Brand "${rejectionModalVendor.name}" returned for correction.`);
        setRejectionModalVendor(null);
        setRejectionReasonInput('');
        await fetchVendorsList();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error rejecting brand:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Derived Financial Calculations directly from real database orders
  const financialStats = useMemo(() => {
    const totalGMV = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.trackingStage >= 4);
    const settledPayouts = completedOrders.reduce((sum, o) => sum + Number(o.subtotal || 0), 0);
    const escrowLocked = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const platformCommission = Math.round(totalGMV * 0.10); // 10% marketplace fee
    const avgOrderValue = orders.length > 0 ? Math.round(totalGMV / orders.length) : 0;

    return {
      totalGMV,
      settledPayouts,
      escrowLocked,
      platformCommission,
      avgOrderValue,
      totalOrdersCount: orders.length
    };
  }, [orders]);

  // Derived Unique Customers Directory from real database orders
  const customersList = useMemo(() => {
    const customerMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      city: string;
      ordersCount: number;
      totalSpend: number;
      lastOrderDate: string;
    }>();

    orders.forEach((ord) => {
      const emailKey = (ord.customerEmail || ord.customerPhone || 'unknown').toLowerCase().trim();
      const spend = Number(ord.totalAmount || 0);

      if (!customerMap.has(emailKey)) {
        customerMap.set(emailKey, {
          name: ord.customerName || 'Shopper',
          email: ord.customerEmail || 'N/A',
          phone: ord.customerPhone || 'N/A',
          city: ord.deliveryCity || 'Nigeria',
          ordersCount: 1,
          totalSpend: spend,
          lastOrderDate: ord.date || ord.createdAt || 'Recent',
        });
      } else {
        const existing = customerMap.get(emailKey)!;
        existing.ordersCount += 1;
        existing.totalSpend += spend;
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerEmail || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q);

      let matchesStage = true;
      if (orderStageFilter !== 'all') {
        matchesStage = o.status === orderStageFilter || (orderStageFilter === 'delivered' && o.trackingStage >= 4);
      }

      return matchesSearch && matchesStage;
    });
  }, [orders, orderSearch, orderStageFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = productSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.vendorName || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q);

      let matchesCat = true;
      if (productCategoryFilter !== 'all') {
        matchesCat = (p.category || '').toLowerCase() === productCategoryFilter.toLowerCase();
      }

      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const q = vendorSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (v.name || '').toLowerCase().includes(q) ||
        (v.designerName || '').toLowerCase().includes(q) ||
        (v.location || '').toLowerCase().includes(q) ||
        (v.email || '').toLowerCase().includes(q);

      let matchesFilter = true;
      if (approvalFilter === 'pending') matchesFilter = v.approvalStatus === 'pending' || !v.isVerified;
      if (approvalFilter === 'approved') matchesFilter = v.approvalStatus === 'approved' || v.isVerified;
      if (approvalFilter === 'rejected') matchesFilter = v.approvalStatus === 'rejected';

      return matchesSearch && matchesFilter;
    });
  }, [vendors, vendorSearch, approvalFilter]);

  const pendingCount = vendors.filter(v => v.approvalStatus === 'pending' || !v.isVerified).length;
  const approvedCount = vendors.filter(v => v.approvalStatus === 'approved' || v.isVerified).length;

  // Navigation Items
  const navItems = [
    {
      id: 'overview',
      label: 'Executive HUD',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Customer Orders',
      icon: ShoppingCart,
      badge: orders.length > 0 ? `${orders.length}` : null,
      badgeColor: 'bg-[var(--gold-accent)] text-black font-bold'
    },
    {
      id: 'catalog',
      label: 'Catalog Moderation',
      icon: ShoppingBag,
      badge: `${products.length}`
    },
    {
      id: 'approvals',
      label: 'Brand Governance',
      icon: ShieldCheck,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-amber-500 text-black font-bold'
    },
    {
      id: 'finance',
      label: 'Escrow & Treasury',
      icon: DollarSign,
    },
    {
      id: 'customers',
      label: 'Shoppers Directory',
      icon: Users,
      badge: `${customersList.length}`
    },
  ];

  // ========================================================
  // 1. LOGIN GATEWAY (UNAUTHENTICATED)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
        
        {/* Left Column: Sticky Editorial Slideshow */}
        <div className="relative w-full lg:w-1/2 h-[340px] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between p-6 lg:p-12 bg-black select-none z-10">
          {adminEditorialSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-70 scale-105 transition-transform duration-[6000ms]' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized
                priority={idx === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
            </div>
          ))}

          <div className="relative z-20 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/images/logo/veyra-logo.png"
                alt="Veyra"
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-300" />}
              </button>
              <span className="px-3 py-1 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] text-[10px] font-mono-luxury uppercase tracking-widest font-bold backdrop-blur-md">
                {adminEditorialSlides[currentSlide].tag}
              </span>
            </div>
          </div>

          <div className="relative z-20 space-y-6 mt-auto">
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center gap-2">
                {adminEditorialSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-[var(--gold-accent)]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight">
                  {adminEditorialSlides[currentSlide].title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {adminEditorialSlides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-luxury text-zinc-400 border-t border-white/10 pt-4">
              <span>EXECUTIVE GOVERNANCE SUITE</span>
              <span>SUPER ADMIN COMMAND</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto min-h-screen">
          <div className="w-full max-w-md space-y-6 animate-fadeIn py-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono-luxury uppercase tracking-widest text-[var(--gold-accent)] font-bold">
                  Executive Security Gateway
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                Super Admin Login
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                Enter your authorized executive credentials to access complete platform operations, orders, catalog, and escrow treasury.
              </p>
            </div>

            {authError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-luxury flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Executive Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@veyra.ng"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter security key"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-full bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold hover:bg-[#d8b357] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Authority...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Access Command Center</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[var(--border-subtle)] text-center">
              <Link href="/" className="text-xs font-mono-luxury text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Return to Veyra Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // ========================================================
  // 2. AUTHENTICATED SUPER ADMIN CONTROL TOWER
  // ========================================================
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors flex flex-col">
      
      {/* ── TOP EXECUTIVE HEADER BAR ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/veyra-logo-horizontal.png"
              alt="Veyra"
              width={150}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono-luxury uppercase font-bold tracking-widest">
              SUPER ADMIN
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono-luxury">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[var(--text-primary)]">Platform Command Live</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAllData}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Refresh All Database Records"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingOrders || isLoadingProducts || isLoadingVendors ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/shop"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] transition-all"
          >
            <span>Live Store</span>
            <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-300" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-500 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Lock Session"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-mono-luxury font-bold">Lock Session</span>
          </button>
        </div>
      </header>

      {/* ── BODY SHELL ── */}
      <div className="flex-1 flex">
        
        {/* Left Sticky Sidebar (Desktop) */}
        <aside className="w-64 lg:w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 flex flex-col justify-between p-4 sm:p-6 shrink-0 hidden md:flex sticky top-[65px] h-[calc(100vh-65px)] self-start overflow-y-auto">
          <div className="space-y-6">
            
            {/* Executive Badge Card */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--gold-accent)]/15 text-[var(--gold-accent)] flex items-center justify-center font-editorial font-bold text-lg shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[var(--text-primary)] truncate font-editorial">
                    Executive Control
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono-luxury truncate">
                    Platform Governance
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono-luxury">
                <span className="text-[var(--text-muted)]">Database:</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Live
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 font-mono-luxury text-xs uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-left cursor-pointer ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? '' : 'text-[var(--gold-accent)]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                        isActive ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]' : item.badgeColor || 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono-luxury text-[var(--text-muted)] space-y-1">
            <div className="flex items-center justify-between">
              <span>Platform Mode:</span>
              <strong className="text-[var(--gold-accent)]">Production Live</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Escrow Status:</span>
              <strong className="text-emerald-500">Secured</strong>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full min-w-0 pb-28">
          
          {/* Action Success Banner */}
          {actionSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-luxury flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
              <button onClick={() => setActionSuccessMsg('')} className="text-xs hover:underline cursor-pointer">Dismiss</button>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: EXECUTIVE HUD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Platform Command Center
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Real-time live monitoring of marketplace transactions, brand verifications, and escrow status.
                </p>
              </div>

              {/* 5 Master KPI Metric Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span className="text-[10px] font-mono-luxury uppercase font-bold">Gross Merchandise Value</span>
                    <DollarSign className="h-4 w-4 text-[var(--gold-accent)]" />
                  </div>
                  <div className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">
                    ₦{financialStats.totalGMV.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono-luxury text-emerald-500 font-bold">
                    {orders.length} total customer orders
                  </div>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-[10px] font-mono-luxury uppercase font-bold">Escrow Locked</span>
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="font-editorial text-3xl font-bold text-amber-400">
                    ₦{financialStats.escrowLocked.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                    Funds safe pending delivery
                  </div>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-[10px] font-mono-luxury uppercase font-bold">Settled to Brands</span>
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="font-editorial text-3xl font-bold text-emerald-400">
                    ₦{financialStats.settledPayouts.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono-luxury text-[var(--text-muted)]">
                    Delivered & confirmed orders
                  </div>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span className="text-[10px] font-mono-luxury uppercase font-bold">Verified Designers</span>
                    <Store className="h-4 w-4 text-[var(--gold-accent)]" />
                  </div>
                  <div className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
                    {approvedCount}
                  </div>
                  <div className="text-[10px] font-mono-luxury text-amber-400 font-bold">
                    {pendingCount} applications pending
                  </div>
                </div>
              </div>

              {/* Recent Orders Ticker */}
              <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                      Recent Marketplace Orders
                    </h3>
                    <span className="text-xs text-[var(--text-secondary)] font-mono-luxury">
                      Live customer orders placed across all verified stores
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-mono-luxury uppercase text-[var(--gold-accent)] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({orders.length})</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono-luxury text-[var(--text-muted)]">
                    No orders recorded yet. Complete a checkout to see live records here.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {orders.slice(0, 5).map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono-luxury flex-wrap">
                        <div>
                          <strong className="text-[var(--text-primary)]">{ord.orderNumber}</strong>
                          <span className="text-[var(--text-muted)] ml-2">• {ord.customerName} ({ord.deliveryCity || 'Lagos'})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--gold-accent)] font-bold">₦{Number(ord.totalAmount || 0).toLocaleString()}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            ord.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {ord.status || 'Escrow Secured'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LIVE CUSTOMER ORDERS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    Customer Orders Management
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                    Inspect every customer order, verify multi-vendor packages, update shipping stages, or release escrow payouts.
                  </p>
                </div>

                <button
                  onClick={fetchOrdersList}
                  className="px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  <span>Refresh Orders</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl surface-card border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'escrow_secured', 'packing', 'dispatched', 'delivered'] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setOrderStageFilter(stage)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                        orderStageFilter === stage
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {stage.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[280px]">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order #, customer, email, phone..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>

              {/* Orders Table */}
              {isLoadingOrders ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin mx-auto" />
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading live orders from PostgreSQL database...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center surface-card rounded-3xl border border-[var(--border-subtle)] space-y-3">
                  <ShoppingCart className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    No orders matching your criteria
                  </h3>
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                    Try switching your search keywords or filter stages above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const isDelivered = ord.status === 'delivered' || ord.trackingStage >= 4;
                    const isActioning = actionLoadingId === ord.id;

                    return (
                      <div
                        key={ord.id}
                        className="p-5 sm:p-6 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/40 transition-all space-y-4 shadow-sm"
                      >
                        {/* Top Line */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                              {ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-luxury font-bold uppercase ${
                              isDelivered
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                            }`}>
                              ● {ord.status || 'Escrow Secured'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono-luxury">
                            <span className="text-[var(--text-muted)]">{ord.date || ord.createdAt}</span>
                            <span className="text-[var(--gold-accent)] text-base font-bold">₦{Number(ord.totalAmount || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Customer & Delivery Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-luxury text-[var(--text-secondary)]">
                          <div>
                            <span className="text-[10px] uppercase text-[var(--text-muted)] block">Customer:</span>
                            <strong className="text-[var(--text-primary)]">{ord.customerName}</strong>
                            <div className="text-[11px] text-[var(--text-muted)]">{ord.customerPhone}</div>
                            <div className="text-[11px] text-[var(--text-muted)] truncate">{ord.customerEmail}</div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase text-[var(--text-muted)] block">Delivery Destination:</span>
                            <strong className="text-[var(--text-primary)]">{ord.deliveryAddress}</strong>
                            <div className="text-[11px] text-[var(--text-muted)]">{ord.deliveryCity}</div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase text-[var(--text-muted)] block">Fulfillment / Courier:</span>
                            <strong className="text-emerald-400">{ord.trackingDetails?.courierName || 'Shipbubble Live Dispatch'}</strong>
                            <div className="text-[11px] text-[var(--text-muted)]">Waybill: {ord.trackingDetails?.waybillNumber || 'Pending pickup'}</div>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="pt-2 flex items-center gap-3 overflow-x-auto pb-1">
                          {(ord.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shrink-0">
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-black shrink-0">
                                <Image src={item.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'} alt="" fill unoptimized className="object-cover" />
                              </div>
                              <div className="text-[11px] font-mono-luxury min-w-[120px]">
                                <div className="font-bold text-[var(--text-primary)] truncate">{item.productName}</div>
                                <div className="text-[var(--text-muted)]">{item.size} • ₦{Number(item.price).toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)]">Advance Stage:</span>
                            <button
                              onClick={() => handleUpdateOrderStage(ord.id, 2)}
                              disabled={isActioning}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[10px] font-mono-luxury font-bold uppercase transition-all cursor-pointer"
                            >
                              Packing (Stage 2)
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStage(ord.id, 3)}
                              disabled={isActioning}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[10px] font-mono-luxury font-bold uppercase transition-all cursor-pointer"
                            >
                              Dispatched (Stage 3)
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStage(ord.id, 4)}
                              disabled={isActioning}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-[10px] font-mono-luxury font-bold uppercase transition-all cursor-pointer"
                            >
                              Delivered (Stage 4)
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isDelivered && (
                              <button
                                onClick={() => handleReleaseEscrow(ord.id)}
                                disabled={isActioning}
                                className="px-3 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-mono-luxury uppercase font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>Release Escrow Payout</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOrderModal(ord)}
                              className="px-3 py-1.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:border-[var(--gold-accent)] transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                              <span>Full Receipt</span>
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              disabled={isActioning}
                              className="p-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: COMPLETE CATALOG & PRODUCT MODERATION */}
          {/* ======================================================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    Marketplace Catalog Moderation
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                    Monitor, inspect, feature, or remove product drops from all Nigerian designers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/vendor-portal/publish"
                    target="_blank"
                    className="px-4 py-2 rounded-full bg-[var(--gold-accent)] text-black text-xs font-mono-luxury uppercase font-bold hover:bg-[#d8b357] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Add New Drop</span>
                  </Link>

                  <button
                    onClick={fetchProductsList}
                    className="px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl surface-card border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'native', 'streetwear', 'footwear', 'jewelry', 'outerwear', 'accessories'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                        productCategoryFilter === cat
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[280px]">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product name, brand..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>

              {/* Products Grid */}
              {isLoadingProducts ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin mx-auto" />
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading catalog products from database...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center surface-card rounded-3xl border border-[var(--border-subtle)] space-y-3">
                  <ShoppingBag className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    No products found
                  </h3>
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                    Try adjusting your search query or category filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => {
                    const isActioning = actionLoadingId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/50 transition-all flex flex-col justify-between space-y-3 shadow-md group"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black">
                            <Image
                              src={p.imageUrl || p.image_url || '/images/products/BlackTrapStarHoodie.jpg'}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {p.is_featured && (
                              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[var(--gold-accent)] text-black text-[9px] font-mono-luxury font-bold uppercase">
                                Featured
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs font-mono-luxury">
                              <span className="text-[var(--gold-accent)] uppercase font-bold text-[10px]">{p.category || 'Fashion'}</span>
                              <strong className="text-[var(--text-primary)]">₦{Number(p.price || 0).toLocaleString()}</strong>
                            </div>
                            <h4 className="font-editorial text-base font-bold text-[var(--text-primary)] line-clamp-1 mt-0.5">
                              {p.name}
                            </h4>
                            <p className="text-[11px] text-[var(--text-muted)] font-mono-luxury truncate">
                              Vendor: {p.vendorName || p.vendor_name || 'Designer'}
                            </p>
                          </div>
                        </div>

                        {/* Super Admin Action Bar */}
                        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleToggleProductFeatured(p.id, p.is_featured)}
                            disabled={isActioning}
                            className={`px-3 py-1 rounded-xl text-[10px] font-mono-luxury uppercase font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              p.is_featured
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'surface-card border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <Star className={`h-3 w-3 ${p.is_featured ? 'fill-current' : ''}`} />
                            <span>{p.is_featured ? 'Featured' : 'Feature'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/shop/${p.id}`}
                              target="_blank"
                              className="p-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--gold-accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                              title="View in Live Shop"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              disabled={isActioning}
                              className="p-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete from Marketplace"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BRAND GOVERNANCE & APPROVALS */}
          {/* ======================================================== */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    Brand Governance & Verification
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                    Review designer onboarding, verify Nigerian bank settlement accounts, and manage storefront status.
                  </p>
                </div>

                <button
                  onClick={fetchVendorsList}
                  className="px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingVendors ? 'animate-spin' : ''}`} />
                  <span>Refresh Brands</span>
                </button>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Total Registered Brands</span>
                  <strong className="font-editorial text-3xl font-bold text-[var(--text-primary)]">{vendors.length}</strong>
                </div>
                <div className="p-5 rounded-3xl surface-card border border-amber-500/30 bg-amber-500/5 space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-amber-400 font-bold block">Pending Review</span>
                  <strong className="font-editorial text-3xl font-bold text-amber-400">{pendingCount}</strong>
                </div>
                <div className="p-5 rounded-3xl surface-card border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-emerald-400 font-bold block">Approved & Verified</span>
                  <strong className="font-editorial text-3xl font-bold text-emerald-400">{approvedCount}</strong>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl surface-card border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setApprovalFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono-luxury uppercase font-bold transition-all cursor-pointer ${
                        approvalFilter === filter
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                          : 'surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[280px]">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search brand, manager, location..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[var(--gold-accent)] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>

              {/* Vendors List Cards */}
              {isLoadingVendors ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-[var(--gold-accent)] animate-spin mx-auto" />
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">Loading brand submissions from database...</p>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="p-12 text-center surface-card rounded-3xl border border-[var(--border-subtle)] space-y-3">
                  <Store className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    No brands matching your filter
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVendors.map((vendor) => {
                    const isApproved = vendor.isVerified || vendor.approvalStatus === 'approved';
                    const isPending = vendor.approvalStatus === 'pending' || !vendor.isVerified;
                    const isActioning = actionLoadingId === vendor.id;

                    return (
                      <div
                        key={vendor.id}
                        className="p-6 sm:p-7 rounded-3xl surface-card border border-[var(--border-subtle)] hover:border-[var(--gold-accent)]/40 transition-all space-y-5 shadow-sm"
                      >
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="h-14 w-14 rounded-2xl bg-[var(--gold-subtle)] border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] font-editorial font-bold text-2xl flex items-center justify-center shrink-0">
                              {vendor.name ? vendor.name.charAt(0).toUpperCase() : 'V'}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                  {vendor.name}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-luxury font-bold uppercase ${
                                  isApproved
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                                }`}>
                                  ● {isApproved ? 'Verified & Active' : 'Pending Review'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-mono-luxury text-[var(--text-secondary)] mt-1 flex-wrap">
                                <span>Manager: <strong className="text-[var(--text-primary)]">{vendor.designerName}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[var(--gold-accent)]" />{vendor.location}</span>
                                <span>•</span>
                                <span>{vendor.email}</span>
                                <span>•</span>
                                <span>{vendor.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <button
                                onClick={() => handleApproveBrand(vendor.id)}
                                disabled={isActioning}
                                className="px-4 py-2 rounded-full bg-emerald-500 text-black text-xs font-mono-luxury uppercase font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                <span>Approve Brand</span>
                              </button>
                            )}

                            <button
                              onClick={() => setRejectionModalVendor(vendor)}
                              disabled={isActioning}
                              className="px-4 py-2 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:border-rose-500 text-rose-400 transition-all cursor-pointer"
                            >
                              Return / Notes
                            </button>

                            <Link
                              href={`/brand/${encodeURIComponent(vendor.name)}`}
                              target="_blank"
                              className="p-2 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                              title="Storefront Preview"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Middle: Bank Settlement Account & Socials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[var(--border-subtle)] text-xs font-mono-luxury">
                          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block flex items-center gap-1">
                              <Building className="h-3 w-3 text-[var(--gold-accent)]" />
                              Nigerian Bank Settlement Account
                            </span>
                            <div className="text-[var(--text-primary)] font-bold">
                              {vendor.accountNumber || '0123456789'} • {vendor.bankName || 'GTBank / Moniepoint'}
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)]">
                              Beneficiary: {vendor.accountName || vendor.name}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">
                              Social & Store Contact
                            </span>
                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              {vendor.instagram && <span className="inline-flex items-center gap-1 text-[11px]"><InstagramLogo />{vendor.instagram}</span>}
                              {vendor.tiktok && <span className="inline-flex items-center gap-1 text-[11px]"><TikTokLogo />{vendor.tiktok}</span>}
                              {vendor.whatsapp && <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400"><Phone className="h-3 w-3" />{vendor.whatsapp}</span>}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ESCROW & TREASURY */}
          {/* ======================================================== */}
          {activeTab === 'finance' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Escrow Settlements & Treasury
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Live platform balances, gross sales, merchant escrow holdings, and calculated platform commissions.
                </p>
              </div>

              {/* 4 Financial Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Gross Marketplace Volume</span>
                  <strong className="font-editorial text-3xl font-bold text-[var(--gold-accent)]">₦{financialStats.totalGMV.toLocaleString()}</strong>
                  <span className="text-[10px] font-mono-luxury text-zinc-400 block">Total sales processed</span>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-amber-500/20 bg-amber-500/5 space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-amber-400 font-bold block">Active Escrow Locked</span>
                  <strong className="font-editorial text-3xl font-bold text-amber-400">₦{financialStats.escrowLocked.toLocaleString()}</strong>
                  <span className="text-[10px] font-mono-luxury text-zinc-400 block">Pending customer delivery</span>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-emerald-400 font-bold block">Settled to Vendors</span>
                  <strong className="font-editorial text-3xl font-bold text-emerald-400">₦{financialStats.settledPayouts.toLocaleString()}</strong>
                  <span className="text-[10px] font-mono-luxury text-zinc-400 block">Completed orders</span>
                </div>

                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">Platform Commission (10%)</span>
                  <strong className="font-editorial text-3xl font-bold text-cyan-400">₦{financialStats.platformCommission.toLocaleString()}</strong>
                  <span className="text-[10px] font-mono-luxury text-zinc-400 block">Calculated revenue</span>
                </div>
              </div>

              {/* Transaction Accounting Ledger */}
              <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    Transaction Accounting Ledger
                  </h3>
                  <span className="text-xs font-mono-luxury text-[var(--text-muted)]">
                    {orders.length} transactions recorded in database
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono-luxury text-[var(--text-muted)]">
                    No transactions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-luxury">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase text-[10px]">
                          <th className="pb-3 font-bold">Order Ref</th>
                          <th className="pb-3 font-bold">Customer</th>
                          <th className="pb-3 font-bold">Items Total</th>
                          <th className="pb-3 font-bold">Delivery Fee</th>
                          <th className="pb-3 font-bold">Grand Total</th>
                          <th className="pb-3 font-bold">Escrow Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                            <td className="py-3 font-bold text-[var(--text-primary)]">{ord.orderNumber}</td>
                            <td className="py-3 text-[var(--text-secondary)]">{ord.customerName}</td>
                            <td className="py-3 text-[var(--text-primary)]">₦{Number(ord.subtotal || 0).toLocaleString()}</td>
                            <td className="py-3 text-[var(--gold-accent)]">₦{Number(ord.shippingFee || 0).toLocaleString()}</td>
                            <td className="py-3 font-bold text-[var(--text-primary)]">₦{Number(ord.totalAmount || 0).toLocaleString()}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ord.status || 'Escrow Locked'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: SHOPPERS & CUSTOMERS DIRECTORY */}
          {/* ======================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Verified Shoppers Directory
                </h1>
                <p className="text-xs text-[var(--text-secondary)] font-mono-luxury mt-1">
                  Directory of registered customers and buyers across Nigeria.
                </p>
              </div>

              {customersList.length === 0 ? (
                <div className="p-12 text-center surface-card rounded-3xl border border-[var(--border-subtle)] space-y-3">
                  <Users className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-40" />
                  <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    No customers recorded yet
                  </h3>
                  <p className="text-xs font-mono-luxury text-[var(--text-secondary)]">
                    Customer records will automatically populate as orders are placed.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl surface-card border border-[var(--border-subtle)] space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-luxury">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase text-[10px]">
                          <th className="pb-3 font-bold">Shopper Name</th>
                          <th className="pb-3 font-bold">Email Address</th>
                          <th className="pb-3 font-bold">Phone Number</th>
                          <th className="pb-3 font-bold">Location</th>
                          <th className="pb-3 font-bold">Orders</th>
                          <th className="pb-3 font-bold">Lifetime Spend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {customersList.map((c, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-surface)] transition-colors">
                            <td className="py-3 font-bold text-[var(--text-primary)]">{c.name}</td>
                            <td className="py-3 text-[var(--text-secondary)]">{c.email}</td>
                            <td className="py-3 text-[var(--text-secondary)]">{c.phone}</td>
                            <td className="py-3 text-[var(--text-secondary)]">{c.city}</td>
                            <td className="py-3 text-[var(--gold-accent)] font-bold">{c.ordersCount}</td>
                            <td className="py-3 font-bold text-emerald-400">₦{c.totalSpend.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ── FULL ORDER RECEIPT & INSPECTION MODAL ── */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl surface-card p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[10px] font-mono-luxury uppercase text-[var(--gold-accent)] font-bold block">
                  Official Order Dossier
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  {selectedOrderModal.orderNumber}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrderModal(null)}
                className="p-2 rounded-full surface-card border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Customer & Delivery Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-luxury">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Customer Contact</span>
                <div className="font-bold text-[var(--text-primary)]">{selectedOrderModal.customerName}</div>
                <div>Phone: {selectedOrderModal.customerPhone}</div>
                <div className="truncate">Email: {selectedOrderModal.customerEmail}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Delivery Address</span>
                <div className="font-bold text-[var(--text-primary)]">{selectedOrderModal.deliveryAddress}</div>
                <div>City / State: {selectedOrderModal.deliveryCity}</div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <span className="text-xs font-mono-luxury uppercase text-[var(--text-muted)] font-bold block">
                Purchased Pieces ({selectedOrderModal.items?.length || 0})
              </span>

              <div className="divide-y divide-[var(--border-subtle)]">
                {(selectedOrderModal.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs font-mono-luxury">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black shrink-0">
                        <Image src={item.imageUrl || '/images/products/BlackTrapStarHoodie.jpg'} alt="" fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{item.productName}</div>
                        <div className="text-[var(--text-muted)]">Size: {item.size} • Qty: {item.quantity} • Vendor: {item.vendorName}</div>
                      </div>
                    </div>

                    <strong className="text-[var(--gold-accent)] shrink-0">₦{Number(item.price * (item.quantity || 1)).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1.5 text-xs font-mono-luxury">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[var(--text-primary)]">₦{Number(selectedOrderModal.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Delivery Fee:</span>
                <span className="font-bold text-[var(--gold-accent)]">₦{Number(selectedOrderModal.shippingFee || 0).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[var(--gold-accent)] text-lg">₦{Number(selectedOrderModal.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="px-5 py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:bg-[var(--bg-surface)] cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── REJECT / RETURN FEEDBACK MODAL ── */}
      {rejectionModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg surface-card p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  Return Submission for Correction
                </h3>
                <span className="text-xs font-mono-luxury text-[var(--text-muted)]">
                  Brand: {rejectionModalVendor.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-mono-luxury leading-relaxed">
              When returned, the vendor's profile fields will unlock so they can correct their store details, bio, or contact information and resubmit for approval.
            </p>

            <form onSubmit={handleRejectBrandSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-luxury uppercase text-[var(--text-secondary)] mb-1 font-bold">
                  Correction Feedback Note (Sent to Vendor)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Please update your store contact phone number and provide an active Instagram handle."
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalVendor(null)}
                  className="px-5 py-2.5 rounded-full surface-card border border-[var(--border-subtle)] text-xs font-mono-luxury uppercase font-bold hover:bg-[var(--bg-surface)] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoadingId === rejectionModalVendor.id}
                  className="px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-mono-luxury uppercase font-bold hover:bg-rose-600 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoadingId === rejectionModalVendor.id ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>Return to Vendor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
