import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // ✅ Login nahi kiya → Login page
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Admin-only route pe regular user aaya → User dashboard
  if (adminOnly && !user.isAdmin) return <Navigate to="/user/dashboard" replace />;

  // ✅ User route pe admin aaya → Admin dashboard
  if (!adminOnly && user.isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children;
}
