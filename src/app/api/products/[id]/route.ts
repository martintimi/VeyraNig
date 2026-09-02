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
      'heather grey': '#9ca3af',
      'charcoal grey': '#374151',
      'charcoal gray': '#374151',
      'light grey': '#d1d5db',
      'light gray': '#d1d5db',
      navy: '#1e3a8a',
      'navy blue': '#1e3a8a',
      'royal blue': '#2563eb',
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
      'khaki / beige': '#d4b996',
      'khaki/beige': '#d4b996',
      khaki: '#d4b996',
      tan: '#d2b48c',
      cream: '#fdfbf7',
      gold: '#d97706',
      'emerald gold': '#e6c367',
      yellow: '#eab308',
      'mustard yellow': '#d97706',
      orange: '#ea580c',
      'vibrant orange': '#ea580c',
      purple: '#7e22ce',
      'lavender purple': '#9333ea',
      pink: '#ec4899',
      'pastel pink': '#f472b6',
      burgundy: '#800020',
      'wine / burgundy': '#831843',
      'wine/burgundy': '#831843',
      wine: '#722f37',
      maroon: '#800000',
      teal: '#0d9488',
      turquoise: '#06b6d4',
      silver: '#e5e7eb',
    };

    function resolveColorHex(name: string = '', fallbackHex?: string): string {
      if (fallbackHex && fallbackHex.startsWith('#') && fallbackHex !== '#111111' && fallbackHex !== '#000000') {
        return fallbackHex;
      }
      const lower = name.toLowerCase().trim();
      if (COLOR_HEX_MAP[lower]) return COLOR_HEX_MAP[lower];
      if (lower.includes('khaki') || lower.includes('beige') || lower.includes('cream') || lower.includes('sand')) return '#d4b996';
      if (lower.includes('brown') || lower.includes('chocolate') || lower.includes('coffee')) return '#78350f';
      if (lower.includes('white') || lower.includes('off-white') || lower.includes('off white')) return '#ffffff';
      if (lower.includes('black') || lower.includes('onyx') || lower.includes('noir')) return '#111111';
      if (lower.includes('charcoal') || lower.includes('grey') || lower.includes('gray')) return '#374151';
      if (lower.includes('navy')) return '#1e3a8a';
      if (lower.includes('sky')) return '#38bdf8';
      if (lower.includes('blue')) return '#2563eb';
      if (lower.includes('olive')) return '#556b2f';
      if (lower.includes('forest') || lower.includes('emerald') || lower.includes('green')) return '#16a34a';
      if (lower.includes('wine') || lower.includes('burgundy') || lower.includes('maroon')) return '#831843';
      if (lower.includes('red') || lower.includes('crimson')) return '#dc2626';
      if (lower.includes('gold') || lower.includes('mustard') || lower.includes('yellow')) return '#d97706';
      if (lower.includes('purple') || lower.includes('lavender') || lower.includes('violet')) return '#7e22ce';
      if (lower.includes('pink') || lower.includes('rose') || lower.includes('blush')) return '#f472b6';
      if (lower.includes('orange')) return '#ea580c';
      if (lower.includes('teal') || lower.includes('turquoise')) return '#0d9488';
      return fallbackHex || '#111111';
    }

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
          const hex = resolveColorHex(trimmed);
          const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
          return { name: formattedName, hex };
        }
        if (typeof c === 'object' && c !== null) {
          const rawName = String(c.name || '').trim();
          if (rawName && !rawName.toLowerCase().startsWith('colorway')) {
            const hex = resolveColorHex(rawName, c.hex);
            return { name: rawName, hex };
          }
          if (c.hex) {
            const hexLower = String(c.hex).toLowerCase().trim();
            const foundKey = Object.keys(COLOR_HEX_MAP).find(k => COLOR_HEX_MAP[k] === hexLower);
            const name = foundKey ? foundKey.charAt(0).toUpperCase() + foundKey.slice(1) : (rawName || 'Standard');
            return { name, hex: c.hex };
          }
          return { name: rawName || 'Standard', hex: resolveColorHex(rawName) };
        }
        return { name: 'Standard', hex: '#111111' };
      });
    }

    if (normalizedColors.length === 0) {
      normalizedColors = [{ name: 'As Featured', hex: '#111111' }];
    }

    const isAccessory = product.category === 'accessories';

    // Fetch product variants for sizing & stock
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id);

    const dynamicSizeStock: Record<string, { enabled: boolean; quantity: number }> = {};
    let dynamicTotalStock = 0;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      variants.forEach((v) => {
        dynamicSizeStock[v.size] = { enabled: true, quantity: Number(v.stock_quantity) || 0 };
        dynamicTotalStock += Number(v.stock_quantity) || 0;
      });
    }

    let resolvedSizes: string[] = ['M', 'L', 'XL'];
    if (isAccessory) {
      resolvedSizes = ['One Size'];
    } else if (Object.keys(dynamicSizeStock).length > 0) {
      resolvedSizes = Object.keys(dynamicSizeStock);
    } else if (product.category === 'footwear') {
      resolvedSizes = ['40', '41', '42', '43', '44'];
    }

    const finalSizeStock = isAccessory
      ? { 'One Size': dynamicSizeStock['One Size'] || { enabled: true, quantity: 20 } }
      : Object.keys(dynamicSizeStock).length > 0
      ? dynamicSizeStock
      : (product.category === 'footwear'
        ? { '40': { enabled: true, quantity: 10 }, '41': { enabled: true, quantity: 10 }, '42': { enabled: true, quantity: 10 } }
        : { S: { enabled: true, quantity: 10 }, M: { enabled: true, quantity: 20 }, L: { enabled: true, quantity: 20 } });

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
      description: product.description && product.description.trim().toLowerCase() !== product.name.trim().toLowerCase() ? product.description : '',
      category: product.category || 'tops',
      genderTarget: product.gender_target || 'unisex',
      garmentOriginType: product.garment_origin_type || 'ready_made_boutique',
      imageUrl: product.image_url || '/images/products/BlackTrapStarHoodie.jpg',
      tags: Array.isArray(product.tags) && product.tags.length > 0 ? product.tags : ['Ready-to-Wear'],
      colors: isAccessory ? [] : normalizedColors,
      sizes: resolvedSizes,
      sizeStock: finalSizeStock,
      stockQuantity: dynamicTotalStock > 0 ? dynamicTotalStock : (isAccessory ? 20 : 50),
      rating: 0,
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
