import { db } from '@/lib/db';
import { BannerManagerView } from '@/components/admin/banner-manager-view';

export const revalidate = 0;

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({
    orderBy: { order: 'asc' },
  });

  return <BannerManagerView initialBanners={JSON.parse(JSON.stringify(banners))} />;
}
