import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const emailParam = searchParams.get('email');
    const orderNumberParam = searchParams.get('orderNumber');
    
    // Resolve vendorId from Query -> Header
    let vendorIdParam = 
      searchParams.get('vendorId') || 
      request.headers.get('x-vendor-id');

    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(limit);

    if (orderNumberParam) {
      query = query.or(`order_number.ilike.%${orderNumberParam}%,id.eq.${orderNumberParam}`);
    } else if (emailParam) {
      query = query.ilike('customer_email', `%${emailParam}%`);
    }

    const { data: rawOrders, error } = await query;

    if (error) {
      console.error('Error fetching orders from DB:', error);
      return NextResponse.json({ success: false, orders: [] });
    }

    // Query products table to map actual image_url by product_id
    const { data: allDbProducts } = await supabase.from('products').select('id, image_url, name');
    const productImageMap = new Map<string, string>();
    if (allDbProducts && Array.isArray(allDbProducts)) {
      allDbProducts.forEach(p => {
        if (p.id && p.image_url) {
          productImageMap.set(p.id, p.image_url);
        }
      });
    }

    let filtered = rawOrders || [];

    // If vendorId is specified, filter for orders containing this vendor's items
    if (vendorIdParam && vendorIdParam !== 'all') {
      const cleanVendorId = vendorIdParam.toLowerCase().trim();
      filtered = filtered.filter((ord: any) => {
        return (ord.order_items || []).some((item: any) => {
          const itemVId = (item.vendor_id || '').toLowerCase().trim();
          return itemVId === cleanVendorId || itemVId.includes(cleanVendorId) || cleanVendorId.includes(itemVId);
        });
      });
    }

    // Format orders for standard frontend consumption
    const formattedOrders = filtered.map((o: any) => {
      const dateObj = new Date(o.created_at || Date.now());
      const dateStr = dateObj.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      const stage = o.status === 'delivered' ? 4 : o.status === 'dispatched' ? 3 : (o.status === 'packing' || o.status === 'ready') ? 2 : 1;

      // Extract vendor packages metadata if stored
      const vendorPackages = o.customer_measurements?.vendorPackages || {};
      const trackingDetails = o.customer_measurements?.trackingDetails || {};

      // Filter items strictly for this vendor if vendorId is requested
      let relevantItems = o.order_items || [];
      if (vendorIdParam && vendorIdParam !== 'all') {
        const cleanVendorId = vendorIdParam.toLowerCase().trim();
        const vendorSpecificItems = (o.order_items || []).filter((item: any) => {
          const itemVId = (item.vendor_id || '').toLowerCase().trim();
          return itemVId === cleanVendorId || itemVId.includes(cleanVendorId) || cleanVendorId.includes(itemVId);
        });
        if (vendorSpecificItems.length > 0) {
          relevantItems = vendorSpecificItems;
        }
      }

      return {
        id: o.id,
        orderNumber: o.order_number || o.id,
        customerName: o.customer_name || 'Valued Client',
        customerEmail: o.customer_email || '',
        customerPhone: o.customer_phone || '',
        deliveryAddress: o.delivery_address || 'Lagos, Nigeria',
        deliveryCity: o.delivery_city || 'Lagos',
        subtotal: Number(o.subtotal || 0),
        shippingFee: Number(o.shipping_fee || 0),
        totalAmount: Number(o.total_amount || 0),
        status: o.status || 'escrow_secured',
        trackingStage: stage,
        date: `${dateStr}, ${timeStr}`,
        createdAt: o.created_at,
        vendorPackages,
        trackingDetails,
        items: relevantItems.map((item: any) => {
          const matchedImage = item.image_url || productImageMap.get(item.product_id) || '/images/products/BlackTrapStarHoodie.jpg';
          return {
            id: item.id,
            productId: item.product_id,
            vendorId: item.vendor_id,
            vendorName: item.vendor_id ? item.vendor_id.replace(/-/g, ' ').toUpperCase() : 'MOJI WEARS',
            productName: item.product_name || 'Garment',
            price: Number(item.price || 0),
            size: item.size || 'M',
            color: item.color || '#111111',
            quantity: Number(item.quantity || 1),
            imageUrl: matchedImage,
            status: item.status || o.status || 'escrow_secured'
          };
        })
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error: any) {
    console.error('API /api/orders GET error:', error);
    return NextResponse.json({ success: false, orders: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const orderNumber = body.orderNumber || `#VY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = body.id || `ord-${Date.now()}`;

    // Package metadata with per-vendor delivery fee allocations
    const measurementsData = {
      ...(body.customerMeasurements || {}),
      vendorPackages: body.vendorPackages || {},
      trackingDetails: {}
    };

    // 1. Insert master order into PostgreSQL
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      customer_name: body.customerName,
      customer_email: body.customerEmail || '',
      customer_phone: body.customerPhone,
      delivery_address: body.deliveryAddress,
      delivery_city: body.deliveryCity || 'Lagos',
      subtotal: Number(body.subtotal || 0),
      shipping_fee: Number(body.shippingFee || 0),
      total_amount: Number(body.totalAmount || 0),
      status: 'escrow_secured',
      payment_ref: body.paymentRef || `vy_ref_${Date.now()}`,
      customer_measurements: measurementsData,
      created_at: new Date().toISOString()
    }).select().single();

    if (orderError) {
      console.error('Error inserting into orders table:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // 2. Insert order items into order_items table with explicit image_url
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      const itemsToInsert = body.items.map((item: any) => ({
        order_id: orderId,
        product_id: item.productId || item.id || `item-${Date.now()}`,
        vendor_id: item.vendorId || 'moji-wears',
        product_name: item.productName || item.name || 'Garment',
        price: Number(item.price || 0),
        size: item.size || item.selectedSize || 'M',
        color: typeof item.color === 'string' ? item.color : (item.color?.hex || '#111111'),
        quantity: Number(item.quantity || 1),
        vendor_payout_amount: Number(item.price || 0) * 0.9,
        platform_commission_amount: Number(item.price || 0) * 0.1,
        status: 'escrow_secured',
        image_url: item.imageUrl || item.image_url || '',
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) {
        console.error('Error inserting into order_items table:', itemsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order recorded in live database and escrow locked',
      order: {
        ...orderData,
        orderNumber,
        items: body.items || [],
      }
    });
  } catch (error: any) {
    console.error('API /api/orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, orderId, status, trackingStage, waybillNumber, driverPhone, driverName } = body;

    if (!orderNumber && !orderId) {
      return NextResponse.json({ error: 'Missing orderNumber or orderId' }, { status: 400 });
    }

    const supabase = await createClient();

    let query = supabase.from('orders').select('*');
    if (orderNumber) {
      query = query.eq('order_number', orderNumber);
    } else {
      query = query.eq('id', orderId);
    }

    const { data: existingOrder, error: fetchErr } = await query.maybeSingle();
    if (fetchErr || !existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedMeasurements = {
      ...(existingOrder.customer_measurements || {}),
      trackingDetails: {
        ...(existingOrder.customer_measurements?.trackingDetails || {}),
        status,
        trackingStage,
        waybillNumber: waybillNumber || existingOrder.customer_measurements?.trackingDetails?.waybillNumber || '',
        driverPhone: driverPhone || existingOrder.customer_measurements?.trackingDetails?.driverPhone || '',
        driverName: driverName || existingOrder.customer_measurements?.trackingDetails?.driverName || '',
        lastUpdated: new Date().toISOString()
      }
    };

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: status,
        customer_measurements: updatedMeasurements
      })
      .eq('id', existingOrder.id)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating order status in DB:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    await supabase.from('order_items').update({ status: status }).eq('order_id', existingOrder.id);

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error: any) {
    console.error('API /api/orders PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
