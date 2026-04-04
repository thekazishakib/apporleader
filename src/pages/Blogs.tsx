import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/storage';
import { formatBlogDateDisplay, toDateInputValue } from '../utils/formatBlogDate';

export default function Blogs() {
  const { isAdmin, blogs, setBlogs } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    content: ''
  });

  const handleAdd = () => {
    setFormData({ title: '', date: '', image: '', excerpt: '', content: '' });
    setEditingId(null);
    setOriginalImage('');
    setIsEditing(true);
  };

  const handleEdit = (blog: any) => {
    setFormData({
      title: blog.title || '',
      date: toDateInputValue(blog.date || ''),
      image: blog.image || '',
      excerpt: blog.excerpt || '',
      content: blog.content || ''
    });
    setEditingId(blog.id);
    setOriginalImage(blog.image || '');
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      if (blog?.image) deleteImageFromStorage(blog.image);
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Auto-delete old image if replaced
      if (originalImage && formData.image !== originalImage) {
        deleteImageFromStorage(originalImage);
      }
      setBlogs(blogs.map(b => b.id === editingId ? { ...formData, id: editingId } : b));
    } else {
      setBlogs([...blogs, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Blogs | ApporLeader</title>
        <meta name="description" content="Read insightful articles on logic, technology, and strategy from the ApporLeader community." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-[#050505] border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[10%] top-[15%] h-[250px] w-[250px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            Knowledge Hub
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Our <span className="text-primary">Blogs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Insightful articles on logic, technology, and strategy.
          </motion.p>
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)]"
            >
              <Plus size={20} /> Add Blog Post
            </motion.button>
          )}
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date *</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} />
                </div>
                <ImageUploadField
                  label="Cover Image *"
                  folder="blogs"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  required
                />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Excerpt *</label>
                  <textarea required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className={`${inputCls} h-24 resize-none`} placeholder="Short description shown on the blog listing..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Content * (Markdown supported)</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className={`${inputCls} h-64 resize-none font-mono text-xs`} placeholder="Write in Markdown: **bold**, # Heading, - list item..." />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-7 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Post</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
              </div>
            </motion.form>
          )}

          <div className="grid grid-cols-1 gap-10">
            {blogs.length > 0 ? blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 group relative hover:shadow-[0_0_30px_rgba(255,95,0,0.06)]"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(blog)} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg backdrop-blur-sm"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg backdrop-blur-sm"><Trash2 size={15} /></button>
                  </div>
                )}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={getDriveImageUrl(blog.image)}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar size={15} className="mr-2 text-primary" />
                    {formatBlogDateDisplay(blog.date)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-snug">{blog.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blogs/${blog.id}`} className="inline-flex items-center text-primary font-bold hover:text-white transition-colors group/link">
                    Read More <ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No blog posts yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
