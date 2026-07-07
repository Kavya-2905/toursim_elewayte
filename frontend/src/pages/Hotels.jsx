import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiStar, FiMapPin, FiFilter, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', destination: '', rating: '', price: '', sort: '', amenities: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => { fetchHotels(); }, [filters, searchParams.get('page')]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', searchParams.get('page') || '1');
      const { data } = await api.get(`/api/hotels?${params}`);
      setHotels(data.data);
      setPagination(data.pagination);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Find Hotels</h1>
          <p className="text-gray-600 dark:text-gray-400">Best accommodations for your perfect stay</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search hotels..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white"><FiFilter /> Filters</button>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none">
            <option value="">Sort By</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select value={filters.price} onChange={(e) => updateFilter('price', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">Any Price</option>
                  <option value="0-2000">Under ₹2,000</option>
                  <option value="2000-5000">₹2,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000-50000">₹10,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Rating</label>
                <select value={filters.rating} onChange={(e) => updateFilter('rating', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">Any</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities</label>
                <select value={filters.amenities} onChange={(e) => updateFilter('amenities', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">All</option>
                  <option value="WiFi">WiFi</option>
                  <option value="Pool">Pool</option>
                  <option value="Spa">Spa</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-500 text-lg">No hotels found</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <motion.div key={hotel._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/hotels/${hotel._id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover">
                  <div className="relative h-52 overflow-hidden">
                    <img src={hotel.images?.[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-sm">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={14} /> {hotel.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{hotel.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiMapPin size={14} /> {hotel.destination?.name || hotel.destination?.state}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.amenities?.slice(0, 4).map((a, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">{a}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-end justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary-500">₹{hotel.price?.toLocaleString()}</span>
                        <span className="text-sm text-gray-500"> /night</span>
                      </div>
                      <span className="text-xs text-gray-400">{hotel.rooms?.available} rooms available</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} onClick={() => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('page', String(i + 1)); return p; })}
                className={`w-10 h-10 rounded-lg font-medium text-sm ${parseInt(searchParams.get('page')) || 1 === i + 1 ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
