import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaSuitcaseRolling, FaHeart, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, wishlistRes] = await Promise.all([
        api.get('/api/bookings/my-bookings'),
        api.get('/api/wishlist')
      ]);
      setBookings(bookingsRes.data.bookings || []);
      setWishlistCount(wishlistRes.data.wishlist?.items?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const totalSpent = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    { label: 'Upcoming Trips', value: upcomingBookings.length, icon: FaSuitcaseRolling, color: 'from-blue-500 to-blue-600', link: '/booking-history' },
    { label: 'Wishlist Items', value: wishlistCount, icon: FaHeart, color: 'from-red-500 to-pink-600', link: '/wishlist' },
    { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: FaDollarSign, color: 'from-green-500 to-emerald-600', link: '/booking-history' },
    { label: 'Total Bookings', value: bookings.length, icon: FaCalendarAlt, color: 'from-purple-500 to-violet-600', link: '/booking-history' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Traveler'}!</h1>
          <p className="text-white/80">Here's an overview of your travel activities</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all group">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
              <Link to="/booking-history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</Link>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <FaSuitcaseRolling className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <Link key={booking._id} to={`/booking-confirmation/${booking._id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.type} Booking</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">#{booking.bookingId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">${booking.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/destinations" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-lg transition-all group text-center">
                <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 dark:text-white">Explore</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Destinations</p>
              </Link>
              <Link to="/hotels" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-lg transition-all group text-center">
                <FaClock className="text-3xl text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 dark:text-white">Find</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hotels</p>
              </Link>
              <Link to="/ai-trip-planner" className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:shadow-lg transition-all group text-center">
                <FaSuitcaseRolling className="text-3xl text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 dark:text-white">AI Trip</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Planner</p>
              </Link>
              <Link to="/budget-planner" className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl hover:shadow-lg transition-all group text-center">
                <FaDollarSign className="text-3xl text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 dark:text-white">Budget</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Planner</p>
              </Link>
            </div>

            {/* Upcoming Trips */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Upcoming Trips</h3>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No upcoming trips</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{booking.type}</p>
                      <p className="text-sm text-gray-500">
                        {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary-600">${booking.totalAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
