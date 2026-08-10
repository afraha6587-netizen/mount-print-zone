import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { ensureFullStoreCatalogSeeded } from '@/lib/seed-catalog';
import { Printer, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; query?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  await ensureFullStoreCatalogSeeded();
  const { category, query } = await searchParams;

  const categories = await db.serviceCategory.findMany({
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

  const services = await db.service.findMany({
    where,
    include: { category: true, pricingRules: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
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
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm font-bold'
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
        <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
          <Printer className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No services found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800">
                {service.image ? (
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Printer className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  From ₹{service.basePrice}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {service.estimatedDelivery}
                  </span>
                  <Link href={`/custom-order?serviceId=${service.id}`}>
                    <Button size="sm" className="gap-1 font-bold">
                      Order Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
