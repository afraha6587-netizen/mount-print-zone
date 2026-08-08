'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ORDER_STATUSES, getStatusBadgeInfo } from '@/lib/order-utils';
import { Search, Download, FileText, ExternalLink, RefreshCw, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  notes: string | null;
  designFileUrl: string | null;
  designFileName: string | null;
  status: string;
  paymentStatus: string;
  expectedDeliveryDate: string | null;
  createdAt: string;
  service: { name: string };
  invoice: { invoiceNumber: string; id: string } | null;
  timeline: { id: string; status: string; note: string | null; createdBy: string | null; createdAt: string }[];
}

export function OrderManagerView({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();
  const [orders, setOrders] = React.useState<OrderItem[]>(initialOrders);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const [selectedOrder, setSelectedOrder] = React.useState<OrderItem | null>(null);

  // Form states for status update
  const [newStatus, setNewStatus] = React.useState('');
  const [newPaymentStatus, setNewPaymentStatus] = React.useState('');
  const [timelineNote, setTimelineNote] = React.useState('');
  const [expectedDate, setExpectedDate] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const openManageModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus);
    setExpectedDate(order.expectedDeliveryDate || '');
    setTimelineNote('');
    setMessage('');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    setMessage('');

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newPaymentStatus,
          expectedDeliveryDate: expectedDate,
          note: timelineNote,
          generateInvoice: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      setMessage('Order updated successfully!');
      router.refresh();
      setSelectedOrder(null);
    } catch (err: any) {
      setMessage(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);

    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Phone, Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Service</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Artwork File</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No orders matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadgeInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-extrabold text-sky-400">{order.orderId}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{order.customerName}</span>
                        <span className="text-[10px] text-slate-400 block">{order.customerPhone}</span>
                        <span className="text-[10px] text-slate-400 block">{order.customerEmail}</span>
                      </td>
                      <td className="p-4 font-medium">
                        {order.service.name}
                        <span className="block text-[10px] text-slate-400">Qty: {order.quantity}</span>
                      </td>
                      <td className="p-4 font-black text-emerald-400 text-sm">
                        ₹{order.grandTotal.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.designFileUrl ? (
                          <a
                            href={order.designFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 underline font-semibold flex items-center gap-1 text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Artwork
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px]">No File</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => openManageModal(order)}
                          className="text-xs font-bold"
                        >
                          Manage
                        </Button>
                        <a href={`/api/invoice/${order.orderId}`} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="p-2" title="Download Invoice PDF">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Order Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="xl"
        title={`Manage Order #${selectedOrder?.orderId}`}
      >
        {selectedOrder && (
          <form onSubmit={handleUpdateOrder} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Update Production Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} - {s.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Update Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PAID">PAID</option>
                  <option value="PARTIAL">PARTIAL</option>
                </select>
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
              />
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Timeline Log Note
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Artwork proof approved by client. Job dispatched to offset press."
                value={timelineNote}
                onChange={(e) => setTimelineNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isUpdating} className="font-bold">
                Save & Update Order
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
