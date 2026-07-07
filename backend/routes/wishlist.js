const express = require('express');
const router = express.Router();
const {
  getWishlist, addToWishlist, removeFromWishlist, checkWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/check/:type/:referenceId', protect, checkWishlist);
router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:type/:referenceId', protect, removeFromWishlist);

module.exports = router;
