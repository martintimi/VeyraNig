import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 1. GET ALL PRODUCTS / FILTER PRODUCTS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
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

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      products: products || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// 2. CREATE / PUBLISH NEW PRODUCT
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      description,
      category,
      genderTarget = 'unisex',
      garmentOriginType = 'ready_made_boutique',
      imageUrl,
      tags = [],
      colors = [],
      vendorId,
      vendorName,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Product name, price, and category are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Resolve active vendor
    let resolvedVendorId = vendorId;

    // Try finding via Supabase session
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();
      if (vendor) {
        resolvedVendorId = vendor.id;
      }
    }

    // If still no vendorId, search by vendorName or brandName in vendors table
    if (!resolvedVendorId && vendorName) {
      const cleanBrand = vendorName.trim();
      const { data: matchedVendor } = await supabase
        .from('vendors')
        .select('id')
        .ilike('brand_name', `%${cleanBrand}%`)
        .maybeSingle();
      if (matchedVendor) {
        resolvedVendorId = matchedVendor.id;
      }
    }

    // If still not found, check if a default vendor exists, or auto-create a vendor profile
    if (!resolvedVendorId) {
      const { data: anyVendor } = await supabase.from('vendors').select('id').limit(1).maybeSingle();
      resolvedVendorId = anyVendor?.id || 'street-souk';
    }

    const productId = `prod-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // Format colors array
    let formattedColors: any[] = [];
    if (Array.isArray(colors)) {
      formattedColors = colors.map((c: any) => typeof c === 'string' ? c : (c.hex || '#111111'));
    }

    const newProduct = {
      id: productId,
      vendor_id: resolvedVendorId,
      name,
      price: Number(price),
      description: description || '',
      category,
      gender_target: genderTarget,
      garment_origin_type: garmentOriginType,
      image_url: imageUrl || '/images/products/BlackTrapStarHoodie.jpg',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []),
      colors: formattedColors,
      is_published: true,
      created_at: new Date().toISOString(),
    };

    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Error inserting product into PostgreSQL:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product drop published successfully to live catalog',
      product: createdProduct,
    });
  } catch (error: any) {
    console.error('API Publish error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// 3. DELETE / UNPUBLISH PRODUCT
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product removed from store' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
