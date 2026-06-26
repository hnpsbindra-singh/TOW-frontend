import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import { Download } from 'lucide-react';

// Auth pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';

// Shared
import Profile from './pages/Profile';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BookRide from './pages/student/BookRide';
import MyRides from './pages/student/MyRides';
import RideDetail from './pages/student/RideDetail';
import RideHistory from './pages/student/RideHistory';

// Driver pages
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverRideDetail from './pages/driver/DriverRideDetail';
import ActiveRides from './pages/driver/ActiveRides';
import CompletedRides from './pages/driver/CompletedRides';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsList from './pages/admin/StudentsList';
import DriversList from './pages/admin/DriversList';
import Verifications from './pages/admin/Verifications';
import AllRides from './pages/admin/AllRides';
import UserDetail from './pages/admin/UserDetail';

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      console.log('App installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid rgba(184, 52, 62, 0.15)',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />

        {showPrompt && (
          <div className="pwa-install-banner animate-fade">
            <div className="pwa-install-content">
              <div className="pwa-install-icon">
                <Download size={20} />
              </div>
              <div>
                <div className="pwa-install-title">Download ThaparOnWheelz</div>
                <div className="pwa-install-desc">Install the app for instant access and a better mobile experience.</div>
              </div>
            </div>
            <div className="pwa-install-actions">
              <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>Later</button>
              <button className="btn btn-primary btn-sm" onClick={handleInstall}>Install Now</button>
            </div>
          </div>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Protected App Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Shared */}
            <Route path="/profile" element={<Profile />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/book" element={<ProtectedRoute role="STUDENT"><BookRide /></ProtectedRoute>} />
            <Route path="/student/rides" element={<ProtectedRoute role="STUDENT"><MyRides /></ProtectedRoute>} />
            <Route path="/student/ride/:rideId" element={<ProtectedRoute role="STUDENT"><RideDetail /></ProtectedRoute>} />
            <Route path="/student/history" element={<ProtectedRoute role="STUDENT"><RideHistory /></ProtectedRoute>} />

            {/* Driver Routes */}
            <Route path="/driver" element={<ProtectedRoute role="DRIVER"><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/ride/:rideId" element={<ProtectedRoute role="DRIVER"><DriverRideDetail /></ProtectedRoute>} />
            <Route path="/driver/active" element={<ProtectedRoute role="DRIVER"><ActiveRides /></ProtectedRoute>} />
            <Route path="/driver/completed" element={<ProtectedRoute role="DRIVER"><CompletedRides /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><StudentsList /></ProtectedRoute>} />
            <Route path="/admin/drivers" element={<ProtectedRoute role="ADMIN"><DriversList /></ProtectedRoute>} />
            <Route path="/admin/verifications" element={<ProtectedRoute role="ADMIN"><Verifications /></ProtectedRoute>} />
            <Route path="/admin/rides" element={<ProtectedRoute role="ADMIN"><AllRides /></ProtectedRoute>} />
            <Route path="/admin/user/:userId" element={<ProtectedRoute role="ADMIN"><UserDetail /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
