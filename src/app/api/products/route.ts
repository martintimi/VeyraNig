import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { products as fallbackProducts } from '@/lib/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const origin = searchParams.get('origin');
    const search = searchParams.get('search');

    const supabase = await createClient();
    let query = supabase.from('products').select('*, vendors(brand_name, designer_name, location)').eq('is_published', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (gender && gender !== 'all') {
      query = query.or(`gender_target.eq.${gender},gender_target.eq.unisex`);
    }
    if (origin && origin !== 'all') {
      query = query.eq('garment_origin_type', origin);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ products: fallbackProducts });
    }

    const formatted = data.map((item: any) => ({
      id: item.id,
      vendorId: item.vendor_id,
      vendorName: item.vendors?.brand_name || 'Veyra Partner Atelier',
      name: item.name,
      price: Number(item.price),
      description: item.description,
      category: item.category,
      genderTarget: item.gender_target,
      garmentOriginType: item.garment_origin_type,
      imageUrl: item.image_url,
      tags: item.tags || [],
      colors: item.colors || [],
    }));

    return NextResponse.json({ products: formatted });
  } catch (error: any) {
    return NextResponse.json({ products: fallbackProducts });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const productId = `prod-${Date.now()}`;
    const { data, error } = await supabase.from('products').insert({
      id: productId,
      vendor_id: body.vendorId || 'sartorial-lagos',
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      gender_target: body.genderTarget || 'unisex',
      garment_origin_type: body.garmentOriginType || 'handmade_designer',
      image_url: body.imageUrl,
      tags: body.tags || [],
      colors: body.colors || [],
      is_published: true,
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
