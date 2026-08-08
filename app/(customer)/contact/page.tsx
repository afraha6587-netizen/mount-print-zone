import { getSiteSettings } from '@/lib/settings';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact & Visit Us
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Have a question about artwork file preparation, bulk volume quotes, or custom print jobs? Get in touch!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-6 shadow-md">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Store Information</h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Our Print Hub Address</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phone & WhatsApp</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{settings.phone}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">WhatsApp: {settings.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Address</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Business Hours</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{settings.business_hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <a
                href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="secondary" className="w-full gap-2 font-bold text-xs">
                  <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp Direct
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form & Google Map */}
        <div className="lg:col-span-7 space-y-6">
          <form className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-md">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Send Us a Message</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />

            <textarea
              rows={4}
              placeholder="How can we help you with your printing project?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />

            <Button type="button" size="md" className="gap-2 font-bold">
              <Send className="w-4 h-4" /> Send Message
            </Button>
          </form>

          {/* Google Map Embed */}
          {settings.google_map_embed && (
            <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <iframe
                src={settings.google_map_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
