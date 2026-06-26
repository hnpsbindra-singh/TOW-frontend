import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../api/client';
import { ShieldCheck, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export default function Verifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  const load = () => {
    setLoading(true);
    adminApi.getPendingVerifications()
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const viewProof = async (userId) => {
    try {
      const res = await adminApi.getProofBlob(userId);
      const file = new Blob([res.data], { type: res.headers['content-type'] });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      toast.error('Could not load proof document');
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (userId, action) => {
    setProcessing((p) => ({ ...p, [userId]: action }));
    try {
      if (action === 'approve') await adminApi.verifyUser(userId);
      else await adminApi.rejectUser(userId);
      toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'}!`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing((p) => ({ ...p, [userId]: null }));
    }
  };

  const baseUrl = adminApi.getProof('');

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Verifications</h1>
          <p className="page-subtitle">Students awaiting proof review</p>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShieldCheck size={28} /></div>
            <div className="empty-state-title">All clear!</div>
            <div className="empty-state-desc">No pending verifications at the moment.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((u) => (
              <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }} id={`verify-card-${u.id}`}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, flexShrink: 0
                }}>
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>

                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.username} · {u.rollNumber}</div>
                </div>

                {/* Proof button */}
                <button
                  className="btn btn-ghost btn-sm"
                  id={`view-proof-${u.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    viewProof(u.id);
                  }}
                >
                  <ExternalLink size={14} /> View Proof
                </button>

                {/* Approve */}
                <button
                  id={`approve-${u.id}`}
                  className="btn btn-success btn-sm"
                  onClick={() => act(u.id, 'approve')}
                  disabled={!!processing[u.id]}
                >
                  {processing[u.id] === 'approve'
                    ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    : <><CheckCircle size={14} /> Approve</>}
                </button>

                {/* Reject */}
                <button
                  id={`reject-${u.id}`}
                  className="btn btn-danger btn-sm"
                  onClick={() => act(u.id, 'reject')}
                  disabled={!!processing[u.id]}
                >
                  {processing[u.id] === 'reject'
                    ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    : <><XCircle size={14} /> Reject</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
