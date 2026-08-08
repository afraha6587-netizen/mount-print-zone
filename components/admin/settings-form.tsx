'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle2 } from 'lucide-react';

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Settings updated successfully! Website updated live.
        </div>
      )}

      {/* Brand Identity */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-2">Brand Identity & Hero Text</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</label>
            <input
              type="text"
              value={settings.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tagline</label>
            <input
              type="text"
              value={settings.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Homepage Hero Headline</label>
          <input
            type="text"
            value={settings.hero_headline || ''}
            onChange={(e) => handleChange('hero_headline', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Homepage Hero Subtitle</label>
          <textarea
            rows={2}
            value={settings.hero_subtitle || ''}
            onChange={(e) => handleChange('hero_subtitle', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-2">Contact & Store Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Email</label>
            <input
              type="email"
              value={settings.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Store Address</label>
          <input
            type="text"
            value={settings.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Hours</label>
          <input
            type="text"
            value={settings.business_hours || ''}
            onChange={(e) => handleChange('business_hours', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Google Map Embed URL</label>
          <input
            type="url"
            value={settings.google_map_embed || ''}
            onChange={(e) => handleChange('google_map_embed', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button type="submit" size="lg" isLoading={isSaving} className="gap-2 font-bold shadow-xl shadow-sky-500/20">
          <Save className="w-4 h-4" /> Save Website Settings
        </Button>
      </div>
    </form>
  );
}
