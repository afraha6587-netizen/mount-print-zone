import { db } from '@/lib/db';
import { PortfolioManagerView } from '@/components/admin/portfolio-manager-view';

export const revalidate = 0;

export default async function AdminPortfolioPage() {
  const [items, categories] = await Promise.all([
    db.portfolioItem.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <PortfolioManagerView
      initialItems={JSON.parse(JSON.stringify(items))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
