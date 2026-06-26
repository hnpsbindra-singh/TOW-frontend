import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Users, Car, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, drivers: 0, pending: 0, rides: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getStudents(),
      adminApi.getDrivers(),
      adminApi.getPendingVerifications(),
      adminApi.getAllRides(),
    ]).then(([s, d, p, r]) => {
      setStats({
        students: s.data?.length ?? 0,
        drivers: d.data?.length ?? 0,
        pending: p.data?.length ?? 0,
        rides: r.data?.length ?? 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: <Users size={22} />, color: 'purple', value: stats.students, label: 'Students', to: '/admin/students' },
    { icon: <Car size={22} />, color: 'cyan', value: stats.drivers, label: 'Drivers', to: '/admin/drivers' },
    { icon: <ShieldCheck size={22} />, color: 'orange', value: stats.pending, label: 'Pending Verifications', to: '/admin/verifications' },
    { icon: <Activity size={22} />, color: 'blue', value: stats.rides, label: 'Total Rides', to: '/admin/rides' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and management</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {loading ? (
          <div className="flex-center" style={{ padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            <div className="stats-grid">
              {cards.map((c) => (
                <div key={c.label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate(c.to)} id={`stat-${c.label.replace(/ /g, '-').toLowerCase()}`}>
                  <div className={`stat-icon ${c.color}`}>{c.icon}</div>
                  <div>
                    <div className="stat-value">{c.value}</div>
                    <div className="stat-label">{c.label}</div>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="section-title">Quick Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Review Verifications', icon: <ShieldCheck size={16} />, to: '/admin/verifications', cls: 'btn-primary' },
                  { label: 'Manage Students', icon: <Users size={16} />, to: '/admin/students', cls: 'btn-ghost' },
                  { label: 'Manage Drivers', icon: <Car size={16} />, to: '/admin/drivers', cls: 'btn-ghost' },
                  { label: 'View All Rides', icon: <Activity size={16} />, to: '/admin/rides', cls: 'btn-ghost' },
                ].map((a) => (
                  <button key={a.label} className={`btn ${a.cls}`} onClick={() => navigate(a.to)} id={`action-${a.label.replace(/ /g, '-').toLowerCase()}`}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
