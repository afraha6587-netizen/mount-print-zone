import { db } from '@/lib/db';
import { OfferManagerView } from '@/components/admin/offer-manager-view';

export const revalidate = 0;

export default async function AdminOffersPage() {
  const offers = await db.offer.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <OfferManagerView initialOffers={JSON.parse(JSON.stringify(offers))} />;
}
