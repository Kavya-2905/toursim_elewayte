const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  category: {
    type: String,
    enum: ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Spiritual', 'Wildlife', 'Island'],
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  budget: {
    type: Number,
    required: [true, 'Budget is required']
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
  bestSeason: {
    type: String,
    enum: ['Winter', 'Summer', 'Monsoon', 'All Year', 'Spring', 'Autumn'],
    default: 'All Year'
  },
  weather: {
    temperature: String,
    humidity: String,
    condition: String,
    icon: String
  },
  entryFee: {
    type: String,
    default: 'Free'
  },
  nearbyAttractions: [{
    name: String,
    distance: String,
    image: String
  }],
  restaurants: [{
    name: String,
    cuisine: String,
    rating: Number,
    image: String
  }],
  hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  coordinates: {
    lat: Number,
    lng: Number
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

// Add text index for search
destinationSchema.index({ name: 'text', description: 'text', state: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
