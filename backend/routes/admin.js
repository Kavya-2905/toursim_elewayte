const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;
