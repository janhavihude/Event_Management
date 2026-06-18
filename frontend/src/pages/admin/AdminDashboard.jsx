import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Ticket, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats || {});
      setRecentBookings(data.recentBookings || []);
    });
  }, []);

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">System overview and management</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Users" value={stats.totalUsers || 0} icon={Users} color="primary" />
        <StatCard title="Organizers" value={stats.totalOrganizers || 0} icon={Users} color="secondary" />
        <StatCard title="Events" value={stats.totalEvents || 0} icon={Calendar} color="amber" />
        <StatCard title="Pending" value={stats.pendingEvents || 0} icon={Clock} color="rose" />
        <StatCard title="Bookings" value={stats.totalBookings || 0} icon={Ticket} color="primary" />
        <StatCard title="Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="secondary" />
      </div>

      <div className="card">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 font-medium text-gray-500">User</th>
                <th className="text-left py-3 font-medium text-gray-500">Event</th>
                <th className="text-left py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-3 text-gray-900 dark:text-white">{b.user?.name}</td>
                  <td className="py-3 text-gray-500">{b.event?.title}</td>
                  <td className="py-3 text-gray-500">₹{b.totalAmount}</td>
                  <td className="py-3"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
