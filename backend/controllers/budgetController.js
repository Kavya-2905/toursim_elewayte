const BudgetPlan = require('../models/BudgetPlan');

/**
 * @desc    Create budget plan
 * @route   POST /api/budget
 */
exports.createBudgetPlan = async (req, res) => {
  try {
    const { destination, totalBudget, travelers, days, breakdown } = req.body;

    const plan = await BudgetPlan.create({
      user: req.user._id,
      destination,
      totalBudget,
      travelers,
      days,
      breakdown
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user budget plans
 * @route   GET /api/budget
 */
exports.getBudgetPlans = async (req, res) => {
  try {
    const plans = await BudgetPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update budget plan
 * @route   PUT /api/budget/:id
 */
exports.updateBudgetPlan = async (req, res) => {
  try {
    const plan = await BudgetPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    Object.assign(plan, req.body);
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete budget plan
 * @route   DELETE /api/budget/:id
 */
exports.deleteBudgetPlan = async (req, res) => {
  try {
    const plan = await BudgetPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
