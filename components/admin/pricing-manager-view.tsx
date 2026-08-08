'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Percent, Truck, CheckCircle2, DollarSign, Save, Edit3, ShieldAlert } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  discountPercent: number;
  category: { name: string };
  pricingRules: { id: string; minQuantity: number; maxQuantity: number; unitPrice: number; discountPercent: number }[];
}

export function PricingManagerView({
  initialSettings,
  services: initialServices,
}: {
  initialSettings: Record<string, string>;
  services: ServiceItem[];
}) {
  const [gstRate, setGstRate] = React.useState(initialSettings.gst_rate || '18');
  const [deliveryCharge, setDeliveryCharge] = React.useState(initialSettings.delivery_charge || '99');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = React.useState(initialSettings.free_delivery_threshold || '1499');

  const [servicesList, setServicesList] = React.useState<ServiceItem[]>(initialServices);
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);
  const [isSavingServices, setIsSavingServices] = React.useState(false);

  const [settingsSuccess, setSettingsSuccess] = React.useState(false);
  const [servicesSuccess, setServicesSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // Handle Tax & Delivery settings save
  const handleSaveTaxDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setErrorMessage('');
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gst_rate: gstRate,
          delivery_charge: deliveryCharge,
          free_delivery_threshold: freeDeliveryThreshold,
        }),
      });

      if (!res.ok) throw new Error('Failed to update tax & delivery settings');

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Save failed');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle inline price update for a service
  const handleServicePriceChange = (id: string, field: 'basePrice' | 'discountPercent', value: number) => {
    setServicesList(
      servicesList.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Save updated product base prices to backend
  const handleSaveAllServicePrices = async () => {
    setIsSavingServices(true);
    setErrorMessage('');
    setServicesSuccess(false);

    try {
      for (const service of servicesList) {
        const res = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: service.id,
            name: service.name,
            basePrice: service.basePrice,
            discountPercent: service.discountPercent,
          }),
        });

        if (!res.ok) throw new Error(`Failed to update ${service.name}`);
      }

      setServicesSuccess(true);
      setTimeout(() => setServicesSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Save failed');
    } finally {
      setIsSavingServices(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Pricing & Tax Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust GST tax rates, delivery charges, and base product unit prices. Changes update the storefront cost breakdown immediately.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> {errorMessage}
        </div>
      )}

      {/* SECTION 1: TAX & DELIVERY CHARGE SETTINGS */}
      <form onSubmit={handleSaveTaxDelivery} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-sky-400" /> GST Tax & Delivery Fee Configuration
          </h3>
          {settingsSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Tax & Delivery Settings Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* GST Rate */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              GST Tax Rate (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none pr-8"
              />
              <span className="absolute right-3 top-3 text-slate-400 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-500">Standard GST percentage calculated on subtotal.</p>
          </div>

          {/* Delivery Charge */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Standard Delivery Charge (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                required
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">Base shipping & delivery fee for orders.</p>
          </div>

          {/* Free Delivery Threshold */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Free Delivery Minimum Order (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                required
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">Orders above this amount get free shipping.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSavingSettings} className="gap-2 font-bold">
            <Save className="w-4 h-4" /> Save Tax & Delivery Rules
          </Button>
        </div>
      </form>

      {/* SECTION 2: PRODUCT BASE PRICES MATRIX */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Base Unit Prices & Discounts Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">Directly modify unit rates for every service product.</p>
          </div>
          <div className="flex items-center gap-3">
            {servicesSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Product Prices Updated!
              </span>
            )}
            <Button onClick={handleSaveAllServicePrices} isLoading={isSavingServices} className="gap-2 font-bold">
              <Save className="w-4 h-4" /> Save All Product Prices
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Service Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 w-44">Base Unit Price (₹)</th>
                <th className="p-3.5 w-36">Discount Rate (%)</th>
                <th className="p-3.5 rounded-r-xl">Volume Pricing Tiers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {servicesList.map((service) => (
                <tr key={service.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    {service.name}
                  </td>
                  <td className="p-3.5 font-semibold text-sky-400">
                    {service.category.name}
                  </td>
                  <td className="p-3.5">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={service.basePrice}
                        onChange={(e) => handleServicePriceChange(service.id, 'basePrice', parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-black text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={service.discountPercent}
                        onChange={(e) => handleServicePriceChange(service.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                        className="w-full pl-3 pr-7 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {service.pricingRules?.length || 0} volume discount tiers
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
