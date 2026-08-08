'use client';

import { Phone, MessageCircle } from 'lucide-react';

export function WhatsAppFloat({ whatsappNumber, phone }: { whatsappNumber?: string; phone?: string }) {
  const cleanNumber = (whatsappNumber || '+919876543210').replace(/[^0-9]/g, '');
  const cleanPhone = (phone || '+919876543210').replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Call Button */}
      <a
        href={`tel:+${cleanPhone}`}
        className="w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center shadow-xl hover:scale-110 transition-transform group relative"
        aria-label="Call Store"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
          Call Store
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Mount Print Zone, I would like to inquire about printing services.')}`}
        target="_blank"
        rel="noreferrer"
        className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group relative p-3 animate-bounce hover:animate-none"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-emerald-500" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
