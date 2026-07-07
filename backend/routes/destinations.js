const express = require('express');
const router = express.Router();
const {
  getDestinations, getDestination, createDestination,
  updateDestination, deleteDestination, getSearchSuggestions, getStates
} = require('../controllers/destinationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/search/suggestions', getSearchSuggestions);
router.get('/filters/states', getStates);
router.get('/', getDestinations);
router.get('/:id', getDestination);
router.post('/', protect, adminOnly, createDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

module.exports = router;
