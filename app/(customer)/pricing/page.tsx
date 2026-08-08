import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { PriceCalculator } from '@/components/customer/price-calculator';

export const revalidate = 0;

export default async function PricingPage() {
  const settings = await getSiteSettings();

  const services = await db.service.findMany({
    where: { isHidden: false },
    include: { pricingRules: true },
    orderBy: { createdAt: 'desc' },
  });

  const gstRate = parseFloat(settings.gst_rate || '18');
  const deliveryCharge = parseFloat(settings.delivery_charge || '99');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Instant Printing Cost Estimator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Transparent pricing based on real-time database rates and instant volume discounts.
        </p>
      </div>

      <PriceCalculator services={services} gstRate={gstRate} deliveryCharge={deliveryCharge} />
    </div>
  );
}
