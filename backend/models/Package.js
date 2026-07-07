const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  activities: [String],
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String
  }
}, { _id: false });

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
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
    required: [true, 'Price is required']
  },
  originalPrice: {
    type: Number
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  durationDays: {
    type: Number,
    required: true
  },
  itinerary: [itineraryDaySchema],
  includedServices: [{
    type: String
  }],
  excludedServices: [{
    type: String
  }],
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
  type: {
    type: String,
    enum: ['Adventure', 'Honeymoon', 'Family', 'Budget', 'Luxury', 'Group', 'Solo'],
    required: true
  },
  maxGroupSize: {
    type: Number,
    default: 20
  },
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

packageSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
