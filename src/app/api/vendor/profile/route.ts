import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('id') || searchParams.get('vendorId');

    const supabase = await createClient();

    let query = supabase.from('vendors').select('*');
    if (vendorId) {
      query = query.eq('id', vendorId);
    }

    const { data: vendor, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Default state
    let bioText = vendor?.bio || '';
    let isProfileSaved = false;
    let approvalStatus = vendor?.is_verified ? 'approved' : 'pending';
    let rejectionReason = '';
    let socialLinks: any = {
      instagram: '',
      tiktok: '',
      snapchat: '',
      whatsapp: vendor?.phone || ''
    };

    if (bioText.startsWith('{') && bioText.endsWith('}')) {
      try {
        const parsed = JSON.parse(bioText);
        bioText = parsed.bio || '';
        socialLinks = { ...socialLinks, ...parsed.socialLinks };
        isProfileSaved = parsed.isProfileSaved !== undefined ? parsed.isProfileSaved : true;
        approvalStatus = parsed.approvalStatus || (vendor?.is_verified ? 'approved' : 'pending');
        rejectionReason = parsed.rejectionReason || '';
      } catch (e) {}
    } else if (bioText && bioText.trim().length > 0) {
      isProfileSaved = true;
      approvalStatus = vendor?.is_verified ? 'approved' : 'pending';
    }

    const responseVendor = {
      id: vendor?.id || 'moji-wears',
      brandName: vendor?.brand_name || '',
      designerName: vendor?.designer_name || vendor?.contact_person || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      location: vendor?.location || '',
      vendorType: vendor?.vendor_type || 'boutique_merchant',
      bio: bioText,
      socialLinks,
      instagram: socialLinks.instagram || '',
      tiktok: socialLinks.tiktok || '',
      snapchat: socialLinks.snapchat || '',
      whatsapp: socialLinks.whatsapp || vendor?.phone || '',
      rating: 5.0,
      isVerified: vendor?.is_verified || false,
      isProfileSaved,
      approvalStatus,
      rejectionReason
    };

    return NextResponse.json({
      success: true,
      vendor: responseVendor,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      brandName,
      designerName,
      email,
      phone,
      location,
      instagram,
      tiktok,
      snapchat,
      whatsapp,
      bio,
      vendorType = 'boutique_merchant',
      approvalStatus = 'approved' // default approved or pending
    } = body;

    const supabase = await createClient();
    let targetId = id || (brandName ? brandName.toLowerCase().replace(/\s+/g, '-') : 'moji-wears');

    // Submitting/saving profile always places store in pending review for Super Admin approval
    const packedBio = JSON.stringify({
      bio: bio || '',
      socialLinks: {
        instagram: instagram || '',
        tiktok: tiktok || '',
        snapchat: snapchat || '',
        whatsapp: whatsapp || phone || ''
      },
      isProfileSaved: true,
      approvalStatus: 'pending',
      rejectionReason: ''
    });

    const updatePayload: any = {
      brand_name: brandName,
      designer_name: designerName,
      contact_person: designerName,
      email: email,
      phone: phone,
      location: location,
      bio: packedBio,
      vendor_type: vendorType,
      is_verified: false
    };

    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('id', targetId)
      .maybeSingle();

    let resultData = null;

    if (existingVendor) {
      const { data, error } = await supabase
        .from('vendors')
        .update(updatePayload)
        .eq('id', targetId)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          id: targetId,
          ...updatePayload,
          rating: 5.0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Store profile submitted successfully',
      vendor: resultData,
      isProfileSaved: true,
      approvalStatus
    });
  } catch (error: any) {
    console.error('Update vendor profile error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
