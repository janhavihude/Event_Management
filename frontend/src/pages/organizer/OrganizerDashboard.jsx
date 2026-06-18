import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users, Ticket } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import api from '../../services/api';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    api.get('/organizer/dashboard').then(({ data }) => {
      setStats(data.stats || {});
      setRecentEvents(data.recentEvents || []);
    });
  }, []);

  return (
    <DashboardLayout type="organizer">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your events and track performance</p>
        </div>
        <Link to="/organizer/create" className="btn-primary text-sm">+ Create Event</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Events" value={stats.totalEvents || 0} icon={Calendar} color="primary" />
        <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="secondary" />
        <StatCard title="Total Bookings" value={stats.totalBookings || 0} icon={Ticket} color="amber" />
        <StatCard title="Upcoming" value={stats.upcomingEvents || 0} icon={Users} color="rose" />
      </div>

      <div className="card">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Recent Events</h2>
        {recentEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events yet. <Link to="/organizer/create" className="text-primary-600">Create your first event</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 font-medium text-gray-500">Event</th>
                  <th className="text-left py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 font-medium text-gray-500">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event._id} className="border-b border-gray-50 dark:border-gray-800">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{event.title}</td>
                    <td className="py-3 text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        event.status === 'approved' ? 'bg-green-100 text-green-700' :
                        event.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>{event.status}</span>
                    </td>
                    <td className="py-3 text-gray-500">{event.totalBookings || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
