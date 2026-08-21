import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import {
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  Star,
  CheckCircle2,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { ReviewModal } from '@/components/customer/review-modal';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let settings: Record<string, string> = {};
  let featuredServices: any[] = [];
  let categories: any[] = [];
  let portfolioItems: any[] = [];
  let testimonials: any[] = [];
  let offers: any[] = [];
  let banners: any[] = [];

  try {
    settings = await getSiteSettings();

    [featuredServices, categories, portfolioItems, testimonials, offers, banners] =
      await Promise.all([
        db.service.findMany({
          where: { isFeatured: true, isHidden: false },
          include: { category: true },
          take: 6,
        }),
        db.serviceCategory.findMany({
          orderBy: { displayOrder: 'asc' },
        }),
        db.portfolioItem.findMany({
          where: { isFeatured: true },
          include: { category: true },
          take: 4,
        }),
        db.testimonial.findMany({
          where: { isFeatured: true },
          take: 3,
        }),
        db.offer.findMany({
          where: { isActive: true },
          take: 2,
        }),
        db.banner.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
          take: 2,
        }),
      ]);
  } catch (err) {
    console.error('HomePage fetch error fallback:', err);
  }

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen High Precision Offset & Digital Printing</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {settings.hero_headline || 'Transforming Ideas into Premium Prints'}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {settings.hero_subtitle ||
                'From luxury business cards to large-format outdoor flex and custom merch. Uncompromising quality delivered fast.'}
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/custom-order">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-xl shadow-sky-500/25">
                  <Printer className="w-5 h-5" />
                  Place Custom Order
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-sky-500" />
                <span>Same-Day Dispatch</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Quality Proofing</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Real-Time Order Tracking</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>GST Tax Invoicing</span>
              </div>
            </div>
          </div>

          {/* Featured Hero Banner Image Card */}
          {banners.length > 0 && (
            <div className="mt-14 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800/60 group">
              <div className="relative h-64 sm:h-96 w-full">
                <Image
                  src={banners[0].image}
                  alt={banners[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <span className="text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">Featured Service</span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white">{banners[0].title}</h3>
                  <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">{banners[0].subtitle}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PROMOTIONAL OFFERS BANNER */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl relative overflow-hidden flex items-center justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-white/20 text-xs font-bold mb-2">
                    CODE: {offer.code}
                  </span>
                  <h3 className="text-xl font-extrabold">{offer.title}</h3>
                  <p className="text-xs text-sky-100 mt-1">
                    On orders above ₹{offer.minOrderValue}
                  </p>
                </div>
                <Link href="/custom-order">
                  <Button variant="secondary" size="sm" className="font-bold">
                    Claim Offer
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Print Categories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore our full range of commercial and custom printing solutions.</p>
          </div>
          <Link href="/services" className="text-sky-600 dark:text-sky-400 font-semibold text-sm flex items-center gap-1 hover:underline">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.slug}`}
              className="group glass-panel rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between"
            >
              <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Printer className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured Printing Services</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Top-rated products crafted with industrial precision and premium materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Printer className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Starting ₹{service.basePrice}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {service.category.name}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {service.estimatedDelivery}
                  </span>
                  <Link href={`/custom-order?serviceId=${service.id}`}>
                    <Button size="sm" className="gap-1">
                      Order Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold">Why Mount Print Zone?</h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining cutting-edge Heidelberg & Canon printing technology with meticulous quality control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Uncompromising Quality</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                400 GSM heavy stocks, soft-touch velvet laminations, raised spot UV, and precision die-cutting on every project.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast Turnaround</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Same-day dispatch for urgent orders and 24-48 hour delivery timelines across major commercial hubs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Digital Proof Verification</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Free pre-press artwork proofing and color matching check before any job goes to press.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      {portfolioItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Print Portfolio</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real projects crafted for our clients.</p>
            </div>
            <Link href="/portfolio" className="text-sky-600 dark:text-sky-400 font-semibold text-sm flex items-center gap-1 hover:underline">
              View Full Gallery <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-lg h-64 border border-slate-200/50 dark:border-slate-800/50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase text-sky-400">{item.category.name}</span>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trusted by Businesses</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">See what our clients say about Mount Print Zone.</p>
            </div>
            <div>
              <ReviewModal />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div key={test.id} className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{test.review}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-600 font-bold flex items-center justify-center text-sm">
                    {test.customerName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{test.customerName}</h5>
                    <span className="text-[11px] text-slate-400">Verified Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
