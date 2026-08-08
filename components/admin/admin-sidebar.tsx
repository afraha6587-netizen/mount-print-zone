'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Tag,
  Image as ImageIcon,
  DollarSign,
  Settings,
  Star,
  Megaphone,
  Percent,
  Users,
  BarChart3,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  userRole: 'ADMIN' | 'STAFF';
}

export function AdminSidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders & Invoices', icon: ShoppingBag },
    { href: '/admin/services', label: 'Services Catalog', icon: Layers },
    { href: '/admin/categories', label: 'Service Categories', icon: Tag },
    { href: '/admin/portfolio', label: 'Portfolio Showcase', icon: ImageIcon },
    { href: '/admin/pricing', label: 'Pricing & GST Rules', icon: DollarSign },
    { href: '/admin/analytics', label: 'Analytics & Growth', icon: BarChart3 },
    { href: '/admin/testimonials', label: 'Customer Reviews', icon: Star },
    { href: '/admin/banners', label: 'Homepage Banners', icon: Megaphone },
    { href: '/admin/offers', label: 'Offers & Coupons', icon: Percent },
    ...(userRole === 'ADMIN'
      ? [
          { href: '/admin/settings', label: 'Website Settings', icon: Settings },
          { href: '/admin/users', label: 'User Roles & Staff', icon: Users },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight block">MPZ Admin</span>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{userRole} MODE</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        Mount Print Zone v1.0 • Next.js 15
      </div>
    </aside>
  );
}
