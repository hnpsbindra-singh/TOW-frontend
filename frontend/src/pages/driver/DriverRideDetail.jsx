import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { driverApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { ArrowLeft, MapPin, CheckCircle, User } from 'lucide-react';

export default function DriverRideDetail() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [ride, setRide] = useState(() => location.state?.ride || null);
  const [loading, setLoading] = useState(!location.state?.ride);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    driverApi.getRide(rideId)
      .then((r) => {
        const apiStatus = location.state?.ride?.status || 'ACCEPTED';
        setRide({ ...r.data, status: apiStatus });
        setLoading(false);
      })
      .catch(() => {
        // If fetch fails (e.g. pending ride unauthorized), fallback to passed state if available
        if (location.state?.ride) {
          setLoading(false);
        } else {
          toast.error('Ride not found or access denied');
          navigate('/driver');
        }
      });
  }, [rideId, location.state]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await driverApi.acceptRide(rideId);
      setRide({ ...res.data, status: 'ACCEPTED' });
      toast.success('Ride accepted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept ride');
    } finally {
      setAccepting(false);
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
          <h1 className="page-title">Ride Request</h1>
          <p className="page-subtitle">Review and accept this ride</p>
        </div>
        <span className={`badge ${RIDE_STATUS_COLORS[ride.status] || 'badge-muted'}`} style={{ fontSize: 14, padding: '6px 14px' }}>
          {ride.status}
        </span>
      </div>

      <div className="page-body grid-2">
        {/* Route */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="section-title"><MapPin size={18} /> Route Details</div>
          <div style={{ display: 'flex', gap: 14 }}>
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
          <div className="divider" />
          <div className="detail-row">
            <span className="detail-key">Requested At</span>
            <span className="detail-value">{new Date(ride.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Student Info + Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ride.studentName && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="section-title"><User size={18} /> Student</div>
              <div className="detail-row">
                <span className="detail-key">Name</span>
                <span className="detail-value">{ride.studentName}</span>
              </div>
              {ride.mobileNumber && (
                <div className="detail-row">
                  <span className="detail-key">Phone</span>
                  <span className="detail-value">{ride.mobileNumber}</span>
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="section-title">Actions</div>
            {ride.status === 'PENDING' ? (
              <button id="accept-ride-btn" className="btn btn-success btn-lg" onClick={handleAccept} disabled={accepting}>
                {accepting
                  ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  : <><CheckCircle size={17} /> Accept Ride</>}
              </button>
            ) : (
              <div className="empty-state" style={{ padding: 20 }}>
                <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                  {ride.status === 'ACCEPTED' ? 'Ride Accepted' : 'Ride Completed'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
