import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaSearch, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => { fetchBookings(); }, [filter]);

  const fetchBookings = async () => {
    try { const { data } = await api.get('/api/bookings', { params: { status: filter !== 'all' ? filter : '', search } }); setBookings(data.bookings || []); }
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try { await api.patch(`/api/bookings/${id}/status`, { status }); toast.success(`Booking ${status}!`); fetchBookings(); }
    catch (error) { toast.error('Failed to update status'); }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={(e) => { e.preventDefault(); fetchBookings(); }} className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Search by booking ID..." />
          </form>
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === s ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Booking ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">No bookings found</td></tr>
            ) : bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">#{booking.bookingId}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{booking.user?.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{booking.type}</td>
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">${booking.totalAmount}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>{booking.status}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-1">
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Confirm"><FaCheck /></button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Cancel"><FaTimes /></button>
                      </>
                    )}
                    <button onClick={() => setSelectedBooking(booking)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="View"><FaEye /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Booking ID:</span><span className="font-medium text-gray-900 dark:text-white">#{selectedBooking.bookingId}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">User:</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.user?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Email:</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.user?.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Type:</span><span className="font-medium text-gray-900 dark:text-white capitalize">{selectedBooking.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Amount:</span><span className="font-medium text-gray-900 dark:text-white">${selectedBooking.totalAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Guests:</span><span className="font-medium text-gray-900 dark:text-white">{selectedBooking.guests}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Date:</span><span className="font-medium text-gray-900 dark:text-white">{new Date(selectedBooking.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Status:</span><span className={`text-xs px-2 py-1 rounded-full ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-700' : selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{selectedBooking.status}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
