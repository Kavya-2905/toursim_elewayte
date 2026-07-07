const express = require('express');
const router = express.Router();
const { generateTripPlan, chat } = require('../controllers/aiController');

router.post('/trip-planner', generateTripPlan);
router.post('/chat', chat);

module.exports = router;
