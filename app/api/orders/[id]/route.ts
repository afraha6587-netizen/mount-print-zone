import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { generateInvoiceNumber } from '@/lib/order-utils';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, expectedDeliveryDate, note, generateInvoice } = body;

    const order = await db.order.findUnique({
      where: { id },
      include: { service: true, invoice: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (expectedDeliveryDate) updateData.expectedDeliveryDate = expectedDeliveryDate;

    // Update order
    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
    });

    // Add Timeline Event if status changed or note provided
    if (status || note) {
      await db.orderTimeline.create({
        data: {
          orderId: id,
          status: status || order.status,
          note: note || `Status updated to ${status || order.status}`,
          createdBy: session.name || session.role,
        },
      });
    }

    // Generate Invoice if requested and not existing
    if (generateInvoice && !order.invoice) {
      const count = await db.invoice.count();
      const invoiceNumber = generateInvoiceNumber(count + 1);

      await db.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          subtotal: order.subtotal,
          taxAmount: order.gstAmount,
          grandTotal: order.grandTotal,
          paymentStatus: paymentStatus || order.paymentStatus,
        },
      });

      await db.notification.create({
        data: {
          type: 'INVOICE_GENERATED',
          title: 'Invoice Generated',
          message: `Invoice ${invoiceNumber} created for Order #${order.orderId}`,
          link: '/admin/orders',
        },
      });
    } else if (paymentStatus && order.invoice) {
      await db.invoice.update({
        where: { id: order.invoice.id },
        data: { paymentStatus },
      });
    }

    // Send email alert to customer on status change
    if (status && status !== order.status) {
      sendEmail({
        to: order.customerEmail,
        subject: `Order Update #${order.orderId} - ${status} - Mount Print Zone`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #0284c7;">Mount Print Zone Status Update</h2>
            <p>Dear ${order.customerName},</p>
            <p>Your order <strong>#${order.orderId}</strong> for ${order.service.name} status has been updated to: <strong style="color: #0284c7;">${status}</strong>.</p>
            ${note ? `<p>Note: ${note}</p>` : ''}
            <p><a href="http://localhost:3000/track-order?id=${order.orderId}&phone=${order.customerPhone}">Click here to view timeline</a></p>
          </div>
        `,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const { id } = await params;
    await db.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
