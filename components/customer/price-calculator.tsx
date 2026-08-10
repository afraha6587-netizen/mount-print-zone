'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  discountPercent: number;
  estimatedDelivery: string;
  pricingRules: {
    minQuantity: number;
    maxQuantity: number;
    unitPrice: number;
    discountPercent: number;
  }[];
}

export function PriceCalculator({
  services = [],
  gstRate = 18,
  deliveryCharge = 99,
}: {
  services: ServiceItem[];
  gstRate: number;
  deliveryCharge: number;
}) {
  const safeServices = services && services.length > 0 ? services : [
    {
      id: 'default-print',
      name: 'Standard Document Printout',
      basePrice: 2,
      discountPercent: 0,
      estimatedDelivery: 'Same Day Dispatch',
      pricingRules: [],
    }
  ];

  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(safeServices[0]?.id || 'default-print');
  const [quantity, setQuantity] = React.useState<number>(100);

  const selectedService = safeServices.find((s) => s.id === selectedServiceId) || safeServices[0];

  // Calculate volume discount price
  let unitPrice = selectedService?.basePrice || 0;
  let discountPercent = selectedService?.discountPercent || 0;

  if (selectedService?.pricingRules) {
    for (const rule of selectedService.pricingRules) {
      if (quantity >= rule.minQuantity && quantity <= rule.maxQuantity) {
        unitPrice = rule.unitPrice;
        discountPercent = Math.max(discountPercent, rule.discountPercent);
        break;
      }
    }
  }

  const subtotal = quantity * unitPrice;
  const discountAmount = (subtotal * discountPercent) / 100;
  const netSubtotal = subtotal - discountAmount;
  const gstAmount = (netSubtotal * gstRate) / 100;
  const grandTotal = netSubtotal + gstAmount + deliveryCharge;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Controls */}
      <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sky-500" />
          Select Product & Specs
        </h3>

        {/* Service Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Choose Printing Service
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {safeServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Base ₹{s.basePrice})
              </option>
            ))}
          </select>
        </div>

        {/* Paper Size / Print Dimensions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Paper / Print Size
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {['A0', 'A1', 'A2', 'A3', 'A4', 'Custom'].map((size) => (
              <button
                key={size}
                type="button"
                className="py-2 px-3 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-sky-500 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Quantity / Units
            </label>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {discountPercent > 0 ? `${discountPercent}% Volume Discount Applied` : 'Standard Pricing'}
            </span>
          </div>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <div className="flex gap-2 pt-1">
            {[100, 250, 500, 1000].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  quantity === q
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {q} units
              </button>
            ))}
          </div>
        </div>

        {/* Volume Discount Info */}
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Automatic Bulk Discounts:
          </h4>
          <ul className="space-y-1 pl-5 list-disc">
            <li>Order 100+ units: 10% Discount</li>
            <li>Order 500+ units: 20% Discount</li>
          </ul>
        </div>
      </div>

      {/* Right Price Summary */}
      <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 dark:border-sky-500/20 shadow-xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            Cost Breakdown
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Unit Effective Price:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal ({quantity} units):</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount ({discountPercent}%):</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>GST ({gstRate}%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Delivery Fee:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-900 dark:text-white">Estimated Total:</span>
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Link href={`/custom-order?serviceId=${selectedService.id}&quantity=${quantity}`}>
          <Button size="lg" className="w-full gap-2 font-bold shadow-lg shadow-sky-500/25">
            Proceed with Order <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
