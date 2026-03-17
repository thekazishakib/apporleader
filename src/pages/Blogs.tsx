import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/deleteImage';
import { deleteImageFromStorage } from '../utils/imageUpload';

export default function Blogs() {
  const { isAdmin, blogs, setBlogs } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    setIsEditing(true);
  };

  const handleEdit = (blog: any) => {
    setFormData({
      title: blog.title || '',
      date: blog.date || '',
      image: blog.image || '',
      excerpt: blog.excerpt || '',
      content: blog.content || ''
    });
    setEditingId(blog.id);
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
      setBlogs(blogs.map(b => b.id === editingId ? { ...formData, id: editingId } : b));
    } else {
      setBlogs([...blogs, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Blogs | ApporLeader</title>
        <meta name="description" content="Read insightful articles on logic, technology, and strategy from the ApporLeader community." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
            <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors">
              <Plus size={20} /> Add Blog Post
            </button>
          )}
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <ImageUploadField
                  label="Cover Image"
                  folder="blogs"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Excerpt</label>
                  <textarea required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white h-24" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white h-64" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20">Cancel</button>
              </div>
            </form>
          ) : null}

          <div className="grid grid-cols-1 gap-12">
            {blogs.map((blog, index) => (
              <motion.div 
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group relative"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
                  </div>
                )}
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={getDriveImageUrl(blog.image)} 
                    alt={blog.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar size={16} className="mr-2" />
                    {blog.date}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{blog.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blogs/${blog.id}`} className="inline-flex items-center text-primary font-bold hover:text-white transition-colors">
                    Read More <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
