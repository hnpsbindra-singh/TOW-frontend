import { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import { formatLocation, RIDE_STATUS_COLORS } from '../../utils/constants';
import { Activity, Search } from 'lucide-react';

export default function AllRides() {
  const [rides, setRides] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllRides().then((r) => setRides(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = rides.filter((r) => {
    const matchStatus = filter === 'ALL' || r.status === filter;
    const matchQuery =
      !query ||
      formatLocation(r.pickUp).toLowerCase().includes(query.toLowerCase()) ||
      formatLocation(r.drop).toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  const STATUS_FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Rides</h1>
          <p className="page-subtitle">{rides.length} total rides in the system</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', maxWidth: 300 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input id="rides-search" className="form-input" placeholder="Search by location…"
              value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <div className="tabs">
            {STATUS_FILTERS.map((s) => (
              <button key={s} id={`filter-${s.toLowerCase()}`} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Activity size={28} /></div>
            <div className="empty-state-title">No rides found</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Status</th>
                  <th>Student ID</th>
                  <th>Driver ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.rideId || r.id} id={`ride-row-${r.rideId || r.id}`}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(r.pickUp)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatLocation(r.drop)}</td>
                    <td><span className={`badge ${RIDE_STATUS_COLORS[r.status] || 'badge-muted'}`}>{r.status}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{(r.studentId || r.userId)?.slice(0, 8)}…</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r.driverId ? `${r.driverId.slice(0, 8)}…` : '—'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
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
