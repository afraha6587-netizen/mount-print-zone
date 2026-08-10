import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { PriceCalculator } from '@/components/customer/price-calculator';

export const revalidate = 0;

const defaultFallbackServices = [
  {
    id: 's1',
    name: 'A0 Architectural Blue Prints & CAD Plots',
    basePrice: 150,
    discountPercent: 10,
    estimatedDelivery: 'Same Day Dispatch',
    pricingRules: [{ minQuantity: 10, maxQuantity: 100, unitPrice: 135, discountPercent: 10 }],
  },
  {
    id: 's2',
    name: 'Thesis Hard Binding (Gold Embossed)',
    basePrice: 450,
    discountPercent: 5,
    estimatedDelivery: '1-2 Working Days',
    pricingRules: [{ minQuantity: 5, maxQuantity: 20, unitPrice: 420, discountPercent: 5 }],
  },
  {
    id: 's3',
    name: 'Jumbo Xerox & Document Printouts',
    basePrice: 2,
    discountPercent: 15,
    estimatedDelivery: 'Same Day Dispatch',
    pricingRules: [{ minQuantity: 100, maxQuantity: 1000, unitPrice: 1.5, discountPercent: 15 }],
  },
];

export default async function PricingPage() {
  let settings: Record<string, string> = {};
  let services = [];

  try {
    settings = await getSiteSettings();
    const dbServices = await db.service.findMany({
      where: { isHidden: false },
      include: { pricingRules: true },
      orderBy: { createdAt: 'desc' },
    });
    services = JSON.parse(JSON.stringify(dbServices));
  } catch (error) {
    console.error('Pricing page fetch error:', error);
  }

  if (!services || services.length === 0) {
    services = defaultFallbackServices;
  }

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
