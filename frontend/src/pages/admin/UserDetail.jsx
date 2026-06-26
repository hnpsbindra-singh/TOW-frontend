import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../api/client';
import { ArrowLeft, Car, Shield, Trash2, ExternalLink } from 'lucide-react';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = () => {
    adminApi.getUser(userId).then((r) => setUser(r.data)).catch(() => {
      toast.error('User not found');
      navigate(-1);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [userId]);

  const act = async (action) => {
    setActionLoading(action);
    try {
      if (action === 'make-driver') await adminApi.makeDriver(userId);
      else if (action === 'make-admin') await adminApi.makeAdmin(userId);
      else if (action === 'approve') await adminApi.verifyUser(userId);
      else if (action === 'reject') await adminApi.rejectUser(userId);
      else if (action === 'delete') {
        if (!confirm('Permanently delete this user?')) { setActionLoading(null); return; }
        await adminApi.deleteUser(userId);
        toast.success('User deleted');
        navigate(-1);
        return;
      }
      toast.success('Action successful!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return null;

  const roleColor = { STUDENT: 'purple', DRIVER: 'cyan', ADMIN: 'orange' };
  const statusColor = { PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger' };

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} id="back-btn" style={{ marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="page-title">User Details</h1>
          <p className="page-subtitle">Manage this user's account and role</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className={`badge badge-${roleColor[user.role] || 'muted'}`}>{user.role}</span>
          {user.verified && <span className="badge badge-success">Verified</span>}
          <span className={`badge ${statusColor[user.progress] || 'badge-muted'}`}>{user.progress}</span>
        </div>
      </div>

      <div className="page-body grid-2">
        {/* Info */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--primary),var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, flexShrink: 0
            }}>
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.username}</div>
            </div>
          </div>

          <div className="divider" />

          {[
            { label: 'Phone', value: user.number },
            { label: 'Roll Number', value: user.rollNumber },
            { label: 'Vehicle', value: user.vehicleNumber || '—' },
            { label: 'Proof File', value: user.proofName || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="detail-row">
              <span className="detail-key">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}

          {user.proofName && (
            <a
              href={adminApi.getProof(userId)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              id={`view-proof-${userId}`}
            >
              <ExternalLink size={14} /> View Proof Document
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="section-title">Admin Actions</div>

          {user.progress === 'PENDING' && !user.verified && (
            <>
              <button id="approve-user-btn" className="btn btn-success" onClick={() => act('approve')} disabled={!!actionLoading}>
                {actionLoading === 'approve' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Approve Verification'}
              </button>
              <button id="reject-user-btn" className="btn btn-danger" onClick={() => act('reject')} disabled={!!actionLoading}>
                {actionLoading === 'reject' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Reject Verification'}
              </button>
              <div className="divider" />
            </>
          )}

          {user.role !== 'DRIVER' && (
            <button id="make-driver-btn" className="btn btn-accent" onClick={() => act('make-driver')} disabled={!!actionLoading}>
              {actionLoading === 'make-driver' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Car size={16} /> Promote to Driver</>}
            </button>
          )}

          {user.role !== 'ADMIN' && (
            <button id="make-admin-btn" className="btn btn-outline" onClick={() => act('make-admin')} disabled={!!actionLoading}>
              {actionLoading === 'make-admin' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Shield size={16} /> Promote to Admin</>}
            </button>
          )}

          <div className="divider" />

          <button id="delete-user-btn" className="btn btn-danger" onClick={() => act('delete')} disabled={!!actionLoading}>
            {actionLoading === 'delete' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Trash2 size={16} /> Delete Account</>}
          </button>
        </div>
      </div>
    </>
  );
}
