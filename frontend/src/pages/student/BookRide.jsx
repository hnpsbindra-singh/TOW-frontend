import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, ArrowRight, Car } from 'lucide-react';
import { studentApi } from '../../api/client';
import { LOCATIONS, formatLocation } from '../../utils/constants';

export default function BookRide() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ pickUp: '', drop: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.pickUp === form.drop) {
      toast.error('Pickup and drop cannot be the same!');
      return;
    }
    setLoading(true);
    try {
      const res = await studentApi.createRide(form);
      toast.success('Ride requested! A driver will accept soon.');
      navigate(`/student/ride/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book a Ride</h1>
          <p className="page-subtitle">Select your pickup and drop location on campus</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 520, width: '100%' }}>
          {/* Visual route illustration */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(100, 0, 0, 0.08), rgba(120, 113, 108, 0.05))',
            borderRadius: 12, padding: '20px', marginBottom: 28, border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(100, 0, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', border: '2px solid var(--primary)' }}>
                <MapPin size={20} style={{ color: 'var(--primary-light)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                {form.pickUp ? formatLocation(form.pickUp) : 'Pickup'}
              </div>
            </div>

            <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 2, position: 'relative' }}>
              <Car size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent)', background: 'var(--bg-card)', padding: 2 }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(120, 113, 108, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', border: '2px solid var(--accent)' }}>
                <MapPin size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                {form.drop ? formatLocation(form.drop) : 'Drop'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} id="book-ride-form" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <select id="pickup-select" name="pickUp" className="form-select" value={form.pickUp} onChange={handleChange} required>
                <option value="">Select pickup…</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{formatLocation(loc)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Drop Location</label>
              <select id="drop-select" name="drop" className="form-select" value={form.drop} onChange={handleChange} required>
                <option value="">Select drop…</option>
                {LOCATIONS.filter((loc) => loc !== form.pickUp).map((loc) => (
                  <option key={loc} value={loc}>{formatLocation(loc)}</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'rgba(100, 0, 0, 0.05)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              A verified campus driver will accept your request shortly. You'll see their details once accepted.
            </div>

            <button id="book-submit-btn" type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading
                ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                : <><Car size={17} /> Request Ride <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
