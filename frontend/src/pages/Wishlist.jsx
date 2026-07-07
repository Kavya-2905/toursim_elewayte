import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaHeart, FaTrash, FaMapMarkerAlt, FaHotel, FaBoxOpen } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/api/wishlist');
      setWishlist(data.data || data.wishlist || { items: [] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      await api.delete(`/api/wishlist/${item.type}/${item.referenceId}`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Destination': return <FaMapMarkerAlt className="text-primary-600" />;
      case 'Hotel': return <FaHotel className="text-blue-600" />;
      default: return <FaBoxOpen className="text-green-600" />;
    }
  };

  const getTypeLink = (type, id) => {
    switch (type) {
      case 'Destination': return `/destinations/${id}`;
      case 'Hotel': return `/hotels/${id}`;
      case 'Package': return `/packages/${id}`;
      default: return '#';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaHeart className="text-red-500 mr-3" /> My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {wishlist.items?.length || 0} saved item(s)
            </p>
          </div>
        </div>

        {(!wishlist.items || wishlist.items.length === 0) ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start exploring destinations and save your favorites!</p>
            <Link to="/destinations" className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
                <Link to={getTypeLink(item.type, item.referenceId)} className="block">
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <div className="text-6xl text-white/50">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(item.type)}
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{item.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {item.name || item.type + ' Item'}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleRemove(item)}
                    className="w-full py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaTrash />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
