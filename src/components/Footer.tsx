import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm">
                <svg viewBox="0 0 400 400" className="w-full h-full text-white" fill="currentColor">
                  <polygon points="80,300 140,100 253,100 253,250 323,250 323,300 203,300 203,190 163,190 130,300" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white leading-tight">ApporLeader</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Decoding Logic, Mastering AI, Winning the Game. Fostering skills through interactive learning and competitions.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/apporleader/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/company/apporleader/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/workshops" className="text-gray-400 hover:text-primary text-sm transition-colors">Workshops</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-primary text-sm transition-colors">Magazines & Articles</Link></li>
              <li><Link to="/members" className="text-gray-400 hover:text-primary text-sm transition-colors">Membership</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-primary text-sm transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Segments */}
          <div>
            <h3 className="text-white font-semibold mb-6">Our Segments</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">AI Segment</li>
              <li className="text-gray-400 text-sm">Business Case Study Segment</li>
              <li className="text-gray-400 text-sm">Competition Segment</li>
              <li className="text-gray-400 text-sm">Abroad Segment</li>
              <li className="text-gray-400 text-sm">Article Segment</li>
              <li className="text-gray-400 text-sm">Magazine Segment</li>
              <li className="text-gray-400 text-sm">Chess Segment</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0" />
                <span className="text-gray-400 text-sm">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span className="text-gray-400 text-sm">apporleader@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <a href="https://chat.whatsapp.com/JdlG8D7neCtLwxXRXmoETc" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-primary transition-colors">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ApporLeader. All rights reserved. &nbsp;|&nbsp; Made by{' '}
            <a href="https://oxerfy.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Oxerfy</a>
            {' '}·{' '}
            <a href="https://kazishakib.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Kazi Shakib</a>
          </p>
          <div className="flex gap-6 items-center">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="text-gray-500 hover:text-white text-sm font-bold transition-colors ml-2"
            >
              !
            </button>
          </div>
        </div>
      </div>
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </footer>
  );
}