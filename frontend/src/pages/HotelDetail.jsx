import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1, rooms: 1 });

  useEffect(() => { fetchHotel(); }, [id]);

  const fetchHotel = async () => {
    try { const { data } = await api.get(`/api/hotels/${id}`); setHotel(data.data); } catch (e) { toast.error('Failed to load hotel'); } finally { setLoading(false); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to book');
    if (!booking.checkIn || !booking.checkOut) return toast.error('Please select dates');
    try {
      const { data } = await api.post('/api/bookings', { type: 'hotel', referenceId: id, ...booking });
      toast.success('Booking confirmed!');
      navigate(`/booking-confirmation/${data.data._id}`);
    } catch (e) { toast.error(e.response?.data?.message || 'Booking failed'); }
  };

  if (loading) return <DetailSkeleton />;
  if (!hotel) return <div className="min-h-screen pt-24 text-center">Hotel not found</div>;

  const nights = booking.checkIn && booking.checkOut ? Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000)) : 0;
  const total = hotel.price * nights * booking.rooms;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/hotels" className="hover:text-primary-500">Hotels</a><span>/</span><span className="text-gray-900 dark:text-white">{hotel.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img src={hotel.images?.[activeImg]} alt={hotel.name} className="w-full h-72 sm:h-96 object-cover" />
              {hotel.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(p => p === 0 ? hotel.images.length - 1 : p - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><FiChevronLeft /></button>
                  <button onClick={() => setActiveImg(p => p === hotel.images.length - 1 ? 0 : p + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><FiChevronRight /></button>
                </>
              )}
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {hotel.images?.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">{hotel.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={hotel.rating} size={18} />
              <span className="font-semibold">{hotel.rating}</span>
              <span className="text-gray-500">({hotel.numReviews} reviews)</span>
              {hotel.destination?.name && <span className="flex items-center gap-1 text-gray-500"><FiMapPin size={14} />{hotel.destination.name}</span>}
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">{hotel.description}</p>

            {/* Amenities */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.map((a, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm">
                    <FiCheck size={14} /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            {hotel.coordinates?.lat && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Location</h3>
                <div className="h-64 rounded-2xl overflow-hidden">
                  <MapContainer center={[hotel.coordinates.lat, hotel.coordinates.lng]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[hotel.coordinates.lat, hotel.coordinates.lng]}><Popup>{hotel.name}</Popup></Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-bold text-primary-500">₹{hotel.price?.toLocaleString()}</span>
                <span className="text-gray-500">/night</span>
              </div>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in</label>
                    <input type="date" value={booking.checkIn} onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })} required min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-out</label>
                    <input type="date" value={booking.checkOut} onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })} required min={booking.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Guests</label>
                    <select value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: +e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rooms</label>
                    <select value={booking.rooms} onChange={(e) => setBooking({ ...booking, rooms: +e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white outline-none">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n>1?'s':''}</option>)}
                    </select>
                  </div>
                </div>
                {nights > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between text-sm"><span>₹{hotel.price} x {nights} night{nights>1?'s':''} x {booking.rooms} room{booking.rooms>1?'s':''}</span><span>₹{total.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"><span>Total</span><span className="text-primary-500">₹{total.toLocaleString()}</span></div>
                  </div>
                )}
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  Book Now
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3 text-center">Free cancellation available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
