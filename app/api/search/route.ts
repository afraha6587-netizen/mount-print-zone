import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const [orders, services, portfolio, invoices] = await Promise.all([
      db.order.findMany({
        where: {
          OR: [
            { orderId: { contains: q } },
            { customerName: { contains: q } },
            { customerPhone: { contains: q } },
            { customerEmail: { contains: q } },
          ],
        },
        take: 5,
      }),
      db.service.findMany({
        where: {
          OR: [{ name: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
      }),
      db.portfolioItem.findMany({
        where: {
          OR: [{ title: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
      }),
      db.invoice.findMany({
        where: {
          invoiceNumber: { contains: q },
        },
        take: 5,
      }),
    ]);

    const results = [
      ...orders.map((o) => ({
        type: 'ORDER',
        id: o.id,
        title: `Order #${o.orderId} - ${o.customerName}`,
        subtitle: `₹${o.grandTotal} | Status: ${o.status}`,
        link: `/admin/orders?query=${o.orderId}`,
      })),
      ...services.map((s) => ({
        type: 'SERVICE',
        id: s.id,
        title: s.name,
        subtitle: `Starting at ₹${s.basePrice}`,
        link: `/admin/services`,
      })),
      ...portfolio.map((p) => ({
        type: 'PORTFOLIO',
        id: p.id,
        title: p.title,
        subtitle: p.description || 'Portfolio Showcase Item',
        link: `/admin/portfolio`,
      })),
      ...invoices.map((i) => ({
        type: 'INVOICE',
        id: i.id,
        title: `Invoice #${i.invoiceNumber}`,
        subtitle: `₹${i.grandTotal} | Status: ${i.paymentStatus}`,
        link: `/admin/orders`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
