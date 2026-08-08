export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || 'orders@mountprintzone.com';

  if (!apiKey) {
    console.log('📧 [MOCK EMAIL DISPATCH LOG]');
    console.log(`TO: ${payload.to}`);
    console.log(`SUBJECT: ${payload.subject}`);
    console.log('HTML CONTENT SUBSTRING:', payload.html.substring(0, 150) + '...');
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Mount Print Zone <${senderEmail}>`,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to send Resend email:', error);
    return false;
  }
}

export function buildOrderConfirmationEmail(order: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  quantity: number;
  grandTotal: number;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
      <h2 style="color: #0284c7; margin-top: 0;">Mount Print Zone</h2>
      <h3 style="margin-bottom: 8px;">Order Confirmed! #${order.orderId}</h3>
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order with Mount Print Zone. We have received your artwork file and your job is scheduled for processing.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px;">
        <tr>
          <td style="padding: 10px; font-weight: bold;">Order ID:</td>
          <td style="padding: 10px;">${order.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Service:</td>
          <td style="padding: 10px;">${order.serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Quantity:</td>
          <td style="padding: 10px;">${order.quantity}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold;">Grand Total:</td>
          <td style="padding: 10px; font-weight: bold; color: #0284c7;">₹${order.grandTotal.toFixed(2)}</td>
        </tr>
      </table>

      <p><a href="http://localhost:3000/track-order?id=${order.orderId}&phone=${order.customerPhone}" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Your Order Live</a></p>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Need help? Contact support@mountprintzone.com or WhatsApp us at +91 98765 43210.</p>
    </div>
  `;
}
