import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaStar, FaTrash, FaSearch } from 'react-icons/fa';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchReviews(); }, [filter]);

  const fetchReviews = async () => {
    try {
      const params = {};
      if (filter === 'pending') params.approved = 'false';
      if (filter === 'approved') params.approved = 'true';
      const { data } = await api.get('/api/reviews', { params });
      setReviews(data.reviews || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try { await api.patch(`/api/reviews/${id}/approve`); toast.success('Review approved!'); fetchReviews(); }
    catch (error) { toast.error('Failed to approve'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await api.delete(`/api/reviews/${id}`); toast.success('Review deleted!'); fetchReviews(); }
    catch (error) { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{reviews.length} review(s)</p>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
            </div>
          ) : reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold">{review.user?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{review.user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{review.targetModel} - {review.createdAt && new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${review.approved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {review.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!review.approved && (
                    <button onClick={() => handleApprove(review._id)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="Approve"><FaCheck /></button>
                  )}
                  <button onClick={() => handleDelete(review._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
