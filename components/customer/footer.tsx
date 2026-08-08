import Link from 'next/link';
import { Printer, MapPin, Phone, Mail, Clock, Instagram, Facebook, ArrowUpRight } from 'lucide-react';

export function Footer({ settings }: { settings?: Record<string, string> }) {
  const companyName = settings?.company_name || 'Mount Print Zone';
  const tagline = settings?.tagline || 'Precision Printing. Premium Finishing.';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'contact@mountprintzone.com';
  const address = settings?.address || '123 Printing Hub Avenue, Sector 18, City - 110001';
  const businessHours = settings?.business_hours || 'Monday - Saturday: 9:30 AM - 8:30 PM';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg">
                <Printer className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">{companyName}</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{tagline}</p>
            <div className="pt-2 flex items-center gap-3 text-slate-300">
              <a
                href={settings?.instagram_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.facebook_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-sky-400 transition-colors">
                  Work Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-sky-400 transition-colors">
                  Pricing Estimator
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-sky-400 transition-colors">
                  Place Custom Order
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-sky-400 transition-colors">
                  Track Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Printing Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Business Cards
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Flex & Star Banners
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Vinyl Stickers & Labels
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Custom Mugs & Apparel
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition-colors">
                  Hardcover Book Binding
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${phone}`} className="text-xs hover:text-sky-400">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-xs hover:text-sky-400">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
              Admin Portal <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
