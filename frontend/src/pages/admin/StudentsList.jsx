import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Users, ArrowRight, Search } from 'lucide-react';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getStudents().then((r) => setStudents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(query.toLowerCase()) ||
    s.username?.toLowerCase().includes(query.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} registered students</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="student-search"
            className="form-input"
            placeholder="Search by name, email, roll…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 80 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={28} /></div>
            <div className="empty-state-title">No students found</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll Number</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/user/${s.id}`)} id={`student-row-${s.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, flexShrink: 0
                        }}>
                          {s.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                      </div>
                    </td>
                    <td>{s.username}</td>
                    <td>{s.rollNumber}</td>
                    <td>{s.verified ? <span className="badge badge-success">Verified</span> : <span className="badge badge-warning">Pending</span>}</td>
                    <td><span className={`badge ${s.progress === 'APPROVED' ? 'badge-success' : s.progress === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>{s.progress}</span></td>
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
