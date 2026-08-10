import { jsPDF } from 'jspdf';

export interface InvoicePDFData {
  invoiceNumber: string;
  orderId: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  customerGstin?: string;
  customerPan?: string;
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

// Convert Number to Indian Words (Rupees)
function numberToIndianWords(num: number): string {
  const rounded = Math.round(num);
  if (rounded === 0) return 'ZERO RUPEES ONLY';

  const singleDigit = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const doubleDigit = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tensMultiple = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  function convertTwoDigits(n: number): string {
    if (n < 10) return singleDigit[n];
    if (n >= 10 && n < 20) return doubleDigit[n - 10];
    return tensMultiple[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + singleDigit[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += singleDigit[Math.floor(n / 100)] + ' HUNDRED ';
    }
    if (n % 100 > 0) {
      str += convertTwoDigits(n % 100);
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(rounded / 10000000);
  let rem = rounded % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (crore > 0) words += convertTwoDigits(crore) + ' CRORE ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' LAKH ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' THOUSAND ';
  if (rem > 0) words += convertThreeDigits(rem);

  return `${words.trim()} RUPEES ONLY`;
}

export async function generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Page Dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin; // 190mm

  // Outer Border Box
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

  let y = margin + 5;

  // 1. TOP STORE HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Mount Print Zone', margin + 35, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Ground Floor No.16', margin + 35, y + 9);
  doc.text(', 1st Cross', margin + 35, y + 13);
  doc.text('Bengaluru Urban, Karnataka - 560001', margin + 35, y + 17);

  // Store Contacts (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.text('Name :', 145, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Mount Print Zone', 157, y + 4);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone :', 145, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text('8867509334', 157, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.text('Email :', 145, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('mountprintzone@gmail.com', 157, y + 14);

  y += 22;

  // 2. GSTIN & TAX INVOICE HEADER BAR
  doc.rect(margin, y, contentWidth, 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GSTIN : 29AAYFM3999C1ZE', margin + 3, y + 5.5);

  doc.setFontSize(12);
  doc.setTextColor(2, 114, 184); // Blue accent
  doc.text('TAX INVOICE', 105, y + 5.5, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('ORIGINAL FOR RECIPIENT', 197, y + 5.5, { align: 'right' });

  y += 8;

  // 3. INVOICE META & CUSTOMER DETAILS BOX
  doc.rect(margin, y, contentWidth, 34);

  // Vertical Divider for Invoice Meta
  doc.line(90, y, 90, y + 34);

  // Customer Details (Left Side)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('M/S', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerName || 'Walk-in Customer', margin + 20, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Address', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(
    data.customerAddress || 'Mount Carmel College Road, Vasanth Nagar, Bengaluru, Karnataka - 560001',
    65
  );
  doc.text(addressLines, margin + 20, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN', margin + 3, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerGstin || 'URP (Unregistered Person)', margin + 20, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.text('PAN', margin + 3, y + 28);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerPan || 'N/A', margin + 20, y + 28);

  doc.setFont('helvetica', 'bold');
  doc.text('Place of Supply', margin + 3, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text('Karnataka ( 29 )', margin + 27, y + 32);

  // Invoice Details (Right Side)
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice No.', 93, y + 5);
  doc.text(data.invoiceNumber.replace('INV-', ''), 125, y + 5);

  doc.text('Invoice Date', 150, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.issueDate, 175, y + 5);

  y += 34;

  // 4. PRODUCTS & SERVICES TABLE
  const tableHeight = 85;
  doc.rect(margin, y, contentWidth, tableHeight);

  // Header Row
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.rect(margin, y, contentWidth, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Sr. No.', margin + 2, y + 5);
  doc.text('Name of Product / Service', margin + 20, y + 5);
  doc.text('HSN / SAC', 130, y + 5);
  doc.text('Qty', 152, y + 5, { align: 'right' });
  doc.text('Rate', 174, y + 5, { align: 'right' });
  doc.text('Taxable Value', 198, y + 5, { align: 'right' });

  // Column Vertical Dividers
  doc.line(margin + 12, y, margin + 12, y + tableHeight);
  doc.line(125, y, 125, y + tableHeight);
  doc.line(140, y, 140, y + tableHeight);
  doc.line(160, y, 160, y + tableHeight);
  doc.line(180, y, 180, y + tableHeight);

  // Line Item Row
  let itemY = y + 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.text('1', margin + 5, itemY);
  doc.setFont('helvetica', 'bold');
  doc.text(data.serviceName, margin + 15, itemY);
  doc.setFont('helvetica', 'normal');

  doc.text('998386', 130, itemY);
  doc.text(`${data.quantity.toFixed(2)} NOS`, 158, itemY, { align: 'right' });
  doc.text(data.unitPrice.toFixed(2), 178, itemY, { align: 'right' });
  doc.text(data.subtotal.toFixed(2), 198, itemY, { align: 'right' });

  // CGST & SGST Rows
  const halfGst = data.gstAmount / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CGST (9.00 %)', 123, y + 55, { align: 'right' });
  doc.text(halfGst.toFixed(2), 198, y + 55, { align: 'right' });

  doc.text('SGST (9.00 %)', 123, y + 60, { align: 'right' });
  doc.text(halfGst.toFixed(2), 198, y + 60, { align: 'right' });

  // Subtotal Divider
  doc.line(180, y + 50, 200, y + 50);

  // Table Bottom Total Bar
  doc.line(margin, y + tableHeight - 8, margin + contentWidth, y + tableHeight - 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Total', 123, y + tableHeight - 3, { align: 'right' });
  doc.text(`${data.quantity.toFixed(2)}`, 158, y + tableHeight - 3, { align: 'right' });
  doc.text(`₹ ${data.grandTotal.toFixed(2)}`, 198, y + tableHeight - 3, { align: 'right' });

  y += tableHeight;

  // 5. TOTAL IN WORDS BOX
  doc.rect(margin, y, contentWidth, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Total in words', margin + 3, y + 4);
  doc.text('(E & O.E.)', 197, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(numberToIndianWords(data.grandTotal), margin + 3, y + 9);

  y += 12;

  // 6. HSN / SAC TAX BREAKDOWN TABLE
  const taxTableHeight = 22;
  doc.rect(margin, y, contentWidth, taxTableHeight);

  // Headers
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('HSN / SAC', margin + 10, y + 4);
  doc.text('Taxable Value', 85, y + 4, { align: 'right' });
  doc.text('CGST', 115, y + 4, { align: 'center' });
  doc.text('SGST', 155, y + 4, { align: 'center' });
  doc.text('Total', 194, y + 4, { align: 'right' });

  doc.line(margin, y + 6, margin + contentWidth, y + 6);

  // Sub headers (% & Amount)
  doc.text('%', 100, y + 9);
  doc.text('Amount', 125, y + 9, { align: 'right' });
  doc.text('%', 140, y + 9);
  doc.text('Amount', 165, y + 9, { align: 'right' });

  doc.line(margin, y + 11, margin + contentWidth, y + 11);

  // Tax Row Values
  doc.setFont('helvetica', 'normal');
  doc.text('998386', margin + 10, y + 15);
  doc.text(data.subtotal.toFixed(2), 85, y + 15, { align: 'right' });
  doc.text('9.00', 100, y + 15);
  doc.text(halfGst.toFixed(2), 125, y + 15, { align: 'right' });
  doc.text('9.00', 140, y + 15);
  doc.text(halfGst.toFixed(2), 165, y + 15, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), 194, y + 15, { align: 'right' });

  doc.line(margin, y + 17, margin + contentWidth, y + 17);

  // Total Tax Row
  doc.setFont('helvetica', 'bold');
  doc.text('Total', 60, y + 20.5);
  doc.text(data.subtotal.toFixed(2), 85, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), 125, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), 165, y + 20.5, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), 194, y + 20.5, { align: 'right' });

  // Tax Table Column Dividers
  doc.line(65, y, 65, y + taxTableHeight);
  doc.line(90, y, 90, y + taxTableHeight);
  doc.line(130, y, 130, y + taxTableHeight);
  doc.line(170, y, 170, y + taxTableHeight);

  y += taxTableHeight;

  // Total Tax in Words
  doc.rect(margin, y, contentWidth, 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Total Tax in words: `, margin + 3, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(numberToIndianWords(data.gstAmount), margin + 32, y + 4);

  y += 6;

  // 7. BANK DETAILS & AUTHORISED SIGNATORY BOX
  const bottomHeight = 35;
  doc.rect(margin, y, contentWidth, bottomHeight);

  // Divider between Bank details & Signatory box
  doc.line(135, y, 135, y + bottomHeight);

  // Bank Details (Left)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, y, 125, 5, 'F');
  doc.text('Bank Details', 65, y + 3.5, { align: 'center' });
  doc.line(margin, y + 5, 135, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Name', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('Union Bank of India', margin + 30, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Branch', margin + 70, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('Vasanthnagaar', margin + 90, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Acc. Name', margin + 3, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text('Mount Print Zone', margin + 30, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Acc. Number', margin + 70, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text('510101003239313', margin + 90, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('IFSC', margin + 3, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text('UBIN0907472', margin + 30, y + 20);

  // Terms and Conditions Line
  doc.line(margin, y + 22, 135, y + 22);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms and Conditions', 65, y + 25.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Subject to our home Jurisdiction. Our Responsibility Ceases as soon as goods leaves our Premises. Goods once sold will not be taken back.', margin + 3, y + 29.5);

  // Authorised Signatory (Right)
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Certified that the particulars given above are true and correct.', 197, y + 5, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('For Mount Print Zone', 197, y + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Authorised Signatory', 197, y + 31, { align: 'right' });

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
