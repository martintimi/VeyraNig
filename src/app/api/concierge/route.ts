import { NextResponse } from 'next/server';

// Server-level persistent in-memory cache for live serverless instances
let globalConciergeConfig = {
  whatsappNumber: process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP || '2348000000000',
  isEnabled: true,
  businessHours: '8:00 AM – 10:00 PM WAT (7 Days)',
  advisorName: 'Veyra Customer Support'
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      config: globalConciergeConfig
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      config: globalConciergeConfig
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid config payload' }, { status: 400 });
    }

    if (body.whatsappNumber) {
      // Clean phone number (strip spaces, dashes, leading plus)
      const cleanPhone = String(body.whatsappNumber).replace(/[^0-9]/g, '');
      if (cleanPhone) {
        globalConciergeConfig.whatsappNumber = cleanPhone;
      }
    }

    if (typeof body.isEnabled === 'boolean') {
      globalConciergeConfig.isEnabled = body.isEnabled;
    }

    if (body.businessHours) {
      globalConciergeConfig.businessHours = String(body.businessHours);
    }

    if (body.advisorName) {
      globalConciergeConfig.advisorName = String(body.advisorName);
    }

    return NextResponse.json({
      success: true,
      message: 'Concierge configuration updated across live platform.',
      config: globalConciergeConfig
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update concierge config' }, { status: 500 });
  }
}
