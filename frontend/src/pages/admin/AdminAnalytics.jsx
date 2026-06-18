import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => {
      setMonthlyBookings(data.monthlyBookings || []);
      setCategoryStats(data.categoryStats || []);
    });
  }, []);

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Site Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Bookings & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" name="Bookings" />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Events by Category</h3>
          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.min((cat.count / 10) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
