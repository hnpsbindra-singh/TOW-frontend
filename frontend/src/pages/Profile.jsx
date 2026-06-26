import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { User, Upload, Save, RefreshCw } from 'lucide-react';
import { profileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', number: '', vehicleNumber: '', recoveryKey: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        number: user.number || '',
        vehicleNumber: user.vehicleNumber || '',
        recoveryKey: user.recoveryKey || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update(form);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await profileApi.uploadProof(file);
      await refreshUser();
      toast.success('Proof uploaded! Awaiting admin verification.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const statusColors = { PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger' };
  const roleColors   = { STUDENT: 'badge-purple', DRIVER: 'badge-cyan', ADMIN: 'badge-orange' };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account and verification status</p>
        </div>
      </div>

      <div className="page-body grid-2">
        {/* Left — Info */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--primary),var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: 'var(--shadow-glow)', flexShrink: 0
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{user?.username}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className={`badge ${roleColors[user?.role] || 'badge-muted'}`}>{user?.role}</span>
                {user?.verified
                  ? <span className="badge badge-success">Verified</span>
                  : <span className="badge badge-warning">Unverified</span>}
                <span className={`badge ${statusColors[user?.progress] || 'badge-muted'}`}>
                  {user?.progress}
                </span>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div>
            {[
              { label: 'Roll Number', value: user?.rollNumber },
              { label: 'Phone', value: user?.number },
              { label: 'Vehicle Number', value: user?.vehicleNumber || '—' },
              { label: 'Recovery Key', value: user?.recoveryKey || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="detail-row">
                <span className="detail-key">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Upload Proof */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Student Proof Document
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              {user?.proofName
                ? `Uploaded: ${user.proofName}`
                : 'No document uploaded yet. Upload to get verified.'}
            </p>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileUpload} id="proof-file-input" />
            <button className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()} disabled={uploading} id="upload-proof-btn">
              {uploading ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Uploading…</> : <><Upload size={14} /> Upload Proof</>}
            </button>
          </div>
        </div>

        {/* Right — Edit Form */}
        <div className="card">
          <div className="section-title"><User size={18} /> Edit Profile</div>
          <form onSubmit={handleSave} id="profile-form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="profile-name" name="name" type="text" className="form-input"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input id="profile-number" name="number" type="tel" className="form-input"
                value={form.number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Recovery Key</label>
              <input id="profile-recovery" name="recoveryKey" type="text" className="form-input"
                placeholder="Min 8 characters" value={form.recoveryKey} onChange={handleChange} required minLength={8} maxLength={15} />
            </div>
            {user?.role === 'DRIVER' && (
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input id="profile-vehicle" name="vehicleNumber" type="text" className="form-input"
                  placeholder="PB-10-AB-1234" value={form.vehicleNumber} onChange={handleChange} />
              </div>
            )}
            <button id="profile-save" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
