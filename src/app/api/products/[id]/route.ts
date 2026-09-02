import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const NIGERIAN_STATES = [
  'Lagos', 'Ogun', 'Oyo', 'Abuja', 'FCT - Abuja', 'Rivers', 'Anambra', 'Enugu', 'Delta',
  'Edo', 'Kano', 'Kaduna', 'Ondo', 'Osun', 'Ekiti', 'Kwara', 'Abia', 'Akwa Ibom',
  'Bayelsa', 'Benue', 'Cross River', 'Ebonyi', 'Gombe', 'Imo', 'Jigawa', 'Katsina',
  'Kebbi', 'Kogi', 'Nasarawa', 'Niger', 'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Bauchi', 'Borno', 'Adamawa'
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let vendorName = 'Verified Vendor';
    let vendorCity = '';
    let vendorState = '';
    let vendorLocation = '';
    let dispatchDays = '1-2 business days';
    let shippingRates = {
      sameCity: 1000,
      closeHub: 2500,
      interstate: 4500,
      parkPickup: 1500,
      parkPickupEnabled: true,
    };

    if (product.vendor_id) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, brand_name, designer_name, location, bio, rating')
        .eq('id', product.vendor_id)
        .maybeSingle();

      if (vendor) {
        vendorName = vendor.brand_name || vendor.designer_name || 'Verified Vendor';
        if (vendor.bio && vendor.bio.startsWith('{') && vendor.bio.endsWith('}')) {
          try {
            const parsed = JSON.parse(vendor.bio);
            vendorCity = parsed.city || '';
            vendorState = parsed.state || '';
            dispatchDays = parsed.dispatchDays || '1-2 business days';
            if (parsed.shippingRates) {
              shippingRates = { ...shippingRates, ...parsed.shippingRates };
            }
          } catch (e) {}
        }

        if (!vendorCity && vendor.location) {
          const rawLoc = vendor.location.trim();
          const parts = rawLoc.split(',').map((s: string) => s.trim());
          if (parts.length >= 2) {
            vendorCity = parts[0];
            const candidateState = parts[1].replace(/nigeria/gi, '').trim();
            vendorState = candidateState || parts[0];
          } else {
            vendorCity = rawLoc;
            vendorState = rawLoc;
          }
        }

        // Clean up vendorState if it says "Nigeria"
        if (!vendorState || vendorState.toLowerCase() === 'nigeria') {
          if (vendorCity && NIGERIAN_STATES.some(st => st.toLowerCase() === vendorCity.toLowerCase())) {
            vendorState = vendorCity;
          } else {
            vendorState = 'Lagos State';
          }
        }

        if (vendorState && !vendorState.toLowerCase().includes('state') && !vendorState.toLowerCase().includes('fct') && !vendorState.toLowerCase().includes('abuja')) {
          vendorState = `${vendorState} State`;
        }

        vendorLocation = vendor.location || (vendorCity && vendorState ? `${vendorCity}, ${vendorState}` : vendorCity || vendorState || '');
      } else {
        vendorName = product.vendor_id.charAt(0).toUpperCase() + product.vendor_id.slice(1).replace(/-/g, ' ');
      }
    }

    const COLOR_HEX_MAP: Record<string, string> = {
      black: '#111111',
      'onyx black': '#111111',
      'jet black': '#0a0a0a',
      white: '#ffffff',
      'pure white': '#ffffff',
      'off white': '#f5f5f5',
      grey: '#6b7280',
      gray: '#6b7280',
      'charcoal grey': '#374151',
      'charcoal gray': '#374151',
      'light grey': '#d1d5db',
      'light gray': '#d1d5db',
      navy: '#1e3a8a',
      'navy blue': '#1e3a8a',
      'royal blue': '#1d4ed8',
      'sky blue': '#38bdf8',
      blue: '#2563eb',
      red: '#dc2626',
      'crimson red': '#991b1b',
      green: '#16a34a',
      'forest green': '#14532d',
      'emerald green': '#059669',
      olive: '#556b2f',
      'olive green': '#556b2f',
      brown: '#78350f',
      'chocolate brown': '#451a03',
      beige: '#d4b996',
      tan: '#d2b48c',
      cream: '#fdfbf7',
      gold: '#d97706',
      yellow: '#eab308',
      orange: '#ea580c',
      purple: '#7e22ce',
      pink: '#ec4899',
      burgundy: '#800020',
      wine: '#722f37',
      maroon: '#800000',
      khaki: '#c3b091',
      teal: '#0d9488',
      turquoise: '#06b6d4',
      silver: '#e5e7eb',
    };

    let normalizedColors: { name: string; hex: string }[] = [];
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      normalizedColors = product.colors.map((c: any) => {
        if (typeof c === 'string') {
          const trimmed = c.trim();
          if (trimmed.startsWith('#')) {
            const hexLower = trimmed.toLowerCase();
            const foundKey = Object.keys(COLOR_HEX_MAP).find(k => COLOR_HEX_MAP[k] === hexLower);
            const name = foundKey ? foundKey.charAt(0).toUpperCase() + foundKey.slice(1) : trimmed;
            return { name, hex: trimmed };
          }
          const lower = trimmed.toLowerCase();
          const hex = COLOR_HEX_MAP[lower] || '#111111';
          const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
          return { name: formattedName, hex };
        }
        if (typeof c === 'object' && c !== null) {
          const rawName = String(c.name || '').trim();
          if (rawName && !rawName.toLowerCase().startsWith('colorway')) {
            const hex = c.hex || COLOR_HEX_MAP[rawName.toLowerCase()] || '#111111';
            return { name: rawName, hex };
          }
          if (c.hex) {
            const hexLower = String(c.hex).toLowerCase().trim();
            const foundKey = Object.keys(COLOR_HEX_MAP).find(k => COLOR_HEX_MAP[k] === hexLower);
            const name = foundKey ? foundKey.charAt(0).toUpperCase() + foundKey.slice(1) : (rawName || 'Standard');
            return { name, hex: c.hex };
          }
          return { name: rawName || 'Standard', hex: '#111111' };
        }
        return { name: 'Standard', hex: '#111111' };
      });
    }

    if (normalizedColors.length === 0) {
      normalizedColors = [{ name: 'As Featured', hex: '#111111' }];
    }

    const isAccessory = product.category === 'accessories';

    // Strictly resolve vendor-selected sizes
    let resolvedSizes: string[] = ['M', 'L', 'XL'];
    if (isAccessory) {
      resolvedSizes = ['One Size'];
    } else if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      resolvedSizes = product.sizes;
    } else if (product.size_stock && typeof product.size_stock === 'object') {
      const enabled = Object.keys(product.size_stock).filter(sz => {
        const v = product.size_stock[sz];
        return typeof v === 'object' ? v?.enabled !== false : Number(v) > 0;
      });
      if (enabled.length > 0) {
        resolvedSizes = enabled;
      }
    }

    const formattedProduct = {
      id: product.id,
      vendorId: product.vendor_id,
      vendorName,
      vendorCity,
      vendorState,
      vendorLocation,
      dispatchDays,
      shippingRates,
      name: product.name,
      price: Number(product.price),
      description: product.description || '',
      category: product.category || 'tops',
      genderTarget: product.gender_target || 'unisex',
      garmentOriginType: product.garment_origin_type || 'ready_made_boutique',
      imageUrl: product.image_url || '/images/products/BlackTrapStarHoodie.jpg',
      tags: Array.isArray(product.tags) && product.tags.length > 0 ? product.tags : ['Ready-to-Wear'],
      colors: isAccessory ? [] : normalizedColors,
      sizes: resolvedSizes,
      sizeStock: isAccessory 
        ? { 'One Size': typeof product.size_stock?.['One Size'] === 'object' ? product.size_stock['One Size'] : { enabled: true, quantity: product.stock_quantity || 20 } }
        : (product.size_stock || {}),
      stockQuantity: product.stock_quantity || 20,
      rating: 5.0,
      reviewCount: 0,
      createdAt: product.created_at,
      badge: isAccessory ? 'Jewelry & Accessories' : 'Ready-to-Wear'
    };

    return NextResponse.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
