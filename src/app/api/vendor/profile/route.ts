import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let vendorId = 
      searchParams.get('id') || 
      searchParams.get('vendorId') || 
      request.headers.get('x-vendor-id');

    const supabase = await createClient();

    let query = supabase.from('vendors').select('*');

    if (vendorId) {
      query = query.eq('id', vendorId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.or(`user_id.eq.${user.id},email.eq.${user.email}`);
      } else {
        query = query.eq('id', 'moji-wears');
      }
    }

    const { data: vendor, error } = await query.limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    }

    let bioText = vendor?.bio || '';
    let isProfileSaved = false;
    let approvalStatus = vendor?.is_verified ? 'approved' : 'pending';
    let rejectionReason = '';
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
        city = parsed.city || '';
        state = parsed.state || '';
        dispatchDays = parsed.dispatchDays || '1-2 business days';
        if (parsed.shippingRates) {
          shippingRates = { ...shippingRates, ...parsed.shippingRates };
        }
      } catch (e) {}
    } else if (bioText && bioText.trim().length > 0) {
      isProfileSaved = true;
    }

    const verified = !!vendor?.is_verified;
    const finalApprovalStatus = verified ? 'approved' : (approvalStatus || 'pending');

    return NextResponse.json({
      success: true,
      vendor: {
        ...vendor,
        is_verified: verified,
        isVerified: verified,
        bio: bioText,
        socialLinks,
        city,
        state,
        dispatchDays,
        shippingRates,
        isProfileSaved: isProfileSaved || verified,
        approvalStatus: finalApprovalStatus,
        rejectionReason,
      }
    });
  } catch (error: any) {
    console.error('API /api/vendor/profile GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vendorId = 
      body.vendorId || 
      body.id || 
      request.headers.get('x-vendor-id') || 
      'moji-wears';

    const supabase = await createClient();

    const bioPayload = JSON.stringify({
      bio: body.bio || '',
      socialLinks: body.socialLinks || {},
      city: body.city || '',
      state: body.state || '',
      dispatchDays: body.dispatchDays || '1-2 business days',
      shippingRates: body.shippingRates || {
        sameCity: 1000,
        closeHub: 2500,
        interstate: 4500,
        parkPickup: 1500,
        parkPickupEnabled: true,
      },
      isProfileSaved: true,
      approvalStatus: 'approved'
    });

    const { data: updated, error } = await supabase
      .from('vendors')
      .update({
        brand_name: body.brandName,
        designer_name: body.designerName,
        contact_person: body.contactPerson,
        phone: body.phone,
        location: body.location,
        bank_name: body.bankName,
        account_number: body.accountNumber,
        account_name: body.accountName,
        bio: bioPayload,
        is_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) {
      console.error('Error updating vendor profile in DB:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      vendor: updated
    });
  } catch (error: any) {
    console.error('API /api/vendor/profile POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
