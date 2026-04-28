import { Link } from 'react-router-dom';
import { Monitor, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-20">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Monitor className="w-7 h-7 text-brand-cyan" /> DTECHNURSE
            </Link>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              Empowering nurses with the technology skills needed to revolutionize healthcare. Bridging the gap between clinical expertise and digital innovation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-brand-cyan transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-cyan transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-brand-cyan transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-cyan transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
            <div className="flex gap-4 text-gray-400">
              <a href="#" aria-label="Twitter" className="hover:text-brand-cyan transition-colors"><Twitter size={20} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-brand-cyan transition-colors"><Linkedin size={20} /></a>
              <a href="#" aria-label="GitHub" className="hover:text-brand-cyan transition-colors"><Github size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DTECHNURSE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
