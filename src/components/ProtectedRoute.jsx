import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="section-container py-24 text-center text-brand-gray">Loading Admin...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
