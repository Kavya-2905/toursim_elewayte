import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', destination: '', images: [''], price: '', duration: '', description: '', type: 'adventure', rating: '' });

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    try { const { data } = await api.get('/api/packages', { params: { search } }); setPackages(data.packages || []); }
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, images: formData.images.filter(Boolean), price: Number(formData.price), duration: Number(formData.duration), rating: Number(formData.rating) || 0 };
    try {
      if (editingId) { await api.put(`/api/packages/${editingId}`, payload); toast.success('Package updated!'); }
      else { await api.post('/api/packages', payload); toast.success('Package created!'); }
      setShowModal(false); resetForm(); fetchPackages();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleEdit = (pkg) => {
    setFormData({ title: pkg.title, destination: pkg.destination?.toString() || '', images: pkg.images?.length ? pkg.images : [''], price: pkg.price, duration: pkg.duration, description: pkg.description, type: pkg.type, rating: pkg.rating });
    setEditingId(pkg._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try { await api.delete(`/api/packages/${id}`); toast.success('Deleted!'); fetchPackages(); }
    catch (error) { toast.error('Failed to delete'); }
  };

  const resetForm = () => { setFormData({ title: '', destination: '', images: [''], price: '', duration: '', description: '', type: 'adventure', rating: '' }); setEditingId(null); };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Packages</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"><FaPlus /><span>Add Package</span></button>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => { e.preventDefault(); fetchPackages(); }} className="mb-6 flex gap-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Search packages..." /></div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Search</button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Destination</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Price</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Duration</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{pkg.title}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{typeof pkg.destination === 'object' ? pkg.destination?.name : pkg.destination}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${pkg.price}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{pkg.duration} days</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs capitalize">{pkg.type}</span></td>
                <td className="py-3 px-4 flex space-x-2">
                  <button onClick={() => handleEdit(pkg)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(pkg._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FaTrash /></button>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Package</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination ID</label><input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} /></div>
              <div className="grid md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (days)</label><input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"><option value="adventure">Adventure</option><option value="family">Family</option><option value="honeymoon">Honeymoon</option><option value="budget">Budget</option><option value="luxury">Luxury</option><option value="cultural">Cultural</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label><input type="url" value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold">{editingId ? 'Update' : 'Create'} Package</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackages;
