import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiHeart, FiCloudDrizzle, FiSun, FiCalendar, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function DestinationDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImg, setActiveImg] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => { fetchDestination(); fetchReviews(); }, [id]);

  const fetchDestination = async () => {
    try {
      const { data } = await api.get(`/api/destinations/${id}`);
      setDest(data.data);
      // Track recently viewed
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = viewed.filter(v => v._id !== data.data._id);
      filtered.unshift({ _id: data.data._id, name: data.data.name, images: data.data.images, type: 'Destination' });
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (error) { toast.error('Failed to load destination'); } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try { const { data } = await api.get(`/api/reviews?targetModel=Destination&targetId=${id}`); setReviews(data.data); } catch (e) {}
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      if (inWishlist) { await api.delete(`/api/wishlist/Destination/${id}`); setInWishlist(false); toast.success('Removed from wishlist'); }
      else { await api.post('/api/wishlist', { type: 'Destination', referenceId: id }); setInWishlist(true); toast.success('Added to wishlist'); }
    } catch (e) { toast.error('Failed to update wishlist'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/reviews', { targetModel: 'Destination', targetId: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchDestination();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to submit review'); }
  };

  if (loading) return <DetailSkeleton />;
  if (!dest) return <div className="min-h-screen pt-24 text-center">Destination not found</div>;

  const tabs = ['overview', 'weather', 'nearby', 'hotels', 'restaurants', 'reviews'];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/destinations" className="hover:text-primary-500">Destinations</a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{dest.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img src={dest.images?.[activeImg]} alt={dest.name} className="w-full h-72 sm:h-96 object-cover" />
              <button onClick={toggleWishlist} className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:scale-110 transition">
                <FiHeart className={inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'} size={20} />
              </button>
              {dest.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(prev => prev === 0 ? dest.images.length - 1 : prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><FiChevronLeft /></button>
                  <button onClick={() => setActiveImg(prev => prev === dest.images.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><FiChevronRight /></button>
                </>
              )}
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {dest.images?.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title & Rating */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">{dest.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500"><FiMapPin size={16} /> {dest.state}</div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={dest.rating} size={20} />
                <span className="text-lg font-semibold">{dest.rating}</span>
                <span className="text-sm text-gray-500">({dest.numReviews} reviews)</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {activeTab === 'overview' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{dest.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><p className="text-xs text-gray-500">Best Season</p><p className="font-medium">{dest.bestSeason}</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><p className="text-xs text-gray-500">Entry Fee</p><p className="font-medium">{dest.entryFee}</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><p className="text-xs text-gray-500">Category</p><p className="font-medium">{dest.category}</p></div>
                  </div>
                </div>
              )}
              {activeTab === 'weather' && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <FiSun className="text-yellow-500" size={40} />
                    <div><p className="text-2xl font-bold">{dest.weather?.temperature}</p><p className="text-gray-600 dark:text-gray-400">{dest.weather?.condition}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl"><p className="text-xs text-gray-500">Humidity</p><p className="font-medium">{dest.weather?.humidity}</p></div>
                    <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl"><p className="text-xs text-gray-500">Best Time</p><p className="font-medium">{dest.bestSeason}</p></div>
                  </div>
                </div>
              )}
              {activeTab === 'nearby' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.nearbyAttractions?.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <img src={a.image} alt={a.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div><p className="font-medium text-gray-900 dark:text-white">{a.name}</p><p className="text-sm text-gray-500">{a.distance}</p></div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'hotels' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.hotels?.map(h => (
                    <a key={h._id} href={`/hotels/${h._id}`} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition">
                      <img src={h.images?.[0]} alt={h.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div><p className="font-medium text-gray-900 dark:text-white">{h.name}</p><p className="text-sm text-primary-500 font-semibold">₹{h.price}/night</p></div>
                    </a>
                  ))}
                  {(!dest.hotels || dest.hotels.length === 0) && <p className="text-gray-500 col-span-2">No hotels listed for this destination.</p>}
                </div>
              )}
              {activeTab === 'restaurants' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.restaurants?.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">{r.name?.charAt(0)}</div>
                      <div><p className="font-medium text-gray-900 dark:text-white">{r.name}</p><p className="text-sm text-gray-500">{r.cuisine} · {r.rating}★</p></div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review Form */}
                  {isAuthenticated && (
                    <form onSubmit={submitReview} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold mb-3">Write a Review</h3>
                      <div className="mb-3"><StarRating rating={reviewForm.rating} interactive onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} /></div>
                      <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} required placeholder="Share your experience..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
                      <button type="submit" className="mt-3 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">Submit Review</button>
                    </form>
                  )}
                  {/* Reviews List */}
                  {reviews.length === 0 ? <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p> :
                    reviews.map(r => (
                      <div key={r._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">{r.user?.name?.charAt(0)}</div>
                          <div><p className="font-medium">{r.user?.name}</p><StarRating rating={r.rating} size={14} /></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{r.comment}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
              <p className="text-sm text-gray-500 mb-1">Starting from</p>
              <p className="text-3xl font-bold text-primary-500 mb-4">₹{dest.budget?.toLocaleString()}</p>
              <a href={`/packages?destination=${dest._id}`} className="block w-full text-center py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                View Packages
              </a>
              <a href={`/hotels?destination=${dest._id}`} className="block w-full text-center py-3 mt-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                Browse Hotels
              </a>
            </div>

            {/* Map */}
            {dest.coordinates?.lat && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="h-64 rounded-xl overflow-hidden">
                  <MapContainer center={[dest.coordinates.lat, dest.coordinates.lng]} zoom={12} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <Marker position={[dest.coordinates.lat, dest.coordinates.lng]}>
                      <Popup>{dest.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
