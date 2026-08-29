import { jsPDF } from 'jspdf';

export interface InvoiceItem {
  name: string;
  hsnSac?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InvoicePDFData {
  invoiceNumber: string;
  orderId?: string;
  issueDate: string;
  dueDate?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerGstin?: string;
  customerPan?: string;
  serviceName?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal: number;
  discountAmount?: number;
  gstAmount: number;
  deliveryCharge?: number;
  grandTotal: number;
  paymentStatus: string;
  paymentMode?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  items?: InvoiceItem[];
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

  // Standardize Line Items (Supports Multi-item stationery & printing)
  const itemList: InvoiceItem[] =
    data.items && data.items.length > 0
      ? data.items
      : [
          {
            name: data.serviceName || 'Commercial Printing Job',
            hsnSac: '998386',
            quantity: data.quantity || 1,
            unitPrice: data.unitPrice || data.subtotal,
            subtotal: data.subtotal,
          },
        ];

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
  doc.setTextColor(15, 23, 42);
  doc.text('Mount Print Zone', margin + 3, y + 4);

  // Store Address (Clean multi-line without leading punctuation)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Ground Floor No.16, 1st Cross, 12th Main Rd,', margin + 3, y + 9);
  doc.text('near MOUNT CARMEL COLLEGE, Vasanth Nagar,', margin + 3, y + 13);
  doc.text('Bengaluru Urban, Karnataka - 560001', margin + 3, y + 17);

  // Store Contacts (Right-aligned)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Name :', rightMargin - 45, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Mount Print Zone', rightMargin - 3, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Phone :', rightMargin - 45, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text('8867509334', rightMargin - 3, y + 9, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Email :', rightMargin - 45, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('mountprintzone@gmail.com', rightMargin - 3, y + 14, { align: 'right' });

  y += 22;

  // ==========================================
  // SECTION 2: TAX INVOICE BANNER
  // ==========================================
  doc.setLineWidth(0.25);
  doc.setDrawColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GSTIN : 29AAYFM3999C1ZE', margin + 4, y + 5);

  doc.setFontSize(11);
  doc.setTextColor(2, 132, 199);
  doc.text('TAX INVOICE', pageWidth / 2, y + 5.2, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ORIGINAL FOR RECIPIENT', rightMargin - 4, y + 5, { align: 'right' });

  y += 7.5;

  // ==========================================
  // SECTION 3: CUSTOMER & INVOICE META GRID
  // ==========================================
  const metaHeight = 36;
  doc.rect(margin, y, contentWidth, metaHeight);

  // Vertical Divider (Middle Split)
  const splitX = margin + 100; // 110mm
  doc.line(splitX, y, splitX, y + metaHeight);

  // --- LEFT SIDE: CUSTOMER DETAILS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('M/S', margin + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(data.customerName || 'Walk-in Customer', margin + 20, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Address', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(
    data.customerAddress || 'Mount Carmel College Road, Vasanth Nagar, Bengaluru, Karnataka - 560001',
    75
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

  // --- RIGHT SIDE: INVOICE META ---
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice No.', splitX + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text(data.invoiceNumber, splitX + 25, y + 5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date', splitX + 55, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.issueDate, splitX + 76, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Order Ref', splitX + 3, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.orderId || 'POS-DIRECT', splitX + 25, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Mode', splitX + 3, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentMode || 'Cash / UPI / Card', splitX + 25, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status', splitX + 3, y + 26);
  const isPaid = data.paymentStatus?.toUpperCase() === 'PAID';
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isPaid ? 16 : 225, isPaid ? 185 : 29, isPaid ? 129 : 72);
  doc.text(isPaid ? 'PAID' : 'UNPAID', splitX + 25, y + 26);

  y += metaHeight;

  // ==========================================
  // SECTION 4: PRODUCTS & SERVICES TABLE GRID
  // ==========================================
  const tableHeight = 90;
  doc.setLineWidth(0.25);
  doc.setDrawColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, tableHeight);

  // Column Positions (Exact Vertical Grid Alignment)
  // Total width: 190mm (from X = 10 to X = 200)
  const col1_Sr = 22; // Sr. (10 to 22)
  const col2_Desc = 110; // Name of Product (22 to 110)
  const col3_Hsn = 132; // HSN/SAC (110 to 132)
  const col4_Qty = 152; // Qty (132 to 152)
  const col5_Rate = 175; // Rate (152 to 175)
  // Taxable Value (175 to 200)

  // Header Bar (Height 7.5mm)
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7.5, 'F');
  doc.line(margin, y + 7.5, rightMargin, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.text('Sr. No.', margin + 6, y + 5, { align: 'center' });
  doc.text('Name of Product / Service', margin + 15, y + 5);
  doc.text('HSN / SAC', (110 + 132) / 2, y + 5, { align: 'center' });
  doc.text('Qty', (132 + 152) / 2, y + 5, { align: 'center' });
  doc.text('Rate', 172, y + 5, { align: 'right' });
  doc.text('Taxable Value', rightMargin - 3, y + 5, { align: 'right' });

  // Vertical Grid Lines (Running down table height)
  doc.line(col1_Sr, y, col1_Sr, y + tableHeight);
  doc.line(col2_Desc, y, col2_Desc, y + tableHeight);
  doc.line(col3_Hsn, y, col3_Hsn, y + tableHeight);
  doc.line(col4_Qty, y, col4_Qty, y + tableHeight);
  doc.line(col5_Rate, y, col5_Rate, y + tableHeight);

  // Render Line Items
  let lineY = y + 13;
  let totalQuantityCount = 0;

  itemList.forEach((item, index) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    // Sr No.
    doc.text(`${index + 1}`, margin + 6, lineY, { align: 'center' });

    // Item Name
    doc.setFont('helvetica', 'bold');
    const itemNameWrapped = doc.splitTextToSize(item.name, 82);
    doc.text(itemNameWrapped, margin + 15, lineY);

    // HSN Code
    doc.setFont('helvetica', 'normal');
    doc.text(item.hsnSac || '998386', (110 + 132) / 2, lineY, { align: 'center' });

    // Qty
    doc.text(`${item.quantity.toFixed(2)} NOS`, (132 + 152) / 2, lineY, { align: 'center' });
    totalQuantityCount += item.quantity;

    // Rate
    doc.text(item.unitPrice.toFixed(2), 172, lineY, { align: 'right' });

    // Taxable Value Amount
    doc.text(item.subtotal.toFixed(2), rightMargin - 3, lineY, { align: 'right' });

    lineY += Math.max(7, itemNameWrapped.length * 4.5);
  });

  // CGST & SGST Summary Rows inside Table
  const halfGst = data.gstAmount / 2;
  const summaryRowY = y + tableHeight - 25;

  doc.line(col2_Desc, summaryRowY, rightMargin, summaryRowY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CGST (9.00 %)', 172, summaryRowY + 5, { align: 'right' });
  doc.text(halfGst.toFixed(2), rightMargin - 3, summaryRowY + 5, { align: 'right' });

  doc.text('SGST (9.00 %)', 172, summaryRowY + 11, { align: 'right' });
  doc.text(halfGst.toFixed(2), rightMargin - 3, summaryRowY + 11, { align: 'right' });

  if (data.deliveryCharge && data.deliveryCharge > 0) {
    doc.text('Delivery Charge', 172, summaryRowY + 17, { align: 'right' });
    doc.text(data.deliveryCharge.toFixed(2), rightMargin - 3, summaryRowY + 17, { align: 'right' });
  }

  // Table Bottom Total Row Bar
  const totalRowY = y + tableHeight - 8;
  doc.line(margin, totalRowY, rightMargin, totalRowY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Total', 121, totalRowY + 5.5, { align: 'center' });
  doc.text(`${totalQuantityCount.toFixed(2)}`, (132 + 152) / 2, totalRowY + 5.5, { align: 'center' });
  doc.text(`₹ ${data.grandTotal.toFixed(2)}`, rightMargin - 3, totalRowY + 5.5, { align: 'right' });

  y += tableHeight;

  // ==========================================
  // SECTION 5: TOTAL IN WORDS BOX
  // ==========================================
  doc.rect(margin, y, contentWidth, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Total in words', margin + 3, y + 4);
  doc.text('(E & O.E.)', rightMargin - 3, y + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(numberToIndianWords(data.grandTotal), margin + 3, y + 8.5);

  y += 11;

  // ==========================================
  // SECTION 6: HSN / SAC TAX BREAKDOWN TABLE
  // ==========================================
  const taxTableH = 23;
  doc.rect(margin, y, contentWidth, taxTableH);

  // Column Positions for Tax Breakdown Table
  const tCol1 = 42; // HSN / SAC (10 to 42)
  const tCol2 = 78; // Taxable Value (42 to 78)
  const tCol3 = 98; // CGST % (78 to 98)
  const tCol4 = 134; // CGST Amount (98 to 134)
  const tCol5 = 154; // SGST % (134 to 154)
  const tCol6 = 190; // SGST Amount (154 to 190)

  // Sub headers line
  doc.line(margin, y + 5, rightMargin, y + 5);
  doc.line(margin, y + 10, rightMargin, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('HSN / SAC', (10 + 42) / 2, y + 3.8, { align: 'center' });
  doc.text('Taxable Value', (42 + 78) / 2, y + 3.8, { align: 'center' });
  doc.text('CGST', (78 + 134) / 2, y + 3.8, { align: 'center' });
  doc.text('SGST', (134 + 190) / 2, y + 3.8, { align: 'center' });
  doc.text('Total', (190 + 200) / 2, y + 3.8, { align: 'center' });

  // Sub headers (% & Amount)
  doc.text('%', (78 + 98) / 2, y + 8.8, { align: 'center' });
  doc.text('Amount', 131, y + 8.8, { align: 'right' });
  doc.text('%', (134 + 154) / 2, y + 8.8, { align: 'center' });
  doc.text('Amount', 187, y + 8.8, { align: 'right' });

  // Vertical Lines in Tax Table
  doc.line(tCol1, y, tCol1, y + taxTableH);
  doc.line(tCol2, y, tCol2, y + taxTableH);
  doc.line(tCol3, y + 5, tCol3, y + taxTableH - 5);
  doc.line(tCol4, y, tCol4, y + taxTableH);
  doc.line(tCol5, y + 5, tCol5, y + taxTableH - 5);
  doc.line(tCol6, y, tCol6, y + taxTableH);

  // Data Row (Y = y + 14.5)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('998386', (10 + 42) / 2, y + 14.5, { align: 'center' });
  doc.text(data.subtotal.toFixed(2), 75, y + 14.5, { align: 'right' });
  doc.text('9.00', (78 + 98) / 2, y + 14.5, { align: 'center' });
  doc.text(halfGst.toFixed(2), 131, y + 14.5, { align: 'right' });
  doc.text('9.00', (134 + 154) / 2, y + 14.5, { align: 'center' });
  doc.text(halfGst.toFixed(2), 187, y + 14.5, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), rightMargin - 2, y + 14.5, { align: 'right' });

  doc.line(margin, y + 17, rightMargin, y + 17);

  // Total Row (Y = y + 20.5)
  doc.setFont('helvetica', 'bold');
  doc.text('Total', (10 + 42) / 2, y + 20.5, { align: 'center' });
  doc.text(data.subtotal.toFixed(2), 75, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), 131, y + 20.5, { align: 'right' });
  doc.text(halfGst.toFixed(2), 187, y + 20.5, { align: 'right' });
  doc.text(data.gstAmount.toFixed(2), rightMargin - 2, y + 20.5, { align: 'right' });

  y += taxTableH;

  // Total Tax in Words Bar
  doc.rect(margin, y, contentWidth, 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Total Tax in words: ', margin + 3, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text(numberToIndianWords(data.gstAmount), margin + 30, y + 4);

  y += 6;

  // ==========================================
  // SECTION 7: BANK DETAILS & AUTHORISED SIGNATORY
  // ==========================================
  const footerH = pageHeight - margin - y; // Remaining space to bottom border
  doc.rect(margin, y, contentWidth, footerH);

  // Vertical Split Divider
  const footSplitX = margin + 115; // 125mm
  doc.line(footSplitX, y, footSplitX, y + footerH);

  // --- LEFT SIDE: BANK DETAILS ---
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 115, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Bank Details', margin + 57.5, y + 3.8, { align: 'center' });
  doc.line(margin, y + 5, footSplitX, y + 5);

  let bY = y + 9.5;
  doc.setFontSize(8);

  doc.setFont('helvetica', 'bold');
  doc.text('Name', margin + 3, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('Union Bank of India', margin + 25, bY);

  doc.setFont('helvetica', 'bold');
  doc.text('Branch', margin + 65, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('Vasanthnagaar', margin + 82, bY);

  bY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Acc. Name', margin + 3, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('Mount Print Zone', margin + 25, bY);

  doc.setFont('helvetica', 'bold');
  doc.text('Acc. Number', margin + 65, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('510101003239313', margin + 85, bY);

  bY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('IFSC', margin + 3, bY);
  doc.setFont('helvetica', 'normal');
  doc.text('UBIN0907472', margin + 25, bY);

  // Terms and Conditions Line
  bY += 4;
  doc.line(margin, bY, footSplitX, bY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Terms and Conditions', margin + 57.5, bY + 3.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const termsText = doc.splitTextToSize(
    'Subject to our home Jurisdiction. Our Responsibility Ceases as soon as goods leaves our Premises. Goods once sold will not be taken back.',
    108
  );
  doc.text(termsText, margin + 3, bY + 7.5);

  // --- RIGHT SIDE: AUTHORISED SIGNATORY ---
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Certified that the particulars given above are true and correct.', rightMargin - 4, y + 5, {
    align: 'right',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('For Mount Print Zone', rightMargin - 4, y + 11, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Authorised Signatory', rightMargin - 4, y + footerH - 4, { align: 'right' });

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
