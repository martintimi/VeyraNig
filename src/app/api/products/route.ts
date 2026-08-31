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
        colors: isAccessory ? [] : (p.colors || []),
        sizes: isAccessory ? ['One Size'] : (p.sizes || ['S', 'M', 'L', 'XL']),
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

    const supabase = await createClient();

    // Check vendor verification status before permitting publication
    if (vendorId) {
      const { data: vendorRecord } = await supabase
        .from('vendors')
        .select('*')
        .or(`id.eq.${vendorId},email.eq.${vendorId}`)
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
      description: description || name,
      tags: tagsList,
      colors: colorsList,
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
