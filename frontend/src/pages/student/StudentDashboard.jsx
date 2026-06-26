import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Car, MapPin, Clock, Plus, ArrowRight, CheckCircle, Activity } from 'lucide-react';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getAllRides().then((r) => setRides(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pending   = rides.filter((r) => r.status === 'PENDING').length;
  const active    = rides.filter((r) => r.status === 'ACCEPTED').length;
  const completed = rides.filter((r) => r.status === 'COMPLETED').length;
  const recent    = [...rides].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="page-subtitle">
            {user?.verified ? 'Your account is verified. Ready to ride!' : 'Complete your profile & upload proof to start booking.'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/book')} id="dashboard-book-btn">
          <Plus size={16} /> Book a Ride
        </button>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={22} /></div>
            <div><div className="stat-value">{pending}</div><div className="stat-label">Pending Rides</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Activity size={22} /></div>
            <div><div className="stat-value">{active}</div><div className="stat-label">Active Rides</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle size={22} /></div>
            <div><div className="stat-value">{completed}</div><div className="stat-label">Completed</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><Car size={22} /></div>
            <div><div className="stat-value">{rides.length}</div><div className="stat-label">Total Rides</div></div>
          </div>
        </div>

        {/* Verification alert */}
        {!user?.verified && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--warning)', marginBottom: 2 }}>Account Not Verified</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Upload your student ID proof from Profile to get verified and book rides.
              </div>
            </div>
            <button className="btn btn-sm" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)', whiteSpace: 'nowrap' }}
              onClick={() => navigate('/profile')} id="verify-now-btn">
              Upload Proof <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Recent Rides */}
        <div>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ margin: 0 }}><Car size={18} /> Recent Rides</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/rides')} id="view-all-rides-btn">
              View All <ArrowRight size={13} />
            </button>
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: 40 }}><div className="spinner" /></div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Car size={28} /></div>
              <div className="empty-state-title">No rides yet</div>
              <div className="empty-state-desc">Book your first campus ride to get started.</div>
              <button className="btn btn-primary mt-12" onClick={() => navigate('/student/book')} id="first-ride-btn">
                <Plus size={16} /> Book Now
              </button>
            </div>
          ) : (
            <div className="ride-cards-grid">
              {recent.map((ride) => (
                <div key={ride.id} className="ride-card" onClick={() => navigate(`/student/ride/${ride.id}`)} id={`ride-card-${ride.id}`}>
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
                    <span>{new Date(ride.createdAt).toLocaleDateString()}</span>
                    <ArrowRight size={13} />
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
