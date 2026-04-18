import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Plus, Edit2, Trash2, Youtube, Play, ChevronLeft, ChevronRight, Pin, FileText, ExternalLink } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/storage';

const categories = ['All', 'Chess', 'Workshops', 'Business', 'Events', 'Competitions'];

// ── Skeleton components ──────────────────────────────────────────
function ImageSkeleton() {
  return (
    <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#111] animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02]" />
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] animate-pulse">
      <div className="aspect-video bg-gradient-to-br from-white/5 to-white/[0.02]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-white/5 rounded w-4/5" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
      </div>
    </div>
  );
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const VIDEOS_PER_PAGE = 12;

export default function Gallery() {
  const { isAdmin, gallery, setGallery, videos, setVideos, slides, setSlides, siteSettings } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [videoPage, setVideoPage] = useState(0);

  // Image form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [formData, setFormData] = useState({ title: '', category: 'Events', image: '', credit: '' });

  // Video form
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [videoEditingId, setVideoEditingId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({ title: '', url: '' });
  const [videoUrlError, setVideoUrlError] = useState('');

  // Slide form
  const [isSlideEditing, setIsSlideEditing] = useState(false);
  const [slideEditingId, setSlideEditingId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState({ title: '', pdf_url: '', class_number: '' });

  const pinnedVideoId = siteSettings.pinnedVideoUrl ? getYouTubeId(siteSettings.pinnedVideoUrl) : null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  const totalVideoPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const pagedVideos = videos.slice(videoPage * VIDEOS_PER_PAGE, (videoPage + 1) * VIDEOS_PER_PAGE);

  // Image handlers
  const handleAdd = () => {
    setFormData({ title: '', category: 'Events', image: '', credit: '' });
    setEditingId(null);
    setOriginalImage('');
    setIsEditing(true);
  };
  const handleEdit = (item: any) => {
    setFormData({ title: item.title, category: item.category, image: item.image, credit: item.credit || '' });
    setEditingId(item.id);
    setOriginalImage(item.image || '');
    setIsEditing(true);
  };
  const handleDelete = (id: string) => {
    const item = gallery.find(i => i.id === id);
    if (window.confirm('Are you sure you want to delete this image?')) {
      if (item?.image) deleteImageFromStorage(item.image);
      setGallery(gallery.filter(item => item.id !== id));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      if (originalImage && formData.image !== originalImage) deleteImageFromStorage(originalImage);
      setGallery(gallery.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
    } else {
      setGallery([...gallery, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  // Video handlers
  const handleVideoAdd = () => {
    setVideoForm({ title: '', url: '' });
    setVideoEditingId(null);
    setVideoUrlError('');
    setIsVideoEditing(true);
  };
  const handleVideoEdit = (video: any) => {
    setVideoForm({ title: video.title, url: video.url });
    setVideoEditingId(video.id);
    setVideoUrlError('');
    setIsVideoEditing(true);
  };
  const handleVideoDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = getYouTubeId(videoForm.url);
    if (!videoId) {
      setVideoUrlError('Invalid YouTube URL. Please use a valid youtube.com or youtu.be link.');
      return;
    }
    if (videoEditingId) {
      setVideos(videos.map(v => v.id === videoEditingId ? { ...videoForm, id: videoEditingId } : v));
    } else {
      setVideos([...videos, { ...videoForm, id: Date.now().toString() }]);
    }
    setIsVideoEditing(false);
  };

  // Slide handlers
  const handleSlideAdd = () => {
    setSlideForm({ title: '', pdf_url: '', class_number: '' });
    setSlideEditingId(null);
    setIsSlideEditing(true);
  };
  const handleSlideEdit = (slide: any) => {
    setSlideForm({ title: slide.title, pdf_url: slide.pdf_url, class_number: slide.class_number?.toString() || '' });
    setSlideEditingId(slide.id);
    setIsSlideEditing(true);
  };
  const handleSlideDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      setSlides(slides.filter(s => s.id !== id));
    }
  };
  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slideData = {
      title: slideForm.title,
      pdf_url: slideForm.pdf_url,
      class_number: slideForm.class_number ? parseInt(slideForm.class_number) : undefined,
    };
    if (slideEditingId) {
      setSlides(slides.map(s => s.id === slideEditingId ? { ...slideData, id: slideEditingId } : s));
    } else {
      setSlides([...slides, { ...slideData, id: Date.now().toString() }]);
    }
    setIsSlideEditing(false);
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Gallery | ApporLeader</title>
        <meta name="description" content="Explore our gallery of moments captured from ApporLeader workshops, competitions, and community events." />
        <link rel="canonical" href="https://apporleader.vercel.app/gallery" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ApporLeader" />
        <meta property="og:title" content="Gallery | ApporLeader" />
        <meta property="og:description" content="Explore our gallery of moments captured from ApporLeader workshops, competitions, and community events." />
        <meta property="og:url" content="https://apporleader.vercel.app/gallery" />
        <meta property="og:image" content="https://apporleader.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gallery | ApporLeader" />
        <meta name="twitter:description" content="Explore our gallery of moments captured from ApporLeader workshops, competitions, and community events." />
        <meta name="twitter:image" content="https://apporleader.vercel.app/og-image.png" />
      </Helmet>

      {/* ── Page Header ── */}
      <section className="py-20 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[10%] top-[10%] h-[250px] w-[250px] rounded-full bg-highlight/10 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            Our Moments
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Our <span className="text-primary">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Moments captured from our workshops, competitions, and community events.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 1. PINNED ICONIC VIDEO                      */}
      {/* ═══════════════════════════════════════════ */}
      {pinnedVideoId && (
        <section className="py-16 bg-[#050505] border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                  <Pin size={13} className="fill-primary" /> ApporLeader Iconic Video
                </span>
              </div>

              {/* Embedded autoplay video */}
              <div className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-[0_0_60px_rgba(255,95,0,0.15)]">
                {/* Glow ring */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-primary/10 pointer-events-none z-10" />
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${pinnedVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1&loop=1&playlist=${pinnedVideoId}`}
                    title="ApporLeader Iconic Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Admin hint */}
              {isAdmin && (
                <p className="text-center text-xs text-gray-600 mt-4">
                  📌 Pinned video — change URL from <span className="text-primary">Admin Panel → Site Settings</span>
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Admin note if no pinned video */}
      {!pinnedVideoId && isAdmin && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-5 flex items-center gap-4">
            <Pin size={20} className="text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">No pinned video set</p>
              <p className="text-xs text-gray-400 mt-0.5">Go to <span className="text-primary font-medium">Admin Panel → Site Settings → Gallery Pinned Video</span> and paste a YouTube URL to feature your iconic video at the top of this page.</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 2. PHOTO GALLERY                            */}
      {/* ═══════════════════════════════════════════ */}

      {/* Category Filters */}
      <section className="py-8 border-b border-white/5 sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 2. PHOTO GALLERY                            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                📸 Photos & Moments
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Our <span className="text-primary">Memories</span>
              </h2>
            </div>
            {isAdmin && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)] text-sm"
              >
                <Plus size={16} /> Add Image
              </button>
            )}
          </div>

          {/* Image Edit Form */}
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12 max-w-2xl mx-auto shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Image' : 'Add Image'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <ImageUploadField
                  label="Image *"
                  folder="gallery"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  required
                />
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Photo Credit (optional)</label>
                  <input type="text" value={formData.credit || ''} onChange={e => setFormData({...formData, credit: e.target.value})} className={inputCls} placeholder="Photographer name..." />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-7 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Image</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
              </div>
            </motion.form>
          )}

          {/* Image Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <ImageSkeleton key={i} />)
            ) : (
            <AnimatePresence>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,95,0,0.1)]"
                  >
                    {isAdmin && (
                      <div className="absolute top-3 left-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg backdrop-blur-sm"><Edit2 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg backdrop-blur-sm"><Trash2 size={14} /></button>
                      </div>
                    )}
                    <div className="w-full h-full cursor-pointer" onClick={() => setSelectedImage({ url: item.image, title: item.title })}>
                      <img
                        src={getDriveImageUrl(item.image)} alt={item.title} referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Maximize2 size={16} className="text-white" />
                        </div>
                        <span className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.category}</span>
                        <h3 className="text-base font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.title}</h3>
                        {item.credit && <p className="text-gray-400 text-xs mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">📷 {item.credit}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  <p className="text-xl">Photos coming soon.</p>
                </div>
              )}
            </AnimatePresence>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. CLASS SLIDES                             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                📑 Class Slides & Materials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Class <span className="text-primary">Slides</span>
              </h2>
            </div>
            {isAdmin && (
              <button
                onClick={handleSlideAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)] text-sm"
              >
                <Plus size={16} /> Add Slide
              </button>
            )}
          </div>

          {/* Slide Add/Edit Form */}
          <AnimatePresence>
            {isSlideEditing && (
              <motion.form
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSlideSubmit}
                className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/10 mb-12 max-w-2xl mx-auto shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">{slideEditingId ? 'Edit Slide' : 'Add Class Slide'}</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Class Title *</label>
                      <input
                        required type="text" placeholder="e.g. Class 1 - Introduction to AI"
                        value={slideForm.title} onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Class Number</label>
                      <input
                        type="number" placeholder="1"
                        value={slideForm.class_number} onChange={e => setSlideForm({ ...slideForm, class_number: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">PDF Link *</label>
                    <input
                      required type="url" placeholder="https://drive.google.com/file/d/..."
                      value={slideForm.pdf_url} onChange={e => setSlideForm({ ...slideForm, pdf_url: e.target.value })}
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-600 mt-1.5">Google Drive, Dropbox বা যেকোনো PDF link দাও</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="submit" className="px-7 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Slide</button>
                  <button type="button" onClick={() => setIsSlideEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Slides Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 animate-pulse">
                  <div className="w-10 h-10 bg-white/5 rounded-lg mb-4" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl">Class slides coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative rounded-2xl border border-white/5 hover:border-primary/30 bg-[#0a0a0a] p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,95,0,0.1)]"
                  >
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleSlideEdit(slide)} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg"><Edit2 size={13} /></button>
                        <button onClick={() => handleSlideDelete(slide.id)} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg"><Trash2 size={13} /></button>
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <FileText size={22} className="text-primary" />
                    </div>
                    {slide.class_number && (
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">Class {slide.class_number}</span>
                    )}
                    <h3 className="text-white font-semibold text-sm leading-snug mb-4 group-hover:text-primary transition-colors">{slide.title}</h3>
                    <a
                      href={slide.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-bold rounded-lg transition-colors"
                    >
                      <ExternalLink size={13} /> View PDF
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. CLASS VIDEOS                             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Youtube size={14} /> Class Recordings
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Our <span className="text-red-500">Classes</span>
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl">
                Watch all our recorded classes and sessions. Click any video to start watching instantly.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={handleVideoAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] shrink-0"
              >
                <Plus size={18} /> Add Video
              </button>
            )}
          </div>

          {/* Video Add/Edit Form */}
          <AnimatePresence>
            {isVideoEditing && (
              <motion.form
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVideoSubmit}
                className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/10 mb-12 max-w-2xl mx-auto shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">{videoEditingId ? 'Edit Video' : 'Add YouTube Video'}</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Video Title *</label>
                    <input
                      required type="text" placeholder="e.g. Class 01 - Introduction to AI"
                      value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">YouTube URL *</label>
                    <input
                      required type="url" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={videoForm.url}
                      onChange={e => { setVideoForm({ ...videoForm, url: e.target.value }); setVideoUrlError(''); }}
                      className={`${inputCls} ${videoUrlError ? 'border-red-500/60' : ''}`}
                    />
                    {videoUrlError && <p className="text-red-400 text-xs mt-1.5">{videoUrlError}</p>}
                  </div>
                  {videoForm.url && getYouTubeId(videoForm.url) && (
                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeId(videoForm.url)}/hqdefault.jpg`}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const img = e.currentTarget;
                          const vid = getYouTubeId(videoForm.url);
                          if (img.src.includes('hqdefault')) {
                            img.src = `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
                          } else if (img.src.includes('mqdefault')) {
                            img.src = `https://img.youtube.com/vi/${vid}/default.jpg`;
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="submit" className="px-7 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors">Save Video</button>
                  <button type="button" onClick={() => setIsVideoEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Video Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <Youtube size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl">Class videos coming soon.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {pagedVideos.map((video, index) => {
                    const videoId = getYouTubeId(video.url);
                    if (!videoId) return null;
                    const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.04 }}
                        className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(220,38,38,0.1)] cursor-pointer bg-[#0a0a0a]"
                        onClick={() => setSelectedVideo({ id: videoId, title: video.title })}
                      >
                        {isAdmin && (
                          <div className="absolute top-3 left-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); handleVideoEdit(video); }} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg backdrop-blur-sm"><Edit2 size={13} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleVideoDelete(video.id); }} className="p-2 bg-red-700/90 text-white rounded-lg hover:bg-red-700 shadow-lg backdrop-blur-sm"><Trash2 size={13} /></button>
                          </div>
                        )}
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={thumb}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src.includes('hqdefault')) {
                                img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                              } else if (img.src.includes('mqdefault')) {
                                img.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                              } else {
                                img.style.display = 'none';
                              }
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <Play size={22} className="text-white ml-1" fill="white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 rounded px-1.5 py-0.5">
                            <Youtube size={14} className="text-red-500" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                            {video.title}
                          </h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {totalVideoPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button onClick={() => setVideoPage(p => Math.max(0, p - 1))} disabled={videoPage === 0} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalVideoPages }).map((_, i) => (
                    <button key={i} onClick={() => setVideoPage(i)} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${videoPage === i ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setVideoPage(p => Math.min(totalVideoPages - 1, p + 1))} disabled={videoPage === totalVideoPages - 1} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
              <p className="text-center text-gray-600 text-xs mt-4">
                Showing {Math.min((videoPage + 1) * VIDEOS_PER_PAGE, videos.length)} of {videos.length} videos
              </p>
            </>
          )}
        </div>
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex flex-col items-center gap-3 max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={getDriveImageUrl(selectedImage.url)} alt={selectedImage.title} referrerPolicy="no-referrer" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
              <p className="text-white font-semibold text-sm">{selectedImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/97 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedVideo(null)}
          >
            <button className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); setSelectedVideo(null); }}>
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-white font-semibold text-base mt-4 text-center">{selectedVideo.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
