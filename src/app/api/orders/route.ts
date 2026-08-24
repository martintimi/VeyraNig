import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');

    // If unauthenticated and no email param, return empty list
    if (!user && !emailParam) {
      return NextResponse.json({ orders: [] });
    }

    let query = supabase.from('orders').select('*, order_items(*)');
    if (user && user.email) {
      query = query.or(`user_id.eq.${user.id},customer_email.eq.${user.email}`);
    } else if (emailParam) {
      query = query.eq('customer_email', emailParam);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (error: any) {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const orderNumber = `#VY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;

    // 1. Insert master order
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone,
      delivery_address: body.deliveryAddress,
      delivery_city: body.deliveryCity || 'Lagos',
      subtotal: body.subtotal,
      shipping_fee: body.shippingFee || 0,
      total_amount: body.totalAmount,
      status: 'calibrated',
      payment_ref: body.paymentRef || `vy_ref_${Date.now()}`,
      customer_measurements: body.customerMeasurements || {},
    }).select().single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // 2. Insert order items
    if (body.items && body.items.length > 0) {
      const itemsToInsert = body.items.map((item: any) => ({
        order_id: orderId,
        product_id: item.productId,
        vendor_id: item.vendorId,
        product_name: item.productName,
        price: item.price,
        size: item.size,
        color: item.color || '#000000',
        quantity: item.quantity || 1,
        vendor_payout_amount: item.price * 0.9,
        platform_commission_amount: item.price * 0.1,
        status: 'calibrated',
      }));

      await supabase.from('order_items').insert(itemsToInsert);
    }

    return NextResponse.json({ success: true, order: orderData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
