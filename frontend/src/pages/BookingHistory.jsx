import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiXCircle, FiEye } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchBookings(); }, [filter]);
  const fetchBookings = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/api/bookings${params}`);
      setBookings(data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to cancel'); }
  };

  const statusColors = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info' };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Booking History</h1>
        <div className="flex gap-2 mb-6">
          {['', 'confirmed', 'pending', 'cancelled', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
        {loading ? <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div></div> :
        bookings.length === 0 ? <div className="text-center py-16"><p className="text-gray-500">No bookings found</p></div> :
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{b.bookingId}</span>
                    <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{b.type} - {b.referenceId?.name || b.referenceId?.title || 'N/A'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {b.checkIn && <span className="flex items-center gap-1"><FiCalendar size={14} /> {new Date(b.checkIn).toLocaleDateString()}</span>}
                    <span>Guests: {b.guests}</span>
                    <span className="font-semibold text-primary-500">₹{b.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/booking-confirmation/${b._id}`} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"><FiEye size={14} /> View</Link>
                  {b.status !== 'cancelled' && <button onClick={() => cancelBooking(b._id)} className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-1"><FiXCircle size={14} /> Cancel</button>}
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
