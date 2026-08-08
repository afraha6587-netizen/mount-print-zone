import { db } from '@/lib/db';
import { OrderManagerView } from '@/components/admin/order-manager-view';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      service: true,
      invoice: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review placed orders, update 7-stage production statuses, generate tax invoices, and notify clients.
        </p>
      </div>

      <OrderManagerView initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
