'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { UserPlus, UserCheck, Trash2, Key, Shield } from 'lucide-react';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function UserManagerView({ initialUsers }: { initialUsers: UserAccount[] }) {
  const router = useRouter();
  const [users, setUsers] = React.useState<UserAccount[]>(initialUsers);

  // Register modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'ADMIN' | 'STAFF'>('STAFF');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  // Password edit modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);
  const [targetUserName, setTargetUserName] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register account');

      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPasswordModal = (user: UserAccount) => {
    setTargetUserId(user.id);
    setTargetUserName(user.name);
    setNewPassword('');
    setPasswordSuccess(false);
    setError('');
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !newPassword) return;

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetUserId, password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Password change failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 font-bold shadow-lg">
          <UserPlus className="w-4 h-4" /> Register New Account
        </Button>
      </div>

      {/* Users List Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Permissions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    {u.name}
                  </td>
                  <td className="p-4 font-mono text-slate-300">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {u.role === 'ADMIN'
                      ? 'Full Access (Settings, Pricing, Users, Orders)'
                      : 'Staff Access (Order Updates, Customer Proofing, Service View)'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openPasswordModal(u)}
                        className="p-1.5 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
                        title="Change Account Password"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        title="Register New Admin or Staff Account"
      >
        <form onSubmit={handleRegisterUser} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mount Carmel Store Manager"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Email *</label>
            <input
              type="email"
              required
              placeholder="Enter work email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password *</label>
            <input
              type="password"
              required
              placeholder="Enter password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'STAFF')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="STAFF">Staff (Order Management & Service Operations)</option>
              <option value="ADMIN">Super Admin (Full Access to Settings, Pricing & Users)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              Register Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        maxWidth="md"
        title={`Change Password for ${targetUserName}`}
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center">
              Password updated successfully!
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="font-bold">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
