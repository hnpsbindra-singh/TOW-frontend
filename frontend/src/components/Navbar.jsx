import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Car, History, User, LogOut,
  Users, ShieldCheck, Activity, CheckCircle, MapPin, Menu, X, Zap
} from 'lucide-react';

const STUDENT_NAV = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/book', icon: MapPin, label: 'Book a Ride' },
  { to: '/student/rides', icon: Car, label: 'My Rides' },
  { to: '/student/history', icon: History, label: 'History' },
];

const DRIVER_NAV = [
  { to: '/driver', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/driver/active', icon: Activity, label: 'Active Rides' },
  { to: '/driver/completed', icon: CheckCircle, label: 'Completed' },
];

const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/drivers', icon: Car, label: 'Drivers' },
  { to: '/admin/verifications', icon: ShieldCheck, label: 'Verifications' },
  { to: '/admin/rides', icon: Activity, label: 'All Rides' },
];

const ROLE_NAV = { STUDENT: STUDENT_NAV, DRIVER: DRIVER_NAV, ADMIN: ADMIN_NAV };
const ROLE_LABEL = { STUDENT: 'Student', DRIVER: 'Driver', ADMIN: 'Admin' };
const ROLE_COLOR = { STUDENT: 'purple', DRIVER: 'info', ADMIN: 'warning' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  // Restrict navigation options if the user is unverified and is a STUDENT
  const navItems = (user?.role && (user.verified || user.role !== 'STUDENT')) ? (ROLE_NAV[user?.role] || []) : [];

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-main">
        {/* Left: Logo */}
        <div className="navbar-logo" onClick={() => navigate(user?.role ? `/${user.role.toLowerCase()}` : '/')}>
          <Zap size={24} style={{ color: 'var(--primary-light)', fill: 'var(--primary-light)', flexShrink: 0 }} />
          <div>
            <div className="navbar-logo-text">ThaparOnWheelz</div>
            <div className="navbar-logo-sub">Campus e-rickshaw booking</div>
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="navbar-desktop-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/student' || to === '/driver' || to === '/admin'}
              className={({ isActive }) => `navbar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) => `navbar-nav-item${isActive ? ' active' : ''}`}
          >
            <User size={16} />
            Profile
          </NavLink>
        </nav>

        {/* Right: Desktop Profile / Logout */}
        <div className="navbar-desktop-actions">
          <div className="navbar-profile-badge">
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#ffffff', 
              border: '1px solid rgba(255, 255, 255, 0.25)', flexShrink: 0
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="navbar-username">{user?.name || user?.username}</span>
              <span className={`badge badge-${ROLE_COLOR[user?.role] || 'muted'}`} style={{ fontSize: 9, padding: '1px 6px', marginTop: 1, color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)', background: 'rgba(255, 255, 255, 0.1)' }}>
                {ROLE_LABEL[user?.role] || user?.role}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile: Hamburger Button */}
        <button 
          className="navbar-mobile-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          id="navbar-toggle-btn"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-dropdown animate-fade">
          <nav className="navbar-mobile-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/student' || to === '/driver' || to === '/admin'}
                className={({ isActive }) => `navbar-nav-item${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              className={({ isActive }) => `navbar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <User size={16} />
              Profile
            </NavLink>
            
            <div className="navbar-mobile-divider" />
            
            <div className="navbar-mobile-profile">
              <div style={{ color: '#ffffff' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{user?.name || user?.username}</div>
                <div style={{ fontSize: 11, color: '#ffffff', marginTop: 2 }}>
                  Role: {ROLE_LABEL[user?.role] || user?.role}
                </div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
