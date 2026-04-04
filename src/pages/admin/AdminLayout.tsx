import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  Image,
  Calendar,
  BookOpen,
  Shield,
  Youtube,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const adminRoutes = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

const contentLinks = [
  { to: '/about', label: 'Leadership', icon: Shield, hint: 'Edit on site' },
  { to: '/members', label: 'Members', icon: Users, hint: 'Edit on site' },
  { to: '/gallery', label: 'Gallery & Videos', icon: Image, hint: 'Edit on site' },
  { to: '/workshops', label: 'Workshops', icon: Calendar, hint: 'Edit on site' },
  { to: '/blogs', label: 'Blogs', icon: BookOpen, hint: 'Edit on site' },
];

export default function AdminLayout() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <NavLink
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors mb-5"
        >
          <ExternalLink size={11} /> Back to site
        </NavLink>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield size={15} className="text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold leading-none mb-0.5">ApporLeader</p>
            <p className="text-sm font-bold text-white leading-none">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Admin pages */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-3 mb-1.5">Dashboard</p>
          <div className="space-y-0.5">
            {adminRoutes.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(255,95,0,0.05)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Content pages */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-3 mb-1.5">Content</p>
          <div className="space-y-0.5">
            {contentLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all group"
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-50 transition-opacity" />
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] flex text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-white/5 bg-[#070707] flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#070707] border-r border-white/5 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#070707]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-white">Admin Panel</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-auto p-5 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
