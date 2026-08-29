import { NextResponse } from 'next/server';
import { generateInvoicePDF, InvoiceItem } from '@/lib/pdf';
import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerName = body.customerName?.trim() || 'Walk-in Customer';
    const customerPhone = body.customerPhone?.trim() || '9876543210';
    const customerEmail = body.customerEmail?.trim() || 'contact@mountprintzone.com';
    const customerAddress = body.customerAddress?.trim() || '';
    const customerGstin = body.customerGstin?.trim() || '';
    const paymentStatus = body.paymentStatus || 'PAID';
    const paymentMode = body.paymentMode || 'Cash';
    const saveToDb = Boolean(body.saveToDb);

    const rawItems: InvoiceItem[] = Array.isArray(body.items) && body.items.length > 0
      ? body.items
      : [
          {
            name: 'Stationery & Printing Job',
            hsnSac: '998386',
            quantity: 1,
            unitPrice: 100,
            subtotal: 100,
          },
        ];

    const items = rawItems.map((item) => {
      const q = Math.max(1, Number(item.quantity) || 1);
      const r = Math.max(0, Number(item.unitPrice) || 0);
      return {
        name: item.name?.trim() || 'General Item',
        hsnSac: item.hsnSac?.trim() || '998386',
        quantity: q,
        unitPrice: r,
        subtotal: q * r,
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const discountAmount = Math.max(0, Number(body.discountAmount) || 0);
    const deliveryCharge = Math.max(0, Number(body.deliveryCharge) || 0);

    const settings = await getSiteSettings();
    const gstRatePercent = parseFloat(settings.gst_rate || '18');

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const gstAmount = Math.round((taxableAmount * (gstRatePercent / 100)) * 100) / 100;
    const grandTotal = Math.round((taxableAmount + gstAmount + deliveryCharge) * 100) / 100;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    const orderId = `POS-${dateStr}-${randomSuffix}`;
    const invoiceNumber = `INV-${orderId}`;
    const issueDateStr = new Date().toLocaleDateString('en-IN');

    // Optionally save custom POS order to database
    if (saveToDb) {
      try {
        let firstService = await db.service.findFirst();
        if (!firstService) {
          const fallbackCat = await db.serviceCategory.create({
            data: { name: 'POS Sales', slug: 'pos-sales' },
          });
          firstService = await db.service.create({
            data: {
              name: 'POS Quick Sale',
              slug: 'pos-quick-sale',
              categoryId: fallbackCat.id,
              basePrice: 10,
              description: 'Quick store sale item',
              estimatedDelivery: 'Instant',
            },
          });
        }

        const createdOrder = await db.order.create({
          data: {
            orderId,
            customerName,
            customerPhone,
            customerEmail,
            serviceId: firstService.id,
            quantity: items.reduce((a, b) => a + b.quantity, 0),
            unitPrice: items[0]?.unitPrice || 0,
            subtotal,
            discountAmount,
            gstAmount,
            deliveryCharge,
            grandTotal,
            paymentStatus,
            notes: `[POS Quick Invoice] Items: ${items.map((i) => `${i.name} (x${i.quantity})`).join(', ')} | Mode: ${paymentMode}`,
          },
        });

        await db.invoice.create({
          data: {
            invoiceNumber,
            orderId: createdOrder.id,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 86400000),
            subtotal,
            taxAmount: gstAmount,
            grandTotal,
            paymentStatus,
          },
        });
      } catch (dbErr) {
        console.warn('Could not save POS order to database, proceeding with PDF stream:', dbErr);
      }
    }

    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber,
      orderId,
      issueDate: issueDateStr,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerGstin,
      items,
      subtotal,
      discountAmount,
      gstAmount,
      deliveryCharge,
      grandTotal,
      paymentStatus,
      paymentMode,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('POS Invoice generation error:', error);
    return NextResponse.json({ error: error.message || 'Invoice generation failed' }, { status: 400 });
  }
}
