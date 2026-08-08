'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus, Edit2, Trash2, CheckCircle, Eye, EyeOff, Layout } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export function BannerManagerView({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = React.useState<Banner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<Banner | null>(null);

  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [image, setImage] = React.useState('');
  const [link, setLink] = React.useState('/services');
  const [isActive, setIsActive] = React.useState(true);
  const [order, setOrder] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImage('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1600&q=80');
    setLink('/services');
    setIsActive(true);
    setOrder(banners.length + 1);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImage(b.image);
    setLink(b.link);
    setIsActive(b.isActive);
    setOrder(b.order);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const body = editingBanner
        ? { id: editingBanner.id, title, subtitle, image, link, isActive, order }
        : { title, subtitle, image, link, isActive, order };

      const res = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save banner');

      if (editingBanner) {
        setBanners(banners.map((b) => (b.id === editingBanner.id ? data.banner : b)));
      } else {
        setBanners([...banners, data.banner]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this homepage banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete banner');
      setBanners(banners.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleStatus = async (b: Banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, isActive: !b.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBanners(banners.map((item) => (item.id === b.id ? data.banner : item)));
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Homepage Banners</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, add, and reorder hero banners displayed on the customer site.</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add New Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`glass-panel rounded-3xl border ${
              banner.isActive ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800/40 bg-slate-950/40 opacity-60'
            } overflow-hidden space-y-3 shadow-xl`}
          >
            <div className="relative h-48 w-full bg-slate-800">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  banner.isActive ? 'bg-emerald-500/90 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {banner.isActive ? 'ACTIVE' : 'DRAFT'}
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Slide #{banner.order}</span>
                <h3 className="font-extrabold text-lg text-white mt-0.5">{banner.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{banner.subtitle}</p>
                <span className="text-[11px] font-mono text-slate-500 block mt-2">Target Link: {banner.link}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleStatus(banner)}
                  className={`text-xs gap-1.5 ${banner.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
                >
                  {banner.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(banner)} className="h-8 w-8 p-0 text-slate-300">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(banner.id)} className="h-8 w-8 p-0 text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BANNER FORM MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg" title={editingBanner ? 'Edit Banner Slide' : 'Add New Banner Slide'}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Banner Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mount Print Zone - Bengaluru"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtitle / Tagline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ultra-Premium Business Cards, Flex Banners & Custom Merch"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Button Link URL</label>
              <input
                type="text"
                placeholder="/services"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Order</label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Set banner active on homepage immediately
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              {editingBanner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
