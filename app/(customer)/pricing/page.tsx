import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { PriceCalculator } from '@/components/customer/price-calculator';

export const revalidate = 0;

const defaultFallbackServices = [
  {
    id: 's1',
    name: 'JUMBO XEROX (A0, A1, A2)',
    basePrice: 50,
    discountPercent: 10,
    estimatedDelivery: 'Express 1 Hour',
    pricingRules: [{ minQuantity: 10, maxQuantity: 100, unitPrice: 45, discountPercent: 10 }],
  },
  {
    id: 's2',
    name: 'BLUE PRINTS / DIGITAL BLUE PRINT (A0, A1, A2)',
    basePrice: 45,
    discountPercent: 10,
    estimatedDelivery: 'Express 1 Hour',
    pricingRules: [{ minQuantity: 10, maxQuantity: 100, unitPrice: 40, discountPercent: 10 }],
  },
  {
    id: 's3',
    name: 'POSTERS / POSTER PRINTS (A0, A1, A2, A3)',
    basePrice: 120,
    discountPercent: 15,
    estimatedDelivery: 'Same Day',
    pricingRules: [{ minQuantity: 5, maxQuantity: 50, unitPrice: 105, discountPercent: 15 }],
  },
  {
    id: 's4',
    name: 'THESIS BINDING (Golden Embossed)',
    basePrice: 350,
    discountPercent: 0,
    estimatedDelivery: 'Same Day / 3 Hours',
    pricingRules: [{ minQuantity: 5, maxQuantity: 20, unitPrice: 320, discountPercent: 10 }],
  },
  {
    id: 's5',
    name: 'PROJECT - BINDING (Leatherette / Soft Cover)',
    basePrice: 250,
    discountPercent: 5,
    estimatedDelivery: 'Same Day',
    pricingRules: [{ minQuantity: 5, maxQuantity: 20, unitPrice: 235, discountPercent: 5 }],
  },
  {
    id: 's6',
    name: 'PRINT OUT (B&W & COLOUR) (A4, A3)',
    basePrice: 2,
    discountPercent: 20,
    estimatedDelivery: 'Instant / Express',
    pricingRules: [{ minQuantity: 100, maxQuantity: 1000, unitPrice: 1.5, discountPercent: 20 }],
  },
  {
    id: 's7',
    name: 'TRACING PRINTS (A0, A1, A2, A3)',
    basePrice: 65,
    discountPercent: 5,
    estimatedDelivery: 'Same Day',
    pricingRules: [{ minQuantity: 10, maxQuantity: 50, unitPrice: 60, discountPercent: 8 }],
  },
  {
    id: 's8',
    name: 'PVC CARD (Plastic ID Cards)',
    basePrice: 80,
    discountPercent: 10,
    estimatedDelivery: 'Same Day',
    pricingRules: [{ minQuantity: 10, maxQuantity: 100, unitPrice: 70, discountPercent: 12 }],
  },
  {
    id: 's9',
    name: 'AYUSHMAN CARD (Govt PVC Health Card)',
    basePrice: 70,
    discountPercent: 0,
    estimatedDelivery: 'Express 15 Mins',
    pricingRules: [],
  },
  {
    id: 's10',
    name: 'PASSPORT SIZE PHOTO (8 Pcs Studio)',
    basePrice: 99,
    discountPercent: 0,
    estimatedDelivery: 'Instant 10 Mins',
    pricingRules: [],
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
          Transparent pricing based on real-time database rates and instant volume discounts for A0, A1, A2, A3, A4 & custom specs.
        </p>
      </div>

      <PriceCalculator services={services} gstRate={gstRate} deliveryCharge={deliveryCharge} />
    </div>
  );
}
