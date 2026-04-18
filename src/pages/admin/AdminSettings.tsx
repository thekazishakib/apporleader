import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Helmet } from 'react-helmet-async';
import type { SiteSettings } from '../../config/siteSettingsMap';
import { useToast } from '../../context/ToastContext';
import { uploadImageToStorage, deleteImageFromStorage } from '../../utils/storage';
import { Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const { showToast } = useToast();
  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [saving, setSaving] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(siteSettings);
    try {
      const parsed = JSON.parse(siteSettings.heroImages || '[]');
      setHeroImages(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHeroImages([]);
    }
  }, [siteSettings]);

  const handleChange = (k: keyof SiteSettings, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({ ...form, heroImages: JSON.stringify(heroImages) });
      showToast('Settings saved', 'success');
    } catch {
      showToast('Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 7 - heroImages.length;
    if (remaining <= 0) {
      showToast('Maximum 7 hero images allowed', 'error');
      return;
    }
    const toUpload = files.slice(0, remaining);
    setUploadingHero(true);
    try {
      const urls = await Promise.all(
        toUpload.map((file) => uploadImageToStorage(file, 'hero'))
      );
      const updated = [...heroImages, ...urls];
      setHeroImages(updated);
      await updateSiteSettings({ heroImages: JSON.stringify(updated) });
      showToast(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`, 'success');
    } catch {
      showToast('Upload failed — check storage settings', 'error');
    } finally {
      setUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  };

  const handleHeroDelete = async (url: string) => {
    if (!window.confirm('Remove this hero image?')) return;
    const updated = heroImages.filter((u) => u !== url);
    setHeroImages(updated);
    await updateSiteSettings({ heroImages: JSON.stringify(updated) });
    await deleteImageFromStorage(url);
    showToast('Image removed', 'success');
  };

  const moveHeroImage = (from: number, to: number) => {
    const updated = [...heroImages];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setHeroImages(updated);
  };

  return (
    <div>
      <Helmet>
        <title>Site settings | Admin</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-2">Site settings</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-2xl">
        These values power CTAs across the header, home page, and footer. Use full URLs (https://...).
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">

        {/* Hero BG Images */}
        <div className="rounded-2xl border border-primary/30 bg-[#0a0a0a] p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={15} /> Hero Background Images
            </h2>
            <p className="text-xs text-gray-500 mt-1.5">
              Upload 5-7 images that will auto-slideshow on the home page hero section. Use arrows to reorder. Max 7 images.
            </p>
          </div>

          <div>
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleHeroUpload}
              disabled={uploadingHero || heroImages.length >= 7}
            />
            <button
              type="button"
              onClick={() => heroInputRef.current?.click()}
              disabled={uploadingHero || heroImages.length >= 7}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 text-primary font-semibold rounded-lg text-sm hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload size={15} />
              {uploadingHero ? 'Uploading...' : `Upload Images (${heroImages.length}/7)`}
            </button>
          </div>

          {heroImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {heroImages.map((url, idx) => (
                <div key={url} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                  <img src={url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveHeroImage(idx, idx - 1)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold transition-colors"
                        title="Move left"
                      >
                        &larr;
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleHeroDelete(url)}
                      className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                    {idx < heroImages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveHeroImage(idx, idx + 1)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold transition-colors"
                        title="Move right"
                      >
                        &rarr;
                      </button>
                    )}
                  </div>
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-600 text-sm">
              No hero images yet. Upload 5-7 images to enable the slideshow.
            </div>
          )}
        </div>

        {/* Forms & links */}
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
            <span className="text-xs text-gray-500 mb-1 block">Registration URL (optional)</span>
            <input
              type="url"
              value={form.registrationUrl}
              onChange={(e) => handleChange('registrationUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
              placeholder="Leave empty to use membership URL everywhere"
            />
          </label>
        </div>

        {/* Contact & social */}
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
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">YouTube Channel URL</span>
            <input
              type="url"
              value={form.socialYoutube}
              onChange={(e) => handleChange('socialYoutube', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
              placeholder="https://www.youtube.com/@ApporLeader"
            />
          </label>
        </div>

        {/* Pinned Video */}
        <div className="rounded-2xl border border-red-600/20 bg-[#0a0a0a] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <span>📌</span> Gallery — Pinned Iconic Video
          </h2>
          <p className="text-xs text-gray-500">
            This video appears at the very top of the Gallery page and autoplays when visitors enter.
          </p>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">YouTube URL (optional)</span>
            <input
              type="url"
              value={form.pinnedVideoUrl}
              onChange={(e) => handleChange('pinnedVideoUrl', e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
