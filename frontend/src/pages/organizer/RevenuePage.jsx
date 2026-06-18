import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const RevenuePage = () => {
  const [events, setEvents] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    api.get('/organizer/dashboard').then(({ data }) => {
      setTotalRevenue(data.stats?.totalRevenue || 0);
      setEvents(data.recentEvents || []);
    });
  }, []);

  return (
    <DashboardLayout type="organizer">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Revenue Tracking</h1>

      <div className="card mb-8 text-center py-8">
        <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
        <p className="text-4xl font-bold text-primary-600">₹{totalRevenue.toLocaleString()}</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue by Event</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event._id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                <p className="text-sm text-gray-500">{event.totalBookings || 0} bookings</p>
              </div>
              <p className="font-semibold text-primary-600">₹{(event.revenue || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevenuePage;
