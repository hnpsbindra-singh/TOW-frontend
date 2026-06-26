import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatLocation } from '../../utils/constants';
import { Car, Clock, Activity, CheckCircle, ArrowRight } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    driverApi.pendingRides()
      .then((r) => setPending(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Driver Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}! Here are the pending rides.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/driver/active')} id="view-active-btn">
            <Activity size={15} /> Active Rides
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/driver/completed')} id="view-completed-btn">
            <CheckCircle size={15} /> Completed
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={22} /></div>
            <div><div className="stat-value">{pending.length}</div><div className="stat-label">Pending Requests</div></div>
          </div>
        </div>

        {/* Pending Rides */}
        <div>
          <div className="section-title"><Car size={18} /> Pending Ride Requests</div>

          {loading ? (
            <div className="flex-center" style={{ padding: 60 }}><div className="spinner" /></div>
          ) : pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Car size={28} /></div>
              <div className="empty-state-title">No pending requests</div>
              <div className="empty-state-desc">Check back shortly — new ride requests will appear here.</div>
            </div>
          ) : (
            <div className="ride-cards-grid">
              {pending.map((ride) => (
                <div
                  key={ride.rideId || ride.id}
                  className="ride-card"
                  onClick={() => navigate(`/driver/ride/${ride.rideId || ride.id}`, { state: { ride: { ...ride, status: 'PENDING' } } })}
                  id={`pending-ride-${ride.rideId || ride.id}`}
                >
                  <div className="ride-card-header">
                    <span className="badge badge-warning">PENDING</span>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div className="ride-route">
                    <div className="route-point">
                      <div className="route-dot pickup" />
                      <div>
                        <div className="route-label">Pickup</div>
                        <div className="route-value">{formatLocation(ride.pickUp)}</div>
                      </div>
                    </div>
                    <div className="route-point">
                      <div className="route-dot drop" />
                      <div>
                        <div className="route-label">Drop</div>
                        <div className="route-value">{formatLocation(ride.drop)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ride-card-footer">
                    <span>{new Date(ride.createdAt).toLocaleString()}</span>
                    <div className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>
                      View <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
