import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiStar, FiCalendar, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const types = ['Adventure', 'Honeymoon', 'Family', 'Budget', 'Luxury', 'Group', 'Solo'];

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', price: '', rating: '', sort: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => { fetchPackages(); }, [filters, searchParams.get('page')]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', searchParams.get('page') || '1');
      const { data } = await api.get(`/api/packages?${params}`);
      setPackages(data.data);
      setPagination(data.pagination);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Travel Packages</h1>
          <p className="text-gray-600 dark:text-gray-400">Curated experiences for every traveler</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search packages..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
          </div>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none">
            <option value="">Sort By</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Type Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilters({ ...filters, type: '' })} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!filters.type ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>All</button>
          {types.map(t => (
            <button key={t} onClick={() => setFilters({ ...filters, type: t })} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filters.type === t ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-500 text-lg">No packages found</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div key={pkg._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/packages/${pkg._id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover">
                  <div className="relative h-52 overflow-hidden">
                    <img src={pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {pkg.originalPrice && <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF</div>}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">{pkg.type}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FiCalendar size={14} /> {pkg.duration}</span>
                      <span className="flex items-center gap-1"><FiStar className="text-yellow-400 fill-yellow-400" size={14} /> {pkg.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        {pkg.originalPrice && <span className="text-sm text-gray-400 line-through mr-2">₹{pkg.originalPrice.toLocaleString()}</span>}
                        <span className="text-xl font-bold text-primary-500">₹{pkg.price?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">/person</span>
                      </div>
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
                className={`w-10 h-10 rounded-lg font-medium text-sm ${(parseInt(searchParams.get('page')) || 1) === i + 1 ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
