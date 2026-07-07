import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiDownload, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => { fetchBooking(); }, [id]);
  const fetchBooking = async () => {
    try { const { data } = await api.get(`/api/bookings/${id}`); setBooking(data.data); } catch (e) { toast.error('Failed to load booking'); }
  };

  const downloadPDF = () => {
    const content = document.getElementById('booking-receipt');
    if (!content) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`<html><head><title>Booking Confirmation</title><style>body{font-family:Arial,sans-serif;padding:40px}h1{color:#0ea5e9}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.item{padding:12px;background:#f8fafc;border-radius:8px}.label{font-size:12px;color:#64748b}.value{font-size:16px;font-weight:600}</style></head><body>`);
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!booking) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FiCheck className="text-green-500" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your booking has been successfully confirmed</p>
        </div>

        <div id="booking-receipt" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-primary-500">TravelEase</h2>
            <p className="text-sm text-gray-500 mt-1">Booking Confirmation</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500">Booking ID</p>
              <p className="font-bold text-gray-900 dark:text-white">{booking.bookingId}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-bold text-green-500 capitalize">{booking.status}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500 flex items-center gap-1"><FiUser size={12} /> Guest</p>
              <p className="font-medium text-gray-900 dark:text-white">{booking.contactName || booking.user?.name}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{booking.type}</p>
            </div>
            {booking.checkIn && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 flex items-center gap-1"><FiCalendar size={12} /> Check-in</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(booking.checkIn).toLocaleDateString()}</p>
              </div>
            )}
            {booking.checkOut && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 flex items-center gap-1"><FiCalendar size={12} /> Check-out</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
            )}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500">Guests</p>
              <p className="font-medium text-gray-900 dark:text-white">{booking.guests}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-bold text-primary-500 text-lg">₹{booking.totalAmount?.toLocaleString()}</p>
            </div>
          </div>

          {booking.referenceId && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
              <p className="text-xs text-gray-500 mb-1">Booked Item</p>
              <p className="font-semibold text-gray-900 dark:text-white">{booking.referenceId?.name || booking.referenceId?.title}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={downloadPDF} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              <FiDownload /> Download Ticket
            </button>
            <Link to="/booking-history" className="flex-1 flex items-center justify-center py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              View Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
