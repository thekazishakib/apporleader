import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/deleteImage';
import { deleteImageFromStorage } from '../utils/imageUpload';

export default function Workshops() {
  const { isAdmin, events, setEvents } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Workshop',
    description: '',
    spots: 100,
    filled: 0,
    color: 'border-primary',
    bg: 'bg-primary/10',
    text: 'text-primary',
    image: '',
    registrationLink: ''
  });

  const handleAdd = () => {
    setFormData({
      title: '', date: '', time: '', location: '', category: 'Workshop', description: '',
      spots: 100, filled: 0, color: 'border-primary', bg: 'bg-primary/10', text: 'text-primary', image: '', registrationLink: ''
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEdit = (event: any) => {
    setFormData(event);
    setEditingId(event.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string | number) => {
    const event = events.find(e => e.id === id);
    if (window.confirm('Are you sure you want to delete this event?')) {
      if (event?.image) deleteImageFromStorage(event.image);
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEvents(events.map(ev => ev.id === editingId ? { ...formData, id: editingId } : ev));
    } else {
      setEvents([...events, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Workshops & Events | ApporLeader</title>
        <meta name="description" content="Join our upcoming workshops, seminars, and competitions to learn, compete, and network." />
      </Helmet>
      {/* Header */}
      <section className="py-20 bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Workshops & <span className="text-btn">Events</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Join our upcoming sessions to learn, compete, and network.
          </motion.p>
          {isAdmin && (
            <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors">
              <Plus size={20} /> Add Event
            </button>
          )}
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Event' : 'Add Event'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white">
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date (e.g., Oct 15, 2026)</label>
                  <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time (e.g., 6:00 PM BST)</label>
                  <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <ImageUploadField
                  label="Event Image (optional)"
                  folder="workshops"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Registration Link (optional)</label>
                  <input type="text" value={formData.registrationLink || ''} onChange={e => setFormData({...formData, registrationLink: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white h-24" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Total Spots</label>
                  <input required type="number" value={formData.spots} onChange={e => setFormData({...formData, spots: parseInt(e.target.value) || 0})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Filled Spots</label>
                  <input required type="number" value={formData.filled} onChange={e => setFormData({...formData, filled: parseInt(e.target.value) || 0})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Theme Color</label>
                  <select value={formData.color} onChange={e => {
                    const color = e.target.value;
                    const bg = color.replace('border-', 'bg-') + '/10';
                    const text = color.replace('border-', 'text-');
                    setFormData({...formData, color, bg, text});
                  }} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white">
                    <option value="border-primary">Primary (Orange)</option>
                    <option value="border-secondary">Secondary (Purple)</option>
                    <option value="border-highlight">Highlight (Blue)</option>
                    <option value="border-btn">Button (Yellow)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20">Cancel</button>
              </div>
            </form>
          ) : null}

          <div className="space-y-8">
            {events.length > 0 ? (
              events.map((event, index) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl bg-[#050505] border-l-4 ${event.color} border-y border-r border-white/5 hover:border-white/20 transition-all relative overflow-hidden group`}
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button onClick={() => handleEdit(event)} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
                    </div>
                  )}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${event.bg} rounded-full blur-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Date Column */}
                  <div className="flex-shrink-0 md:w-48 flex flex-col justify-center items-start md:items-center md:border-r border-white/10 md:pr-6">
                    <span className={`text-sm font-bold uppercase tracking-wider ${event.text} mb-2`}>{event.category}</span>
                    <div className="text-3xl font-bold text-white mb-1">{event.date.split(' ')[1]?.replace(',', '') || event.date}</div>
                    <div className="text-gray-400 font-medium">{event.date.split(' ')[0]} {event.date.split(' ')[2]}</div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5"><Clock size={16} className={event.text} /> {event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} className={event.text} /> {event.location}</span>
                    </div>
                    
                    {event.image && (
                      <div className="mb-4 rounded-xl overflow-hidden h-48 w-full">
                        <img src={getDriveImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-gray-500" />
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${event.bg.replace('/10', '')}`} 
                            style={{ width: `${(event.filled / event.spots) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 font-medium">{event.filled}/{event.spots} spots</span>
                      </div>
                      
                      <button 
                        onClick={() => event.registrationLink ? window.open(event.registrationLink, '_blank') : alert('Registration link coming soon!')}
                        className={`px-6 py-2 rounded-full font-bold text-black ${event.bg.replace('/10', '')} transition-transform hover:scale-105 flex items-center gap-2`}
                      >
                        Register Now <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No upcoming workshops or events at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
