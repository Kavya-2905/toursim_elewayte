import { useState } from 'react';
import api from '../services/api';
import { FaPlane, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaUsers, FaRobot, FaLightbulb, FaUtensils, FaHotel, FaCamera } from 'react-icons/fa';

const AITripPlanner = () => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: 3,
    travelType: 'solo',
    interests: ''
  });
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);

  const travelTypes = [
    { value: 'solo', label: 'Solo', icon: '🧑' },
    { value: 'couple', label: 'Couple', icon: '💑' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends', icon: '👫' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripPlan(null);
    try {
      const { data } = await api.post('/api/ai/trip-planner', formData);
      setTripPlan(data.data || data.plan);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl mb-4">
            <FaRobot className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">AI Trip Planner</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Let our AI-powered assistant create a personalized travel itinerary just for you. 
            Tell us your preferences and we'll plan the perfect trip!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6 sticky top-24">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                  Destination
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Where do you want to go?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaDollarSign className="inline mr-2 text-green-600" />
                  Budget (USD)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 1000"
                  min="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-blue-600" />
                  Number of Days
                </label>
                <input
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaUsers className="inline mr-2 text-purple-600" />
                  Travel Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {travelTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelType: type.value })}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        formData.travelType === type.value
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Interests (optional)
                </label>
                <textarea
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. history, food, adventure, photography..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FaPlane />
                <span>{loading ? 'Generating Plan...' : 'Generate Trip Plan'}</span>
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Creating Your Perfect Trip...</h3>
                <p className="text-gray-600 dark:text-gray-400">Our AI is crafting a personalized itinerary for you</p>
              </div>
            )}

            {!loading && !tripPlan && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <FaPlane className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Plan Your Trip?</h3>
                <p className="text-gray-600 dark:text-gray-400">Fill in the form and let our AI create your perfect travel itinerary</p>
              </div>
            )}

            {!loading && tripPlan && (
              <div className="space-y-6">
                {/* Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    🗺️ {tripPlan.overview?.title || `Trip to ${formData.destination}`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{tripPlan.overview?.description}</p>
                </div>

                {/* Day-wise Itinerary */}
                {(tripPlan.itinerary || tripPlan.dayWiseItinerary || []).map((day, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-primary-600 mb-4">
                      Day {day.day || index + 1}: {day.title || day.theme}
                    </h3>
                    <div className="space-y-3">
                      {(day.activities || []).map((activity, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-lg">{activity.icon || '📍'}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{activity.name || activity}</p>
                            {activity.time && <p className="text-sm text-gray-500">{activity.time}</p>}
                            {activity.description && <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {day.meals && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {day.meals.map((meal, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                            <FaUtensils className="mr-1" /> {meal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Hotel Suggestions */}
                {/* Hotel Suggestions */}
                {(tripPlan.hotels || tripPlan.suggestedHotels || []).length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      <FaHotel className="inline mr-2 text-blue-600" /> Hotel Suggestions
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(tripPlan.hotels || tripPlan.suggestedHotels || []).map((hotel, i) => (
                        <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="font-semibold text-gray-900 dark:text-white">{hotel.name}</p>
                          {hotel.priceRange && <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.priceRange}</p>}
                          {hotel.reason && <p className="text-sm text-gray-500 mt-1">{hotel.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restaurant Suggestions */}
                {tripPlan.restaurants && tripPlan.restaurants.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      <FaUtensils className="inline mr-2 text-orange-600" /> Restaurant Recommendations
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {tripPlan.restaurants.map((rest, i) => (
                        <div key={i} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="font-semibold text-gray-900 dark:text-white">{rest.name}</p>
                          {rest.cuisine && <p className="text-sm text-gray-600 dark:text-gray-400">{rest.cuisine}</p>}
                          {rest.mustTry && <p className="text-sm text-gray-500">Must try: {rest.mustTry}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget Breakdown */}
                {/* Budget Breakdown */}
                {(tripPlan.budgetBreakdown || tripPlan.estimatedExpenses) && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      <FaDollarSign className="inline mr-2 text-green-600" /> Budget Breakdown
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(tripPlan.budgetBreakdown || tripPlan.estimatedExpenses || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">${value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Tips */}
                {/* Travel Tips */}
                {(tripPlan.tips || tripPlan.travelTips || []).length > 0 && (
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">
                      <FaLightbulb className="inline mr-2" /> Travel Tips
                    </h3>
                    <ul className="space-y-2">
                      {(tripPlan.tips || tripPlan.travelTips || []).map((tip, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span>💡</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITripPlanner;
