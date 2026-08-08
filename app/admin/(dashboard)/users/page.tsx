import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { UserManagerView } from '@/components/admin/user-manager-view';

export const revalidate = 0;

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { role: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management & Registration</h1>
        <p className="text-xs text-slate-400 mt-1">Register new staff accounts, manage access roles, and assign permissions.</p>
      </div>

      <UserManagerView initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
