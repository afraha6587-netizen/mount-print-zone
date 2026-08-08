import { getSiteSettings } from '@/lib/settings';
import { requireAdmin } from '@/lib/auth';
import { SettingsForm } from '@/components/admin/settings-form';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Website Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure storefront headlines, logo, company address, phone, business hours, and map location.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
