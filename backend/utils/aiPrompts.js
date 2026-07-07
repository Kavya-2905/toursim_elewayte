/**
 * Structured prompts for OpenAI API
 */

const generateTripPlanPrompt = ({ destination, budget, days, travelType }) => {
  return `You are an expert travel planner. Create a detailed ${days}-day trip itinerary for ${destination}.

Travel Details:
- Destination: ${destination}
- Budget: ₹${budget}
- Duration: ${days} days
- Travel Type: ${travelType}

Please provide a JSON response with the following structure:
{
  "overview": "Brief overview of the trip",
  "dayWiseItinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Detailed description",
      "activities": ["Activity 1", "Activity 2"],
      "meals": { "breakfast": "suggestion", "lunch": "suggestion", "dinner": "suggestion" }
    }
  ],
  "suggestedHotels": [
    { "name": "Hotel name", "priceRange": "₹X-₹Y per night", "rating": 4.5, "reason": "Why recommended" }
  ],
  "restaurants": [
    { "name": "Restaurant name", "cuisine": "type", "mustTry": "dish", "priceRange": "₹X-₹Y" }
  ],
  "touristAttractions": [
    { "name": "Place name", "type": "type", "entryFee": "₹X", "timeNeeded": "X hours" }
  ],
  "estimatedExpenses": {
    "accommodation": "₹X",
    "food": "₹X",
    "transport": "₹X",
    "activities": "₹X",
    "shopping": "₹X",
    "total": "₹X"
  },
  "travelTips": ["Tip 1", "Tip 2"],
  "bestRoute": "Suggested route/area to focus on"
}

Make it realistic and budget-friendly. Ensure the total estimated expenses are within ₹${budget}.`;
};

const chatbotSystemPrompt = `You are TravelEase AI Assistant, a friendly and knowledgeable travel expert. You help users with:
- Destination recommendations
- Travel planning tips
- Budget advice
- Weather and best time to visit information
- Cultural etiquette and local customs
- Safety tips for travelers
- Food and restaurant recommendations
- Transportation options

Always be helpful, concise, and provide actionable advice. If you're not sure about something, suggest the user verify with local sources. Keep responses under 200 words unless asked for more detail.`;

const generateChatPrompt = (userMessage, chatHistory = []) => {
  const messages = [
    { role: 'system', content: chatbotSystemPrompt }
  ];

  // Add chat history (last 10 messages for context)
  const recentHistory = chatHistory.slice(-10);
  recentHistory.forEach(msg => {
    messages.push({ role: msg.role, content: msg.content });
  });

  messages.push({ role: 'user', content: userMessage });
  return messages;
};

module.exports = {
  generateTripPlanPrompt,
  chatbotSystemPrompt,
  generateChatPrompt
};
