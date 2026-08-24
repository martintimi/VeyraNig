import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null, authenticated: false }, { status: 200 });
    }

    const isVendor = user.user_metadata?.user_type === 'vendor';

    if (isVendor) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .single();

      return NextResponse.json({
        authenticated: true,
        user,
        userType: 'vendor',
        vendor: vendor || null,
      });
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      return NextResponse.json({
        authenticated: true,
        user,
        userType: 'shopper',
        profile: profile ? {
          ...profile,
          name: profile.full_name,
          phone: profile.phone,
          email: profile.email,
          deliveryAddress: profile.delivery_address,
          city: profile.delivery_city,
          state: profile.delivery_state,
        } : {
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
