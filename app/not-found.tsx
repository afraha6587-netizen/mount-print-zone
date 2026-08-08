import Link from 'next/link';
import { Printer, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-center">
      <div className="max-w-md space-y-6 glass-panel p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
          <Printer className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-5xl font-black text-sky-400">404</span>
          <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The printing page or resource you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link href="/" className="block">
          <Button size="lg" className="w-full gap-2 font-bold shadow-lg shadow-sky-500/20">
            <Home className="w-4 h-4" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
