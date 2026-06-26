import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    const redirects = { STUDENT: '/student', DRIVER: '/driver', ADMIN: '/admin' };
    return <Navigate to={redirects[user.role] || '/login'} replace />;
  }

  // Verification Wall: If user is not verified and is a STUDENT, block access to all pages except Profile
  if (!user.verified && user.role === 'STUDENT' && location.pathname !== '/profile') {
    return (
      <div className="page-body flex-center" style={{ minHeight: 'calc(100vh - 160px)', padding: 24 }}>
        <div className="card text-center" style={{ maxWidth: 460, width: '100%', border: '2px solid rgba(245, 158, 11, 0.3)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="flex-center" style={{ marginBottom: 20 }}>
            <div className="stat-icon orange" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={32} />
            </div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Verification Required
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Please upload the verification proof in the profile tab and wait for admin to verify your account.
          </p>
          <Link to="/profile" className="btn btn-primary btn-full" id="wall-go-profile" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Go to Profile Tab <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

export function PublicRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (token && user) {
    const redirects = { STUDENT: '/student', DRIVER: '/driver', ADMIN: '/admin' };
    return <Navigate to={redirects[user.role] || '/student'} replace />;
  }

  return children;
}
