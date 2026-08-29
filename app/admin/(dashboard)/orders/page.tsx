import { db } from '@/lib/db';
import { OrderManagerView } from '@/components/admin/order-manager-view';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review placed orders, update 7-stage production statuses, generate tax invoices, and notify clients.
          </p>
        </div>

        <Link href="/admin/invoice-generator">
          <Button size="sm" className="gap-2 font-bold bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-500/20 text-white">
            <FileText className="w-4 h-4" /> ⚡ Create Quick POS Invoice
          </Button>
        </Link>
      </div>

      <OrderManagerView initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
