'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Layers, Printer } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  basePrice: number;
  discountPercent: number;
  estimatedDelivery: string;
  isFeatured: boolean;
  isHidden: boolean;
  categoryId: string;
  category: { name: string };
}

interface CategoryOption {
  id: string;
  name: string;
}

export function ServiceManagerView({
  initialServices,
  categories,
}: {
  initialServices: any[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<ServiceItem | null>(null);

  // Form State
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || '');
  const [description, setDescription] = React.useState('');
  const [basePrice, setBasePrice] = React.useState(100);
  const [discountPercent, setDiscountPercent] = React.useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = React.useState('1-2 Days');
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setBasePrice(100);
    setDiscountPercent(0);
    setEstimatedDelivery('1-2 Days');
    setIsFeatured(false);
    setIsHidden(false);
    setImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setSlug(service.slug);
    setCategoryId(service.categoryId);
    setDescription(service.description);
    setBasePrice(service.basePrice);
    setDiscountPercent(service.discountPercent);
    setEstimatedDelivery(service.estimatedDelivery);
    setIsFeatured(service.isFeatured);
    setIsHidden(service.isHidden);
    setImage(service.image || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        categoryId,
        description,
        basePrice,
        discountPercent,
        estimatedDelivery,
        isFeatured,
        isHidden,
        image,
      };

      const res = await fetch('/api/admin/services', {
        method: editingService ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService ? { id: editingService.id, ...payload } : payload),
      });

      if (!res.ok) throw new Error('Failed to save service');

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="gap-2 font-bold shadow-lg">
          <Plus className="w-4 h-4" /> Add New Printing Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`glass-panel p-5 rounded-3xl border ${
              service.isHidden ? 'border-rose-950 opacity-60' : 'border-slate-800'
            } bg-slate-900/60 shadow-xl flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-800">
                {service.image ? (
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Printer className="w-8 h-8" />
                  </div>
                )}
                {service.isFeatured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-slate-950" /> Featured
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  {service.category.name}
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">{service.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{service.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="font-extrabold text-emerald-400 text-sm">₹{service.basePrice}</span>
                <span className="text-slate-400">{service.estimatedDelivery}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <Button size="sm" variant="outline" onClick={() => openEditModal(service)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingService ? 'Edit Printing Service' : 'Add New Service'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Base Price (₹) *</label>
              <input
                type="number"
                min={0}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold text-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Delivery</label>
              <input
                type="text"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-sky-500"
              />
              Mark as Featured
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-sky-500"
              />
              Hide from Storefront
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
