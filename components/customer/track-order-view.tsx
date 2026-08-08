'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUSES, getStatusBadgeInfo } from '@/lib/order-utils';
import { Search, Download, Clock, ShieldCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrackOrderView() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderId, setOrderId] = React.useState(initialId);
  const [phone, setPhone] = React.useState(initialPhone);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [orderData, setOrderData] = React.useState<any>(null);

  const fetchTrackOrder = React.useCallback(async (id: string, ph: string) => {
    if (!id || !ph) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, phone: ph }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to locate order');
      }
      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || 'Order not found');
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialId && initialPhone) {
      fetchTrackOrder(initialId, initialPhone);
    }
  }, [initialId, initialPhone, fetchTrackOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderId, phone);
  };

  const getStatusIndex = (status: string) => {
    if (status === 'CANCELLED') return -1;
    return ORDER_STATUSES.findIndex((s) => s.key === status);
  };

  return (
    <div className="space-y-10">
      {/* Lookup Card */}
      <form
        onSubmit={handleSearch}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Order ID (e.g. MPZ-8F3K9P2Q) *
            </label>
            <input
              type="text"
              required
              placeholder="MPZ-XXXXXXXX"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Customer Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className="w-full font-bold gap-2 shadow-lg shadow-sky-500/20"
        >
          <Search className="w-4 h-4" /> Track Order
        </Button>
      </form>

      {error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center font-semibold text-sm">
          {error}
        </div>
      )}

      {/* Order Status Display */}
      {orderData && (
        <div className="space-y-8">
          {/* Order Header Summary */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 dark:border-sky-500/20 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Order Summary
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  #{orderData.orderId}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <a href={`/api/invoice/${orderData.orderId}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 font-bold">
                    <Download className="w-4 h-4 text-sky-500" /> Download Invoice PDF
                  </Button>
                </a>
              </div>
            </div>

            {/* Grid Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Customer Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{orderData.customerName}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Ordered Service</span>
                <span className="font-bold text-slate-900 dark:text-white">{orderData.service.name}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Payment Status</span>
                <Badge variant={orderData.paymentStatus === 'PAID' ? 'success' : 'warning'} className="mt-1">
                  {orderData.paymentStatus}
                </Badge>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Grand Total</span>
                <span className="font-extrabold text-sky-600 dark:text-sky-400 text-lg">₹{orderData.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timeline Animation */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg space-y-8">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" /> Production & Delivery Progress
            </h3>

            {/* 7-Stage Stepper Progress Bar */}
            <div className="relative py-4">
              <div className="hidden md:flex items-center justify-between relative z-10">
                {ORDER_STATUSES.filter((s) => s.key !== 'CANCELLED').map((statusItem, idx) => {
                  const currentIdx = getStatusIndex(orderData.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={statusItem.key} className="flex flex-col items-center text-center space-y-2 max-w-[100px]">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.2 : 1,
                          backgroundColor: isCompleted ? '#0284c7' : '#94a3b8',
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                          isCompleted ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </motion.div>
                      <span
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                        }`}
                      >
                        {statusItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Events Detailed List */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity History</h4>
              <div className="space-y-4">
                {orderData.timeline.map((event: any) => {
                  const badge = getStatusBadgeInfo(event.status);
                  return (
                    <div key={event.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60">
                      <div className="w-3 h-3 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(event.createdAt).toLocaleString('en-IN')}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {event.note}
                          </p>
                        )}
                        {event.createdBy && (
                          <span className="text-[10px] text-slate-400 block">By {event.createdBy}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
