import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

const DEFAULT_WHATSAPP_NUMBER = '2349070332145';

const DEFAULT_CONFIG = {
  whatsappNumber: process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP || DEFAULT_WHATSAPP_NUMBER,
  isEnabled: true,
  businessHours: '9:00 AM – 10:00 PM WAT (7 Days)',
  advisorName: 'Ìrísí Customer Support'
};

export async function GET() {
  try {
    // 1. Fetch live config from Supabase database
    const { data, error } = await supabase
      .from('vendors')
      .select('id, phone, bio')
      .eq('id', 'admin-concierge-settings')
      .single();

    if (!error && data && data.bio) {
      try {
        const parsed = JSON.parse(data.bio);
        return NextResponse.json({
          success: true,
          config: {
            ...DEFAULT_CONFIG,
            ...parsed,
            whatsappNumber: parsed.whatsappNumber || data.phone || DEFAULT_CONFIG.whatsappNumber
          }
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      config: DEFAULT_CONFIG
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      config: DEFAULT_CONFIG
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid config payload' }, { status: 400 });
    }

    const cleanPhone = body.whatsappNumber
      ? String(body.whatsappNumber).replace(/[^0-9]/g, '')
      : DEFAULT_WHATSAPP_NUMBER;

    const newConfig = {
      whatsappNumber: cleanPhone || DEFAULT_WHATSAPP_NUMBER,
      isEnabled: typeof body.isEnabled === 'boolean' ? body.isEnabled : true,
      businessHours: body.businessHours ? String(body.businessHours) : '9:00 AM – 10:00 PM WAT (7 Days)',
      advisorName: body.advisorName ? String(body.advisorName) : 'Ìrísí Customer Support'
    };

    // 2. Persist to Supabase database so all serverless instances and users worldwide get it
    const { error: dbError } = await supabase
      .from('vendors')
      .upsert({
        id: 'admin-concierge-settings',
        brand_name: newConfig.advisorName,
        phone: newConfig.whatsappNumber,
        bio: JSON.stringify(newConfig)
      });

    if (dbError) {
      console.error('Failed to persist concierge to Supabase:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Concierge configuration saved to database.',
      config: newConfig
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update concierge config' }, { status: 500 });
  }
}
