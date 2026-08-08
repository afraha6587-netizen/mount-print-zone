'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Trash2, CheckCircle2, Eye, EyeOff, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: string;
  customerName: string;
  photo: string | null;
  review: string;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
}

export function TestimonialManagerView({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [reviews, setReviews] = React.useState<Testimonial[]>(initialTestimonials);

  const toggleFeatured = async (t: Testimonial) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, isFeatured: !t.isFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews(reviews.map((item) => (item.id === t.id ? data.testimonial : item)));
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this customer review?')) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Reviews & Testimonials</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer feedback submitted from the website and choose which reviews to feature on the homepage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((test) => (
          <div
            key={test.id}
            className={`glass-panel p-6 rounded-3xl border ${
              test.isFeatured ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800/40 bg-slate-950/40 opacity-70'
            } flex flex-col justify-between space-y-4 shadow-xl`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  test.isFeatured ? 'bg-emerald-500/90 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {test.isFeatured ? 'FEATURED ON HOMEPAGE' : 'HIDDEN'}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">"{test.review}"</p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white text-xs block">{test.customerName}</span>
                <span className="text-[10px] text-slate-500 block">
                  {new Date(test.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFeatured(test)}
                  className={`text-xs gap-1 ${test.isFeatured ? 'text-amber-400' : 'text-emerald-400'}`}
                >
                  {test.isFeatured ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {test.isFeatured ? 'Hide' : 'Feature'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(test.id)} className="h-8 w-8 p-0 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
