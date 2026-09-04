import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Paystack secret not configured' }, { status: 500 });
    }

    const signature = request.headers.get('x-paystack-signature');
    const rawBody = await request.text();

    // Verify Paystack HMAC SHA512 signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle successful charge event
    if (event.event === 'charge.success') {
      const data = event.data;
      const paymentRef = data.reference;
      const amountPaid = data.amount / 100; // Convert kobo to Naira

      const supabase = await createClient();

      // Update order status in orders table
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          escrow_status: 'held_in_escrow',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .or(`payment_ref.eq.${paymentRef},id.eq.${paymentRef}`);

      if (error) {
        console.warn('[Paystack Webhook] Failed to update order status:', error.message);
      } else {
        console.log(`[Paystack Webhook] Order ${paymentRef} confirmed (₦${amountPaid.toLocaleString()} in Escrow)`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err: any) {
    console.error('[Paystack Webhook] Processing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
