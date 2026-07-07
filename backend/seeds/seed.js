const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');
const Review = require('../models/Review');

dotenv.config();

const IMG = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
  ladakh: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  udaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  rishikesh: 'https://images.unsplash.com/photo-1512472638909-9e3f7e3f42e8?w=800',
  darjeeling: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
  andaman: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  hotel1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  hotel2: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  hotel3: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  hotel4: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  pkg1: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  pkg2: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
  pkg3: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  pkg4: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
};

const destinations = [
  {
    name: 'Goa', description: 'India\'s premier beach destination known for its golden sand beaches, vibrant nightlife, Portuguese heritage, and water sports. A paradise for beach lovers and party enthusiasts.', state: 'Goa', category: 'Beach',
    images: [IMG.goa, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
    budget: 5000, rating: 4.5, bestSeason: 'Winter', entryFee: 'Free',
    weather: { temperature: '25-33°C', humidity: '60-80%', condition: 'Tropical', icon: 'sun' },
    nearbyAttractions: [
      { name: 'Baga Beach', distance: '2 km', image: IMG.goa },
      { name: 'Fort Aguada', distance: '5 km', image: IMG.goa },
      { name: 'Dudhsagar Falls', distance: '60 km', image: IMG.goa }
    ],
    restaurants: [
      { name: 'Britto\'s', cuisine: 'Goan', rating: 4.5, image: IMG.goa },
      { name: 'Cafe Mambo', cuisine: 'Continental', rating: 4.2, image: IMG.goa }
    ],
    coordinates: { lat: 15.2993, lng: 74.1240 }, status: 'active', featured: true
  },
  {
    name: 'Jaipur', description: 'The Pink City, capital of Rajasthan, famous for its majestic forts, palaces, and rich Rajasthani culture. A UNESCO World Heritage city with stunning architecture.', state: 'Rajasthan', category: 'Historical',
    images: [IMG.jaipur, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'],
    budget: 4000, rating: 4.6, bestSeason: 'Winter', entryFee: '₹50-500',
    weather: { temperature: '10-35°C', humidity: '30-60%', condition: 'Semi-arid', icon: 'cloud-sun' },
    nearbyAttractions: [
      { name: 'Amber Fort', distance: '11 km', image: IMG.jaipur },
      { name: 'Hawa Mahal', distance: '1 km', image: IMG.jaipur },
      { name: 'City Palace', distance: '0.5 km', image: IMG.jaipur }
    ],
    restaurants: [
      { name: 'Laxmi Mishthan Bhandar', cuisine: 'Rajasthani', rating: 4.6, image: IMG.jaipur },
      { name: 'Bar Palladio', cuisine: 'Italian', rating: 4.4, image: IMG.jaipur }
    ],
    coordinates: { lat: 26.9124, lng: 75.7873 }, status: 'active', featured: true
  },
  {
    name: 'Manali', description: 'A stunning hill station in Himachal Pradesh surrounded by snow-capped mountains, perfect for adventure sports, honeymoon getaways, and nature lovers.', state: 'Himachal Pradesh', category: 'Mountain',
    images: [IMG.manali, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600'],
    budget: 6000, rating: 4.7, bestSeason: 'Summer', entryFee: 'Free',
    weather: { temperature: '5-20°C', humidity: '50-70%', condition: 'Cool', icon: 'mountain' },
    nearbyAttractions: [
      { name: 'Rohtang Pass', distance: '51 km', image: IMG.manali },
      { name: 'Solang Valley', distance: '14 km', image: IMG.manali },
      { name: 'Hadimba Temple', distance: '2 km', image: IMG.manali }
    ],
    restaurants: [
      { name: 'Johnson\'s Cafe', cuisine: 'Indian', rating: 4.3, image: IMG.manali },
      { name: 'Drifters\' Cafe', cuisine: 'Continental', rating: 4.1, image: IMG.manali }
    ],
    coordinates: { lat: 32.2396, lng: 77.1887 }, status: 'active', featured: true
  },
  {
    name: 'Kerala Backwaters', description: 'God\'s Own Country - a tropical paradise of backwaters, houseboats, tea gardens, and Ayurvedic wellness retreats. Perfect for a serene and rejuvenating vacation.', state: 'Kerala', category: 'Island',
    images: [IMG.kerala, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600'],
    budget: 8000, rating: 4.8, bestSeason: 'Winter', entryFee: '₹100-2000',
    weather: { temperature: '23-32°C', humidity: '70-90%', condition: 'Tropical', icon: 'cloud-rain' },
    nearbyAttractions: [
      { name: 'Alleppey Backwaters', distance: '0 km', image: IMG.kerala },
      { name: 'Munnar Tea Gardens', distance: '150 km', image: IMG.kerala },
      { name: 'Kovalam Beach', distance: '200 km', image: IMG.kerala }
    ],
    restaurants: [
      { name: 'Rice Boat', cuisine: 'Kerala', rating: 4.7, image: IMG.kerala },
      { name: 'Thalassery Restaurant', cuisine: 'Malabar', rating: 4.5, image: IMG.kerala }
    ],
    coordinates: { lat: 9.4981, lng: 76.3388 }, status: 'active', featured: true
  },
  {
    name: 'Varanasi', description: 'One of the world\'s oldest living cities, the spiritual capital of India on the banks of the Ganges. Famous for its ghats, temples, and the mesmerizing Ganga Aarti.', state: 'Uttar Pradesh', category: 'Spiritual',
    images: [IMG.varanasi, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600'],
    budget: 3000, rating: 4.4, bestSeason: 'Winter', entryFee: 'Free',
    weather: { temperature: '8-40°C', humidity: '40-80%', condition: 'Subtropical', icon: 'sun' },
    nearbyAttractions: [
      { name: 'Dashashwamedh Ghat', distance: '0.5 km', image: IMG.varanasi },
      { name: 'Kashi Vishwanath Temple', distance: '1 km', image: IMG.varanasi },
      { name: 'Sarnath', distance: '10 km', image: IMG.varanasi }
    ],
    restaurants: [
      { name: 'Blue Lassi', cuisine: 'Street Food', rating: 4.6, image: IMG.varanasi },
      { name: 'Pizzeria Vaatika', cuisine: 'Italian/Indian', rating: 4.3, image: IMG.varanasi }
    ],
    coordinates: { lat: 25.3176, lng: 82.9739 }, status: 'active', featured: false
  },
  {
    name: 'Ladakh', description: 'The Land of High Passes - a breathtaking Himalayan region with dramatic landscapes, ancient monasteries, crystal-clear lakes, and unique Tibetan Buddhist culture.', state: 'Ladakh', category: 'Adventure',
    images: [IMG.ladakh, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600'],
    budget: 12000, rating: 4.9, bestSeason: 'Summer', entryFee: '₹400 (permit)',
    weather: { temperature: '-5-25°C', humidity: '20-40%', condition: 'Cold Desert', icon: 'mountain' },
    nearbyAttractions: [
      { name: 'Pangong Lake', distance: '160 km', image: IMG.ladakh },
      { name: 'Nubra Valley', distance: '120 km', image: IMG.ladakh },
      { name: 'Thiksey Monastery', distance: '19 km', image: IMG.ladakh }
    ],
    restaurants: [
      { name: 'Gesmo Restaurant', cuisine: 'Tibetan', rating: 4.2, image: IMG.ladakh },
      { name: 'Bon Appetit', cuisine: 'Multi-cuisine', rating: 4.0, image: IMG.ladakh }
    ],
    coordinates: { lat: 34.1526, lng: 77.5771 }, status: 'active', featured: true
  },
  {
    name: 'Udaipur', description: 'The City of Lakes - a romantic city with stunning palaces, serene lakes, and vibrant bazaars. Known as the Venice of the East for its beautiful waterways.', state: 'Rajasthan', category: 'Historical',
    images: [IMG.udaipur, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600'],
    budget: 5000, rating: 4.6, bestSeason: 'Winter', entryFee: '₹100-800',
    weather: { temperature: '10-38°C', humidity: '30-60%', condition: 'Semi-arid', icon: 'sun' },
    nearbyAttractions: [
      { name: 'Lake Pichola', distance: '0 km', image: IMG.udaipur },
      { name: 'City Palace', distance: '0.5 km', image: IMG.udaipur },
      { name: 'Jagdish Temple', distance: '1 km', image: IMG.udaipur }
    ],
    restaurants: [
      { name: 'Ambrai Restaurant', cuisine: 'Indian', rating: 4.7, image: IMG.udaipur },
      { name: 'Upre by 1559 AD', cuisine: 'Rajasthani', rating: 4.5, image: IMG.udaipur }
    ],
    coordinates: { lat: 24.5854, lng: 73.7125 }, status: 'active', featured: true
  },
  {
    name: 'Rishikesh', description: 'The Yoga Capital of the World - nestled in the Himalayan foothills along the Ganges. Perfect for yoga, meditation, white-water rafting, and spiritual exploration.', state: 'Uttarakhand', category: 'Adventure',
    images: [IMG.rishikesh, 'https://images.unsplash.com/photo-1591018653367-4e4f0b32e909?w=600'],
    budget: 4000, rating: 4.5, bestSeason: 'All Year', entryFee: 'Free',
    weather: { temperature: '10-35°C', humidity: '50-70%', condition: 'Subtropical', icon: 'cloud-sun' },
    nearbyAttractions: [
      { name: 'Laxman Jhula', distance: '0.5 km', image: IMG.rishikesh },
      { name: 'Triveni Ghat', distance: '2 km', image: IMG.rishikesh },
      { name: 'Neelkanth Mahadev', distance: '32 km', image: IMG.rishikesh }
    ],
    restaurants: [
      { name: 'Little Buddha Cafe', cuisine: 'Continental', rating: 4.4, image: IMG.rishikesh },
      { name: 'Chotiwala Restaurant', cuisine: 'Indian', rating: 4.2, image: IMG.rishikesh }
    ],
    coordinates: { lat: 30.0869, lng: 78.2676 }, status: 'active', featured: false
  },
  {
    name: 'Darjeeling', description: 'The Queen of the Himalayas - a charming hill station famous for its tea plantations, stunning views of Kanchenjunga, and the historic Darjeeling Himalayan Railway.', state: 'West Bengal', category: 'Mountain',
    images: [IMG.darjeeling, 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800'],
    budget: 5000, rating: 4.5, bestSeason: 'Spring', entryFee: '₹50-200',
    weather: { temperature: '2-20°C', humidity: '60-85%', condition: 'Cool', icon: 'mountain' },
    nearbyAttractions: [
      { name: 'Tiger Hill', distance: '11 km', image: IMG.darjeeling },
      { name: 'Batasia Loop', distance: '5 km', image: IMG.darjeeling },
      { name: 'Peace Pagoda', distance: '3 km', image: IMG.darjeeling }
    ],
    restaurants: [
      { name: 'Glenary\'s', cuisine: 'Continental', rating: 4.5, image: IMG.darjeeling },
      { name: 'Keventer\'s', cuisine: 'Snacks', rating: 4.3, image: IMG.darjeeling }
    ],
    coordinates: { lat: 27.0410, lng: 88.2662 }, status: 'active', featured: false
  },
  {
    name: 'Andaman Islands', description: 'A tropical archipelago with pristine beaches, crystal-clear waters, vibrant coral reefs, and lush rainforests. Perfect for snorkeling, scuba diving, and island hopping.', state: 'Andaman & Nicobar', category: 'Beach',
    images: [IMG.andaman, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800'],
    budget: 15000, rating: 4.7, bestSeason: 'Winter', entryFee: '₹50-1000',
    weather: { temperature: '24-32°C', humidity: '70-90%', condition: 'Tropical', icon: 'sun' },
    nearbyAttractions: [
      { name: 'Radhanagar Beach', distance: '12 km', image: IMG.andaman },
      { name: 'Cellular Jail', distance: '4 km', image: IMG.andaman },
      { name: 'Ross Island', distance: '3 km', image: IMG.andaman }
    ],
    restaurants: [
      { name: 'Full Moon Cafe', cuisine: 'Seafood', rating: 4.4, image: IMG.andaman },
      { name: 'New Lighthouse', cuisine: 'Indian/Seafood', rating: 4.2, image: IMG.andaman }
    ],
    coordinates: { lat: 11.7401, lng: 92.6586 }, status: 'active', featured: true
  }
];

const hotels = [
  { name: 'Taj Exotica Resort', destination: null, description: 'Luxury beachfront resort with world-class amenities, private pools, and stunning ocean views.', images: [IMG.hotel1, IMG.hotel2], price: 15000, rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym'], rooms: { total: 50, available: 50 }, coordinates: { lat: 15.2993, lng: 74.1240 }, status: 'active', featured: true },
  { name: 'Goa Beach Resort', destination: null, description: 'Affordable beachside resort perfect for families and groups with direct beach access.', images: [IMG.hotel2, IMG.hotel3], price: 4500, rating: 4.2, amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access', 'Parking'], rooms: { total: 80, available: 80 }, coordinates: { lat: 15.5, lng: 73.8 }, status: 'active', featured: false },
  { name: 'Rambagh Palace', destination: null, description: 'Former palace of the Maharaja of Jaipur, now one of the world\'s finest luxury hotels.', images: [IMG.hotel3, IMG.hotel4], price: 25000, rating: 4.9, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Garden', 'Butler Service'], rooms: { total: 30, available: 30 }, coordinates: { lat: 26.9124, lng: 75.7873 }, status: 'active', featured: true },
  { name: 'Hotel Pearl Palace', destination: null, description: 'Budget-friendly hotel in the heart of Jaipur with clean rooms and excellent service.', images: [IMG.hotel4, IMG.hotel1], price: 2000, rating: 4.0, amenities: ['WiFi', 'Restaurant', 'AC', 'Parking'], rooms: { total: 60, available: 60 }, coordinates: { lat: 26.92, lng: 75.79 }, status: 'active', featured: false },
  { name: 'The Himalayan Resort', destination: null, description: 'Cozy mountain retreat with stunning valley views, bonfire area, and adventure activities.', images: [IMG.hotel1, IMG.hotel3], price: 5500, rating: 4.5, amenities: ['WiFi', 'Restaurant', 'Bonfire', 'Valley View', 'Adventure Desk'], rooms: { total: 40, available: 40 }, coordinates: { lat: 32.2396, lng: 77.1887 }, status: 'active', featured: true },
  { name: 'Kerala Houseboat', destination: null, description: 'Traditional luxury houseboat cruising through Kerala\'s serene backwaters with all modern amenities.', images: [IMG.hotel2, IMG.hotel4], price: 8000, rating: 4.7, amenities: ['AC', 'Meals Included', 'Sun Deck', 'Fishing', 'Village Tour'], rooms: { total: 10, available: 10 }, coordinates: { lat: 9.4981, lng: 76.3388 }, status: 'active', featured: true },
  { name: 'BrijRama Palace', destination: null, description: 'Heritage hotel on the banks of the Ganges in Varanasi offering authentic cultural experiences.', images: [IMG.hotel3, IMG.hotel1], price: 7000, rating: 4.6, amenities: ['WiFi', 'Restaurant', 'Ghats View', 'Yoga', 'Cultural Tours'], rooms: { total: 25, available: 25 }, coordinates: { lat: 25.3176, lng: 82.9739 }, status: 'active', featured: false },
  { name: 'The Ladakh Retreat', destination: null, description: 'Comfortable stay in the heart of Leh with mountain views and warm hospitality.', images: [IMG.hotel4, IMG.hotel2], price: 6000, rating: 4.4, amenities: ['WiFi', 'Restaurant', 'Mountain View', 'Heater', 'Travel Desk'], rooms: { total: 35, available: 35 }, coordinates: { lat: 34.1526, lng: 77.5771 }, status: 'active', featured: false },
  { name: 'Udaipur Lake Palace Hotel', destination: null, description: 'Floating palace hotel on Lake Pichola offering a royal experience with lake views.', images: [IMG.hotel1, IMG.hotel4], price: 18000, rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Lake View', 'Boat Ride'], rooms: { total: 20, available: 20 }, coordinates: { lat: 24.5854, lng: 73.7125 }, status: 'active', featured: true },
  { name: 'Andaman Beach Resort', destination: null, description: 'Beachfront resort with water sports facilities and stunning coral reef views.', images: [IMG.hotel2, IMG.hotel3], price: 9000, rating: 4.5, amenities: ['WiFi', 'Pool', 'Beach Access', 'Water Sports', 'Restaurant'], rooms: { total: 45, available: 45 }, coordinates: { lat: 11.7401, lng: 92.6586 }, status: 'active', featured: true },
];

const packages = [
  {
    title: 'Romantic Goa Getaway', destination: null, description: 'A perfect 4-day romantic escape to Goa with beach views, candlelight dinners, and water sports.',
    images: [IMG.pkg1, IMG.goa], price: 12000, originalPrice: 15000, duration: '4 Days / 3 Nights', durationDays: 4,
    itinerary: [
      { day: 1, title: 'Arrival & Beach', description: 'Check-in, relax at beach, evening bonfire', activities: ['Airport Transfer', 'Beach Walk', 'Sunset Viewing'], meals: { breakfast: 'Hotel', lunch: 'Beach Shack', dinner: 'Candlelight Dinner' } },
      { day: 2, title: 'Water Sports Day', description: 'Full day of water sports and beach activities', activities: ['Parasailing', 'Jet Ski', 'Banana Boat', 'Scuba Diving'], meals: { breakfast: 'Hotel', lunch: 'Poolside', dinner: 'Restaurant' } },
      { day: 3, title: 'Sightseeing', description: 'Explore Old Goa, forts, and spice plantations', activities: ['Fort Aguada', 'Old Goa Churches', 'Spice Plantation Tour'], meals: { breakfast: 'Hotel', lunch: 'Local Restaurant', dinner: 'Beach Restaurant' } },
      { day: 4, title: 'Departure', description: 'Last-minute shopping and departure', activities: ['Market Shopping', 'Airport Transfer'], meals: { breakfast: 'Hotel', lunch: 'On the way', dinner: '' } }
    ],
    includedServices: ['Hotel Stay', 'Breakfast', 'Airport Transfers', 'Water Sports', 'Sightseeing Tour', 'Travel Insurance'],
    excludedServices: ['Flights', 'Personal Expenses', 'Tips'], rating: 4.6, type: 'Honeymoon', maxGroupSize: 2, status: 'active', featured: true
  },
  {
    title: 'Royal Rajasthan Tour', destination: null, description: 'Experience the grandeur of Rajasthan with visits to Jaipur, Udaipur, and Jodhpur\'s magnificent palaces and forts.',
    images: [IMG.pkg2, IMG.jaipur], price: 25000, originalPrice: 30000, duration: '7 Days / 6 Nights', durationDays: 7,
    itinerary: [
      { day: 1, title: 'Arrive Jaipur', description: 'Check-in and explore local markets', activities: ['Hotel Check-in', 'Local Market Tour'], meals: { breakfast: 'Hotel', lunch: 'Restaurant', dinner: 'Hotel' } },
      { day: 2, title: 'Jaipur Sightseeing', description: 'Visit Amber Fort, City Palace, Hawa Mahal', activities: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 3, title: 'Jaipur to Udaipur', description: 'Drive to Udaipur, visit Ranakpur', activities: ['Drive to Udaipur', 'Ranakpur Temples'], meals: { breakfast: 'Hotel', lunch: 'En route', dinner: 'Hotel' } },
      { day: 4, title: 'Udaipur Exploration', description: 'City Palace, Lake Pichola boat ride', activities: ['City Palace', 'Lake Pichola', 'Saheliyon ki Bari'], meals: { breakfast: 'Hotel', lunch: 'Restaurant', dinner: 'Rooftop' } },
      { day: 5, title: 'Udaipur to Jodhpur', description: 'Drive to Jodhpur, explore the Blue City', activities: ['Drive to Jodhpur', 'Local Exploration'], meals: { breakfast: 'Hotel', lunch: 'En route', dinner: 'Hotel' } },
      { day: 6, title: 'Jodhpur Sightseeing', description: 'Mehrangarh Fort, Jaswant Thada', activities: ['Mehrangarh Fort', 'Jaswant Thada', 'Clock Tower Market'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 7, title: 'Departure', description: 'Final shopping and departure', activities: ['Shopping', 'Airport Transfer'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Hotel Stay', 'All Meals', 'AC Transport', 'Guide', 'Entry Tickets', 'Travel Insurance'],
    excludedServices: ['Flights', 'Personal Shopping', 'Tips'], rating: 4.7, type: 'Luxury', maxGroupSize: 12, status: 'active', featured: true
  },
  {
    title: 'Kerala Backwater Bliss', destination: null, description: 'Cruise through Kerala\'s serene backwaters, explore tea gardens, and rejuvenate with Ayurvedic treatments.',
    images: [IMG.pkg3, IMG.kerala], price: 18000, originalPrice: 22000, duration: '5 Days / 4 Nights', durationDays: 5,
    itinerary: [
      { day: 1, title: 'Arrive Kochi', description: 'Check-in and explore Fort Kochi', activities: ['Airport Transfer', 'Fort Kochi Tour', 'Chinese Fishing Nets'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 2, title: 'Munnar Tea Gardens', description: 'Drive to Munnar, explore tea plantations', activities: ['Drive to Munnar', 'Tea Museum', 'Tea Gardens Walk'], meals: { breakfast: 'Hotel', lunch: 'En route', dinner: 'Resort' } },
      { day: 3, title: 'Munnar to Alleppey', description: 'Drive to Alleppey, board houseboat', activities: ['Drive to Alleppey', 'Houseboat Check-in', 'Backwater Cruise'], meals: { breakfast: 'Resort', lunch: 'Houseboat', dinner: 'Houseboat' } },
      { day: 4, title: 'Kovalam Beach', description: 'Drive to Kovalam, beach relaxation', activities: ['Beach Time', 'Ayurvedic Spa', 'Beach Walk'], meals: { breakfast: 'Hotel', lunch: 'Beach Restaurant', dinner: 'Hotel' } },
      { day: 5, title: 'Departure', description: 'Final relaxation and departure', activities: ['Shopping', 'Airport Transfer'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Hotel & Houseboat Stay', 'Breakfast & Dinner', 'AC Transport', 'Ayurvedic Spa', 'Houseboat Meals'],
    excludedServices: ['Flights', 'Lunch', 'Personal Expenses'], rating: 4.8, type: 'Family', maxGroupSize: 8, status: 'active', featured: true
  },
  {
    title: 'Adventure in Manali', destination: null, description: 'Thrilling adventure package with river rafting, paragliding, trekking, and snow activities in Manali.',
    images: [IMG.pkg1, IMG.manali], price: 10000, originalPrice: 13000, duration: '5 Days / 4 Nights', durationDays: 5,
    itinerary: [
      { day: 1, title: 'Arrival in Manali', description: 'Check-in, explore Mall Road', activities: ['Check-in', 'Mall Road Walk', 'Local Cafe'], meals: { breakfast: 'Hotel', lunch: 'Cafe', dinner: 'Hotel' } },
      { day: 2, title: 'Solang Valley', description: 'Adventure sports at Solang Valley', activities: ['Paragliding', 'Zorbing', 'Snow Activities'], meals: { breakfast: 'Hotel', lunch: 'Solang Cafe', dinner: 'Hotel' } },
      { day: 3, title: 'Rohtang Pass', description: 'Full day excursion to Rohtang Pass', activities: ['Rohtang Pass', 'Snow Point', 'Photography'], meals: { breakfast: 'Hotel', lunch: 'Packed', dinner: 'Hotel' } },
      { day: 4, title: 'River Rafting & Temple', description: 'Morning rafting, afternoon temple visit', activities: ['River Rafting', 'Hadimba Temple', 'Shopping'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 5, title: 'Departure', description: 'Morning walk and departure', activities: ['Nature Walk', 'Departure'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Hotel Stay', 'Breakfast', 'Adventure Activities', 'Transport', 'Permits'],
    excludedServices: ['Flights', 'Lunch & Dinner', 'Personal Expenses'], rating: 4.5, type: 'Adventure', maxGroupSize: 15, status: 'active', featured: false
  },
  {
    title: 'Spiritual Varanasi Retreat', destination: null, description: 'A soul-stirring journey through Varanasi\'s ancient ghats, temples, and spiritual ceremonies.',
    images: [IMG.pkg2, IMG.varanasi], price: 8000, originalPrice: 10000, duration: '3 Days / 2 Nights', durationDays: 3,
    itinerary: [
      { day: 1, title: 'Arrival & Ganga Aarti', description: 'Check-in, ghats tour, evening Ganga Aarti', activities: ['Hotel Check-in', 'Ghats Walk', 'Ganga Aarti'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 2, title: 'Temple & Sarnath', description: 'Visit Kashi Vishwanath, Sarnath excursion', activities: ['Kashi Vishwanath Temple', 'Sarnath Excursion', 'Boat Ride'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 3, title: 'Sunrise & Departure', description: 'Sunrise boat ride, departure', activities: ['Sunrise Boat Ride', 'Shopping', 'Departure'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Hotel Stay', 'Breakfast', 'Guided Tours', 'Boat Rides', 'Transport'],
    excludedServices: ['Flights', 'Lunch & Dinner', 'Personal Expenses'], rating: 4.4, type: 'Solo', maxGroupSize: 10, status: 'active', featured: false
  },
  {
    title: 'Budget Explorer India', destination: null, description: 'Affordable 5-day package covering Delhi, Agra and Jaipur with budget stays, local transport, and street food experiences.',
    images: [IMG.pkg4, IMG.jaipur], price: 5000, originalPrice: 7000, duration: '5 Days / 4 Nights', durationDays: 5,
    itinerary: [
      { day: 1, title: 'Arrive Delhi', description: 'Check-in at budget hotel, explore local markets', activities: ['Hotel Check-in', 'Chandni Chowk Walk', 'Street Food Tour'], meals: { breakfast: 'Hotel', lunch: 'Street Food', dinner: 'Local Restaurant' } },
      { day: 2, title: 'Delhi Sightseeing', description: 'Visit India Gate, Red Fort, Qutub Minar', activities: ['India Gate', 'Red Fort', 'Qutub Minar', 'Lotus Temple'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 3, title: 'Delhi to Agra', description: 'Train to Agra, visit Taj Mahal', activities: ['Train to Agra', 'Taj Mahal', 'Agra Fort'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 4, title: 'Agra to Jaipur', description: 'Drive to Jaipur via Fatehpur Sikri', activities: ['Fatehpur Sikri', 'Drive to Jaipur', 'Local Market'], meals: { breakfast: 'Hotel', lunch: 'En route', dinner: 'Hotel' } },
      { day: 5, title: 'Jaipur & Departure', description: 'Hawa Mahal, City Palace, departure', activities: ['Hawa Mahal', 'City Palace', 'Shopping', 'Departure'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Budget Hotel Stay', 'Breakfast', 'Train Tickets', 'AC Bus Transport', 'Guided Tours'],
    excludedServices: ['Flights', 'Lunch & Dinner', 'Entry Fees', 'Personal Expenses'], rating: 4.2, type: 'Budget', maxGroupSize: 20, status: 'active', featured: true
  },
  {
    title: 'Ladakh Bike Expedition', destination: null, description: 'Epic bike ride through Ladakh\'s dramatic landscapes, crossing highest motorable passes.',
    images: [IMG.pkg3, IMG.ladakh], price: 35000, originalPrice: 42000, duration: '8 Days / 7 Nights', durationDays: 8,
    itinerary: [
      { day: 1, title: 'Arrive Leh', description: 'Acclimatization day', activities: ['Arrival', 'Rest', 'Local Market'], meals: { breakfast: 'Hotel', lunch: 'Hotel', dinner: 'Hotel' } },
      { day: 2, title: 'Leh Local', description: 'Visit monasteries and palace', activities: ['Thiksey Monastery', 'Leh Palace', 'Shanti Stupa'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 3, title: 'Nubra Valley', description: 'Cross Khardung La to Nubra', activities: ['Khardung La Pass', 'Nubra Valley', 'Double-humped Camel'], meals: { breakfast: 'Hotel', lunch: 'Camp', dinner: 'Camp' } },
      { day: 4, title: 'Pangong Lake', description: 'Drive to the stunning Pangong Lake', activities: ['Drive to Pangong', 'Lake Viewing', 'Photography'], meals: { breakfast: 'Camp', lunch: 'Packed', dinner: 'Camp' } },
      { day: 5, title: 'Pangong to Leh', description: 'Return journey via Chang La', activities: ['Return Drive', 'Chang La Pass', 'Rest'], meals: { breakfast: 'Camp', lunch: 'Packed', dinner: 'Hotel' } },
      { day: 6, title: 'Rest Day', description: 'Rest and explore Leh', activities: ['Rest', 'Shopping', 'Local Cafe'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 7, title: 'Magnetic Hill', description: 'Visit Magnetic Hill and Gurudwara', activities: ['Magnetic Hill', 'Gurudwara Patthar Sahib', 'Confluence'], meals: { breakfast: 'Hotel', lunch: 'Local', dinner: 'Hotel' } },
      { day: 8, title: 'Departure', description: 'Final morning and departure', activities: ['Departure'], meals: { breakfast: 'Hotel', lunch: '', dinner: '' } }
    ],
    includedServices: ['Hotel & Camp Stay', 'All Meals', 'Bike Rental', 'Fuel', 'Permits', 'Mechanic Support'],
    excludedServices: ['Flights', 'Personal Gear', 'Tips'], rating: 4.9, type: 'Adventure', maxGroupSize: 10, status: 'active', featured: true
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Hotel.deleteMany();
    await Package.deleteMany();
    await Review.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin', email: 'admin@travelease.com', password: 'admin123', role: 'admin'
    });

    // Create demo user
    const user = await User.create({
      name: 'John Doe', email: 'user@travelease.com', password: 'user123', role: 'user', phone: '9876543210'
    });

    console.log('Created users');

    // Create destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(`Created ${createdDestinations.length} destinations`);

    // Link destinations to hotels
    const hotelDestMap = {
      'Taj Exotica Resort': 'Goa', 'Goa Beach Resort': 'Goa',
      'Rambagh Palace': 'Jaipur', 'Hotel Pearl Palace': 'Jaipur',
      'The Himalayan Resort': 'Manali',
      'Kerala Houseboat': 'Kerala Backwaters',
      'BrijRama Palace': 'Varanasi',
      'The Ladakh Retreat': 'Ladakh',
      'Udaipur Lake Palace Hotel': 'Udaipur',
      'Andaman Beach Resort': 'Andaman Islands'
    };

    for (const hotel of hotels) {
      const destName = hotelDestMap[hotel.name];
      const dest = createdDestinations.find(d => d.name === destName);
      if (dest) {
        hotel.destination = dest._id;
        dest.hotels.push(hotel._id || null); // Will be updated after creation
      }
    }

    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`Created ${createdHotels.length} hotels`);

    // Update destinations with hotel references
    for (const hotel of createdHotels) {
      await Destination.findByIdAndUpdate(hotel.destination, {
        $push: { hotels: hotel._id }
      });
    }

    // Link destinations to packages
    const pkgDestMap = {
      'Romantic Goa Getaway': 'Goa',
      'Royal Rajasthan Tour': 'Jaipur',
      'Kerala Backwater Bliss': 'Kerala Backwaters',
      'Adventure in Manali': 'Manali',
      'Spiritual Varanasi Retreat': 'Varanasi',
      'Budget Explorer India': 'Jaipur',
      'Ladakh Bike Expedition': 'Ladakh'
    };

    for (const pkg of packages) {
      const destName = pkgDestMap[pkg.title];
      const dest = createdDestinations.find(d => d.name === destName);
      if (dest) pkg.destination = dest._id;
    }

    const createdPackages = await Package.insertMany(packages);
    console.log(`Created ${createdPackages.length} packages`);

    // Create sample reviews
    const reviews = [
      { user: user._id, targetModel: 'Destination', targetId: createdDestinations[0]._id, rating: 5, comment: 'Amazing beach destination! Loved the nightlife and water sports.', approved: true },
      { user: user._id, targetModel: 'Destination', targetId: createdDestinations[1]._id, rating: 5, comment: 'The forts and palaces are breathtaking. Must visit!', approved: true },
      { user: user._id, targetModel: 'Hotel', targetId: createdHotels[0]._id, rating: 5, comment: 'Incredible luxury and service. Worth every penny!', approved: true },
      { user: user._id, targetModel: 'Hotel', targetId: createdHotels[4]._id, rating: 4, comment: 'Great mountain views and cozy rooms. Perfect for a mountain getaway.', approved: true },
      { user: user._id, targetModel: 'Package', targetId: createdPackages[0]._id, rating: 5, comment: 'Perfect honeymoon package! Everything was well organized.', approved: true },
      { user: user._id, targetModel: 'Package', targetId: createdPackages[2]._id, rating: 5, comment: 'The houseboat experience was magical. Highly recommend!', approved: true },
    ];

    await Review.insertMany(reviews);
    console.log(`Created ${reviews.length} reviews`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@travelease.com / admin123');
    console.log('User:  user@travelease.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
