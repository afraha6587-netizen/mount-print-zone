import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { CustomOrderForm } from '@/components/customer/custom-order-form';

export const revalidate = 0;

export default async function CustomOrderPage() {
  const settings = await getSiteSettings();

  const services = await db.service.findMany({
    where: { isHidden: false },
    select: { id: true, name: true, basePrice: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Place a Custom Print Order
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload your print-ready artwork files (PDF, AI, PSD, CDR, PNG, JPG, DOCX). We verify proofs before printing.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12">Loading form...</div>}>
        <CustomOrderForm
          services={services}
          maxUploadMb={settings.max_upload_size_mb || '50'}
          acceptedTypes={settings.accepted_file_types || 'PDF, AI, PSD, CDR, PNG, JPG, DOCX'}
        />
      </Suspense>
    </div>
  );
}
