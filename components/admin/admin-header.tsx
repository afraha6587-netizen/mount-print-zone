'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, ExternalLink, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserSession } from '@/lib/auth';

export function AdminHeader({ user }: { user: UserSession }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2) {
      setIsSearching(true);
      setShowSearchResults(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
      setShowSearchResults(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Instant Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search orders, services, customers, invoices..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-11 left-0 right-0 glass-panel bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
            {isSearching ? (
              <div className="p-3 text-xs text-slate-400 text-center">Searching database...</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-xs text-slate-400 text-center">No matching results found</div>
            ) : (
              results.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    setShowSearchResults(false);
                    router.push(res.link);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{res.title}</span>
                    <span className="text-[10px] text-slate-400">{res.subtitle}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                    {res.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <a
          href="/admin/invoice-generator"
          className="p-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20"
        >
          ⚡ POS Billing
        </a>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold hidden sm:flex items-center gap-1.5"
        >
          View Storefront <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <span className="font-bold text-xs text-white block">{user.name}</span>
            <span className="text-[10px] text-sky-400 font-semibold">{user.role}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
