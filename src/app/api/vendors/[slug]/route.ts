import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Brand slug is required' }, { status: 400 });
    }

    const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
    const cleanBrandName = decodedSlug.replace(/[-_]/g, ' ');

    const supabase = await createClient();

    // 1. Find Vendor in Database
    const { data: vendorList } = await supabase
      .from('vendors')
      .select('*');

    let resolvedVendor = vendorList?.find((v: any) => 
      v.id?.toLowerCase() === decodedSlug ||
      v.id?.toLowerCase().replace(/-/g, ' ') === cleanBrandName ||
      v.id?.toLowerCase().replace(/[-_\s]/g, '') === decodedSlug.replace(/[-_\s]/g, '') ||
      v.brand_name?.toLowerCase() === cleanBrandName ||
      v.brand_name?.toLowerCase() === decodedSlug ||
      v.brand_name?.toLowerCase().replace(/\s+/g, '-') === decodedSlug ||
      v.email?.toLowerCase() === decodedSlug
    );

    if (!resolvedVendor) {
      return NextResponse.json({ error: `Brand storefront for "${slug}" not found` }, { status: 404 });
    }

    const vendorId = resolvedVendor?.id || decodedSlug.replace(/\s+/g, '-');
    const brandName = resolvedVendor?.brand_name || cleanBrandName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Parse bio, location, turnaround and multi-social links
    let bioText = resolvedVendor?.bio || '';
    let city = '';
    let state = '';
    let dispatchDays = '1-2 business days';
    let socialLinks: any = {
      instagram: '',
      tiktok: '',
      snapchat: '',
      whatsapp: resolvedVendor?.phone || ''
    };

    if (bioText.startsWith('{') && bioText.endsWith('}')) {
      try {
        const parsed = JSON.parse(bioText);
        bioText = parsed.bio || '';
        city = parsed.city || '';
        state = parsed.state || '';
        dispatchDays = parsed.dispatchDays || '1-2 business days';
        if (parsed.socialLinks) {
          socialLinks = { ...socialLinks, ...parsed.socialLinks };
        }
      } catch (e) {}
    }

    // Return exact bio without mock fallbacks
    bioText = typeof bioText === 'string' ? bioText.trim() : '';

    const locationDisplay = resolvedVendor?.location || (city && state ? `${city}, ${state}` : city || state || 'Nigeria');

    // 2. Fetch Products strictly for this Brand from Database
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .or(`vendor_id.eq.${vendorId},vendor_id.eq.${decodedSlug}`)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    const formattedProducts = (dbProducts || []).map((p: any) => {
      let normalizedColors = [];
      if (Array.isArray(p.colors)) {
        normalizedColors = p.colors.map((c: any, idx: number) => 
          typeof c === 'string' ? { name: c === '#111111' ? 'Black' : c === '#ffffff' ? 'White' : `Color ${idx+1}`, hex: c } : c
        );
      }
      return {
        id: p.id,
        vendorId: p.vendor_id,
        vendorName: brandName,
        name: p.name,
        price: Number(p.price),
        description: p.description || '',
        category: p.category || 'tops',
        genderTarget: p.gender_target || 'unisex',
        garmentOriginType: p.garment_origin_type || 'ready_made_boutique',
        imageUrl: p.image_url || '/images/products/BlackTrapStarHoodie.jpg',
        tags: Array.isArray(p.tags) ? p.tags : [],
        colors: normalizedColors,
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
        sizeStock: p.size_stock || { S: 10, M: 25, L: 30, XL: 15, XXL: 5 },
        stockQuantity: p.stock_quantity || 85,
        rating: 5.0,
        reviewCount: 18,
        createdAt: p.created_at
      };
    });

    const vendorPayload = {
      id: vendorId,
      name: brandName,
      designerName: resolvedVendor?.designer_name || 'Boutique Manager',
      vendorType: resolvedVendor?.vendor_type || 'fashion_designer',
      origin: locationDisplay,
      city,
      state,
      bio: bioText,
      socialLinks,
      instagram: socialLinks.instagram,
      tiktok: socialLinks.tiktok,
      snapchat: socialLinks.snapchat,
      whatsapp: socialLinks.whatsapp || resolvedVendor?.phone,
      productCount: formattedProducts.length,
      satisfactionRate: 99.4,
      deliveryDays: dispatchDays,
      isVerified: true
    };

    return NextResponse.json({
      success: true,
      vendor: vendorPayload,
      products: formattedProducts,
      count: formattedProducts.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
