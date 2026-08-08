import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customOrderSchema } from '@/lib/validators';
import { generateOrderId } from '@/lib/order-utils';
import { getSiteSettings } from '@/lib/settings';
import { sendEmail, buildOrderConfirmationEmail } from '@/lib/email';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = customOrderSchema.parse(body);

    const service = await db.service.findUnique({
      where: { id: parsed.serviceId },
      include: { pricingRules: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Selected service not found' }, { status: 404 });
    }

    // Fetch Site Settings for GST & Delivery
    const settings = await getSiteSettings();
    const gstRate = parseFloat(settings.gst_rate || '18') / 100;
    const baseDelivery = parseFloat(settings.delivery_charge || '99');
    const freeThreshold = parseFloat(settings.free_delivery_threshold || '1499');

    // Calculate volume discount rate
    let unitPrice = service.basePrice;
    let discountPercent = service.discountPercent || 0;

    for (const rule of service.pricingRules) {
      if (parsed.quantity >= rule.minQuantity && parsed.quantity <= rule.maxQuantity) {
        unitPrice = rule.unitPrice;
        discountPercent = Math.max(discountPercent, rule.discountPercent);
        break;
      }
    }

    const subtotal = parsed.quantity * unitPrice;
    const discountAmount = (subtotal * discountPercent) / 100;
    const netSubtotal = subtotal - discountAmount;
    const gstAmount = netSubtotal * gstRate;
    const deliveryCharge = netSubtotal >= freeThreshold ? 0 : baseDelivery;
    const grandTotal = netSubtotal + gstAmount + deliveryCharge;

    // Generate unique Order ID
    let orderId = generateOrderId();
    let isUnique = false;
    while (!isUnique) {
      const existing = await db.order.findUnique({ where: { orderId } });
      if (!existing) isUnique = true;
      else orderId = generateOrderId();
    }

    // Create Order with initial Timeline
    const order = await db.order.create({
      data: {
        orderId,
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        customerEmail: parsed.customerEmail,
        serviceId: service.id,
        quantity: parsed.quantity,
        unitPrice,
        subtotal,
        discountAmount,
        gstAmount,
        deliveryCharge,
        grandTotal,
        notes: parsed.notes || '',
        designFileUrl: parsed.designFileUrl || '',
        designFileName: parsed.designFileName || '',
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        timeline: {
          create: [
            {
              status: 'PENDING',
              note: 'Order submitted by customer with artwork file.',
              createdBy: 'Customer',
            },
          ],
        },
      },
    });

    // Create Admin Notification
    await db.notification.create({
      data: {
        type: 'NEW_ORDER',
        title: 'New Order Received',
        message: `Order #${orderId} placed by ${parsed.customerName} for ${service.name}.`,
        link: '/admin/orders',
      },
    });

    // Dispatch Confirmation Email
    sendEmail({
      to: parsed.customerEmail,
      subject: `Order Confirmation #${orderId} - Mount Print Zone`,
      html: buildOrderConfirmationEmail({
        orderId,
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        serviceName: service.name,
        quantity: parsed.quantity,
        grandTotal,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        grandTotal: order.grandTotal,
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (status) where.status = status;
    if (query) {
      where.OR = [
        { orderId: { contains: query } },
        { customerName: { contains: query } },
        { customerPhone: { contains: query } },
        { customerEmail: { contains: query } },
      ];
    }

    const orders = await db.order.findMany({
      where,
      include: {
        service: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
