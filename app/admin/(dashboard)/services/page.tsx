import { db } from '@/lib/db';
import { ensureFullStoreCatalogSeeded } from '@/lib/seed-catalog';
import { ServiceManagerView } from '@/components/admin/service-manager-view';

export const revalidate = 0;

export default async function AdminServicesPage() {
  await ensureFullStoreCatalogSeeded();
  const [services, categories] = await Promise.all([
    db.service.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Service Catalog Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Add, edit, hide, or update pricing and images for all printing products.
        </p>
      </div>

      <ServiceManagerView
        initialServices={JSON.parse(JSON.stringify(services))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
