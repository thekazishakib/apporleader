import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Helmet } from 'react-helmet-async';
import type { SiteSettings } from '../../config/siteSettingsMap';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const { showToast } = useToast();
  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  const handleChange = (k: keyof SiteSettings, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(form);
      showToast('Settings saved', 'success');
    } catch {
      showToast('Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Site settings | Admin</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-2">Site settings</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-2xl">
        These values power CTAs across the header, home page, and footer. Use full URLs (https://…).
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Forms & links</h2>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Membership / club application URL</span>
            <input
              type="url"
              required
              value={form.membershipUrl}
              onChange={(e) => handleChange('membershipUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Registration URL (optional — e.g. events signup)</span>
            <input
              type="url"
              value={form.registrationUrl}
              onChange={(e) => handleChange('registrationUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
              placeholder="Leave empty to use membership URL everywhere"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Contact & social</h2>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Public contact email</span>
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">WhatsApp community link</span>
            <input
              type="url"
              required
              value={form.whatsappUrl}
              onChange={(e) => handleChange('whatsappUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Instagram URL</span>
            <input
              type="url"
              required
              value={form.socialInstagram}
              onChange={(e) => handleChange('socialInstagram', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">LinkedIn URL</span>
            <input
              type="url"
              required
              value={form.socialLinkedin}
              onChange={(e) => handleChange('socialLinkedin', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-red-600/20 bg-[#0a0a0a] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <span>📌</span> Gallery — Pinned Iconic Video
          </h2>
          <p className="text-xs text-gray-500">
            This video appears at the very top of the Gallery page and autoplays when visitors enter. Use it for your most iconic / featured video.
          </p>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">YouTube URL (optional)</span>
            <input
              type="url"
              value={form.pinnedVideoUrl}
              onChange={(e) => handleChange('pinnedVideoUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
