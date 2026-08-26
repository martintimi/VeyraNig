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
      colors: normalizedColors,
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
      sizeStock: product.size_stock || { S: 10, M: 25, L: 30, XL: 15, XXL: 5 },
      stockQuantity: product.stock_quantity || 85,
      rating: 5.0,
      reviewCount: 18,
      createdAt: product.created_at,
      badge: 'Ready-to-Wear'
    };

    return NextResponse.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
