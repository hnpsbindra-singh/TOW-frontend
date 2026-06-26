import { Link } from 'react-router-dom';
import { Car, Shield, Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={24} style={{ color: 'var(--primary)', fill: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.5px' }}>ThaparOnWheelz</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-glow one" />
        <div style={{ position: 'relative', zIndex: 1 }} className="animate-scale">
          <div className="hero-badge">
            <Zap size={12} /> Campus Ride Sharing Platform
          </div>
          <h1 className="hero-title">
            Your Campus.<br />
            <span className="gradient-text">Your Ride.</span>
          </h1>
          <p className="hero-desc">
            Book campus cabs instantly. Connect students with verified campus drivers
            for safe, reliable rides across the entire university.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-register">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" id="hero-login">
              Sign In
            </Link>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Campus Locations', value: '42+' },
              { label: 'Rides Completed', value: '1K+' },
              { label: 'Avg Wait Time', value: '<5 min' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary-light)' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-grid">
        {[
          {
            icon: <MapPin size={22} />,
            color: 'purple',
            title: 'Campus Coverage',
            desc: 'All hostels, departments, gates and common spots covered — 42+ locations across campus.',
          },
          {
            icon: <Shield size={22} />,
            color: 'cyan',
            title: 'Verified Drivers',
            desc: 'Every driver is verified by admin. Students can see driver details before boarding.',
          },
          {
            icon: <Clock size={22} />,
            color: 'green',
            title: 'Real-time Status',
            desc: 'Track your ride from pending → accepted → completed with live status updates.',
          },
          {
            icon: <Car size={22} />,
            color: 'orange',
            title: 'Easy Booking',
            desc: 'Select pickup and drop location, submit your request — a driver will accept shortly.',
          },
        ].map((f) => (
          <div key={f.title} className="feature-card animate-fade">
            <div className={`feature-icon stat-icon ${f.color}`}>{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <div style={{ padding: '24px 60px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2026 Thapar On Wheels. Built for TIET campus mobility.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Login</Link>
          <Link to="/register" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
