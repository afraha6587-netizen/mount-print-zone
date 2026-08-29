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
  const doubleDigit = [
    'TEN',
    'ELEVEN',
    'TWELVE',
    'THIRTEEN',
    'FOURTEEN',
    'FIFTEEN',
    'SIXTEEN',
    'SEVENTEEN',
    'EIGHTEEN',
    'NINETEEN',
  ];
  const tensMultiple = [
    '',
    '',
    'TWENTY',
    'THIRTY',
    'FORTY',
    'FIFTY',
    'SIXTY',
    'SEVENTY',
    'EIGHTY',
    'NINETY',
  ];

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

  // Page Dimensions & Grid Setup
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin; // 190mm
  const rightMargin = margin + contentWidth; // 200mm

  // Outer Border Frame
  doc.setLineWidth(0.35);
  doc.setDrawColor(30, 41, 59); // Slate-800
  doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

  let y = margin;

  // ==========================================
  // SECTION 1: STORE BRANDING & CONTACT HEADER
  // ==========================================
  doc.setFillColor(2, 132, 199); // Sky-600 Blue accent line at top
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 5;

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(2, 132, 199); // Brand Blue
  doc.text('MOUNT PRINT ZONE', margin + 3, y + 4);

  // Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('DIGITAL PRINTING | WIDE FORMAT PLOTTING | BINDING & STATIONERY', margin + 3, y + 8.5);

  // Store Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // Slate-700
  doc.text('16 1st Cross, 12th Main Rd, near MOUNT CARMEL COLLEGE,', margin + 3, y + 13);
  doc.text('Vasanth Nagar, Bengaluru, Karnataka - 560001', margin + 3, y + 17);

  // Store Contacts (Right-aligned)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Mobile / WhatsApp :', rightMargin - 45, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('+91 88675 09334', rightMargin - 3, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Email :', rightMargin - 45, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text('mountprintzone@gmail.com', rightMargin - 3, y + 9, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN :', rightMargin - 45, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('29AAYFM3999C1ZE', rightMargin - 3, y + 14, { align: 'right' });

  y += 22;

  // ==========================================
  // SECTION 2: TAX INVOICE BANNER
  // ==========================================
  doc.setFillColor(15, 23, 42); // Dark Navy Banner
  doc.rect(margin, y, contentWidth, 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('GSTIN: 29AAYFM3999C1ZE', margin + 4, y + 5);

  doc.setFontSize(11);
  doc.text('TAX INVOICE', pageWidth / 2, y + 5.2, { align: 'center' });

  doc.setFontSize(8);
  doc.text('ORIGINAL FOR RECIPIENT', rightMargin - 4, y + 5, { align: 'right' });

  y += 7.5;

  // ==========================================
  // SECTION 3: CUSTOMER & INVOICE META GRID
  // ==========================================
  const metaHeight = 36;
  doc.setLineWidth(0.25);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, metaHeight);

  // Vertical Divider (Middle Split)
  const splitX = margin + 100; // 110mm
  doc.line(splitX, y, splitX, y + metaHeight);

  // --- LEFT SIDE: CUSTOMER DETAILS ---
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 90, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('BILLED TO (CUSTOMER DETAILS)', margin + 3, y + 4);
  doc.line(margin, y + 5.5, splitX, y + 5.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('M/S :', margin + 3, y + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(data.customerName || 'Walk-in Customer', margin + 16, y + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone :', margin + 3, y + 15.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerPhone || 'N/A', margin + 16, y + 15.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Email :', margin + 3, y + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerEmail || 'N/A', margin + 16, y + 20.5);

  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN :', margin + 3, y + 25.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerGstin || 'URP (Unregistered Person)', margin + 16, y + 25.5);

  doc.setFont('helvetica', 'bold');
  doc.text('State :', margin + 3, y + 30.5);
  doc.setFont('helvetica', 'normal');
  doc.text('29 - Karnataka', margin + 16, y + 30.5);

  // --- RIGHT SIDE: INVOICE META ---
  doc.setFillColor(248, 250, 252);
  doc.rect(splitX, y, 90, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('INVOICE INFORMATION', splitX + 3, y + 4);
  doc.line(splitX, y + 5.5, rightMargin, y + 5.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice No. :', splitX + 3, y + 10.5);
  doc.setTextColor(2, 132, 199);
  doc.text(data.invoiceNumber, splitX + 28, y + 10.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date :', splitX + 3, y + 15.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.issueDate, splitX + 28, y + 15.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Order ID :', splitX + 3, y + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.orderId, splitX + 28, y + 20.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status :', splitX + 3, y + 25.5);
  const isPaid = data.paymentStatus?.toUpperCase() === 'PAID';
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isPaid ? 16 : 225, isPaid ? 185 : 29, isPaid ? 129 : 72);
  doc.text(isPaid ? 'PAID' : 'UNPAID', splitX + 28, y + 25.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Place of Supply :', splitX + 3, y + 30.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Bengaluru, Karnataka (29)', splitX + 28, y + 30.5);

  y += metaHeight;

  // ==========================================
  // SECTION 4: PRODUCTS & SERVICES TABLE GRID
  // ==========================================
  const tableHeight = 90;
  doc.setLineWidth(0.25);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, tableHeight);

  // Column Positions (Exact Vertical Grid Alignment)
  const colSr = margin + 12; // 22mm
  const colDesc = margin + 110; // 120mm
  const colHsn = margin + 132; // 142mm
  const colQty = margin + 152; // 162mm
  const colRate = margin + 172; // 182mm
  // Right edge = rightMargin (200mm)

  // Header Bar (Fill slate-100)
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7.5, 'F');
  doc.line(margin, y + 7.5, rightMargin, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.text('Sr.', margin + 6, y + 5, { align: 'center' });
  doc.text('Description of Goods / Services', margin + 15, y + 5);
  doc.text('HSN/SAC', colDesc + 11, y + 5, { align: 'center' });
  doc.text('Qty', colHsn + 10, y + 5, { align: 'center' });
  doc.text('Rate (₹)', colQty + 10, y + 5, { align: 'center' });
  doc.text('Amount (₹)', colRate + 14, y + 5, { align: 'center' });

  // Vertical Grid Lines (Full height down table)
  doc.line(colSr, y, colSr, y + tableHeight);
  doc.line(colDesc, y, colDesc, y + tableHeight);
  doc.line(colHsn, y, colHsn, y + tableHeight);
  doc.line(colQty, y, colQty, y + tableHeight);
  doc.line(colRate, y, colRate, y + tableHeight);

  // Line Item Row 1
  let itemY = y + 13;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('1', margin + 6, itemY, { align: 'center' });

  // Service Name & Description
  doc.setTextColor(15, 23, 42);
  doc.text(data.serviceName, margin + 15, itemY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Commercial Print Job | Mount Print Zone Specifications', margin + 15, itemY + 4.5);

  // Numbers (Right/Center Aligned)
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('998386', colDesc + 11, itemY, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text(`${data.quantity}`, colHsn + 18, itemY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(data.unitPrice.toFixed(2), colQty + 18, itemY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text(data.subtotal.toFixed(2), rightMargin - 3, itemY, { align: 'right' });

  // TABLE BOTTOM SUMMARY BOX (Y: y + tableHeight - 28 to y + tableHeight)
  const summaryTop = y + tableHeight - 28;
  doc.line(colDesc, summaryTop, rightMargin, summaryTop);

  let sumY = summaryTop + 5;
  doc.setFontSize(8);

  // Taxable Value
  doc.setFont('helvetica', 'normal');
  doc.text('Taxable Subtotal :', colRate - 3, sumY, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`₹ ${data.subtotal.toFixed(2)}`, rightMargin - 3, sumY, { align: 'right' });

  // CGST Line
  sumY += 5;
  const halfGst = data.gstAmount / 2;
  doc.setFont('helvetica', 'normal');
  doc.text('CGST (9.00%) :', colRate - 3, sumY, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`₹ ${halfGst.toFixed(2)}`, rightMargin - 3, sumY, { align: 'right' });

  // SGST Line
  sumY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('SGST (9.00%) :', colRate - 3, sumY, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`₹ ${halfGst.toFixed(2)}`, rightMargin - 3, sumY, { align: 'right' });

  // Delivery Charges (if any)
  if (data.deliveryCharge > 0) {
    sumY += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Delivery Charge :', colRate - 3, sumY, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`₹ ${data.deliveryCharge.toFixed(2)}`, rightMargin - 3, sumY, { align: 'right' });
  }

  // Grand Total Bottom Bar
  const grandBarY = y + tableHeight - 8;
  doc.line(margin, grandBarY, rightMargin, grandBarY);

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, grandBarY, contentWidth, 8, 'F');
  doc.line(margin, grandBarY, rightMargin, grandBarY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Items / Qty :', margin + 4, grandBarY + 5.5);
  doc.setTextColor(2, 132, 199);
  doc.text(`${data.quantity} Pcs`, margin + 34, grandBarY + 5.5);

  doc.setTextColor(15, 23, 42);
  doc.text('GRAND TOTAL :', colRate - 3, grandBarY + 5.5, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(2, 132, 199);
  doc.text(`₹ ${data.grandTotal.toFixed(2)}`, rightMargin - 3, grandBarY + 5.5, { align: 'right' });

  y += tableHeight;

  // ==========================================
  // SECTION 5: TOTAL IN WORDS BOX
  // ==========================================
  doc.rect(margin, y, contentWidth, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Amount Chargeable in Words :', margin + 3, y + 4);

  doc.setFont('helvetica', 'bold');
  doc.text('(E. & O.E.)', rightMargin - 3, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(numberToIndianWords(data.grandTotal), margin + 3, y + 8.5);

  y += 11;

  // ==========================================
  // SECTION 6: HSN / SAC TAX BREAKDOWN TABLE
  // ==========================================
  const taxTableH = 22;
  doc.rect(margin, y, contentWidth, taxTableH);

  // Column Positions for Tax Table
  const tCol1 = margin + 35; // HSN (35mm)
  const tCol2 = margin + 70; // Taxable Value (35mm)
  const tCol3 = margin + 95; // CGST Rate
  const tCol4 = margin + 125; // CGST Amt
  const tCol5 = margin + 150; // SGST Rate
  const tCol6 = margin + 175; // SGST Amt

  // Header Fill
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.line(margin, y + 5, rightMargin, y + 5);
  doc.line(margin, y + 10, rightMargin, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);

  doc.text('HSN / SAC', margin + 17, y + 3.8, { align: 'center' });
  doc.text('Taxable Value (₹)', tCol1 + 17.5, y + 3.8, { align: 'center' });
  doc.text('Central Tax (CGST)', tCol2 + 27.5, y + 3.8, { align: 'center' });
  doc.text('State Tax (SGST)', tCol4 + 25, y + 3.8, { align: 'center' });
  doc.text('Total Tax (₹)', tCol6 + 7.5, y + 3.8, { align: 'center' });

  // Sub headers (% & Amount)
  doc.text('Rate', tCol2 + 12.5, y + 8.8, { align: 'center' });
  doc.text('Amount (₹)', tCol3 + 15, y + 8.8, { align: 'center' });
  doc.text('Rate', tCol4 + 12.5, y + 8.8, { align: 'center' });
  doc.text('Amount (₹)', tCol5 + 12.5, y + 8.8, { align: 'center' });

  // Vertical Lines in Tax Table
  doc.line(tCol1, y, tCol1, y + taxTableH);
  doc.line(tCol2, y, tCol2, y + taxTableH);
  doc.line(tCol3, y + 5, tCol3, y + taxTableH - 5);
  doc.line(tCol4, y, tCol4, y + taxTableH);
  doc.line(tCol5, y + 5, tCol5, y + taxTableH - 5);
  doc.line(tCol6, y, tCol6, y + taxTableH);

  // Tax Value Row (Y = y + 14.5)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('998386', margin + 17, y + 14.5, { align: 'center' });
  doc.text(data.subtotal.toFixed(2), tCol2 - 2, y + 14.5, { align: 'right' });
  doc.text('9.00 %', tCol2 + 12.5, y + 14.5, { align: 'center' });
  doc.text(halfGst.toFixed(2), tCol4 - 2, y + 14.5, { align: 'right' });
  doc.text('9.00 %', tCol4 + 12.5, y + 14.5, { align: 'center' });
  doc.text(halfGst.toFixed(2), tCol6 - 2, y + 14.5, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), rightMargin - 2, y + 14.5, { align: 'right' });

  // Divider Line before Total Tax Row
  doc.line(margin, y + 17, rightMargin, y + 17);

  // Total Tax Row (Y = y + 20.5)
  doc.setFont('helvetica', 'bold');
  doc.text('Total', margin + 17, y + 20.5, { align: 'center' });
  doc.text(data.subtotal.toFixed(2), tCol2 - 2, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), tCol4 - 2, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), tCol6 - 2, y + 20.5, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), rightMargin - 2, y + 20.5, { align: 'right' });

  y += taxTableH;

  // Total Tax in Words Bar
  doc.rect(margin, y, contentWidth, 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tax Amount in Words :', margin + 3, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(numberToIndianWords(data.gstAmount), margin + 33, y + 4);

  y += 6;

  // ==========================================
  // SECTION 7: BANK DETAILS & AUTHORISED SIGNATORY
  // ==========================================
  const footerH = pageHeight - margin - y; // Remaining height to bottom border
  doc.rect(margin, y, contentWidth, footerH);

  // Vertical Split Divider
  const footSplitX = margin + 115; // 125mm
  doc.line(footSplitX, y, footSplitX, y + footerH);

  // --- LEFT SIDE: BANK DETAILS & TERMS ---
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 115, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('OUR BANK DETAILS FOR DIRECT UPI / NEFT PAYMENT', margin + 3, y + 4);
  doc.line(margin, y + 5.5, footSplitX, y + 5.5);

  let bY = y + 10;
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('Bank Name :', margin + 3, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('Union Bank of India', margin + 26, bY);

  doc.setFont('helvetica', 'bold');
  doc.text('Branch :', margin + 65, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('Vasanthnagar, BLR', margin + 82, bY);

  bY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Account Name :', margin + 3, bY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Mount Print Zone', margin + 26, bY);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Account No. :', margin + 65, bY);
  doc.setFont('helvetica', 'bold');
  doc.text('510101003239313', margin + 82, bY);

  bY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('IFSC Code :', margin + 3, bY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('UBIN0907472', margin + 26, bY);

  // Terms & Conditions Header
  bY += 6;
  doc.line(margin, bY, footSplitX, bY);
  bY += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Terms & Conditions :', margin + 3, bY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Goods once sold will not be taken back or exchanged.', margin + 3, bY + 4);
  doc.text('2. Our responsibility ceases as soon as goods leave our store premises.', margin + 3, bY + 7.5);
  doc.text('3. All disputes are subject to Bengaluru Jurisdiction only.', margin + 3, bY + 11);

  // --- RIGHT SIDE: AUTHORISED SIGNATORY ---
  let sigY = y + 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Certified that the particulars given above are true and correct.', rightMargin - 4, sigY, {
    align: 'right',
  });

  sigY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('For MOUNT PRINT ZONE', rightMargin - 4, sigY, { align: 'right' });

  // Signature Space
  sigY = y + footerH - 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('Authorised Signatory', rightMargin - 4, sigY, { align: 'right' });

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
