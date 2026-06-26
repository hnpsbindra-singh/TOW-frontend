import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CompletedRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    driverApi.completedRides().then((r) => setRides(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Completed Rides</h1>
          <p className="page-subtitle">Your ride history</p>
        </div>
      </div>
      <div className="page-body">
        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : rides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CheckCircle size={28} /></div>
            <div className="empty-state-title">No completed rides</div>
            <div className="empty-state-desc">Completed ride history will appear here.</div>
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
                  <tr key={ride.rideId || ride.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/driver/ride/${ride.rideId || ride.id}`, { state: { ride: { ...ride, status: 'COMPLETED' } } })} id={`completed-row-${ride.rideId || ride.id}`}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(ride.pickUp)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(ride.drop)}</td>
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
