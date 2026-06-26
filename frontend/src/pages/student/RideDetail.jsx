import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { studentApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { ArrowLeft, MapPin, Car, CheckCircle, Trash2, Phone, User } from 'lucide-react';

export default function RideDetail() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    try {
      const r = await studentApi.getRide(rideId);
      setRide(r.data);
      if (r.data.driverName) {
        setDriver({
          name: r.data.driverName,
          number: r.data.driverNumber,
          vehicleNumber: r.data.vehicleNumber,
        });
      } else if (r.data.status === 'ACCEPTED') {
        const d = await studentApi.getDriver(rideId).catch(() => null);
        if (d) setDriver(d.data);
      }
    } catch {
      toast.error('Ride not found');
      navigate('/student/rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [rideId]);

  const handleCancel = async () => {
    if (!confirm('Cancel this ride?')) return;
    setActionLoading(true);
    try {
      await studentApi.cancelRide(rideId);
      toast.success('Ride cancelled');
      navigate('/student/rides');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      await studentApi.markComplete(rideId);
      toast.success('Ride marked as complete!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!ride) return null;

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} id="back-btn" style={{ marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="page-title">Ride Details</h1>
          <p className="page-subtitle">Ride ID: {ride.id}</p>
        </div>
        <span className={`badge ${RIDE_STATUS_COLORS[ride.status] || 'badge-muted'}`} style={{ fontSize: 14, padding: '6px 14px' }}>
          {ride.status}
        </span>
      </div>

      <div className="page-body grid-2">
        {/* Route Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-title"><MapPin size={18} /> Route</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 4 }}>
                <div className="route-dot pickup" style={{ width: 14, height: 14 }} />
                <div style={{ width: 2, height: 36, background: 'linear-gradient(var(--primary), var(--accent))' }} />
                <div className="route-dot drop" style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28 }}>
                <div>
                  <div className="route-label">Pickup</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{formatLocation(ride.pickUp)}</div>
                </div>
                <div>
                  <div className="route-label">Drop</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{formatLocation(ride.drop)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider" />
          <div className="detail-row">
            <span className="detail-key">Requested At</span>
            <span className="detail-value">{new Date(ride.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Driver + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Driver info */}
          {(ride.status === 'ACCEPTED' || ride.status === 'COMPLETED') && driver ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="section-title"><Car size={18} /> Your Driver</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--accent-dark),var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, flexShrink: 0
                }}>
                  {driver.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{driver.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{driver.vehicleNumber}</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-key"><Phone size={13} style={{ display: 'inline', marginRight: 4 }} />Phone</span>
                <span className="detail-value">{driver.number}</span>
              </div>
            </div>
          ) : ride.status === 'PENDING' ? (
            <div className="card" style={{ textAlign: 'center', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={40} style={{ color: 'var(--primary)', marginBottom: 12 }} />
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Looking for a driver…</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>A driver will accept your request shortly.</div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="section-title" style={{ marginBottom: 4 }}>Actions</div>

            {ride.status === 'ACCEPTED' && (
              <button id="complete-ride-btn" className="btn btn-success" onClick={handleComplete} disabled={actionLoading}>
                <CheckCircle size={16} /> Mark as Completed
              </button>
            )}

            {(ride.status === 'PENDING' || ride.status === 'ACCEPTED') && (
              <button id="cancel-ride-btn" className="btn btn-danger" onClick={handleCancel} disabled={actionLoading}>
                <Trash2 size={16} /> Cancel Ride
              </button>
            )}

            {ride.status === 'COMPLETED' && (
              <div className="empty-state" style={{ padding: 20 }}>
                <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                <div style={{ fontWeight: 700, color: 'var(--success)' }}>Ride Completed</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
