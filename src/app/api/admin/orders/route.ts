import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Super Admin Orders Management API
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { orderId, status, trackingStage, waybillNumber, courierName, driverPhone, releaseEscrow } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch existing order
    const { data: existingOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchErr || !existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (status) {
      updates.status = status;
    }

    // Update customer_measurements tracking details if provided
    const measurements = existingOrder.customer_measurements || {};
    const trackingDetails = measurements.trackingDetails || {};

    if (trackingStage !== undefined) {
      trackingDetails.trackingStage = Number(trackingStage);
      if (trackingStage >= 4) {
        updates.status = 'delivered';
      } else if (trackingStage === 3) {
        updates.status = 'dispatched';
      } else if (trackingStage === 2) {
        updates.status = 'packing';
      }
    }

    if (waybillNumber) trackingDetails.waybillNumber = waybillNumber;
    if (courierName) trackingDetails.courierName = courierName;
    if (driverPhone) trackingDetails.driverPhone = driverPhone;

    if (releaseEscrow) {
      trackingDetails.escrowReleased = true;
      trackingDetails.escrowReleasedAt = new Date().toISOString();
      updates.status = 'delivered';
    }

    measurements.trackingDetails = trackingDetails;
    updates.customer_measurements = measurements;

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (updateErr) {
      console.error('Super Admin order update error:', updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully by Super Admin',
      order: updatedOrder
    });
  } catch (err: any) {
    console.error('Super Admin PATCH orders error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // Delete related order_items first
    await supabase.from('order_items').delete().eq('order_id', orderId);

    // Delete order
    const { error } = await supabase.from('orders').delete().eq('id', orderId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} removed from database`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
