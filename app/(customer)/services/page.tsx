import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { ensureFullStoreCatalogSeeded } from '@/lib/seed-catalog';
import { Printer, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; query?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { category, query } = await searchParams;

  let categories: any[] = [];
  let services: any[] = [];

  try {
    categories = await db.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    const where: any = { isHidden: false };
    if (category) {
      const selectedCat = categories.find((c) => c.slug === category);
      if (selectedCat) where.categoryId = selectedCat.id;
    }
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ];
    }

    services = await db.service.findMany({
      where,
      include: { category: true, pricingRules: true },
      orderBy: { createdAt: 'desc' },
    });

    if (services.length === 0 && !query && !category) {
      await ensureFullStoreCatalogSeeded();
      services = await db.service.findMany({
        where,
        include: { category: true, pricingRules: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (err) {
    console.error('ServicesPage fetch error fallback:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 smooth-gpu">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Printing Services & Products
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse our full commercial printing catalog. Everything is customizable to your specs.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/services"
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
            !category
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm font-bold'
              : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
          }`}
        >
          All Categories
        </Link>

        {categories.map((cat) => {
          const isActive = category === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/services?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-sky-600 text-white border-transparent shadow-sm font-bold'
                  : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-4">
          <Printer className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Services Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any printing services matching your selected filters.
          </p>
          <Link href="/services">
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Product Image */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Printer className="w-12 h-12 stroke-[1.5]" />
                    </div>
                  )}
                  {service.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md">
                      {service.category.name}
                    </span>
                  )}
                </div>

                {/* Service Details */}
                <div className="px-6 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Price & Order Action */}
              <div className="p-6 pt-4 space-y-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Starting Rate
                    </span>
                    <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
                      ₹{service.basePrice.toFixed(2)}
                    </span>
                  </div>

                  {service.estimatedDelivery && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      {service.estimatedDelivery}
                    </span>
                  )}
                </div>

                <Link href={`/custom-order?serviceId=${service.id}`}>
                  <Button className="w-full gap-2 font-bold shadow-md shadow-sky-500/20">
                    Order Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
