import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // 1. Fetch product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Fetch vendor info
    let vendorName = 'Veyra Partner';
    let vendorInfo: any = null;

    if (product.vendor_id) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, brand_name, designer_name, location, bio, rating')
        .eq('id', product.vendor_id)
        .maybeSingle();

      if (vendor) {
        vendorName = vendor.brand_name || vendor.designer_name || 'Veyra Partner';
        vendorInfo = vendor;
      } else {
        vendorName = product.vendor_id.charAt(0).toUpperCase() + product.vendor_id.slice(1).replace(/-/g, ' ');
      }
    }

    // 3. Normalize colors
    let normalizedColors: { name: string; hex: string }[] = [];
    if (Array.isArray(product.colors)) {
      normalizedColors = product.colors.map((c: any, index: number) => {
        if (typeof c === 'string') {
          const colorName = c === '#111111' ? 'Black' : c === '#ffffff' ? 'White' : c === '#6b7280' ? 'Grey' : c === '#1e3a8a' ? 'Navy' : `Colorway ${index + 1}`;
          return { name: colorName, hex: c };
        }
        return { name: c.name || `Colorway ${index + 1}`, hex: c.hex || '#111111' };
      });
    }

    if (normalizedColors.length === 0) {
      normalizedColors = [{ name: 'As Pictured', hex: '#111111' }];
    }

    // 4. Return full, rich product payload
    const formattedProduct = {
      id: product.id,
      vendorId: product.vendor_id,
      vendorName,
      vendorInfo,
      name: product.name,
      price: Number(product.price),
      description: product.description || '',
      category: product.category || 'tops',
      genderTarget: product.gender_target || 'unisex',
      garmentOriginType: product.garment_origin_type || 'ready_made_boutique',
      imageUrl: product.image_url || '/images/products/BlackTrapStarHoodie.jpg',
      tags: Array.isArray(product.tags) && product.tags.length > 0 ? product.tags : ['Ready-to-Wear'],
      colors: normalizedColors,
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
      sizeStock: product.size_stock || { S: 10, M: 25, L: 30, XL: 15, XXL: 5 },
      stockQuantity: product.stock_quantity || 85,
      rating: 5.0,
      reviewCount: 18,
      createdAt: product.created_at,
      badge: product.garment_origin_type === 'ready_made_boutique' ? 'Fast 24-48h Drop' : 'Bespoke Atelier'
    };

    return NextResponse.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
