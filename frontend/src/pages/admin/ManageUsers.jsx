import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaSearch, FaUserCheck, FaUserTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const { data } = await api.get('/api/admin/users', { params: { search } }); setUsers(data.users || []); }
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/api/admin/users/${id}/toggle-status`);
      toast.success(`User ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (error) { toast.error('Failed to update user status'); }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{users.length} total users</p>
      </div></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="mb-6 flex gap-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Search by name or email..." /></div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Search</button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full"><thead><tr className="bg-gray-50 dark:bg-gray-700/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</div>
                    <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{user.role}</span></td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${user.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{user.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                <td className="py-3 px-4">
                  <button onClick={() => handleToggleStatus(user._id, user.isActive !== false ? 'active' : 'inactive')} className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${user.isActive !== false ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                    {user.isActive !== false ? <><FaToggleOn className="text-lg" /><span>Deactivate</span></> : <><FaToggleOff className="text-lg" /><span>Activate</span></>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
