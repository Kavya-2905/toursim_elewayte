const express = require('express');
const router = express.Router();
const {
  createBooking, getUserBookings, getBooking, cancelBooking, getAllBookings
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/admin/all', protect, adminOnly, getAllBookings);
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
