import React, { Suspense } from 'react';
import { TrackOrderView } from '@/components/customer/track-order-view';

export const revalidate = 0;

export default function TrackOrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Live Order Tracking
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter your unique Order ID and registered Phone Number to view production status and download tax invoices.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12">Loading tracker...</div>}>
        <TrackOrderView />
      </Suspense>
    </div>
  );
}
