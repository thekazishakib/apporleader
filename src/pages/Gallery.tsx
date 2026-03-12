import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';

const categories = ['All', 'Chess', 'Workshops', 'Business', 'Events', 'Competitions'];

export default function Gallery() {
  const { isAdmin, gallery, setGallery } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Events',
    image: '',
    credit: ''
  });

  const filteredItems = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  const handleAdd = () => {
    setFormData({ title: '', category: 'Events', image: '', credit: '' });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setGallery(gallery.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setGallery(gallery.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
    } else {
      setGallery([...gallery, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Gallery | ApporLeader</title>
        <meta name="description" content="Explore our gallery of moments captured from workshops, competitions, and community events." />
      </Helmet>
      {/* Header */}
      <section className="py-20 bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Our <span className="text-primary">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Moments captured from our workshops, competitions, and community events.
          </motion.p>
          {isAdmin && (
            <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors">
              <Plus size={20} /> Add Image
            </button>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-white/5 sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
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

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Image' : 'Add Image'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white">
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Credit (optional)</label>
                  <input type="text" value={formData.credit || ''} onChange={e => setFormData({...formData, credit: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20">Cancel</button>
              </div>
            </form>
          ) : null}

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10"
                  >
                    {isAdmin && (
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
                      </div>
                    )}
                    <div className="w-full h-full cursor-pointer" onClick={() => setSelectedImage(item.image)}>
                      <img 
                        src={getDriveImageUrl(item.image)} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Maximize2 size={20} className="text-white" />
                        </div>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.category}</span>
                        <h3 className="text-xl font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.title}</h3>
                        {item.credit && <p className="text-gray-400 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">Photo by: {item.credit}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  <p className="text-xl">Images coming soon.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={getDriveImageUrl(selectedImage)}
              alt="Enlarged view"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
