'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  RotateCcw,
  CheckCircle2,
  Printer,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface InvoiceRow {
  id: string;
  name: string;
  hsnSac: string;
  quantity: number;
  unitPrice: number;
}

const PRESET_STORE_ITEMS = [
  { name: 'XEROX COPYING (A4 / A3)', hsn: '998386', rate: 2 },
  { name: 'COLOUR PRINT OUT (A4)', hsn: '998386', rate: 10 },
  { name: 'THESIS HARD BINDING', hsn: '998386', rate: 300 },
  { name: 'SPIRAL / WIRO BINDING', hsn: '998386', rate: 50 },
  { name: 'PVC PLASTIC CARD (ID / Ayushman)', hsn: '998386', rate: 80 },
  { name: 'OFFICE STATIONERY & ITEMS', hsn: '998386', rate: 50 },
  { name: 'CUSTOM MUG PRINTING', hsn: '998386', rate: 250 },
  { name: 'PASSPORT SIZE PHOTO (8 Pcs)', hsn: '998386', rate: 99 },
  { name: 'POSTER / BLUEPRINT (A0, A1, A2)', hsn: '998386', rate: 150 },
  { name: 'LAMINATION (A4 / A3)', hsn: '998386', rate: 30 },
];

export default function AdminInvoiceGeneratorPage() {
  const [customerName, setCustomerName] = React.useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerAddress, setCustomerAddress] = React.useState('');
  const [customerGstin, setCustomerGstin] = React.useState('');

  const [paymentStatus, setPaymentStatus] = React.useState<'PAID' | 'UNPAID'>('PAID');
  const [paymentMode, setPaymentMode] = React.useState('UPI / GPay / PhonePe');

  const [items, setItems] = React.useState<InvoiceRow[]>([
    { id: '1', name: 'XEROX COPYING (A4, A3)', hsnSac: '998386', quantity: 10, unitPrice: 2 },
  ]);

  const [discountAmount, setDiscountAmount] = React.useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = React.useState<number>(0);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');

  // Row Manipulation
  const handleAddItem = (preset?: { name: string; hsn: string; rate: number }) => {
    const newItem: InvoiceRow = {
      id: Math.random().toString(36).substr(2, 9),
      name: preset ? preset.name : 'Stationery / Custom Item',
      hsnSac: preset ? preset.hsn : '998386',
      quantity: 1,
      unitPrice: preset ? preset.rate : 50,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceRow, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Billing Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const taxableTotal = Math.max(0, subtotal - (Number(discountAmount) || 0));
  const gstAmount = Math.round(taxableTotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((taxableTotal + gstAmount + (Number(deliveryCharge) || 0)) * 100) / 100;

  // Handle PDF Invoice Generation
  const handleGenerateInvoice = async (saveToDb: boolean) => {
    if (items.length === 0) {
      alert('Please add at least one line item');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('');

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        customerGstin,
        paymentStatus,
        paymentMode,
        items: items.map((i) => ({
          name: i.name,
          hsnSac: i.hsnSac,
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice) || 0,
          subtotal: (Number(i.quantity) || 1) * (Number(i.unitPrice) || 0),
        })),
        discountAmount: Number(discountAmount) || 0,
        deliveryCharge: Number(deliveryCharge) || 0,
        saveToDb,
      };

      const res = await fetch('/api/admin/generate-custom-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MPZ_Invoice_${customerName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatusMessage(
        saveToDb
          ? '🎉 Invoice generated, downloaded & saved to sales database!'
          : '📄 Tax Invoice PDF generated and downloaded successfully!'
      );
    } catch (err: any) {
      alert(err.message || 'Error generating invoice PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setCustomerGstin('');
    setPaymentStatus('PAID');
    setPaymentMode('UPI / GPay / PhonePe');
    setItems([{ id: '1', name: 'XEROX COPYING (A4, A3)', hsnSac: '998386', quantity: 10, unitPrice: 2 }]);
    setDiscountAmount(0);
    setDeliveryCharge(0);
    setStatusMessage('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Quick POS Invoice Generator
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Generate custom Tax Invoices instantly for walk-in customers purchasing stationery, binding, Xerox, photos, or custom shop items.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs font-bold">
            <RotateCcw className="w-3.5 h-3.5" /> Clear / Reset Form
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          {statusMessage}
        </div>
      )}

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer & Item Builder (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Box */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-sky-500" /> Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer / M/S Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walk-in Customer / Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer GSTIN (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none uppercase"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Vasanth Nagar, Bengaluru"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Item Add Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              ⚡ Quick Add Common Store Items & Stationery:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_STORE_ITEMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddItem(preset)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
                >
                  + {preset.name} (₹{preset.rate})
                </button>
              ))}
            </div>
          </div>

          {/* Line Items Table Builder */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-500" /> Invoice Item List ({items.length})
              </h3>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddItem()}
                className="gap-1 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Blank Item Row
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    {/* Item Name */}
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">
                        #{index + 1} Item Name / Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="e.g. Office Pen Set / Binding"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    {/* HSN Code */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">HSN Code</label>
                      <input
                        type="text"
                        value={item.hsnSac}
                        onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none text-center"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Qty *</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none text-center"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Rate (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none text-right"
                      />
                    </div>

                    {/* Delete Action */}
                    <div className="sm:col-span-1 flex items-center justify-end pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Bill Summary (1 col) */}
        <div className="space-y-6">
          {/* Payment Settings */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" /> Payment & Billing Status
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('PAID')}
                    className={`py-2 rounded-xl text-xs font-black border transition-all ${
                      paymentStatus === 'PAID'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    PAID 🎉
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('UNPAID')}
                    className={`py-2 rounded-xl text-xs font-black border transition-all ${
                      paymentStatus === 'UNPAID'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    UNPAID ⏳
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="UPI / GPay / PhonePe">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash Sale">Cash Counter Sale</option>
                  <option value="Credit / Debit Card">Credit / Debit Card POS</option>
                  <option value="Bank Direct Transfer">Bank Transfer (NEFT / IMPS)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Discount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Delivery/Packing (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Live Total Calculation
            </h3>

            <div className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Special Discount:</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{taxableTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>CGST (9.00%):</span>
                <span>₹{(gstAmount / 2).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>SGST (9.00%):</span>
                <span>₹{(gstAmount / 2).toFixed(2)}</span>
              </div>

              {deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Packing / Delivery:</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-black uppercase text-slate-900 dark:text-white">Grand Total:</span>
                <span className="text-2xl font-black text-sky-600 dark:text-sky-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              size="lg"
              isLoading={isGenerating}
              onClick={() => handleGenerateInvoice(false)}
              className="w-full font-bold shadow-lg shadow-sky-500/20 py-3.5 text-sm gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF Tax Invoice
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              isLoading={isGenerating}
              onClick={() => handleGenerateInvoice(true)}
              className="w-full font-bold py-3.5 text-sm gap-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Save className="w-4 h-4" /> Save POS Sale & Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
