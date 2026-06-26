import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { Activity, MapPin, ArrowRight } from 'lucide-react';

export default function ActiveRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    driverApi.activeRides().then((r) => setRides(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Active Rides</h1>
          <p className="page-subtitle">Rides you have accepted and are in progress</p>
        </div>
      </div>
      <div className="page-body">
        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : rides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Activity size={28} /></div>
            <div className="empty-state-title">No active rides</div>
            <div className="empty-state-desc">Rides you accept will appear here.</div>
          </div>
        ) : (
          <div className="ride-cards-grid">
            {rides.map((ride) => (
              <div key={ride.rideId || ride.id} className="ride-card" onClick={() => navigate(`/driver/ride/${ride.rideId || ride.id}`, { state: { ride: { ...ride, status: 'ACCEPTED' } } })} id={`active-ride-${ride.rideId || ride.id}`}>
                <div className="ride-card-header">
                  <span className={`badge ${RIDE_STATUS_COLORS[ride.status] || 'badge-muted'}`}>{ride.status}</span>
                  <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
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
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
