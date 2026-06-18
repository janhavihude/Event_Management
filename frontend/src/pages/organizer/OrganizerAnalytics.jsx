import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

const OrganizerAnalytics = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get('event') || '');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/organizer/events').then(({ data }) => {
      setEvents(data.events || []);
      if (!selectedEvent && data.events?.length) setSelectedEvent(data.events[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api.get(`/organizer/events/${selectedEvent}/analytics`).then(({ data }) => setAnalytics(data.analytics));
    }
  }, [selectedEvent]);

  const ticketData = analytics ? Object.entries(analytics.ticketTypes || {}).map(([name, value]) => ({ name, value })) : [];

  return (
    <DashboardLayout type="organizer">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Event Analytics</h1>

      <select className="input-field max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
      </select>

      {analytics ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: analytics.totalBookings },
              { label: 'Tickets Sold', value: analytics.totalTickets },
              { label: 'Revenue', value: `₹${analytics.revenue?.toLocaleString()}` },
              { label: 'Occupancy', value: `${analytics.occupancyRate}%` },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Ticket Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={ticketData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {ticketData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-gray-500">Views</span><span className="font-medium">{analytics.views}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Available Seats</span><span className="font-medium">{analytics.availableSeats}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total Seats</span><span className="font-medium">{analytics.totalSeats}</span></div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-primary-500 h-3 rounded-full transition-all" style={{ width: `${analytics.occupancyRate}%` }} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12"><p className="text-gray-500">Select an event to view analytics</p></div>
      )}
    </DashboardLayout>
  );
};

export default OrganizerAnalytics;
