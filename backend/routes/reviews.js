const express = require('express');
const router = express.Router();
const {
  getReviews, createReview, approveReview, deleteReview, getAllReviews
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/admin/all', protect, adminOnly, getAllReviews);
router.get('/', getReviews);
router.post('/', protect, createReview);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
