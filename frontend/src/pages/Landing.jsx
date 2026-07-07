import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiStar, FiArrowRight, FiChevronDown, FiChevronUp, FiShield, FiHeadphones, FiCreditCard, FiGlobe, FiHeart, FiAward } from 'react-icons/fi';
import api from '../services/api';

export default function Landing() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [destRes, pkgRes, hotelRes] = await Promise.all([
        api.get('/api/destinations?limit=6&sort=rating'),
        api.get('/api/packages?limit=6&sort=rating'),
        api.get('/api/hotels?limit=6&sort=rating')
      ]);
      setDestinations(destRes.data.data);
      setPackages(pkgRes.data.data);
      setHotels(hotelRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/destinations?search=${searchQuery}`);
  };

  const faqs = [
    { q: 'How do I book a trip on TravelEase?', a: 'Simply browse our destinations or packages, select your preferred option, and click "Book Now". Follow the simple checkout process to confirm your booking.' },
    { q: 'Can I customize my travel package?', a: 'Yes! Our AI Trip Planner creates fully customized itineraries based on your preferences, budget, and travel style.' },
    { q: 'What is the cancellation policy?', a: 'Most bookings can be cancelled up to 48 hours before check-in for a full refund. Check individual listing policies for specific terms.' },
    { q: 'Is my payment secure?', a: 'Absolutely. We use industry-standard encryption and secure payment processing to protect all transactions.' },
    { q: 'How does the AI Trip Planner work?', a: 'Enter your destination, budget, number of days, and travel type. Our AI generates a complete day-wise itinerary with hotels, restaurants, and attractions.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', text: 'TravelEase made our honeymoon absolutely perfect! The AI planner suggested the most amazing spots in Kerala.', rating: 5, avatar: 'P' },
    { name: 'Rahul Verma', location: 'Delhi', text: 'The budget planner feature saved us so much money. We could track every expense and stay within our limit.', rating: 5, avatar: 'R' },
    { name: 'Anita Desai', location: 'Bangalore', text: 'Booked a family package to Jaipur through TravelEase. Everything was well-organized and the hotels were fantastic!', rating: 4, avatar: 'A' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920" alt="Travel" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white font-heading mb-6 leading-tight">
              Explore the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">TravelEase</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              AI-powered travel planning, seamless bookings, and unforgettable experiences. Your dream vacation starts here.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-3 sm:p-4 shadow-2xl max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <FiSearch className="text-primary-500" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to go?" className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400" />
              </div>
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all">
                Search
              </button>
            </div>
          </motion.form>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-12 text-white">
            {[{ n: '500+', l: 'Destinations' }, { n: '10K+', l: 'Happy Travelers' }, { n: '1000+', l: 'Hotels' }, { n: '4.8', l: 'Avg Rating' }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold">{s.n}</p>
                <p className="text-sm text-white/70">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-3">Popular Destinations</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">Discover India's most breathtaking destinations, handpicked for unforgettable experiences</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div key={dest._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/destinations/${dest._id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover">
                  <div className="relative h-56 overflow-hidden">
                    <img src={dest.images?.[0]} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium">
                      {dest.category}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-sm">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-1">
                      <FiMapPin size={14} />
                      <span>{dest.state}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{dest.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{dest.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500">From <span className="text-lg font-bold text-primary-500">₹{dest.budget?.toLocaleString()}</span></span>
                      <span className="text-primary-500 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                        Explore <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/destinations" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-all">
              View All Destinations <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Packages */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-3">Trending Packages</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">Curated travel packages for every type of traveler</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.slice(0, 3).map((pkg, i) => (
              <motion.div key={pkg._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/packages/${pkg._id}`} className="group block bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden card-hover border border-gray-100 dark:border-gray-700">
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {pkg.originalPrice && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">{pkg.type}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><FiCalendar size={14} /> {pkg.duration}</span>
                      <span className="flex items-center gap-1"><FiStar className="text-yellow-400 fill-yellow-400" size={14} /> {pkg.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        {pkg.originalPrice && <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>}
                        <span className="text-xl font-bold text-primary-500 ml-2">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">/person</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/packages" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              View All Packages <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Hotels */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-3">Top Hotels</h2>
            <p className="text-gray-600 dark:text-gray-400">Handpicked accommodations for the perfect stay</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.slice(0, 3).map((hotel, i) => (
              <motion.div key={hotel._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/hotels/${hotel._id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img src={hotel.images?.[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{hotel.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FiStar className="fill-yellow-400" size={14} />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <div className="flex gap-1">
                        {hotel.amenities?.slice(0, 3).map((a, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary-500">₹{hotel.price?.toLocaleString()}</span>
                        <span className="text-sm text-gray-500"> /night</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-3">Why Choose TravelEase?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiGlobe, title: '500+ Destinations', desc: 'Explore curated destinations across India and beyond' },
              { icon: FiShield, title: 'Secure Booking', desc: 'Safe payments with instant confirmation' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock assistance for all your queries' },
              { icon: FiCreditCard, title: 'Best Price Guarantee', desc: 'Competitive prices with exclusive deals and discounts' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-accent-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">What Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-yellow-300 fill-yellow-300" size={16} />)}
                </div>
                <p className="text-white/90 text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/60 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                  {openFaq === i ? <FiChevronUp className="text-primary-500 flex-shrink-0" /> : <FiChevronDown className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">Join thousands of travelers who plan their perfect trips with TravelEase</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/destinations" className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Explore Destinations
            </Link>
            <Link to="/ai-trip-planner" className="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
              Try AI Trip Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
