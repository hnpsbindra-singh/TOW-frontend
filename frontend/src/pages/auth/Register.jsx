import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Zap, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/client';

export default function Register() {
  const [form, setForm] = useState({
    name: '', username: '', password: '', number: '', rollNumber: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(form);
      setDone(true);
      toast.success('Account created! Please log in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="auth-wrapper">
      <div className="auth-bg-glow one" />
      <div className="auth-bg-glow two" />
      <div className="auth-card animate-scale" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: 16 }} />
        <h2 className="auth-title">You're in!</h2>
        <p className="auth-subtitle" style={{ marginBottom: 24 }}>
          Your account has been created. Upload your student proof from Profile to get verified.
        </p>
        <Link to="/login" className="btn btn-primary btn-full" id="go-login">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-glow one" />
      <div className="auth-bg-glow two" />

      <div className="auth-card animate-scale" style={{ maxWidth: 480 }}>
        <div className="auth-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={28} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>ThaparOnWheelz</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Campus e-rickshaw booking</p>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(140, 6, 35, 0.06)',
          color: 'var(--primary)',
          padding: '6px 14px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 24,
          border: '1px solid rgba(140, 6, 35, 0.15)'
        }}>
          <Zap size={11} style={{ fill: 'currentColor' }} /> Flat ₹10 per ride · Thapar University
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="reg-name" name="name" type="text" className="form-input"
                placeholder="Arjun Sharma" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input id="reg-number" name="number" type="tel" className="form-input"
                placeholder="9876543210" value={form.number} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email / Username</label>
            <input id="reg-username" name="username" type="email" className="form-input"
              placeholder="you@thapar.edu" value={form.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input id="reg-roll" name="rollNumber" type="text" className="form-input"
              placeholder="102203XXX" value={form.rollNumber} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={handleChange}
                style={{ paddingRight: 44 }}
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button id="register-submit" type="submit" className="btn btn-primary btn-lg btn-full" style={{ padding: '14px 28px', fontSize: 15 }} disabled={loading}>
            {loading
              ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
