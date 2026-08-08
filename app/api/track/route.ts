import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trackOrderSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = trackOrderSchema.parse(body);

    const cleanPhone = parsed.phone.replace(/[^0-9]/g, '');

    const order = await db.order.findFirst({
      where: {
        orderId: { equals: parsed.orderId.trim().toUpperCase() },
        customerPhone: { contains: cleanPhone },
      },
      include: {
        service: {
          include: { category: true },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        invoice: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order found matching the provided Order ID and Phone Number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to track order' },
      { status: 400 }
    );
  }
}
