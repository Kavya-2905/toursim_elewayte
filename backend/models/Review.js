const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetModel: {
    type: String,
    enum: ['Destination', 'Hotel', 'Package'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent duplicate reviews
reviewSchema.index({ user: 1, targetModel: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
