import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Helmet } from 'react-helmet-async';
import {
  Image, Calendar, BookOpen, Shield,
  Settings, ArrowUpRight, Youtube, Layers,
  ExternalLink, TrendingUp,
} from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌙' };
}

export default function AdminDashboard() {
  const { members, leadershipTeam, gallery, events, blogs, videos } = useAdmin();
  const greeting = getGreeting();

  const totalContent = leadershipTeam.length + gallery.length + events.length + blogs.length + videos.length;

  const stats = [
    {
      label: 'Leadership',
      value: leadershipTeam.length,
      to: '/about',
      icon: Shield,
      color: 'from-violet-500/20 to-violet-600/5',
      border: 'border-violet-500/20 hover:border-violet-500/40',
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      desc: 'About page',
    },
    {
      label: 'Gallery',
      value: gallery.length,
      to: '/gallery',
      icon: Image,
      color: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      desc: 'Photos & moments',
    },
    {
      label: 'Events',
      value: events.length,
      to: '/workshops',
      icon: Calendar,
      color: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      desc: 'Workshops & events',
    },
    {
      label: 'Blog Posts',
      value: blogs.length,
      to: '/blogs',
      icon: BookOpen,
      color: 'from-pink-500/20 to-pink-600/5',
      border: 'border-pink-500/20 hover:border-pink-500/40',
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10',
      desc: 'Articles',
    },
    {
      label: 'Class Videos',
      value: videos.length,
      to: '/gallery',
      icon: Youtube,
      color: 'from-red-500/20 to-red-600/5',
      border: 'border-red-500/20 hover:border-red-500/40',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10',
      desc: 'YouTube recordings',
    },
  ];

  const quickActions = [
    { label: 'Edit Leadership', to: '/about', icon: Shield, desc: 'Add or update team members' },
    { label: 'Update Gallery', to: '/gallery', icon: Image, desc: 'Upload photos & class videos' },
    { label: 'Add Workshop', to: '/workshops', icon: Calendar, desc: 'Create new event or session' },
    { label: 'Write Blog', to: '/blogs', icon: BookOpen, desc: 'Publish a new article' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>Admin Dashboard | ApporLeader</title>
      </Helmet>

      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-primary/10 via-[#0d0d0d] to-[#0d0d0d] p-7 md:p-9">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">{greeting.emoji} {greeting.text}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Control Room</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-md">
              Everything is running smoothly. Click any card to start editing content directly on the site.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                <Layers size={16} />
                <span className="text-2xl font-bold tabular-nums">{totalContent}</span>
              </div>
              <p className="text-xs text-gray-500">Total items</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <TrendingUp size={16} />
                <span className="text-2xl font-bold tabular-nums">{stats.length}</span>
              </div>
              <p className="text-xs text-gray-500">Sections</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to + s.label}
                to={s.to}
                className={`group relative rounded-2xl border bg-gradient-to-br ${s.color} ${s.border} p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${s.iconBg} ${s.iconColor}`}>
                    <Icon size={17} />
                  </div>
                  <ArrowUpRight size={14} className={`${s.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <p className="text-3xl font-bold text-white tabular-nums mb-1">{s.value}</p>
                <p className="text-sm font-semibold text-white/80">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to + a.label}
                to={a.to}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200"
              >
                <div className="p-2.5 rounded-xl bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{a.label}</p>
                  <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                </div>
                <ExternalLink size={13} className="ml-auto text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Site Settings Banner ── */}
      <Link
        to="/admin/settings"
        className="group flex items-center justify-between rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-transparent px-6 py-5 hover:border-primary/40 hover:from-primary/12 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Settings size={18} />
          </div>
          <div>
            <p className="font-semibold text-white">Site Settings</p>
            <p className="text-sm text-gray-400 mt-0.5">Membership URL, contact email, WhatsApp, social links</p>
          </div>
        </div>
        <ArrowUpRight size={18} className="text-primary shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </Link>

      {/* ── How it works note ── */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 flex gap-3">
        <div className="text-primary mt-0.5 shrink-0">💡</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-gray-300 font-medium">How to edit content:</span> Click any stat card or quick action — it opens the public page where you'll see <span className="text-primary font-medium">Add / Edit / Delete</span> buttons on each item. Changes save to the database instantly.
        </p>
      </div>
    </div>
  );
}
