import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { History, MapPin, ArrowRight } from 'lucide-react';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentApi.completedHistory()
      .then((r) => setRides(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ride History</h1>
          <p className="page-subtitle">Your completed campus rides</p>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : rides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><History size={28} /></div>
            <div className="empty-state-title">No completed rides</div>
            <div className="empty-state-desc">Your completed ride history will appear here.</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/student/ride/${ride.id}`)} id={`history-row-${ride.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="route-dot pickup" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(ride.pickUp)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="route-dot drop" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(ride.drop)}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${RIDE_STATUS_COLORS[ride.status] || 'badge-muted'}`}>{ride.status}</span></td>
                    <td>{new Date(ride.createdAt).toLocaleDateString()}</td>
                    <td><ArrowRight size={14} style={{ color: 'var(--text-muted)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
