const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Price per night is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  rooms: {
    total: { type: Number, default: 20 },
    available: { type: Number, default: 20 }
  },
  roomTypes: [{
    type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'] },
    price: Number,
    capacity: Number
  }],
  coordinates: {
    lat: Number,
    lng: Number
  },
  availableFrom: Date,
  availableTo: Date,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

hotelSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
