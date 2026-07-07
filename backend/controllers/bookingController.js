const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

/**
 * @desc    Create booking
 * @route   POST /api/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const { type, referenceId, checkIn, checkOut, tripDate, guests, rooms, specialRequests, contactName, contactEmail, contactPhone } = req.body;

    let totalAmount = 0;
    let reference = null;

    // Calculate total amount based on type
    if (type === 'hotel') {
      reference = await Hotel.findById(referenceId);
      if (!reference) return res.status(404).json({ success: false, message: 'Hotel not found' });
      if (reference.rooms.available < (rooms || 1)) {
        return res.status(400).json({ success: false, message: 'No rooms available' });
      }
      const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      totalAmount = reference.price * days * (rooms || 1);
    } else if (type === 'package') {
      reference = await Package.findById(referenceId);
      if (!reference) return res.status(404).json({ success: false, message: 'Package not found' });
      totalAmount = reference.price * (guests || 1);
    } else {
      totalAmount = req.body.totalAmount || 0;
    }

    const booking = await Booking.create({
      user: req.user._id,
      type,
      referenceId,
      checkIn,
      checkOut,
      tripDate,
      guests: guests || 1,
      rooms: rooms || 1,
      totalAmount,
      specialRequests,
      contactName: contactName || req.user.name,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    // Update hotel room availability
    if (type === 'hotel') {
      await Hotel.findByIdAndUpdate(referenceId, {
        $inc: { 'rooms.available': -(rooms || 1) }
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('referenceId');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user bookings
 * @route   GET /api/bookings
 */
exports.getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('referenceId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 */
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('referenceId');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Cancel booking
 * @route   DELETE /api/bookings/:id
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Restore hotel room availability
    if (booking.type === 'hotel') {
      await Hotel.findByIdAndUpdate(booking.referenceId, {
        $inc: { 'rooms.available': booking.rooms }
      });
    }

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/bookings/admin/all
 */
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('referenceId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
