const mongoose = require('mongoose');

const budgetPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required']
  },
  totalBudget: {
    type: Number,
    required: [true, 'Total budget is required']
  },
  travelers: {
    type: Number,
    required: true,
    default: 1
  },
  days: {
    type: Number,
    required: true,
    default: 1
  },
  breakdown: {
    hotel: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    emergency: { type: Number, default: 0 }
  },
  totalEstimated: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate totals before saving
budgetPlanSchema.pre('save', function(next) {
  const b = this.breakdown;
  this.totalEstimated = b.hotel + b.transport + b.food + b.activities + b.shopping + b.emergency;
  this.remaining = this.totalBudget - this.totalEstimated;
});

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);
