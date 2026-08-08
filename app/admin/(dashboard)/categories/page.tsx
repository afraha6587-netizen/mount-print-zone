import { db } from '@/lib/db';
import Image from 'next/image';
import { Tag, Plus, Printer } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await db.serviceCategory.findMany({
    include: { services: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Category Management</h1>
          <p className="text-xs text-slate-400 mt-1">Organize printing products into categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-800">
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <Printer className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{cat.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                {cat.services.length} Active Products
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
