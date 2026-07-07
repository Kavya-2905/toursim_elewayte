const express = require('express');
const router = express.Router();
const {
  createBudgetPlan, getBudgetPlans, updateBudgetPlan, deleteBudgetPlan
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBudgetPlan);
router.get('/', protect, getBudgetPlans);
router.put('/:id', protect, updateBudgetPlan);
router.delete('/:id', protect, deleteBudgetPlan);

module.exports = router;
