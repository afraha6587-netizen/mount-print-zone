'use client';

import * as React from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import { Sparkles } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string | null;
  category: { name: string };
}

export function PortfolioLightbox({ items }: { items: PortfolioItem[] }) {
  const [selectedItem, setSelectedItem] = React.useState<PortfolioItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" /> View Project Details
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {item.category.name}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1 line-clamp-1">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        maxWidth="2xl"
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-950">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold">
                {selectedItem.category.name}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedItem.description || 'Custom print project completed with precision finishing.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
