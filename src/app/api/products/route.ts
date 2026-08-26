import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const NIGERIAN_STATES = [
  'Lagos', 'Ogun', 'Oyo', 'Abuja', 'FCT - Abuja', 'Rivers', 'Anambra', 'Enugu', 'Delta',
  'Edo', 'Kano', 'Kaduna', 'Ondo', 'Osun', 'Ekiti', 'Kwara', 'Abia', 'Akwa Ibom',
  'Bayelsa', 'Benue', 'Cross River', 'Ebonyi', 'Gombe', 'Imo', 'Jigawa', 'Katsina',
  'Kebbi', 'Kogi', 'Nasarawa', 'Niger', 'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Bauchi', 'Borno', 'Adamawa'
];

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

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
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
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category,
        genderTarget: p.gender_target,
        garmentOriginType: p.garment_origin_type,
        imageUrl: p.image_url,
        description: p.description,
        tags: p.tags || [],
        colors: p.colors || [],
        sizes: p.sizes || ['S', 'M', 'L', 'XL'],
        sizeStock: p.size_stock || {},
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
      'moji-wears';

    const {
      name,
      price,
      category,
      genderTarget,
      garmentOriginType,
      imageUrl,
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

    const productId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { data, error } = await supabase.from('products').insert({
      id: productId,
      name,
      price: Number(price),
      category,
      gender_target: genderTarget || 'unisex',
      garment_origin_type: garmentOriginType || 'ready_made_boutique',
      image_url: imageUrl,
      description: description || name,
      tags: tags || [],
      colors: colors || [],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      size_stock: sizeStock || {},
      stock_quantity: stockQuantity ? Number(stockQuantity) : 10,
      is_customizable: garmentOriginType === 'bespoke_atelier',
      tailoring_specs: tailoringSpecs || null,
      vendor_id: vendorId,
      is_published: true,
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product published to store catalog successfully',
      product: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
