const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    type: {
      type: String,
      enum: ['Destination', 'Hotel', 'Package'],
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'items.type'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
