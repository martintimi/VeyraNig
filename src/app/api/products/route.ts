import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const NIGERIAN_STATES = [
  'Lagos', 'Ogun', 'Oyo', 'Abuja', 'FCT - Abuja', 'Rivers', 'Anambra', 'Enugu', 'Delta',
  'Edo', 'Kano', 'Kaduna', 'Ondo', 'Osun', 'Ekiti', 'Kwara', 'Abia', 'Akwa Ibom',
  'Bayelsa', 'Benue', 'Cross River', 'Ebonyi', 'Gombe', 'Imo', 'Jigawa', 'Katsina',
  'Kebbi', 'Kogi', 'Nasarawa', 'Niger', 'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Bauchi', 'Borno', 'Adamawa'
];

export function getSmartFallbackImage(name: string = '', category: string = ''): string {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();
  if (n.includes('agbada') || c === 'agbada_robes' || c === 'boubou_kaftans') return '/images/products/BlackAgbada.jpg';
  if (n.includes('senator') || n.includes('kaftan') || c === 'senator_kaftan') return '/images/products/BlackSenator.jpg';
  if (n.includes('jean') || n.includes('pant') || n.includes('trouser') || n.includes('cargo') || c === 'jeans_trousers' || c === 'unisex_denim' || c === 'bottoms' || c === 'women_jeans_trousers') return '/images/products/BaggyJean.jpg';
  if (n.includes('shoe') || n.includes('slide') || n.includes('loafer') || n.includes('sneaker') || n.includes('croc') || n.includes('heel') || n.includes('addidas') || n.includes('adidas') || c === 'footwear' || c === 'men_footwear' || c === 'women_footwear' || c === 'unisex_footwear') return '/images/products/AddidasShoeUnisex.jpg';
  if (n.includes('cap') || n.includes('beanie') || n.includes('hat') || c === 'accessories' || c === 'men_caps' || c === 'women_bags' || c === 'unisex_accessories') return '/images/products/GucciCap.jpg';
  if (n.includes('blue') && (n.includes('hoodie') || n.includes('jacket'))) return '/images/products/BlueAndWhiteLosAngelisHoddie.jpg';
  if (n.includes('brown') || n.includes('white')) return '/images/products/WhiteNdBrownHoodie.jpg';
  return '/images/products/BlackTrapStarHoodie.jpg';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = 
      searchParams.get('vendorId') || 
      searchParams.get('id') || 
      request.headers.get('x-vendor-id');
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const origin = searchParams.get('origin');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();

    let query = supabase.from('products').select('*').order('created_at', { ascending: false }).limit(limit);

    if (vendorId && vendorId !== 'all') {
      query = query.or(`vendor_id.eq.${vendorId},vendor_id.ilike.%${vendorId}%`);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (gender && gender !== 'all' && gender !== 'unisex') {
      query = query.or(`gender_target.eq.${gender},gender_target.eq.unisex`);
    }
    if (origin) {
      query = query.eq('garment_origin_type', origin);
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: vendorsList } = await supabase.from('vendors').select('id, brand_name, designer_name, location, bio');
    const vendorMap = new Map<string, any>();

    if (vendorsList && Array.isArray(vendorsList)) {
      vendorsList.forEach((v) => {
        let city = '';
        let state = '';
        let dispatchDays = '1-2 business days';
        let shippingRates = {
          sameCity: 1000,
          closeHub: 2500,
          interstate: 4500,
          parkPickup: 1500,
          parkPickupEnabled: true,
        };

        if (v.bio && v.bio.startsWith('{') && v.bio.endsWith('}')) {
          try {
            const parsed = JSON.parse(v.bio);
            city = parsed.city || '';
            state = parsed.state || '';
            dispatchDays = parsed.dispatchDays || '1-2 business days';
            if (parsed.shippingRates) {
              shippingRates = { ...shippingRates, ...parsed.shippingRates };
            }
          } catch (e) {}
        }

        if (!city && v.location) {
          const matched = NIGERIAN_STATES.find(s => v.location.toLowerCase().includes(s.toLowerCase()));
          if (matched) {
            city = matched;
            state = matched;
          } else {
            const parts = v.location.split(',').map((p: string) => p.trim());
            city = parts[0] || 'Lagos';
            state = parts[1] || parts[0] || 'Lagos';
          }
        }

        vendorMap.set(v.id, {
          brand_name: v.brand_name,
          designer_name: v.designer_name,
          location: v.location,
          city: city || 'Lagos',
          state: state || 'Lagos',
          dispatchDays,
          shippingRates,
        });
      });
    }

    const formatted = (products || []).map((p) => {
      const vendorInfo = vendorMap.get(p.vendor_id);
      const resolvedImg = p.image_url && p.image_url.trim().length > 0 && p.image_url !== '/images/products/BlackTrapStarHoodie.jpg'
        ? p.image_url
        : getSmartFallbackImage(p.name, p.category);

      const isAccessory = p.category === 'accessories';

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
      if (Array.isArray(p.colors) && p.colors.length > 0) {
        normalizedColors = p.colors.map((c: any) => {
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

      let resolvedSizes: string[] = ['M', 'L', 'XL'];
      if (isAccessory) {
        resolvedSizes = ['One Size'];
      } else if (Array.isArray(p.sizes) && p.sizes.length > 0) {
        resolvedSizes = p.sizes;
      } else if (p.size_stock && typeof p.size_stock === 'object') {
        const enabled = Object.keys(p.size_stock).filter(sz => {
          const v = p.size_stock[sz];
          return typeof v === 'object' ? v?.enabled !== false : Number(v) > 0;
        });
        if (enabled.length > 0) {
          resolvedSizes = enabled;
        }
      }

      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category,
        genderTarget: p.gender_target,
        garmentOriginType: p.garment_origin_type,
        imageUrl: resolvedImg,
        image_url: resolvedImg,
        description: p.description,
        tags: p.tags || [],
        colors: isAccessory ? [] : normalizedColors,
        sizes: resolvedSizes,
        sizeStock: isAccessory 
          ? { 'One Size': typeof p.size_stock?.['One Size'] === 'object' ? p.size_stock['One Size'] : { enabled: true, quantity: p.stock_quantity || 20 } }
          : (p.size_stock || {}),
        stockQuantity: p.stock_quantity || 10,
        isCustomizable: p.is_customizable,
        tailoringSpecs: p.tailoring_specs,
        vendorId: p.vendor_id,
        vendorName: vendorInfo?.brand_name || p.vendor_id?.replace(/-/g, ' ').toUpperCase() || 'Veyra Partner',
        vendorLocation: vendorInfo?.location || 'Lagos, Nigeria',
        vendorCity: vendorInfo?.city || 'Lagos',
        vendorState: vendorInfo?.state || 'Lagos',
        vendorDispatchDays: vendorInfo?.dispatchDays || '1-2 business days',
        vendorShippingRates: vendorInfo?.shippingRates || {
          sameCity: 1000,
          closeHub: 2500,
          interstate: 4500,
          parkPickup: 1500,
          parkPickupEnabled: true,
        }
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      products: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resolvedVendorId = 
      body.vendorId || 
      request.headers.get('x-vendor-id') || 
      '';

    const supabase = await createClient();

    // Check vendor verification status before permitting publication
    if (resolvedVendorId) {
      const { data: vendorRecord } = await supabase
        .from('vendors')
        .select('*')
        .or(`id.eq.${resolvedVendorId},email.eq.${resolvedVendorId}`)
        .maybeSingle();

      if (vendorRecord) {
        let isApproved = !!vendorRecord.is_verified;
        let approvalStatus = isApproved ? 'approved' : 'pending';

        if (vendorRecord.bio && vendorRecord.bio.startsWith('{')) {
          try {
            const parsed = JSON.parse(vendorRecord.bio);
            if (parsed.approvalStatus) {
              approvalStatus = parsed.approvalStatus;
              isApproved = parsed.approvalStatus === 'approved';
            }
          } catch (e) {}
        }

        if (!isApproved) {
          const reason = approvalStatus === 'rejected'
            ? 'Your store profile was returned for correction. Please update your store details and get Super Admin approval before publishing pieces.'
            : 'Your store profile is under review. Product publishing will be unlocked once approved by Super Admin.';
          return NextResponse.json({ error: reason }, { status: 403 });
        }
      }
    }

    // BATCH INSERTION MODE (Multiple Products at once)
    if (Array.isArray(body.items) && body.items.length > 0) {
      const rows = body.items.map((item: any, idx: number) => {
        const pId = `prod-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
        const colorsList = Array.isArray(item.colors)
          ? item.colors.map((c: any) => typeof c === 'string' ? c : (c.name || c.hex || 'Black'))
          : [];
        const tagsList = Array.isArray(item.tags)
          ? item.tags.map((t: any) => typeof t === 'string' ? t.replace(/^#/, '') : String(t))
          : ['Ready-to-Wear'];
        const finalImage = item.imageUrl || item.image_url || getSmartFallbackImage(item.name || 'Garment', item.category || 'tops');
        
        return {
          id: pId,
          name: item.name || `Collection Piece #${idx + 1}`,
          price: Number(item.price || 0),
          category: item.category || 'tops',
          gender_target: item.genderTarget || 'unisex',
          garment_origin_type: item.garmentOriginType || 'ready_made_boutique',
          image_url: finalImage,
          description: item.description && item.description.trim().toLowerCase() !== (item.name || '').trim().toLowerCase() ? item.description : '',
          tags: tagsList,
          colors: colorsList,
          sizes: item.sizes || ['M', 'L', 'XL'],
          size_stock: item.sizeStock || {},
          stock_quantity: Number(item.stockQuantity || 20),
          vendor_id: resolvedVendorId,
          is_published: true,
        };
      });

      const { data, error } = await supabase.from('products').insert(rows).select();
      if (error) {
        console.error('Error inserting batch into products table:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        count: data?.length || rows.length,
        products: data || rows,
      });
    }

    // SINGLE PRODUCT INSERTION MODE
    const {
      name,
      price,
      category,
      genderTarget,
      garmentOriginType,
      imageUrl,
      image_url,
      description,
      tags,
      colors,
      sizes,
      sizeStock,
      stockQuantity,
      tailoringSpecs,
      vendorName,
    } = body;
    const vendorId = resolvedVendorId;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const colorsList = Array.isArray(colors)
      ? colors.map((c: any) => typeof c === 'string' ? c : (c.name || c.hex || 'Black'))
      : [];

    const tagsList = Array.isArray(tags)
      ? tags.map((t: any) => typeof t === 'string' ? t.replace(/^#/, '') : String(t))
      : [];

    const finalImage = imageUrl || image_url || getSmartFallbackImage(name, category);

    const { data, error } = await supabase.from('products').insert({
      id: productId,
      name,
      price: Number(price),
      category,
      gender_target: genderTarget || 'unisex',
      garment_origin_type: garmentOriginType || 'ready_made_boutique',
      image_url: finalImage,
      description: description && description.trim().toLowerCase() !== name.trim().toLowerCase() ? description : '',
      tags: tagsList,
      colors: colorsList,
      sizes: sizes || ['M', 'L', 'XL'],
      size_stock: sizeStock || {},
      stock_quantity: Number(stockQuantity || 20),
      vendor_id: vendorId,
      is_published: true,
    }).select().single();

    if (error) {
      console.error('Error inserting into products table:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optionally insert size variants into product_variants if available
    try {
      if (sizeStock && typeof sizeStock === 'object') {
        const variantsToInsert: any[] = [];
        Object.entries(sizeStock).forEach(([sz, val]: [string, any]) => {
          if (val && (val.enabled || val.quantity > 0)) {
            variantsToInsert.push({
              product_id: productId,
              size: sz,
              color: colorsList[0] || 'Default',
              stock_quantity: Number(val.quantity || 10),
            });
          }
        });
        if (variantsToInsert.length > 0) {
          await supabase.from('product_variants').insert(variantsToInsert);
        }
      }
    } catch (variantErr) {
      console.warn('Optional product_variants insert skipped:', variantErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Product published to store catalog successfully',
      product: data,
    });
  } catch (error: any) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
