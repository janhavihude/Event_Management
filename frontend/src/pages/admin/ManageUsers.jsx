import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.users || []));
  }, []);

  const toggleActive = async (user) => {
    try {
      const { data } = await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
      setUsers(users.map((u) => (u._id === user._id ? data.user : u)));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const filtered = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Manage Users</h1>
      <input className="input-field max-w-sm mb-6" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 font-medium text-gray-500">Email</th>
              <th className="text-left py-3 font-medium text-gray-500">Role</th>
              <th className="text-left py-3 font-medium text-gray-500">Status</th>
              <th className="text-left py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-b border-gray-50 dark:border-gray-800">
                <td className="py-3 font-medium text-gray-900 dark:text-white">{user.name}</td>
                <td className="py-3 text-gray-500">{user.email}</td>
                <td className="py-3"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">{user.role}</span></td>
                <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="py-3">
                  <button onClick={() => toggleActive(user)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
