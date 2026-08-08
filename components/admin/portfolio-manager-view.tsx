'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  categoryId: string;
  image: string;
  description: string;
  isFeatured: boolean;
  category: Category;
}

export function PortfolioManagerView({
  initialItems,
  categories,
}: {
  initialItems: PortfolioItem[];
  categories: Category[];
}) {
  const [items, setItems] = React.useState<PortfolioItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PortfolioItem | null>(null);

  const [title, setTitle] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || '');
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isFeatured, setIsFeatured] = React.useState(true);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategoryId(categories[0]?.id || '');
    setImage('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setIsFeatured(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategoryId(item.categoryId);
    setImage(item.image);
    setDescription(item.description);
    setIsFeatured(item.isFeatured);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem
        ? { id: editingItem.id, title, categoryId, image, description, isFeatured }
        : { title, categoryId, image, description, isFeatured };

      const res = await fetch('/api/admin/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save portfolio showcase project');

      if (editingItem) {
        setItems(items.map((i) => (i.id === editingItem.id ? data.item : i)));
      } else {
        setItems([data.item, ...items]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this project from the portfolio showcase?')) return;

    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete portfolio item');
      setItems(items.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isFeatured: !item.isFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(items.map((i) => (i.id === item.id ? data.item : i)));
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Portfolio Showcase Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new print project photos, edit descriptions, and feature completed work on the public gallery.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add Showcase Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`glass-panel p-4 rounded-3xl border ${
              item.isFeatured ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800/40 bg-slate-950/40 opacity-70'
            } flex flex-col justify-between space-y-3 shadow-xl`}
          >
            <div className="space-y-3">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-800">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                {item.isFeatured && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-slate-950" /> Featured
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  {item.category?.name || 'Printing Project'}
                </span>
                <h3 className="font-extrabold text-sm text-white line-clamp-1 mt-0.5">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFeatured(item)}
                className={`text-xs gap-1 ${item.isFeatured ? 'text-amber-400' : 'text-emerald-400'}`}
              >
                {item.isFeatured ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {item.isFeatured ? 'Hide' : 'Feature'}
              </Button>

              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(item)} className="h-8 w-8 p-0 text-slate-300">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PORTFOLIO FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? 'Edit Showcase Project' : 'Add New Showcase Project'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. A0 Architectural Blue Prints & CAD Plotting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Photo URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Details / Description</label>
            <textarea
              rows={3}
              placeholder="Describe paper stock GSM, finishing details, gold foil embossing, grommets, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPortfolioFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="isPortfolioFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Feature project on homepage & public portfolio gallery
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              {editingItem ? 'Save Changes' : 'Create Showcase Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
