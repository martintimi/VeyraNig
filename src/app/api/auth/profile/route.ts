import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, deliveryAddress, city, state, heightCm, weightKg, chestCm, waistCm, hipsCm, shoulderCm } = body;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        phone,
        delivery_address: deliveryAddress,
        delivery_city: city,
        delivery_state: state,
        height_cm: heightCm,
        weight_kg: weightKg,
        chest_cm: chestCm,
        waist_cm: waistCm,
        hips_cm: hipsCm,
        shoulder_cm: shoulderCm,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
