import Image from 'next/image';
import { getSiteSettings } from '@/lib/settings';
import { Printer, ShieldCheck, Award, Zap, Users, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
          About Mount Print Zone
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Where Precision Printing Meets Artistry
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Founded with a passion for exceptional quality, Mount Print Zone (MPZ) provides corporate brands, creative agencies, and individual clients with state-of-the-art offset, digital, and wide-format outdoor printing.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl text-center space-y-1 border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-4xl font-black text-sky-600 dark:text-sky-400">10,000+</span>
          <span className="text-xs font-bold text-slate-500 block uppercase">Completed Orders</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center space-y-1 border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">99.8%</span>
          <span className="text-xs font-bold text-slate-500 block uppercase">Client Satisfaction</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center space-y-1 border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-4xl font-black text-purple-600 dark:text-purple-400">24 Hours</span>
          <span className="text-xs font-bold text-slate-500 block uppercase">Average Turnaround</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center space-y-1 border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-4xl font-black text-amber-600 dark:text-amber-400">50+</span>
          <span className="text-xs font-bold text-slate-500 block uppercase">Print Media Types</span>
        </div>
      </div>

      {/* Our Mission */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Industrial Machinery & Finishing</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We operate Heidelberg multi-color offset presses, high-speed Canon digital production engines, and Mimaki eco-solvent vinyl plotters to achieve unmatched color accuracy and sharp resolutions.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" /> Velvet Soft-Touch & Thermal Matte Laminations
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" /> Precision Die-Cutting & Embossing
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" /> Gold, Silver & Rose Foil Edge Stamping
            </li>
          </ul>
        </div>

        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900">
          <Image
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
            alt="Print Production Facility"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
