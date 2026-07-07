import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', destination: '', images: [''], pricePerNight: '', rating: '', description: '', amenities: '', coordinates: { latitude: '', longitude: '' } });

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    try { const { data } = await api.get('/api/hotels', { params: { search } }); setHotels(data.hotels || []); }
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, images: formData.images.filter(Boolean), pricePerNight: Number(formData.pricePerNight), rating: Number(formData.rating), amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean), coordinates: { latitude: Number(formData.coordinates.latitude), longitude: Number(formData.coordinates.longitude) } };
    try {
      if (editingId) { await api.put(`/api/hotels/${editingId}`, payload); toast.success('Hotel updated!'); }
      else { await api.post('/api/hotels', payload); toast.success('Hotel created!'); }
      setShowModal(false); resetForm(); fetchHotels();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleEdit = (hotel) => {
    setFormData({ name: hotel.name, destination: hotel.destination?.toString() || '', images: hotel.images?.length ? hotel.images : [''], pricePerNight: hotel.pricePerNight, rating: hotel.rating, description: hotel.description, amenities: hotel.amenities?.join(', ') || '', coordinates: { latitude: hotel.coordinates?.latitude || '', longitude: hotel.coordinates?.longitude || '' } });
    setEditingId(hotel._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try { await api.delete(`/api/hotels/${id}`); toast.success('Deleted!'); fetchHotels(); }
    catch (error) { toast.error('Failed to delete'); }
  };

  const resetForm = () => { setFormData({ name: '', destination: '', images: [''], pricePerNight: '', rating: '', description: '', amenities: '', coordinates: { latitude: '', longitude: '' } }); setEditingId(null); };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Hotels</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"><FaPlus /><span>Add Hotel</span></button>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => { e.preventDefault(); fetchHotels(); }} className="mb-6 flex gap-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Search hotels..." /></div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Search</button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Location</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Price/Night</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{hotel.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{typeof hotel.destination === 'object' ? hotel.destination?.name : hotel.destination}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${hotel.pricePerNight}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{hotel.rating}/5</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button onClick={() => handleEdit(hotel)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(hotel._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Hotel</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination ID</label><input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} /></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price/Night ($)</label><input type="number" value={formData.pricePerNight} onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label><input type="number" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" max="5" step="0.1" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label><input type="url" value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities (comma-separated)</label><input type="text" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="WiFi, Pool, Spa, Gym" /></div>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold">{editingId ? 'Update' : 'Create'} Hotel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotels;
