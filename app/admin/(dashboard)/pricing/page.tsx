import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { PricingManagerView } from '@/components/admin/pricing-manager-view';

export const revalidate = 0;

export default async function AdminPricingPage() {
  const settings = await getSiteSettings();
  const services = await db.service.findMany({
    include: { category: true, pricingRules: true },
    orderBy: { name: 'asc' },
  });

  return (
    <PricingManagerView
      initialSettings={settings}
      services={JSON.parse(JSON.stringify(services))}
    />
  );
}
