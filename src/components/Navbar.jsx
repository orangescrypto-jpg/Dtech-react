import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-border">
      <div className="section-container flex justify-between items-center h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 text-brand-dark font-extrabold text-xl">
          <Monitor className="w-6 h-6 text-brand-cyan" />
          DTECHNURSE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path ? 'text-brand-blue' : 'text-brand-gray hover:text-brand-dark'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/blog" className="btn-primary text-sm">Get Started</Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-dark" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-border overflow-hidden"
          >
            <div className="section-container py-4 flex flex-col gap-4">
              {links.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-brand-gray hover:text-brand-dark font-medium">
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
