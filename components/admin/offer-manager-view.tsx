'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus, Edit2, Trash2, Tag, Percent, Eye, EyeOff } from 'lucide-react';

interface Offer {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  minOrderValue: number;
  isActive: boolean;
  validUntil: string | null;
}

export function OfferManagerView({ initialOffers }: { initialOffers: Offer[] }) {
  const [offers, setOffers] = React.useState<Offer[]>(initialOffers);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOffer, setEditingOffer] = React.useState<Offer | null>(null);

  const [code, setCode] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [discountPercent, setDiscountPercent] = React.useState(10);
  const [minOrderValue, setMinOrderValue] = React.useState(500);
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const openCreateModal = () => {
    setEditingOffer(null);
    setCode('OFFER' + Math.floor(10 + Math.random() * 90));
    setTitle('');
    setDiscountPercent(15);
    setMinOrderValue(500);
    setIsActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (o: Offer) => {
    setEditingOffer(o);
    setCode(o.code);
    setTitle(o.title);
    setDiscountPercent(o.discountPercent);
    setMinOrderValue(o.minOrderValue);
    setIsActive(o.isActive);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const method = editingOffer ? 'PUT' : 'POST';
      const body = editingOffer
        ? { id: editingOffer.id, code, title, discountPercent, minOrderValue, isActive }
        : { code, title, discountPercent, minOrderValue, isActive };

      const res = await fetch('/api/admin/offers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save offer');

      if (editingOffer) {
        setOffers(offers.map((o) => (o.id === editingOffer.id ? data.offer : o)));
      } else {
        setOffers([data.offer, ...offers]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional offer?')) return;

    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete offer');
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleStatus = async (o: Offer) => {
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...o, isActive: !o.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOffers(offers.map((item) => (item.id === o.id ? data.offer : item)));
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Offers & Promotional Coupons</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage store coupon codes, minimum order value requirements, and discount rates.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add New Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`glass-panel p-6 rounded-3xl border ${
              offer.isActive ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800/40 bg-slate-950/40 opacity-60'
            } flex flex-col justify-between space-y-4 shadow-xl`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-400 font-mono font-black text-xs border border-sky-500/30 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {offer.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  offer.isActive ? 'bg-emerald-500/90 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {offer.isActive ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-white pt-1">{offer.title}</h3>
              <p className="text-xs text-slate-400">
                <span className="text-emerald-400 font-extrabold text-sm">{offer.discountPercent}% OFF</span> on orders above ₹{offer.minOrderValue}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleStatus(offer)}
                className={`text-xs gap-1.5 ${offer.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
              >
                {offer.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {offer.isActive ? 'Deactivate' : 'Activate'}
              </Button>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(offer)} className="h-8 w-8 p-0 text-slate-300">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(offer.id)} className="h-8 w-8 p-0 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OFFER FORM MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" title={editingOffer ? 'Edit Coupon Offer' : 'Add New Coupon Offer'}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. MPZBLR10"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Discount Percent (%) *</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Offer Title / Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. 15% OFF Bulk Business Cards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Min Order Value (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="500"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOfferActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="isOfferActive" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Set coupon code active for customer checkout
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              {editingOffer ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
