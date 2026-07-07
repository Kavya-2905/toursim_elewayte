const Review = require('../models/Review');
const mongoose = require('mongoose');

/**
 * @desc    Get reviews for a target
 * @route   GET /api/reviews?targetModel=Destination&targetId=xxx
 */
exports.getReviews = async (req, res) => {
  try {
    const { targetModel, targetId, approved = 'true' } = req.query;
    let query = {};
    if (targetModel) query.targetModel = targetModel;
    if (targetId) query.targetId = targetId;
    query.approved = approved === 'true' ? true : { $in: [true, false] };

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create review
 * @route   POST /api/reviews
 */
exports.createReview = async (req, res) => {
  try {
    const { targetModel, targetId, rating, comment } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, targetModel, targetId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this' });
    }

    const review = await Review.create({
      user: req.user._id,
      targetModel,
      targetId,
      rating,
      comment
    });

    // Update target rating
    const Model = mongoose.model(targetModel);
    const reviews = await Review.find({ targetModel, targetId, approved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Model.findByIdAndUpdate(targetId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve review (Admin)
 * @route   PUT /api/reviews/:id/approve
 */
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews/admin/all
 */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
