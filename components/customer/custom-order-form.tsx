'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Upload, CheckCircle2, ShieldCheck, Link2 } from 'lucide-react';
import Link from 'next/link';

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
}

export function CustomOrderForm({
  services,
  maxUploadMb,
  acceptedTypes,
}: {
  services: ServiceOption[];
  maxUploadMb: string;
  acceptedTypes: string;
}) {
  const searchParams = useSearchParams();
  const defaultServiceId = searchParams.get('serviceId') || services[0]?.id || '';
  const defaultQty = parseInt(searchParams.get('quantity') || '100', 10);

  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [serviceId, setServiceId] = React.useState(defaultServiceId);
  const [paperSize, setPaperSize] = React.useState('A4');
  const [quantity, setQuantity] = React.useState(defaultQty);
  const [notes, setNotes] = React.useState('');
  const [driveLink, setDriveLink] = React.useState('');

  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [createdOrder, setCreatedOrder] = React.useState<{
    orderId: string;
    customerName: string;
    customerPhone: string;
    grandTotal: number;
  } | null>(null);

  // Compress image if larger than 3.5MB to avoid Vercel 4.5MB Serverless Payload limits
  const compressImageIfNeeded = async (imageFile: File): Promise<File> => {
    if (imageFile.size < 3.5 * 1024 * 1024) return imageFile;
    if (!imageFile.type.startsWith('image/')) return imageFile;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDim = 2400;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], imageFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(imageFile);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => resolve(imageFile);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setErrorMessage('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      let fileUrl = '';
      let fileName = '';

      // 1. Upload File if attached
      if (file) {
        setIsUploading(true);

        const uploadReadyFile = await compressImageIfNeeded(file);
        const formData = new FormData();
        formData.append('file', uploadReadyFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.status === 413) {
          throw new Error(
            'Artwork file size is too large for direct upload (limit 4.5MB). Please attach a Google Drive / WeTransfer link in the Drive Link field below!'
          );
        }

        const contentType = uploadRes.headers.get('content-type') || '';
        let uploadData: any = {};

        if (contentType.includes('application/json')) {
          uploadData = await uploadRes.json();
        } else {
          const rawText = await uploadRes.text();
          throw new Error(`Upload server error (${uploadRes.status}): ${rawText.substring(0, 120)}`);
        }

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Failed to upload artwork file');
        }

        fileUrl = uploadData.url;
        fileName = uploadData.filename;
        setIsUploading(false);
      }

      // Combine Drive link with notes if provided
      let finalNotes = `[Size: ${paperSize}] ${notes}`.trim();
      if (driveLink.trim()) {
        finalNotes += ` | [Artwork Cloud Link: ${driveLink.trim()}]`;
        if (!fileUrl) {
          fileUrl = driveLink.trim();
          fileName = 'Cloud_Artwork_Link';
        }
      }

      // 2. Create Order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          serviceId,
          quantity,
          notes: finalNotes,
          designFileUrl: fileUrl,
          designFileName: fileName,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        throw new Error(`Order server error (${res.status}): ${rawText.substring(0, 120)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setCreatedOrder(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6"
      >
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold leading-relaxed">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sethi"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. vikram@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Select Service */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Printing Service *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Quantity *
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Paper Size / Dimensions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Paper / Print Size *
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {['A0', 'A1', 'A2', 'A3', 'A4', 'Custom'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPaperSize(size)}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border ${
                  paperSize === size
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Special Instructions / Finishing Notes
          </label>
          <textarea
            rows={3}
            placeholder="Specify dimensions, velvet/gloss lamination, foil colors, grommets placement, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Upload Design File */}
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Attach Design File (PDF, AI, PSD, CDR, PNG, JPG, DOCX, DWG)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-sky-500 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.ai,.psd,.cdr,.png,.jpg,.jpeg,.docx,.dwg,.zip,.rar"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-sky-500 animate-bounce" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {file ? file.name : 'Click or Drag & Drop Design File'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Direct Upload Limit: 4.5MB (Images auto-compressed). For larger files, paste a link below.
                </span>
              </label>
            </div>
          </div>

          {/* Cloud Drive Link for Large Files */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-sky-500" /> Or Paste Large File Link (Google Drive / WeTransfer / Dropbox)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Submit Action */}
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting || isUploading}
          className="w-full font-bold shadow-xl shadow-sky-500/25 py-3.5 text-base"
        >
          Submit Order & Get Order ID
        </Button>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!createdOrder}
        onClose={() => setCreatedOrder(null)}
        maxWidth="md"
        title="Order Placed Successfully! 🎉"
      >
        {createdOrder && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Unique Order ID</span>
              <h3 className="text-3xl font-black text-sky-600 dark:text-sky-400 tracking-wider">
                {createdOrder.orderId}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                A confirmation email has been sent to your inbox.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <Link
                href={`/track-order?id=${createdOrder.orderId}&phone=${createdOrder.customerPhone}`}
              >
                <Button size="lg" className="w-full gap-2 font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4" /> Track Order Status Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
