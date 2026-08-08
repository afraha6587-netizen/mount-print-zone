export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DESIGN_REVIEW'
  | 'PRINTING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_STATUSES: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'PENDING', label: 'Pending', description: 'Order received and awaiting review' },
  { key: 'APPROVED', label: 'Approved', description: 'Order confirmed and scheduled for production' },
  { key: 'DESIGN_REVIEW', label: 'Design Review', description: 'Artwork proofing and color calibration' },
  { key: 'PRINTING', label: 'Printing', description: 'Job currently on press' },
  { key: 'READY', label: 'Ready', description: 'Packaged & ready for pickup/dispatch' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Handed over to customer / courier' },
  { key: 'CANCELLED', label: 'Cancelled', description: 'Order cancelled' },
];

export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MPZ-${result}`;
}

export function generateInvoiceNumber(seq: number): string {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(4, '0');
  return `INV-MPZ-${year}-${padded}`;
}

export function getStatusBadgeInfo(status: string) {
  switch (status) {
    case 'PENDING':
      return { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    case 'APPROVED':
      return { label: 'Approved', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    case 'DESIGN_REVIEW':
      return { label: 'Design Review', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
    case 'PRINTING':
      return { label: 'Printing', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
    case 'READY':
      return { label: 'Ready for Pickup', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    case 'DELIVERED':
      return { label: 'Delivered', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  }
}
