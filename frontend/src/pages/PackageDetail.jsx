import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiCalendar, FiUsers, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(1);
  const [expandedDay, setExpandedDay] = useState(0);

  useEffect(() => { fetchPackage(); }, [id]);
  const fetchPackage = async () => {
    try { const { data } = await api.get(`/api/packages/${id}`); setPkg(data.data); } catch (e) { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) return toast.error('Please login to book');
    try {
      const { data } = await api.post('/api/bookings', { type: 'package', referenceId: id, guests, tripDate: new Date(Date.now() + 7 * 86400000) });
      toast.success('Booking confirmed!');
      navigate(`/booking-confirmation/${data.data._id}`);
    } catch (e) { toast.error(e.response?.data?.message || 'Booking failed'); }
  };

  if (loading) return <DetailSkeleton />;
  if (!pkg) return <div className="min-h-screen pt-24 text-center">Package not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/packages" className="hover:text-primary-500">Packages</a><span>/</span><span className="text-gray-900 dark:text-white">{pkg.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={pkg.images?.[0]} alt={pkg.title} className="w-full h-72 sm:h-96 object-cover" />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">{pkg.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><FiCalendar size={14} /> {pkg.duration}</span>
                  <span className="flex items-center gap-1"><FiUsers size={14} /> Max {pkg.maxGroupSize}</span>
                  <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">{pkg.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={pkg.rating} size={18} />
                <span className="font-semibold">{pkg.rating}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.description}</p>

            {/* Itinerary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Day-wise Itinerary</h3>
              <div className="space-y-2">
                {pkg.itinerary?.map((day, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button onClick={() => setExpandedDay(expandedDay === i ? -1 : i)} className="w-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold">{day.day}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{day.title}</span>
                      </div>
                      {expandedDay === i ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {expandedDay === i && (
                      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{day.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {day.activities?.map((a, j) => (
                            <span key={j} className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs"><FiCheck size={12} /> {a}</span>
                          ))}
                        </div>
                        {day.meals && (
                          <div className="text-xs text-gray-500">
                            <span>🍳 {day.meals.breakfast}</span> · <span>🍽️ {day.meals.lunch}</span> · <span>🌙 {day.meals.dinner}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Included Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-green-600">Included</h4>
                {pkg.includedServices?.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 text-sm"><FiCheck className="text-green-500" size={16} /> {s}</div>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-red-600">Not Included</h4>
                {pkg.excludedServices?.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 text-sm"><FiX className="text-red-500" size={16} /> {s}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
              <div className="flex items-end gap-2 mb-2">
                {pkg.originalPrice && <span className="text-lg text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>}
                <span className="text-3xl font-bold text-primary-500">₹{pkg.price?.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">per person</p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Number of Guests</label>
                <select value={guests} onChange={(e) => setGuests(+e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                  {Array.from({ length: pkg.maxGroupSize }, (_, i) => <option key={i+1} value={i+1}>{i+1} Guest{i>0?'s':''}</option>)}
                </select>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <div className="flex justify-between text-sm"><span>₹{pkg.price} x {guests} guest{guests>1?'s':''}</span><span>₹{(pkg.price * guests).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"><span>Total</span><span className="text-primary-500">₹{(pkg.price * guests).toLocaleString()}</span></div>
              </div>

              <button onClick={handleBooking} className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
