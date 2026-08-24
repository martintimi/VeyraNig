import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, type = 'signup' } = body;

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and 6-digit OTP code are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Try verifying as signup OTP first
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: type as any,
    });

    // Fallback to type 'email' if signup type fails
    if (error && type === 'signup') {
      const fallback = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'email',
      });
      if (!fallback.error) {
        data = fallback.data;
        error = null;
      }
    }

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Invalid or expired OTP code' }, { status: 400 });
    }

    // Fetch user profile or vendor profile from PostgreSQL
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${data.user.id},email.eq.${email}`)
      .maybeSingle();

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .or(`user_id.eq.${data.user.id},email.eq.${email}`)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      profile: profile || null,
      vendor: vendor || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error verifying OTP' }, { status: 500 });
  }
}
