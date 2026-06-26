import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/client';

export default function ResetPassword() {
  const [form, setForm] = useState({ username: '', recoveryKey: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetRequest(form);
      setDone(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Check your recovery key.');
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
        <h2 className="auth-title">Password Reset!</h2>
        <p className="auth-subtitle" style={{ marginBottom: 24 }}>
          Your password has been updated successfully.
        </p>
        <Link to="/login" className="btn btn-primary btn-full" id="reset-go-login">Back to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-glow one" />
      <div className="auth-bg-glow two" />

      <div className="auth-card animate-scale">
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

        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your recovery key to set a new password</p>

        <form className="auth-form" onSubmit={handleSubmit} id="reset-form">
          <div className="form-group">
            <label className="form-label">Email / Username</label>
            <input id="reset-username" name="username" type="text" className="form-input"
              placeholder="you@thapar.edu" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Recovery Key</label>
            <input id="reset-key" name="recoveryKey" type="text" className="form-input"
              placeholder="Your recovery key" value={form.recoveryKey} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input id="reset-newpw" name="newPassword" type="password" className="form-input"
              placeholder="Min 8 characters" value={form.newPassword} onChange={handleChange} required />
          </div>

          <button id="reset-submit" type="submit" className="btn btn-primary btn-lg btn-full" style={{ padding: '14px 28px', fontSize: 15 }} disabled={loading}>
            {loading
              ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 24 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--primary)' }}>
            <ArrowLeft size={13} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
