import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const emptyForm = {
  destinationName: '',
  travelDate: '',
  numberOfTravelers: 1,
  packageType: 'Silver',
  price: '',
  bookingStatus: 'Pending',
  contactAddress: ''
};

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/bookings', { headers });
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings');
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/bookings/${editId}`, form, { headers });
        setEditId(null);
      } else {
        await api.post('/api/bookings', form, { headers });
      }
      setForm(emptyForm);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving booking');
    }
  };

  const handleEdit = b => {
    setEditId(b._id);
    setForm({
      destinationName: b.destinationName,
      travelDate: b.travelDate?.slice(0, 10),
      numberOfTravelers: b.numberOfTravelers,
      packageType: b.packageType,
      price: b.price,
      bookingStatus: b.bookingStatus,
      contactAddress: b.contactAddress
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this booking?')) return;
    await api.delete(`/api/bookings/${id}`, { headers });
    fetchBookings();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const statusColor = s => s === 'Confirmed' ? 'green' : s === 'Cancelled' ? 'red' : 'orange';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>{editId ? 'Update Booking' : 'Add New Booking'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        <input name="destinationName" placeholder="Destination" value={form.destinationName} onChange={handleChange} required style={iS} />
        <input name="travelDate" type="date" value={form.travelDate} onChange={handleChange} required style={iS} />
        <input name="numberOfTravelers" type="number" min="1" placeholder="No. of Travelers" value={form.numberOfTravelers} onChange={handleChange} required style={iS} />
        <select name="packageType" value={form.packageType} onChange={handleChange} style={iS}>
          <option>Silver</option>
          <option>Gold</option>
          <option>Platinum</option>
        </select>
        <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required style={iS} />
        <select name="bookingStatus" value={form.bookingStatus} onChange={handleChange} style={iS}>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Cancelled</option>
        </select>
        <input name="contactAddress" placeholder="Contact Address" value={form.contactAddress} onChange={handleChange} required style={{ ...iS, gridColumn: 'span 2' }} />
        <button type="submit" style={{ gridColumn: 'span 2', padding: 10, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {editId ? 'Update Booking' : 'Add Booking'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
            style={{ gridColumn: 'span 2', padding: 10, background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Cancel Edit
          </button>
        )}
      </form>

      <h3>My Bookings</h3>
      {bookings.length === 0 ? <p>No bookings yet.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              {['Destination', 'Date', 'Travelers', 'Package', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={td}>{b.destinationName}</td>
                <td style={td}>{new Date(b.travelDate).toLocaleDateString()}</td>
                <td style={td}>{b.numberOfTravelers}</td>
                <td style={td}>{b.packageType}</td>
                <td style={td}>₹{b.price}</td>
                <td style={td}>
                  <span style={{ color: statusColor(b.bookingStatus), fontWeight: 600 }}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td style={td}>
                  <button onClick={() => handleEdit(b)} style={{ marginRight: 8, padding: '4px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(b._id)} style={{ padding: '4px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const iS = { padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' };
const td = { padding: '8px 12px' };
