const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hotel', 'package', 'trip'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  bookingId: {
    type: String,
    unique: true
  },
  checkIn: Date,
  checkOut: Date,
  tripDate: Date,
  guests: {
    type: Number,
    default: 1
  },
  rooms: {
    type: Number,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  cancellationReason: String,
  cancelledAt: Date
}, { timestamps: true });

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingId = `TE-${timestamp}-${random}`;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
