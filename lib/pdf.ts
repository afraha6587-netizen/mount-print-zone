import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface InvoicePDFData {
  invoiceNumber: string;
  orderId: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentStatus: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export async function generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Page Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [2, 132, 199]; // Sky 600
  const lightBg = [248, 250, 252]; // Slate 50

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(data.companyName || 'MOUNT PRINT ZONE', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Precision Printing & Premium Finishing', 15, 25);
  doc.text('GSTIN: 07AAAAM1234F1Z9 | Regd. Office', 15, 30);

  // Invoice Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 195, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${data.invoiceNumber}`, 195, 27, { align: 'right' });

  // 2. Info Cards Block
  let y = 48;

  // Customer Details Column
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO:', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.customerName, 15, y + 6);
  doc.text(`Phone: ${data.customerPhone}`, 15, y + 12);
  doc.text(`Email: ${data.customerEmail}`, 15, y + 18);

  // Invoice Meta Column
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS:', 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order Ref: #${data.orderId}`, 120, y + 6);
  doc.text(`Issue Date: ${data.issueDate}`, 120, y + 12);
  doc.text(`Payment Status: ${data.paymentStatus.toUpperCase()}`, 120, y + 18);

  // 3. Table Header
  y = 80;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(15, y, 180, 10, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ITEM / SERVICE DESCRIPTION', 20, y + 6.5);
  doc.text('QTY', 120, y + 6.5, { align: 'center' });
  doc.text('UNIT PRICE', 150, y + 6.5, { align: 'right' });
  doc.text('AMOUNT (₹)', 190, y + 6.5, { align: 'right' });

  // Table Row
  y += 10;
  doc.rect(15, y, 180, 14, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(data.serviceName, 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('High precision industrial printing with custom finishing.', 20, y + 10.5);

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(String(data.quantity), 120, y + 7, { align: 'center' });
  doc.text(`₹${data.unitPrice.toFixed(2)}`, 150, y + 7, { align: 'right' });
  doc.text(`₹${data.subtotal.toFixed(2)}`, 190, y + 7, { align: 'right' });

  // 4. Totals Calculation Box
  y += 20;
  const totalBoxX = 120;
  doc.setFontSize(9.5);

  doc.text('Subtotal:', totalBoxX, y);
  doc.text(`₹${data.subtotal.toFixed(2)}`, 190, y, { align: 'right' });

  if (data.discountAmount > 0) {
    y += 6;
    doc.text('Discount:', totalBoxX, y);
    doc.text(`- ₹${data.discountAmount.toFixed(2)}`, 190, y, { align: 'right' });
  }

  y += 6;
  doc.text('GST (18%):', totalBoxX, y);
  doc.text(`₹${data.gstAmount.toFixed(2)}`, 190, y, { align: 'right' });

  if (data.deliveryCharge > 0) {
    y += 6;
    doc.text('Delivery Fee:', totalBoxX, y);
    doc.text(`₹${data.deliveryCharge.toFixed(2)}`, 190, y, { align: 'right' });
  }

  y += 8;
  doc.setLineWidth(0.5);
  doc.setDrawColor(2, 132, 199);
  doc.line(totalBoxX, y, 195, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('Grand Total:', totalBoxX, y);
  doc.text(`₹${data.grandTotal.toFixed(2)}`, 190, y, { align: 'right' });

  // 5. QR Code & Verification
  try {
    const qrDataUrl = await QRCode.toDataURL(
      `https://mountprintzone.com/track-order?id=${data.orderId}&phone=${data.customerPhone}`
    );
    doc.addImage(qrDataUrl, 'PNG', 15, 140, 32, 32);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Scan QR to track status & verify', 15, 176);
  } catch (e) {
    console.error('QR code generation error:', e);
  }

  // 6. Footer & Terms
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 260, 195, 260);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for choosing Mount Print Zone! For queries: support@mountprintzone.com | +91 98765 43210', 105, 266, { align: 'center' });
  doc.text('This is a computer-generated tax invoice and requires no physical signature.', 105, 271, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}
