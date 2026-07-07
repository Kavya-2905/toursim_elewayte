import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaDollarSign, FaChartPie, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const BudgetPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    totalBudget: '',
    travelers: 1,
    days: 1,
    breakdown: {
      hotel: 0,
      transport: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      emergency: 0
    }
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/api/budget');
      setPlans(data.data || data.plans || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBudgetChange = (value) => {
    const budget = parseFloat(value) || 0;
    setFormData({
      ...formData,
      totalBudget: value,
      breakdown: {
        hotel: Math.round(budget * 0.3),
        transport: Math.round(budget * 0.2),
        food: Math.round(budget * 0.15),
        activities: Math.round(budget * 0.15),
        shopping: Math.round(budget * 0.1),
        emergency: Math.round(budget * 0.1)
      }
    });
  };

  const handleBreakdownChange = (category, value) => {
    const newBreakdown = { ...formData.breakdown, [category]: parseFloat(value) || 0 };
    setFormData({ ...formData, breakdown: newBreakdown });
  };

  const totalBreakdown = Object.values(formData.breakdown).reduce((a, b) => a + b, 0);
  const remaining = (parseFloat(formData.totalBudget) || 0) - totalBreakdown;

  const chartData = Object.entries(formData.breakdown)
    .filter(([, value]) => value > 0)
    .map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[index % COLORS.length]
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/budget', {
        destination: formData.destination,
        totalBudget: parseFloat(formData.totalBudget),
        travelers: parseInt(formData.travelers),
        days: parseInt(formData.days),
        breakdown: formData.breakdown
      });
      toast.success('Budget plan saved!');
      fetchPlans();
      setShowForm(false);
      setFormData({ destination: '', totalBudget: '', travelers: 1, days: 1, breakdown: { hotel: 0, transport: 0, food: 0, activities: 0, shopping: 0, emergency: 0 } });
    } catch (error) {
      toast.error('Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/budget/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const categories = [
    { key: 'hotel', label: 'Accommodation', icon: '🏨' },
    { key: 'transport', label: 'Transport', icon: '✈️' },
    { key: 'food', label: 'Food & Dining', icon: '🍽️' },
    { key: 'activities', label: 'Activities', icon: '🎯' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️' },
    { key: 'emergency', label: 'Emergency Fund', icon: '🏥' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Budget Planner</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Plan your travel budget wisely</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Plan</span>
          </button>
        </div>

        {/* New Plan Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Budget Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Budget ($)</label>
                  <input
                    type="number"
                    value={formData.totalBudget}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travelers</label>
                  <input
                    type="number"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Days</label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Breakdown</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.key} className="flex items-center space-x-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400">{cat.label}</label>
                        <input
                          type="number"
                          value={formData.breakdown[cat.key]}
                          onChange={(e) => handleBreakdownChange(cat.key, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Total Allocated: ${totalBreakdown.toLocaleString()}
                  </span>
                  <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remaining >= 0 ? 'Remaining' : 'Over'}: ${Math.abs(remaining).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : 'Save Budget Plan'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Saved Plans */}
        <div className="space-y-6">
          {plans.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <FaChartPie className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Budget Plans Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your first budget plan to start tracking expenses</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.destination}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {plan.travelers} traveler(s) · {plan.days} day(s)
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary-600">${plan.totalEstimated?.toLocaleString()}</span>
                    <button onClick={() => handleDelete(plan._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {plan.breakdown && Object.entries(plan.breakdown).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">${value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
