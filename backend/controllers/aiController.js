const { generateTripPlanPrompt, generateChatPrompt } = require('../utils/aiPrompts');

/**
 * @desc    Generate AI trip plan
 * @route   POST /api/ai/trip-planner
 */
exports.generateTripPlan = async (req, res) => {
  try {
    const { destination, budget, days, travelType } = req.body;

    if (!destination || !budget || !days || !travelType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Return mock data if no API key
      const mockPlan = generateMockTripPlan(destination, budget, days, travelType);
      return res.json({ success: true, data: mockPlan });
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = generateTripPlanPrompt({ destination, budget, days, travelType });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a travel planning expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    let planData;
    try {
      planData = JSON.parse(completion.choices[0].message.content);
    } catch (parseErr) {
      planData = generateMockTripPlan(destination, budget, days, travelType);
    }

    res.json({ success: true, data: planData });
  } catch (error) {
    console.error('AI Trip Planner Error:', error);
    // Fallback to mock data
    const mockPlan = generateMockTripPlan(req.body.destination, req.body.budget, req.body.days, req.body.travelType);
    res.json({ success: true, data: mockPlan });
  }
};

/**
 * @desc    AI Chatbot
 * @route   POST /api/ai/chat
 */
exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      const mockResponse = generateMockChatResponse(message);
      return res.json({ success: true, data: { response: mockResponse } });
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = generateChatPrompt(message, history);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      success: true,
      data: { response: completion.choices[0].message.content }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    const mockResponse = generateMockChatResponse(req.body.message);
    res.json({ success: true, data: { response: mockResponse } });
  }
};

// Mock trip plan generator (fallback)
function generateMockTripPlan(destination, budget, days, travelType) {
  const budgetNum = parseInt(budget);
  const daysNum = parseInt(days);

  const activities = {
    'Goa': ['Beach hopping', 'Water sports', 'Visit Fort Aguada', 'Explore Old Goa churches', 'Nightlife at Baga'],
    'Jaipur': ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Nahargarh Fort', 'Local bazaar shopping'],
    'Manali': ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'River rafting', 'Mall Road shopping'],
    'Kerala': ['Backwater cruise', 'Tea gardens', 'Kathakali show', 'Ayurvedic spa', 'Beach visit'],
    'default': ['Local sightseeing', 'Cultural exploration', 'Food tour', 'Adventure activities', 'Shopping']
  };

  const destActivities = activities[destination] || activities['default'];

  const itinerary = Array.from({ length: daysNum }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}: ${destActivities[i % destActivities.length]}`,
    description: `Explore ${destination} - ${destActivities[i % destActivities.length]}. Enjoy the local culture and scenery.`,
    activities: [destActivities[i % destActivities.length], destActivities[(i + 1) % destActivities.length]],
    meals: {
      breakfast: 'Local breakfast at hotel',
      lunch: 'Traditional cuisine at local restaurant',
      dinner: 'Multi-cuisine dinner'
    }
  }));

  return {
    overview: `A wonderful ${daysNum}-day ${travelType} trip to ${destination} within a budget of ₹${budgetNum.toLocaleString()}.`,
    dayWiseItinerary: itinerary,
    suggestedHotels: [
      { name: `${destination} Grand Hotel`, priceRange: `₹${Math.floor(budgetNum * 0.15)}-${Math.floor(budgetNum * 0.25)}/night`, rating: 4.5, reason: 'Great location and amenities' },
      { name: `${destination} Budget Inn`, priceRange: `₹${Math.floor(budgetNum * 0.08)}-${Math.floor(budgetNum * 0.12)}/night`, rating: 4.0, reason: 'Value for money' }
    ],
    restaurants: [
      { name: 'Spice Garden', cuisine: 'Local', mustTry: 'Special Thali', priceRange: '₹300-500' },
      { name: 'The Ocean View', cuisine: 'Multi-cuisine', mustTry: 'Seafood Platter', priceRange: '₹500-800' },
      { name: 'Street Food Corner', cuisine: 'Street Food', mustTry: 'Local Snacks', priceRange: '₹100-200' }
    ],
    touristAttractions: destActivities.map(a => ({
      name: a, type: 'Attraction', entryFee: '₹50-200', timeNeeded: '2-3 hours'
    })),
    estimatedExpenses: {
      accommodation: `₹${Math.floor(budgetNum * 0.35)}`,
      food: `₹${Math.floor(budgetNum * 0.25)}`,
      transport: `₹${Math.floor(budgetNum * 0.2)}`,
      activities: `₹${Math.floor(budgetNum * 0.12)}`,
      shopping: `₹${Math.floor(budgetNum * 0.08)}`,
      total: `₹${budgetNum}`
    },
    travelTips: [
      'Carry sunscreen and hats for outdoor activities',
      'Book accommodations in advance during peak season',
      'Try local street food for authentic experience',
      'Keep some cash handy for small vendors',
      `Best time to visit ${destination} is October to March`
    ],
    bestRoute: `Start from city center, explore nearby attractions first, then venture to outskirts on later days.`
  };
}

// Mock chat response (fallback)
function generateMockChatResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('budget') || msg.includes('cost')) {
    return 'For budget travel in India, plan around ₹2,000-5,000 per day including accommodation, food, and transport. Budget hotels range ₹800-2,000/night, local meals ₹200-500, and transport ₹200-500/day.';
  }
  if (msg.includes('best') && msg.includes('time') || msg.includes('when')) {
    return 'The best time to visit most Indian destinations is October to March (winter season). Hill stations are best visited in summer (April-June). Monsoon (July-September) is great for Kerala and Western Ghats.';
  }
  if (msg.includes('safe') || msg.includes('safety')) {
    return 'India is generally safe for tourists. Standard precautions: avoid isolated areas at night, keep valuables secure, use registered taxis/Uber, stay hydrated, and carry basic medicines.';
  }
  if (msg.includes('food') || msg.includes('eat') || msg.includes('restaurant')) {
    return 'Must-try Indian foods: Butter Chicken, Biryani, Dosa, Chaat, Thali. Always eat at busy restaurants (high turnover = fresh food). Street food is delicious but choose hygienic vendors.';
  }
  return `Great question! As a travel expert, I'd suggest researching ${message.includes('where') ? 'popular destinations on TravelEase' : 'our destinations and packages'}. You can use our AI Trip Planner for a customized itinerary, or browse our curated travel packages. Feel free to ask about specific destinations, budgets, or travel tips!`;
}
