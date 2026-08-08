import Link from 'next/link';
import { db } from '@/lib/db';
import { PortfolioLightbox } from '@/components/customer/portfolio-lightbox';

export const revalidate = 0;

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { category } = await searchParams;

  const categories = await db.serviceCategory.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const where: any = {};
  if (category) {
    const selectedCat = categories.find((c) => c.slug === category);
    if (selectedCat) where.categoryId = selectedCat.id;
  }

  const items = await db.portfolioItem.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Client Work Showcase
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A glimpse into our recent printing, signages, and packaging projects. Click any image to view details.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/portfolio"
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
            !category
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm font-bold'
              : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
          }`}
        >
          All Showcase
        </Link>
        {categories.map((cat) => {
          const isActive = category === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/portfolio?category=${cat.slug}`}
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

      {/* Lightbox Gallery */}
      <PortfolioLightbox items={items} />
    </div>
  );
}
