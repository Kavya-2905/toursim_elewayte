const User = require('../models/User');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalDestinations,
      totalHotels,
      totalPackages,
      confirmedBookings,
      revenueData
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Destination.countDocuments({ status: 'active' }),
      Hotel.countDocuments({ status: 'active' }),
      Package.countDocuments({ status: 'active' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly bookings (last 12 months)
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Popular destinations
    const popularDestinations = await Booking.aggregate([
      { $match: { type: 'package' } },
      {
        $group: {
          _id: '$referenceId',
          bookings: { $sum: 1 }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('referenceId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Latest users
    const latestUsers = await User.find({ role: 'user' })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top rated destinations
    const topRatedDestinations = await Destination.find({ status: 'active' })
      .sort({ rating: -1 })
      .limit(5)
      .select('name state rating numReviews images');

    // Booking status breakdown
    const bookingStatusData = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // User growth (last 6 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        cards: {
          totalUsers,
          totalBookings,
          activePackages: totalPackages,
          totalRevenue: totalRevenue,
          totalDestinations,
          totalHotels,
          confirmedBookings
        },
        monthlyBookings,
        popularDestinations,
        recentBookings,
        latestUsers,
        topRatedDestinations,
        bookingStatusData,
        userGrowth
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/admin/users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle user active status (Admin)
 * @route   PUT /api/admin/users/:id/toggle
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
