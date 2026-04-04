import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter, Plus, Edit2, Trash2, Facebook, Instagram, Mail, Globe } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';
import ImageUploadField from '../components/ImageUploadField';
import { deleteImageFromStorage } from '../utils/storage';

export default function Members() {
  const { isAdmin, members, setMembers, leadershipTeam, setLeadershipTeam, siteSettings } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState<'members' | 'leadership' | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    bio: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    gmail: '',
    isEx: false
  });

  const handleAdd = () => {
    setFormData({ name: '', role: '', image: '', bio: '', website: '', github: '', linkedin: '', twitter: '', facebook: '', instagram: '', gmail: '', isEx: false });
    setEditingId(null);
    setOriginalImage('');
    setEditingSource('members');
    setIsEditing(true);
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name || '',
      role: member.role || '',
      image: member.image || '',
      bio: member.bio || '',
      website: member.website || '',
      github: member.github || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      facebook: member.facebook || '',
      instagram: member.instagram || '',
      gmail: member.gmail || '',
      isEx: member.isEx || false
    });
    setEditingId(member.id);
    setOriginalImage(member.image || '');
    setEditingSource(member._source);
    setIsEditing(true);
  };

  const handleDelete = (member: any) => {
    if (member.isEx) {
      alert('Ex-members cannot be deleted from the records.');
      return;
    }
    if (member._source === 'leadership') {
      if (member.isPermanent) {
        alert('President and Vice President records cannot be deleted. You can mark them as "Ex" instead.');
        return;
      }
      if (window.confirm('Are you sure you want to delete this leader?')) {
        if (member.image) deleteImageFromStorage(member.image);
        setLeadershipTeam(leadershipTeam.filter((m: any) => m.id !== member.id));
      }
    } else {
      if (window.confirm('Are you sure you want to delete this member?')) {
        if (member.image) deleteImageFromStorage(member.image);
        setMembers(members.filter((m: any) => m.id !== member.id));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isLeaderRole = formData.role.toLowerCase().includes('president') || formData.role.toLowerCase().includes('founder');

    if (editingId) {
      // Auto-delete old image if replaced
      if (originalImage && formData.image !== originalImage) {
        deleteImageFromStorage(originalImage);
      }
      if (editingSource === 'leadership') {
        const existingMember = leadershipTeam.find((m: any) => m.id === editingId);
        const permanent = (existingMember as any)?.isPermanent || false;
        setLeadershipTeam(leadershipTeam.map((m: any) => m.id === editingId ? { ...formData, id: editingId, isPermanent: permanent } : m));
      } else {
        setMembers(members.map((m: any) => m.id === editingId ? { ...formData, id: editingId } : m));
      }
    } else {
      if (isLeaderRole) {
        setLeadershipTeam([...leadershipTeam, { ...formData, id: Date.now().toString(), isPermanent: false }]);
      } else {
        setMembers([...members, { ...formData, id: Date.now().toString() }]);
      }
    }
    setIsEditing(false);
  };

  const allPeople = [
    ...leadershipTeam.map((m: any) => ({ ...m, _source: 'leadership' as const })),
    ...members.map((m: any) => ({ ...m, _source: 'members' as const }))
  ];

  const getCategory = (member: any) => {
    const role = member.role.toLowerCase();
    if (member.isEx) {
      if (role.includes('president') || role.includes('founder')) return 'Ex-Leadership';
      if (role.includes('mentor') || role.includes('representative')) return 'Ex-Mentors & Representatives';
      return 'Ex-Members';
    } else {
      if (role.includes('president') || role.includes('founder')) return 'Leadership';
      if (role.includes('mentor') || role.includes('representative')) return 'Mentors & Representatives';
      return 'Members';
    }
  };

  const groupedMembers = allPeople.reduce((acc, member) => {
    const category = getCategory(member);
    if (!acc[category]) acc[category] = [];
    acc[category].push(member);
    return acc;
  }, {} as Record<string, any[]>);

  const categoryOrder = [
    'Leadership',
    'Mentors & Representatives',
    'Members',
    'Ex-Leadership',
    'Ex-Mentors & Representatives',
    'Ex-Members'
  ];

  const sortMembers = (membersList: any[]) => {
    return [...membersList].sort((a, b) => {
      const aRole = a.role.toLowerCase();
      const bRole = b.role.toLowerCase();

      const getRank = (role: string) => {
        if (role.includes('founder')) return 1;
        if (role.includes('president') && !role.includes('vice')) return 2;
        if (role.includes('vice president')) return 3;
        if (role.includes('mentor')) return 4;
        if (role.includes('representative')) return 5;
        return 6;
      };

      return getRank(aRole) - getRank(bRole);
    });
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Members | ApporLeader</title>
        <meta name="description" content="Meet the talented members of the ApporLeader community." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-[#050505] border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[5%] top-[20%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-[5%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            The Community
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Meet Our <span className="text-primary">Leaders</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          >
            The visionaries driving ApporLeader forward.
          </motion.p>
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)]"
            >
              <Plus size={20} /> Add Member
            </motion.button>
          )}
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit / Add Form */}
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-16 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Member' : 'Add Member'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
                  <input required type="text" maxLength={100} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Role *</label>
                  <input required type="text" maxLength={100} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputCls} placeholder="e.g. Co-Founder & President" />
                </div>
                <ImageUploadField
                  label="Profile Image *"
                  folder="members"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  required
                />
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio *</label>
                  <textarea required maxLength={5000} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={`${inputCls} h-24 resize-none`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Website URL</label>
                  <input type="url" maxLength={1000} value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub URL</label>
                  <input type="url" maxLength={1000} value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} className={inputCls} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn URL</label>
                  <input type="url" maxLength={1000} value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={inputCls} placeholder="https://linkedin.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Twitter / X URL</label>
                  <input type="url" maxLength={1000} value={formData.twitter || ''} onChange={e => setFormData({...formData, twitter: e.target.value})} className={inputCls} placeholder="https://x.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Facebook URL</label>
                  <input type="url" maxLength={1000} value={formData.facebook || ''} onChange={e => setFormData({...formData, facebook: e.target.value})} className={inputCls} placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Instagram URL</label>
                  <input type="url" maxLength={1000} value={formData.instagram || ''} onChange={e => setFormData({...formData, instagram: e.target.value})} className={inputCls} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Gmail / Email</label>
                  <input type="email" maxLength={1000} value={formData.gmail || ''} onChange={e => setFormData({...formData, gmail: e.target.value})} className={inputCls} placeholder="person@gmail.com" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="isEx"
                    checked={formData.isEx || false}
                    onChange={e => setFormData({...formData, isEx: e.target.checked})}
                    className="w-5 h-5 rounded border-white/10 bg-[#0a0a0a] text-primary focus:ring-primary focus:ring-offset-[#050505]"
                  />
                  <label htmlFor="isEx" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Mark as Ex-Member (They have left the club)
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-7 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Member</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-7 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
              </div>
            </motion.form>
          )}

          <div className="space-y-24">
            {categoryOrder.map(category => {
              const categoryMembers = groupedMembers[category];
              if (!categoryMembers || categoryMembers.length === 0) return null;

              const sortedMembers = sortMembers(categoryMembers);
              const isExCategory = category.startsWith('Ex-');

              return (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-12">
                    <span className="w-8 h-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-bold text-white">{category}</h2>
                    <span className="text-sm text-gray-500 font-medium ml-auto">{sortedMembers.length} member{sortedMembers.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,95,0,0.08)] ${
                          isExCategory ? 'border-white/5 bg-[#050505] opacity-75 hover:opacity-100' : 'border-white/5 bg-[#050505]'
                        }`}
                      >
                        {isAdmin && (
                          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(member)} className="p-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 shadow-lg backdrop-blur-sm"><Edit2 size={15} /></button>
                            {!member.isPermanent && !member.isEx && (
                              <button onClick={() => handleDelete(member)} className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 shadow-lg backdrop-blur-sm"><Trash2 size={15} /></button>
                            )}
                          </div>
                        )}
                        {/* Role badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-primary border border-primary/20 uppercase tracking-wider">
                            {member.role.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>

                        {/* Image */}
                        <div className="aspect-square overflow-hidden relative">
                          <img
                            src={getDriveImageUrl(member.image)}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Overlay with socials */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end justify-center pb-5 gap-3">
                            {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Twitter size={16} /></a>}
                            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Linkedin size={16} /></a>}
                            {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Github size={16} /></a>}
                            {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Facebook size={16} /></a>}
                            {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Instagram size={16} /></a>}
                            {member.gmail && <a href={`mailto:${member.gmail}`} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Mail size={16} /></a>}
                            {member.website && <a href={member.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all duration-200 hover:scale-110"><Globe size={16} /></a>}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-primary transition-colors">{member.name}</h3>
                          <p className="text-primary text-xs font-semibold mb-3 uppercase tracking-wider">{member.role}</p>
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                            {member.bio}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#050505] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-btn/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Want to join the club?</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Apply now to become part of our exclusive community and get access to all our resources, workshops, and events.
          </p>
          <a
            href={siteSettings.membershipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-btn rounded-full text-lg transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,212,0,0.4)]"
          >
            Become a Member <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
