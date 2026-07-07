import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { FaUsers, FaSuitcaseRolling, FaDollarSign, FaMapMarkerAlt, FaHotel, FaBoxOpen, FaEye, FaChartBar, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/admin/dashboard');
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: FaSuitcaseRolling, color: 'from-green-500 to-emerald-600', change: '+8%' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FaDollarSign, color: 'from-purple-500 to-violet-600', change: '+23%' },
    { label: 'Destinations', value: stats?.totalDestinations || 0, icon: FaMapMarkerAlt, color: 'from-orange-500 to-red-600', change: '+5%' },
    { label: 'Hotels', value: stats?.totalHotels || 0, icon: FaHotel, color: 'from-cyan-500 to-blue-600', change: '+3%' },
    { label: 'Packages', value: stats?.totalPackages || 0, icon: FaBoxOpen, color: 'from-pink-500 to-rose-600', change: '+7%' }
  ];

  const monthlyData = stats?.monthlyBookings || [
    { month: 'Jan', bookings: 12, revenue: 4800 },
    { month: 'Feb', bookings: 19, revenue: 7600 },
    { month: 'Mar', bookings: 25, revenue: 10000 },
    { month: 'Apr', bookings: 32, revenue: 12800 },
    { month: 'May', bookings: 28, revenue: 11200 },
    { month: 'Jun', bookings: 35, revenue: 14000 }
  ];

  const popularDestinations = stats?.popularDestinations || [
    { name: 'Goa', count: 45 },
    { name: 'Jaipur', count: 38 },
    { name: 'Manali', count: 32 },
    { name: 'Kerala', count: 28 },
    { name: 'Ladakh', count: 22 }
  ];

  const recentBookings = stats?.recentBookings || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/destinations" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">Manage Destinations</Link>
              <Link to="/admin/bookings" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">View Bookings</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="text-white text-lg" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <FaArrowUp className="mr-1 text-[10px]" /> {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaChartBar className="mr-2 text-primary-600" /> Monthly Bookings
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaDollarSign className="mr-2 text-green-600" /> Revenue Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Popular Destinations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Destinations</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={popularDestinations} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {popularDestinations.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-primary-600 text-sm hover:text-primary-700">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No recent bookings</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">#{booking.bookingId}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{booking.user?.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{booking.type}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${booking.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>{booking.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/destinations" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Destinations</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage all destinations</p>
            </div>
          </Link>
          <Link to="/admin/hotels" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FaHotel className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Hotels</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage all hotels</p>
            </div>
          </Link>
          <Link to="/admin/users" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FaUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Users</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage all users</p>
            </div>
          </Link>
          <Link to="/admin/reviews" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <FaEye className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reviews</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Moderate reviews</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
