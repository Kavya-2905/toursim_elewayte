import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiFilter, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const categories = ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Spiritual', 'Wildlife', 'Island'];
const seasons = ['All Year', 'Winter', 'Summer', 'Monsoon', 'Spring', 'Autumn'];

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
    season: searchParams.get('season') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '',
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [states, setStates] = useState([]);

  useEffect(() => { fetchDestinations(); fetchStates(); }, [filters, searchParams.get('page')]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', searchParams.get('page') || '1');
      params.set('limit', '12');
      const { data } = await api.get(`/api/destinations?${params}`);
      setDestinations(data.data);
      setPagination(data.pagination);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchStates = async () => {
    try { const { data } = await api.get('/api/destinations/filters/states'); setStates(data.data); } catch (e) {}
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSearchParams(prev => { const p = new URLSearchParams(prev); if (value) p.set(key, value); else p.delete(key); p.set('page', '1'); return p; });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', state: '', season: '', rating: '', sort: '' });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Explore Destinations</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover amazing places across India</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search destinations..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
            <FiFilter /> Filters {showFilters ? <FiX /> : null}
          </button>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none">
            <option value="">Sort By</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select value={filters.state} onChange={(e) => updateFilter('state', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best Season</label>
                <select value={filters.season} onChange={(e) => updateFilter('season', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">All Seasons</option>
                  {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Rating</label>
                <select value={filters.rating} onChange={(e) => updateFilter('rating', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  <option value="">Any Rating</option>
                  {[4, 3.5, 3, 2.5].map(r => <option key={r} value={r}>{r}+ Stars</option>)}
                </select>
              </div>
            </div>
            <button onClick={clearFilters} className="mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium">Clear All Filters</button>
          </motion.div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-16">
            <FiMapPin className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div key={dest._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/destinations/${dest._id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover">
                  <div className="relative h-52 overflow-hidden">
                    <img src={dest.images?.[0]} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-xs font-medium">{dest.category}</div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-sm">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={14} /> {dest.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-1"><FiMapPin size={14} /> {dest.state}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{dest.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{dest.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500">From <span className="text-lg font-bold text-primary-500">₹{dest.budget?.toLocaleString()}</span></span>
                      <span className="text-xs text-gray-400">{dest.bestSeason}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} onClick={() => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('page', String(i + 1)); return p; })}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  (parseInt(searchParams.get('page')) || 1) === i + 1
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
