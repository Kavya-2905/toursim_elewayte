import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', state: '', category: 'beach',
    images: [''], budget: '', bestSeason: '', entryFee: '',
    coordinates: { latitude: '', longitude: '' }, status: 'active'
  });

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    try {
      const { data } = await api.get('/api/destinations', { params: { search } });
      setDestinations(data.destinations || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchDestinations(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, images: formData.images.filter(Boolean), budget: Number(formData.budget), coordinates: { latitude: Number(formData.coordinates.latitude), longitude: Number(formData.coordinates.longitude) } };
    try {
      if (editingId) {
        await api.put(`/api/destinations/${editingId}`, payload);
        toast.success('Destination updated!');
      } else {
        await api.post('/api/destinations', payload);
        toast.success('Destination created!');
      }
      setShowModal(false); resetForm(); fetchDestinations();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleEdit = (dest) => {
    setFormData({ name: dest.name, description: dest.description, state: dest.state, category: dest.category, images: dest.images?.length ? dest.images : [''], budget: dest.budget, bestSeason: dest.bestSeason, entryFee: dest.entryFee, coordinates: { latitude: dest.coordinates?.latitude || '', longitude: dest.coordinates?.longitude || '' }, status: dest.status });
    setEditingId(dest._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try { await api.delete(`/api/destinations/${id}`); toast.success('Deleted!'); fetchDestinations(); }
    catch (error) { toast.error('Failed to delete'); }
  };

  const resetForm = () => { setFormData({ name: '', description: '', state: '', category: 'beach', images: [''], budget: '', bestSeason: '', entryFee: '', coordinates: { latitude: '', longitude: '' }, status: 'active' }); setEditingId(null); };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Destinations</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"><FaPlus /><span>Add Destination</span></button>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-6 flex gap-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Search destinations..." /></div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Search</button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">State</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Budget</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody>
            {destinations.map((dest) => (
              <tr key={dest._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{dest.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{dest.state}</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs capitalize">{dest.category}</span></td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${dest.budget}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{dest.rating}/5</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button onClick={() => handleEdit(dest)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(dest._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Destination</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} required /></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"><option value="beach">Beach</option><option value="mountain">Mountain</option><option value="city">City</option><option value="heritage">Heritage</option><option value="adventure">Adventure</option><option value="spiritual">Spiritual</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget ($)</label><input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best Season</label><input type="text" value={formData.bestSeason} onChange={(e) => setFormData({...formData, bestSeason: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label><input type="url" value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="https://..." /></div>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold">{editingId ? 'Update' : 'Create'} Destination</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDestinations;
