import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter, Plus, Edit2, Trash2, Facebook, Instagram, Mail } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';

export default function Members() {
  const { isAdmin, members, setMembers, leadershipTeam, setLeadershipTeam } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState<'members' | 'leadership' | null>(null);
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
        setLeadershipTeam(leadershipTeam.filter(m => m.id !== member.id));
      }
    } else {
      if (window.confirm('Are you sure you want to delete this member?')) {
        setMembers(members.filter(m => m.id !== member.id));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isLeaderRole = formData.role.toLowerCase().includes('president') || formData.role.toLowerCase().includes('founder');
    
    if (editingId) {
      if (editingSource === 'leadership') {
        const existingMember = leadershipTeam.find(m => m.id === editingId);
        const permanent = existingMember?.isPermanent || false;
        setLeadershipTeam(leadershipTeam.map(m => m.id === editingId ? { ...formData, id: editingId, isPermanent: permanent } : m));
      } else {
        setMembers(members.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
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
    ...leadershipTeam.map(m => ({ ...m, _source: 'leadership' as const })),
    ...members.map(m => ({ ...m, _source: 'members' as const }))
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

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Helmet>
        <title>Members | ApporLeader</title>
        <meta name="description" content="Meet the talented members of the ApporLeader community." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
            <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors">
              <Plus size={20} /> Add Member
            </button>
          )}
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Member' : 'Add Member'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input required type="text" maxLength={100} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <input required type="text" maxLength={100} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <input required type="text" maxLength={1000} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                  <textarea required maxLength={5000} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white h-24" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Website URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Twitter URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.twitter || ''} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Facebook URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.facebook || ''} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Instagram URL (optional)</label>
                  <input type="text" maxLength={1000} value={formData.instagram || ''} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Gmail (optional)</label>
                  <input type="email" maxLength={1000} value={formData.gmail || ''} onChange={e => setFormData({...formData, gmail: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white" />
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
                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20">Cancel</button>
              </div>
            </form>
          ) : null}

          <div className="space-y-24">
            {categoryOrder.map(category => {
              const categoryMembers = groupedMembers[category];
              if (!categoryMembers || categoryMembers.length === 0) return null;

              const sortedMembers = sortMembers(categoryMembers);

              return (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedMembers.map((member, index) => (
                      <motion.div 
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group relative"
                      >
                        {isAdmin && (
                          <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button onClick={() => handleEdit(member)} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                            {!member.isPermanent && !member.isEx && (
                              <button onClick={() => handleDelete(member)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
                            )}
                          </div>
                        )}
                        <div className="aspect-square overflow-hidden relative">
                          <img 
                            src={getDriveImageUrl(member.image)} 
                            alt={member.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                            {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Twitter size={18} /></a>}
                            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Linkedin size={18} /></a>}
                            {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Github size={18} /></a>}
                            {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Facebook size={18} /></a>}
                            {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Instagram size={18} /></a>}
                            {member.gmail && <a href={`mailto:${member.gmail}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"><Mail size={18} /></a>}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                          <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                          <p className="text-gray-400 text-sm leading-relaxed">
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
      <section className="py-24 bg-[#050505] border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Want to join the club?</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Apply now to become part of our exclusive community and get access to all our resources, workshops, and events.
          </p>
          <a 
            href="https://forms.gle/Wtbyryj5fe7vgLy56"
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
