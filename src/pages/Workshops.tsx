import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/storage';
import { sortEventsForDisplay, isUpcomingEvent } from '../utils/eventSort';

export default function Workshops() {
  const { isAdmin, events, setEvents } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
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
    setOriginalImage('');
    setIsEditing(true);
  };

  const handleEdit = (event: any) => {
    setFormData({ ...event });
    setEditingId(event.id);
    setOriginalImage(event.image || '');
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
      if (originalImage && formData.image !== originalImage) {
        deleteImageFromStorage(originalImage);
      }
      setEvents(events.map(ev => ev.id === editingId ? { ...formData, id: editingId } : ev));
    } else {
      setEvents([...events, { ...formData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors";
  const sortedEvents = sortEventsForDisplay(events);

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Workshops & Events | ApporLeader</title>
        <meta name="description" content="Join ApporLeader's upcoming workshops, seminars, and competitions to learn AI, logic, and business strategy. Compete and network with a global community." />
        <link rel="canonical" href="https://apporleader.vercel.app/workshops" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ApporLeader" />
        <meta property="og:title" content="Workshops & Events | ApporLeader" />
        <meta property="og:description" content="Join ApporLeader's upcoming workshops, seminars, and competitions to learn, compete, and network." />
        <meta property="og:url" content="https://apporleader.vercel.app/workshops" />
        <meta property="og:image" content="https://apporleader.vercel.app/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Workshops & Events | ApporLeader" />
        <meta name="twitter:description" content="Join ApporLeader's upcoming workshops, seminars, and competitions to learn, compete, and network." />
        <meta name="twitter:image" content="https://apporleader.vercel.app/favicon.svg" />
      </Helmet>

      {/* Header */}
      <section className="py-20 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[10%] top-[20%] h-[250px] w-[250px] rounded-full bg-btn/10 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-btn/10 border border-btn/20 text-btn text-xs font-bold uppercase tracking-widest mb-6"
          >
            Events & Learning
          </motion.span>
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
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)]"
            >
              <Plus size={20} /> Add Event
            </motion.button>
          )}
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Event' : 'Add Event'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date (e.g., Oct 15, 2026) *</label>
                  <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} placeholder="Oct 15, 2026" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Time *</label>
                  <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputCls} placeholder="6:00 PM BST" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Location *</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputCls} placeholder="Online (Google Meet)" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Registration Link</label>
                  <input type="url" value={formData.registrationLink || ''} onChange={e => setFormData({...formData, registrationLink: e.target.value})} className={inputCls} placeholder="https://forms.gle/..." />
                </div>
                <ImageUploadField
                  label="Event Image (optional)"
                  folder="workshops"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description *</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputCls} h-24 resize-none`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Total Spots</label>
                  <input required type="number" value={formData.spots} onChange={e => setFormData({...formData, spots: parseInt(e.target.value) || 0})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Filled Spots</label>
                  <input required type="number" value={formData.filled} onChange={e => setFormData({...formData, filled: parseInt(e.target.value) || 0})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Theme Color</label>
                  <select value={formData.color} onChange={e => {
                    const color = e.target.value;
                    const bg = color.replace('border-', 'bg-') + '/10';
                    const text = color.replace('border-', 'text-');
                    setFormData({...formData, color, bg, text});
                  }} className={inputCls}>
                    <option value="border-primary">Primary (Orange)</option>
                    <option value="border-secondary">Secondary (Amber)</option>
                    <option value="border-highlight">Highlight (Yellow)</option>
                    <option value="border-btn">Button (Gold)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-7 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Event</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
              </div>
            </motion.form>
          )}

          <div className="space-y-6">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event, index) => {
                const upcoming = isUpcomingEvent(event.date);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl bg-[#050505] border-l-4 ${event.color} border-y border-r border-white/5 hover:border-white/15 transition-all relative overflow-hidden group ${!upcoming ? 'opacity-60 hover:opacity-100' : ''}`}
                  >
                    {/* Upcoming badge */}
                    {upcoming && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        {isAdmin && (
                          <>
                            <button onClick={() => handleEdit(event)} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                          </>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Upcoming</span>
                      </div>
                    )}
                    {!upcoming && isAdmin && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(event)} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(event.id)} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg"><Trash2 size={14} /></button>
                      </div>
                    )}
                    {!upcoming && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10">Past</span>
                      </div>
                    )}

                    <div className={`absolute top-0 right-0 w-32 h-32 ${event.bg} rounded-full blur-[60px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Date Column */}
                    <div className="flex-shrink-0 md:w-44 flex flex-col justify-center items-start md:items-center md:border-r border-white/10 md:pr-6">
                      <span className={`text-xs font-bold uppercase tracking-wider ${event.text} mb-2`}>{event.category}</span>
                      <div className="text-3xl font-bold text-white mb-0.5">{event.date.split(' ')[1]?.replace(',', '') || event.date}</div>
                      <div className="text-gray-400 font-medium text-sm">{event.date.split(' ')[0]} {event.date.split(' ')[2]}</div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-white mb-3 pr-24">{event.title}</h3>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={15} className={event.text} /> {event.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={15} className={event.text} /> {event.location}</span>
                      </div>

                      {event.image && (
                        <div className="mb-4 rounded-xl overflow-hidden h-44 w-full">
                          <img src={getDriveImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <p className="text-gray-400 leading-relaxed mb-5 text-sm">{event.description}</p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={15} className="text-gray-500" />
                          <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${event.bg.replace('/10', '')}`}
                              style={{ width: `${Math.min((event.filled / event.spots) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-500 font-medium text-xs">{event.filled}/{event.spots} spots</span>
                        </div>

                        <button
                          onClick={() => event.registrationLink ? window.open(event.registrationLink, '_blank') : alert('Registration link coming soon!')}
                          disabled={!upcoming}
                          className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
                            upcoming
                              ? `${event.bg.replace('/10', '')} text-black hover:scale-105 shadow-lg`
                              : 'bg-white/5 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {upcoming ? 'Register Now' : 'Closed'} {upcoming && <ArrowRight size={15} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
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
