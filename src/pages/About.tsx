import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Award, Globe, Github, Linkedin, Plus, Edit2, Trash2, Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getDriveImageUrl } from '../utils/drive';
import { Helmet } from 'react-helmet-async';

const values = [
  {
    title: 'Innovation',
    description: 'We constantly push boundaries, exploring new frontiers in AI, logic, and business strategy.',
    icon: Zap,
    color: 'text-primary',
  },
  {
    title: 'Community',
    description: 'A strong, supportive network of like-minded individuals striving for excellence together.',
    icon: Users,
    color: 'text-secondary',
  },
  {
    title: 'Excellence',
    description: 'We demand the best from ourselves and provide top-tier resources to our members.',
    icon: Award,
    color: 'text-highlight',
  },
];

export default function About() {
  const { isAdmin, leadershipTeam, setLeadershipTeam } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const member = leadershipTeam.find(m => m.id === id);
    if (member?.isPermanent) {
      alert('President and Vice President records cannot be deleted. You can mark them as "Ex" instead.');
      return;
    }
    if (member?.isEx) {
      alert('Ex-members cannot be deleted from the records.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this leader?')) {
      setLeadershipTeam(leadershipTeam.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPresidentOrVP = formData.role.toLowerCase().includes('president') || formData.role.toLowerCase().includes('vice president');
    
    if (editingId) {
      const existingMember = leadershipTeam.find(m => m.id === editingId);
      const permanent = existingMember?.isPermanent || isPresidentOrVP;
      setLeadershipTeam(leadershipTeam.map(m => m.id === editingId ? { ...formData, id: editingId, isPermanent: permanent } : m));
    } else {
      setLeadershipTeam([...leadershipTeam, { ...formData, id: Date.now().toString(), isPermanent: isPresidentOrVP }]);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-[#0a0a0a]">
      <Helmet>
        <title>About Us | ApporLeader</title>
        <meta name="description" content="Learn about ApporLeader, our mission, vision, and the leadership team driving our community." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            About <span className="text-primary">ApporLeader</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            ApporLeader is dedicated to fostering skills in logic, AI, business, and more through interactive learning and competitions.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                We believe that the future belongs to those who can decode complex logic, harness the power of artificial intelligence, and apply strategic thinking to real-world challenges.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                ApporLeader was founded to bridge the gap between theoretical knowledge and practical application, providing a platform where ambitious minds can collaborate, compete, and grow.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-highlight/20 rounded-2xl flex items-center justify-center mb-8">
                <Zap size={32} className="text-highlight" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                To be the premier global community where future leaders are forged through the mastery of logic, AI, and strategic business thinking.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                We envision a world where our members are at the forefront of innovation, driving positive change and solving the most complex problems of tomorrow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">The principles that guide our community and shape our initiatives.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-[#050505] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6`}>
                  <value.icon size={28} className={value.color} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Leadership Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">Meet the minds behind ApporLeader.</p>
            {isAdmin && (
              <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors">
                <Plus size={20} /> Add Leader
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-2xl border border-white/10 mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Leader' : 'Add Leader'}</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 justify-center max-w-3xl mx-auto">
            {[...leadershipTeam].sort((a, b) => {
              const getRank = (member: any) => {
                const role = member.role.toLowerCase();
                const isEx = member.isEx;
                
                if (role.includes('founder')) return 1;
                if (role.includes('president') && !role.includes('vice') && !isEx) return 2;
                if (role.includes('president') && !role.includes('vice') && isEx) return 3;
                if (role.includes('vice president') && !isEx) return 4;
                if (role.includes('vice president') && isEx) return 5;
                if (isEx) return 7;
                return 6;
              };

              return getRank(a) - getRank(b);
            }).map((member, index) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={() => handleEdit(member)} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                    {!member.isPermanent && !member.isEx && (
                      <button onClick={() => handleDelete(member.id)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
                    )}
                  </div>
                )}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-white/10 relative">
                  <img 
                    src={getDriveImageUrl(member.image)} 
                    alt={member.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex gap-4">
                      {member.website && (
                        <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Globe size={20} />
                        </a>
                      )}
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Linkedin size={20} />
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Twitter size={20} />
                        </a>
                      )}
                      {member.facebook && (
                        <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Facebook size={20} />
                        </a>
                      )}
                      {member.instagram && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                          <Instagram size={20} />
                        </a>
                      )}
                      {member.gmail && (
                        <a href={`mailto:${member.gmail}`} className="text-white hover:text-primary transition-colors">
                          <Mail size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name} {member.isEx && <span className="text-gray-500 text-sm ml-2">(EX)</span>}
                </h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
