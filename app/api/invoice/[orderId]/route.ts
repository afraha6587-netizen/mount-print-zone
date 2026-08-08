import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateInvoicePDF } from '@/lib/pdf';
import { getSiteSettings } from '@/lib/settings';

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;

    const order = await db.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderId: orderId.toUpperCase() }],
      },
      include: {
        service: true,
        invoice: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const settings = await getSiteSettings();

    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber: order.invoice?.invoiceNumber || `INV-${order.orderId}`,
      orderId: order.orderId,
      issueDate: order.invoice?.issueDate
        ? new Date(order.invoice.issueDate).toLocaleDateString('en-IN')
        : new Date(order.createdAt).toLocaleDateString('en-IN'),
      dueDate: order.invoice?.dueDate
        ? new Date(order.invoice.dueDate).toLocaleDateString('en-IN')
        : new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN'),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      serviceName: order.service.name,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      gstAmount: order.gstAmount,
      deliveryCharge: order.deliveryCharge,
      grandTotal: order.grandTotal,
      paymentStatus: order.paymentStatus,
      companyName: settings.company_name,
      companyAddress: settings.address,
      companyPhone: settings.phone,
      companyEmail: settings.email,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${order.orderId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF invoice generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF invoice' }, { status: 500 });
  }
}
