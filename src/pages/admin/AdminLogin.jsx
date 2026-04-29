import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Monitor, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (user) return <Navigate to="/admin" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError("Invalid credentials. Access denied.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center gap-2 text-brand-dark font-extrabold text-2xl mb-2 justify-center">
          <Monitor className="w-7 h-7 text-brand-cyan" /> DTECHNURSE
        </div>
        <p className="text-center text-brand-gray text-sm mb-8">Admin Portal Access</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <LogIn size={18} /> Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

import { Navigate } from 'react-router-dom'; // Add this to top imports if not there
