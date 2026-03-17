import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Members', path: '/members' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Workshops', path: '/workshops' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
              <svg viewBox="0 0 400 400" className="w-full h-full text-white" fill="currentColor">
                <polygon points="80,300 140,100 253,100 253,250 323,250 323,300 203,300 203,190 163,190 130,300" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">ApporLeader</span>
              <span className="text-[10px] text-gray-400 hidden sm:block">Decoding Logic, Mastering AI, Winning the Game.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <a
              href="https://forms.gle/Wtbyryj5fe7vgLy56"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-btn text-black font-bold rounded-full hover:scale-105 transition-transform text-sm"
            >
              Join Us
            </a>
          </div>

          {/* Mobile Toggle & Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="https://forms.gle/Wtbyryj5fe7vgLy56"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-btn text-black font-bold rounded-full hover:scale-105 transition-transform text-sm"
            >
              Join
            </a>
            <button
              className="p-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#0a0a0a] border-b border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium px-2 py-1 rounded-md transition-colors ${
                    location.pathname === link.path ? 'text-primary bg-white/5' : 'text-gray-300 hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
