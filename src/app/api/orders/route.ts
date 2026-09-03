import { sendOrderConfirmationEmail, sendVendorNewOrderEmail, sendDispatchNotificationEmail, sendDeliverySettledEmail } from '@/lib/services/emailService';
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

      const vendorPackages = o.customer_measurements?.vendorPackages || {};
      const trackingDetails = o.customer_measurements?.trackingDetails || {};

      // Resilient items lookup: use order_items from DB or fallback to customer_measurements.items
      let sourceItems = (o.order_items && o.order_items.length > 0)
        ? o.order_items
        : (o.customer_measurements?.items || []);

      // Filter items strictly for this vendor if vendorId is requested
      let relevantItems = sourceItems;
      if (vendorIdParam && vendorIdParam !== 'all') {
        const cleanVendorId = vendorIdParam.toLowerCase().trim();
        const vendorSpecificItems = sourceItems.filter((item: any) => {
          const itemVId = (item.vendor_id || item.vendorId || '').toLowerCase().trim();
          return itemVId === cleanVendorId || itemVId.includes(cleanVendorId) || cleanVendorId.includes(itemVId);
        });
        relevantItems = vendorSpecificItems;
      }

      // Per-vendor scoping: when a vendor calls this API, use THEIR package status & stage!
      let resolvedStatus = o.status || 'escrow_secured';
      let resolvedStage = o.status === 'delivered' ? 4 : o.status === 'dispatched' ? 3 : (o.status === 'packing' || o.status === 'ready') ? 2 : 1;
      let resolvedTrackingDetails = trackingDetails;

      if (vendorIdParam && vendorIdParam !== 'all') {
        const cleanVId = vendorIdParam.toLowerCase().trim();
        const thisVendorPkg = vendorPackages[cleanVId];

        if (thisVendorPkg) {
          resolvedStage = Number(thisVendorPkg.trackingStage || 1);
          resolvedStatus = thisVendorPkg.status || (resolvedStage === 4 ? 'delivered' : resolvedStage === 3 ? 'dispatched' : resolvedStage === 2 ? 'packing' : 'escrow_secured');
          resolvedTrackingDetails = {
            status: resolvedStatus,
            trackingStage: resolvedStage,
            waybillNumber: thisVendorPkg.waybillNumber || '',
            driverPhone: thisVendorPkg.driverPhone || '',
            driverName: thisVendorPkg.driverName || '',
            lastUpdated: thisVendorPkg.lastUpdated || ''
          };
        } else {
          // If vendor has no package record yet in vendorPackages, look at their items' status
          const firstItem = relevantItems[0];
          const itmStatus = firstItem?.status || 'escrow_secured';
          resolvedStage = itmStatus === 'delivered' ? 4 : itmStatus === 'dispatched' ? 3 : itmStatus === 'packing' ? 2 : 1;
          resolvedStatus = itmStatus;
          resolvedTrackingDetails = {
            status: resolvedStatus,
            trackingStage: resolvedStage,
            waybillNumber: '',
            driverPhone: '',
            driverName: '',
            lastUpdated: ''
          };
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
        deliveryState: o.customer_measurements?.deliveryState || o.customer_measurements?.state || o.delivery_state || '',
        subtotal: Number(o.subtotal || 0),
        shippingFee: Number(o.shipping_fee || 0),
        totalAmount: Number(o.total_amount || 0),
        status: resolvedStatus,
        trackingStage: resolvedStage,
        date: `${dateStr}, ${timeStr}`,
        createdAt: o.created_at,
        vendorPackages,
        trackingDetails: resolvedTrackingDetails,
        items: relevantItems.map((item: any) => {
          const pId = item.product_id || item.productId;
          const vId = item.vendor_id || item.vendorId || 'moji-wears';
          const pName = item.product_name || item.productName || 'Garment';
          const matchedImage = item.image_url || item.imageUrl || productImageMap.get(pId) || '/images/products/BlackTrapStarHoodie.jpg';
          return {
            id: item.id || `item-${pId}`,
            productId: pId,
            vendorId: vId,
            vendorName: item.vendorName || (vId ? vId.replace(/-/g, ' ').toUpperCase() : 'MOJI WEARS'),
            productName: pName,
            price: Number(item.price || 0),
            size: item.size || item.selectedSize || 'M',
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

    // Initialize explicit per-vendor packages for every item's vendor in the order
    const initialVendorPackages: Record<string, any> = { ...(body.vendorPackages || {}) };
    if (body.items && Array.isArray(body.items)) {
      body.items.forEach((item: any) => {
        const vId = (item.vendorId || item.vendor_id || 'vendor').toLowerCase().trim();
        if (!initialVendorPackages[vId]) {
          const method = body.packageMethods?.[vId] || 'doorstep';
          const isPark = method === 'park_pickup';
          const trackingCode = isPark ? `VY-PK-${Date.now().toString().slice(-6)}` : `GIG-NG-${Date.now().toString().slice(-6)}`;
          
          initialVendorPackages[vId] = {
            vendorId: vId,
            vendorName: item.vendorName || vId.replace(/-/g, ' ').toUpperCase(),
            vendorCity: item.vendorCity || 'Lagos',
            vendorState: item.vendorState || 'Lagos',
            status: 'escrow_secured',
            deliveryMethod: method,
            courierName: isPark ? 'Motor Park Bus Waybill' : 'GIG Logistics / Shipbubble',
            trackingStage: 1,
            waybillNumber: trackingCode,
            trackingNumber: trackingCode,
            driverPhone: '',
            driverName: '',
            lastUpdated: new Date().toISOString()
          };
        }
      });
    }

    // Package metadata with per-vendor delivery fee allocations
    const measurementsData = {
      ...(body.customerMeasurements || {}),
      items: body.items || [],
      vendorPackages: initialVendorPackages,
      packageMethods: body.packageMethods || {},
      deliveryState: body.deliveryState || body.state || '',
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

    // 2. Insert order items into order_items table without invalid image_url column
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      const itemsToInsert = body.items.map((item: any) => {
        const qty = Number(item.quantity || 1);
        const itemPrice = Number(item.price || 0);
        return {
          order_id: orderId,
          product_id: item.productId || item.id || `item-${Date.now()}`,
          vendor_id: (item.vendorId || item.vendor_id || 'vendor').toLowerCase().trim(),
          product_name: item.productName || item.name || 'Garment',
          price: itemPrice,
          size: item.size || item.selectedSize || 'M',
          color: typeof item.color === 'string' ? item.color : (item.color?.hex || '#111111'),
          quantity: qty,
          vendor_payout_amount: itemPrice * qty * 0.9,
          platform_commission_amount: itemPrice * qty * 0.1,
          status: 'escrow_secured',
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) {
        console.error('Error inserting into order_items table:', itemsError);
      }
    }

    // Dispatch automated background email alerts
    try {
      sendOrderConfirmationEmail({
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail || 'buyer@veyra.ng',
        deliveryAddress: body.deliveryAddress,
        items: body.items || [],
        totalAmount: Number(body.totalAmount || 0),
        shippingFee: Number(body.shippingFee || 0)
      }).catch(e => console.error('Email error:', e));

      // Notify each unique vendor
      const uniqueVendorIds = Array.from(new Set((body.items || []).map((i: any) => (i.vendorId || i.vendor_id || 'vendor').toLowerCase().trim())));
      uniqueVendorIds.forEach(vId => {
        sendVendorNewOrderEmail(`${vId}@merchants.veyra.ng`, {
          orderNumber,
          customerName: body.customerName,
          customerEmail: body.customerEmail || 'buyer@veyra.ng',
          deliveryAddress: body.deliveryAddress,
          items: (body.items || []).filter((i: any) => (i.vendorId || i.vendor_id || 'vendor').toLowerCase().trim() === vId),
          totalAmount: Number(body.totalAmount || 0),
          shippingFee: Number(body.shippingFee || 0)
        }).catch(e => console.error('Vendor email error:', e));
      });
    } catch (e) {
      console.error('Email dispatch wrapper error:', e);
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
    const { orderNumber, orderId, status, trackingStage, waybillNumber, driverPhone, driverName, vendorId } = body;

    if (!orderNumber && !orderId) {
      return NextResponse.json({ error: 'Missing orderNumber or orderId' }, { status: 400 });
    }

    const headerVendorId = request.headers.get('x-vendor-id');
    const targetVendorId = (vendorId || headerVendorId || '').toLowerCase().trim();

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

    const existingMeasurements = existingOrder.customer_measurements || {};
    const existingVendorPackages = { ...(existingMeasurements.vendorPackages || {}) };

    // Fetch order items to discover all vendor IDs in this order
    const sourceItems = (existingMeasurements.items && Array.isArray(existingMeasurements.items))
      ? existingMeasurements.items
      : [];
    const { data: dbItems } = await supabase.from('order_items').select('id, vendor_id').eq('order_id', existingOrder.id);

    const allVendorIds = new Set<string>();
    if (dbItems && Array.isArray(dbItems)) {
      dbItems.forEach(i => {
        if (i.vendor_id) allVendorIds.add(i.vendor_id.toLowerCase().trim());
      });
    }
    sourceItems.forEach((i: any) => {
      const vid = (i.vendorId || i.vendor_id || '').toLowerCase().trim();
      if (vid) allVendorIds.add(vid);
    });

    // Ensure all vendors in this order are initialized with their existing or default stage 1
    allVendorIds.forEach(vId => {
      if (!existingVendorPackages[vId]) {
        existingVendorPackages[vId] = {
          vendorId: vId,
          status: 'escrow_secured',
          trackingStage: 1,
          waybillNumber: '',
          driverPhone: '',
          driverName: '',
          lastUpdated: existingOrder.created_at || new Date().toISOString()
        };
      }
    });

    if (targetVendorId && targetVendorId !== 'all') {
      // Find matching vendor key among known vendors
      let matchedVendorKey = targetVendorId;
      const cleanTarget = targetVendorId.replace(/[^a-z0-9]/g, '');

      for (const vId of allVendorIds) {
        const cleanV = vId.replace(/[^a-z0-9]/g, '');
        if (cleanV === cleanTarget || cleanV.includes(cleanTarget) || cleanTarget.includes(cleanV)) {
          matchedVendorKey = vId;
          break;
        }
      }

      // 1. Update ONLY this vendor's package
      existingVendorPackages[matchedVendorKey] = {
        ...(existingVendorPackages[matchedVendorKey] || {}),
        status,
        trackingStage: Number(trackingStage || 1),
        waybillNumber: waybillNumber !== undefined ? waybillNumber : (existingVendorPackages[matchedVendorKey]?.waybillNumber || ''),
        driverPhone: driverPhone !== undefined ? driverPhone : (existingVendorPackages[matchedVendorKey]?.driverPhone || ''),
        driverName: driverName !== undefined ? driverName : (existingVendorPackages[matchedVendorKey]?.driverName || ''),
        lastUpdated: new Date().toISOString()
      };

      if (matchedVendorKey !== targetVendorId) {
        existingVendorPackages[targetVendorId] = existingVendorPackages[matchedVendorKey];
      }

      // Update order_items strictly for this vendor
      await supabase.from('order_items')
        .update({ status })
        .eq('order_id', existingOrder.id)
        .ilike('vendor_id', `%${matchedVendorKey}%`);
    } else {
      // Global update (e.g. buyer confirms whole order)
      await supabase.from('order_items')
        .update({ status })
        .eq('order_id', existingOrder.id);

      Object.keys(existingVendorPackages).forEach(vKey => {
        existingVendorPackages[vKey] = {
          ...existingVendorPackages[vKey],
          status,
          trackingStage: Number(trackingStage || 1),
          lastUpdated: new Date().toISOString()
        };
      });
    }

    // Determine smart overall order status
    const allPkgs = Object.values(existingVendorPackages) as any[];
    let masterStatus = status;
    let masterStage = Number(trackingStage || 1);

    if (allPkgs.length > 0) {
      const allDelivered = allPkgs.every(p => p.trackingStage >= 4);
      const anyDispatched = allPkgs.some(p => p.trackingStage >= 3);
      const anyPacking = allPkgs.some(p => p.trackingStage >= 2);

      if (allDelivered) {
        masterStatus = 'delivered';
        masterStage = 4;
      } else if (anyDispatched) {
        masterStatus = 'dispatched';
        masterStage = 3;
      } else if (anyPacking) {
        masterStatus = 'packing';
        masterStage = 2;
      } else {
        masterStatus = 'escrow_secured';
        masterStage = 1;
      }
    }

    const updatedMeasurements = {
      ...existingMeasurements,
      vendorPackages: existingVendorPackages,
      trackingDetails: {
        ...(existingMeasurements.trackingDetails || {}),
        status: masterStatus,
        trackingStage: masterStage,
        waybillNumber: waybillNumber || existingMeasurements.trackingDetails?.waybillNumber || '',
        driverPhone: driverPhone || existingMeasurements.trackingDetails?.driverPhone || '',
        driverName: driverName || existingMeasurements.trackingDetails?.driverName || '',
        lastUpdated: new Date().toISOString()
      }
    };

    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: masterStatus,
        customer_measurements: updatedMeasurements
      })
      .eq('id', existingOrder.id)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating order status in DB:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Dispatch automated dispatch or settlement email alerts
    try {
      if (status === 'dispatched') {
        sendDispatchNotificationEmail({
          orderNumber: existingOrder.order_number,
          customerName: existingOrder.customer_name,
          customerEmail: existingOrder.customer_email || 'buyer@veyra.ng',
          deliveryAddress: existingOrder.delivery_address,
          items: existingOrder.order_items || [],
          totalAmount: Number(existingOrder.total_amount || 0),
          shippingFee: Number(existingOrder.shipping_fee || 0),
          driverPhone: driverPhone || '',
          waybillNumber: waybillNumber || '',
          vendorName: targetVendorId || 'Store Merchant'
        }).catch(e => console.error('Dispatch email error:', e));
      } else if (status === 'delivered') {
        sendDeliverySettledEmail(`${targetVendorId || 'merchant'}@merchants.veyra.ng`, {
          orderNumber: existingOrder.order_number,
          customerName: existingOrder.customer_name,
          customerEmail: existingOrder.customer_email || 'buyer@veyra.ng',
          deliveryAddress: existingOrder.delivery_address,
          items: existingOrder.order_items || [],
          totalAmount: Number(existingOrder.total_amount || 0),
          shippingFee: Number(existingOrder.shipping_fee || 0),
          vendorName: targetVendorId || 'Store Merchant'
        }).catch(e => console.error('Settled email error:', e));
      }
    } catch (e) {
      console.error('Patch email dispatch error:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated successfully`,
      order: updatedOrder
    });
  } catch (error: any) {
    console.error('API /api/orders PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
