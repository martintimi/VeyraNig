import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, expectedRole } = body;

    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Authenticate credentials with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError || !authData?.user) {
      return NextResponse.json({
        error: authError?.message || 'Invalid email or password. Please check your credentials.'
      }, { status: 401 });
    }

    const user = authData.user;
    const metadataType = user.user_metadata?.user_type; // 'shopper' | 'vendor'

    // 2. Query both tables to verify exact account existence
    const { data: vendorRecord } = await supabase
      .from('vendors')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${normalizedEmail}`)
      .maybeSingle();

    const { data: profileRecord } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${user.id},email.eq.${normalizedEmail}`)
      .maybeSingle();

    // 3. Strict Role Isolation Check
    if (expectedRole === 'shopper') {
      // If user is a vendor trying to log in on shopper portal
      if (vendorRecord && !profileRecord && metadataType === 'vendor') {
        return NextResponse.json({
          error: 'This account is registered as a Merchant Atelier. Please sign in via the Partner Portal at /vendor-portal/auth.'
        }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        user,
        userType: 'shopper',
        profile: profileRecord || {
          id: user.id,
          name: user.user_metadata?.full_name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          phone: user.user_metadata?.phone || '',
          gender: user.user_metadata?.gender || 'male',
        },
      });
    }

    if (expectedRole === 'vendor') {
      // If user is a shopper trying to log in on vendor portal
      if (!vendorRecord && (profileRecord || metadataType === 'shopper')) {
        return NextResponse.json({
          error: 'This account is registered as a Customer Shopper. Please sign in via the Shopper Storefront at /auth.'
        }, { status: 403 });
      }

      if (!vendorRecord) {
        return NextResponse.json({
          error: 'No merchant atelier found for this account. Please register your store first.'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user,
        userType: 'vendor',
        vendor: vendorRecord,
      });
    }

    // Default fallback if expectedRole not specified
    if (vendorRecord) {
      return NextResponse.json({
        success: true,
        user,
        userType: 'vendor',
        vendor: vendorRecord,
      });
    } else {
      return NextResponse.json({
        success: true,
        user,
        userType: 'shopper',
        profile: profileRecord,
      });
    }
  } catch (error: any) {
    console.error('API Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
