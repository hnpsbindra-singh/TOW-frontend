import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/client';
import { MapPin, Car, Plus, ArrowRight } from 'lucide-react';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentApi.getAllRides()
      .then((r) => setRides([...r.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Rides</h1>
          <p className="page-subtitle">All your ride requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/book')} id="new-ride-btn">
          <Plus size={16} /> New Ride
        </button>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : rides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Car size={28} /></div>
            <div className="empty-state-title">No rides yet</div>
            <div className="empty-state-desc">Book your first campus ride to get started.</div>
            <button className="btn btn-primary mt-12" onClick={() => navigate('/student/book')} id="book-first-btn">
              <Plus size={16} /> Book a Ride
            </button>
          </div>
        ) : (
          <div className="ride-cards-grid">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="ride-card"
                onClick={() => navigate(`/student/ride/${ride.id}`)}
                id={`my-ride-${ride.id}`}
              >
                <div className="ride-card-header">
                  <span className={`badge ${RIDE_STATUS_COLORS[ride.status] || 'badge-muted'}`}>
                    {ride.status}
                  </span>
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
