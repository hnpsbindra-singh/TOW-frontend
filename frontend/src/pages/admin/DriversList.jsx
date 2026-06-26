import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Car, ArrowRight, Search } from 'lucide-react';

export default function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getDrivers().then((r) => setDrivers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = drivers.filter((d) =>
    d.name?.toLowerCase().includes(query.toLowerCase()) ||
    d.username?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Drivers</h1>
          <p className="page-subtitle">{drivers.length} registered drivers</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input id="driver-search" className="form-input" placeholder="Search drivers…"
            value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Car size={28} /></div>
            <div className="empty-state-title">No drivers found</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/user/${d.id}`)} id={`driver-row-${d.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,var(--accent-dark),var(--accent))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, flexShrink: 0
                        }}>
                          {d.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                      </div>
                    </td>
                    <td>{d.username}</td>
                    <td>{d.number}</td>
                    <td>{d.vehicleNumber || '—'}</td>
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
