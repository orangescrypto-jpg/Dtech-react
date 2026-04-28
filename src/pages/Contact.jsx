import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const validate = () => {
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";
    if (!form.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = "Invalid email format";
    if (!form.message.trim()) tempErrors.message = "Message cannot be empty";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API call
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 4000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="section-container py-16 md:py-24 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
        <p className="text-brand-gray">Have a question or want to collaborate? Drop us a message.</p>
      </motion.div>

      {status === 'success' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} /> Message sent successfully!
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} /> Please fix the errors below.
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-brand-border">
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">Full Name</label>
          <input 
            type="text" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-brand-border'} focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">Email Address</label>
          <input 
            type="email" 
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-brand-border'} focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all`}
            placeholder="jane@hospital.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">Message</label>
          <textarea 
            rows="5" 
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-brand-border'} focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all resize-none`}
            placeholder="Tell us what's on your mind..."
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          <Send size={18} /> Send Message
        </button>
      </form>
    </div>
  );
}
